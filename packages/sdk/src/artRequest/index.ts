import type { AnyObject } from '../_util/type'
import type { ArtReadableStream, ArtStreamOptions, SSEOutput } from '../artStream'
import type { ArtFetchMiddlewares } from './artFetch'

import ArtStream from '../artStream'
import ArtFetch from './artFetch'

export interface ArtRequestCallbacks<Output> {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (chunks: Output[], responseHeaders: Headers) => void

  /**
   * @description Callback when the request fails
   */
  onError: (error: Error) => void

  /**
   * @description Callback when the request is updated
   */
  onUpdate?: (chunk: Output, responseHeaders: Headers) => void
}

export interface ArtRequestOptions<Input = AnyObject, Output = SSEOutput> extends RequestInit {
  /**
   * @description Callbacks for the request
   */
  callbacks?: ArtRequestCallbacks<Output>
  /**
   * @description The parameters to be sent
   */
  params?: Input
  /**
   * @description The custom headers to be sent
   */
  headers?: Record<string, string>
  /**
   * @description The timeout for the request
   */
  timeout?: number
  /**
   * @description The timeout for the stream mode request,when the stream mode request is timeout, the request will be aborted
   */
  streamTimeout?: number
  /**
   * @description Custom fetch
   */
  fetch?: (
    baseURL: Parameters<typeof fetch>[0],
    options: ArtRequestOptions<Input, Output>
  ) => Promise<Response>
  /**
   * @description Middlewares for the request and response
   */
  middlewares?: ArtFetchMiddlewares<Input, Output>
  /**
   * @description Custom stream transformer, can use to adapt the stream data to the custom format
   */
  transformStream?:
    | ArtStreamOptions<Output>['transformStream']
    | ((baseURL: string, responseHeaders: Headers) => ArtStreamOptions<Output>['transformStream'])

  /**
   * @description Whether to manually run the request
   */
  manual?: boolean
}

export type ArtRequestGlobalOptions<Input, Output> = Pick<
  ArtRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'transformStream' | 'manual'
>

export type ArtRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  baseURL: string,
  options?: ArtRequestOptions<Input, Output>
) => ArtRequestClass<Input, Output>

/**
 * @description Global options for the request
 */
const globalOptions: ArtRequestGlobalOptions<AnyObject, AnyObject> = {
  manual: false,
  headers: {
    'Content-Type': 'application/json',
  },
}

export abstract class AbstractArtRequestClass<Input, Output> {
  baseURL!: string
  options!: ArtRequestOptions<Input, Output>

  constructor(baseURL: string, options?: ArtRequestOptions<Input, Output>) {
    if (!baseURL || typeof baseURL !== 'string') throw new Error('The baseURL is not valid!')
    this.baseURL = baseURL
    this.options = options || {}
  }

  abstract get asyncHandler(): Promise<any>
  abstract get isTimeout(): boolean
  abstract get isStreamTimeout(): boolean
  abstract get isRequesting(): boolean
  abstract get manual(): boolean

  abstract run(params?: Input): void
  abstract abort(): void
}

/**
 * Set global options for the request
 * @param options ArtRequestGlobalOptions<Input, Output>
 */
export function setArtRequestGlobalOptions<Input, Output>(
  options: ArtRequestGlobalOptions<Input, Output>
) {
  Object.assign(globalOptions, options)
}

export class ArtRequestClass<Input = AnyObject, Output = SSEOutput> extends AbstractArtRequestClass<
  Input,
  Output
> {
  private _asyncHandler!: Promise<any>

  private timeoutHandler!: number
  private _isTimeout = false
  private streamTimeoutHandler!: number
  private _isStreamTimeout = false
  private abortController!: AbortController
  private _isRequesting = false
  private _manual = false

  public get asyncHandler() {
    return this._asyncHandler
  }

  public get isTimeout() {
    return this._isTimeout
  }

  private set isTimeout(value: boolean) {
    this._isTimeout = value
  }

  public get isStreamTimeout() {
    return this._isStreamTimeout
  }

  private set isStreamTimeout(value: boolean) {
    this._isStreamTimeout = value
  }

  public get isRequesting() {
    return this._isRequesting
  }

  public get manual() {
    return this._manual
  }

  constructor(baseURL: string, options?: ArtRequestOptions<Input, Output>) {
    super(baseURL, options)
    this._manual = options?.manual || false
    if (!this.manual) {
      this.init()
    }
  }

  public run(params?: Input) {
    if (this.manual) {
      this.init(params)
    } else {
      console.warn('The request is not manual, so it cannot be run!')
    }
  }

  public abort() {
    clearTimeout(this.timeoutHandler)
    clearTimeout(this.streamTimeoutHandler)
    this.abortController.abort()
  }

  private init(extraParams?: Partial<Input>) {
    this.abortController = new AbortController()
    const {
      callbacks,
      params,
      headers = {},
      transformStream,
      fetch,
      timeout,
      streamTimeout,
      middlewares,
      ...otherOptions
    } = this.options
    const requestInit: ArtRequestOptions<Input, Output> = {
      ...otherOptions,
      method: 'POST',
      body: JSON.stringify({
        ...params,
        ...(extraParams || {}),
      }),
      params: {
        ...params,
        ...extraParams,
      } as Input,
      headers: Object.assign({}, globalOptions.headers || {}, headers),
      signal: this.abortController.signal,
      middlewares,
    }
    if (timeout && timeout > 0) {
      this.timeoutHandler = window.setTimeout(() => {
        this.isTimeout = true
        this.finishRequest()
        callbacks?.onError?.(new Error('TimeoutError'))
      }, timeout)
    }
    this.startRequest()
    // save and export a async handler to wait for the request to be finished
    // though it is not necessary, but it is useful for some scenarios
    this._asyncHandler = ArtFetch<Input, Output>(this.baseURL, {
      fetch,
      ...requestInit,
    })
      .then(async (response) => {
        clearTimeout(this.timeoutHandler)
        if (this.isTimeout) return

        if (transformStream) {
          let transformer = transformStream as ArtStreamOptions<Output>['transformStream']
          if (typeof transformStream === 'function') {
            transformer = transformStream(this.baseURL, response.headers)
          }
          await this.customResponseHandler<Output>(response, callbacks, transformer, streamTimeout)
          return
        }
        const contentType = response.headers.get('content-type') || ''
        const mimeType = contentType.split(';')[0].trim()
        switch (mimeType) {
          /** SSE */
          case 'text/event-stream':
            await this.sseResponseHandler<Output>(response, callbacks, streamTimeout)
            break
          /** JSON */
          case 'application/json':
            await this.jsonResponseHandler<Output>(response, callbacks)
            break
          default:
            throw new Error(`The response content-type: ${contentType} is not support!`)
        }
      })
      .catch((error) => {
        clearTimeout(this.timeoutHandler)
        this.finishRequest()
        // abort() throw a DOMException, so we need to check it
        const err =
          error instanceof Error || error instanceof DOMException
            ? error
            : new Error('Unknown error!')
        callbacks?.onError?.(err)
      })
  }

  private startRequest() {
    this._isRequesting = true
  }

  private finishRequest() {
    this._isRequesting = false
  }

  private customResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: ArtRequestCallbacks<Output>,
    transformStream?: ArtStreamOptions<Output>['transformStream'],
    streamTimeout?: number | undefined
  ) => {
    const stream = ArtStream<Output>({
      readableStream: response.body!,
      transformStream,
    })
    await this.processStream<Output>(stream, response, callbacks, streamTimeout)
  }

  private sseResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: ArtRequestCallbacks<Output>,
    streamTimeout?: number
  ) => {
    const stream = ArtStream<Output>({
      readableStream: response.body!,
    })
    await this.processStream<Output>(stream, response, callbacks, streamTimeout)
  }

  private async processStream<Output>(
    stream: ArtReadableStream<Output>,
    response: Response,
    callbacks?: ArtRequestCallbacks<Output>,
    streamTimeout?: number
  ) {
    const chunks: Output[] = []
    const iterator = stream[Symbol.asyncIterator]()
    let result: IteratorResult<Output, any>
    do {
      // if streamTimeout is set, start the stream timeout timer
      // every time the stream is updated, reset the timer
      if (streamTimeout) {
        this.streamTimeoutHandler = window.setTimeout(() => {
          this.isStreamTimeout = true
          this.finishRequest()
          callbacks?.onError?.(new Error('StreamTimeoutError'))
        }, streamTimeout)
      }
      result = await iterator.next()
      chunks.push(result.value)
      callbacks?.onUpdate?.(result.value, response.headers)
      clearTimeout(this.streamTimeoutHandler)
      if (this.isStreamTimeout) {
        break
      }
    } while (!result.done)
    if (streamTimeout) {
      clearTimeout(this.streamTimeoutHandler)
      if (this.isStreamTimeout) {
        this.finishRequest()
        return
      }
    }
    this.finishRequest()
    callbacks?.onSuccess?.(chunks, response.headers)
  }

  private jsonResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: ArtRequestCallbacks<Output>
  ) => {
    const chunk: Output = await response.json()
    callbacks?.onUpdate?.(chunk, response.headers)
    this.finishRequest()
    // keep type consistency with stream mode
    callbacks?.onSuccess?.([chunk], response.headers)
  }
}

function ArtRequest<Input = AnyObject, Output = SSEOutput>(
  baseURL: string,
  options?: ArtRequestOptions<Input, Output>
): AbstractArtRequestClass<Input, Output> {
  return new ArtRequestClass<Input, Output>(baseURL, options)
}

export default ArtRequest
