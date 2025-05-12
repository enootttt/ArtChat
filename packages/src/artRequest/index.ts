import type { AnyObject } from '../_util/type'
import type { ArtStreamOptions, SSEOutput } from '../artStream'
import type { ArtFetchOptions } from './artFetch'

import ArtStream from '../artStream'
import ArtFetch from './artFetch'

export interface ArtRequestBaseOptions {
  /**
   * @description Base URL, e.g., 'https://api.example.com/v1/chat'
   */
  baseURL: string

  /**
   * @description Model name, e.g., 'gpt-3.5-turbo'
   */
  model?: string

  /**
   * @warning 🔥🔥 Its dangerously!
   *
   * Enabling the dangerouslyApiKey option can be dangerous because it exposes
   * your secret API credentials in the client-side code. Web browsers are inherently
   * less secure than server environments, any user with access to the browser can
   * potentially inspect, extract, and misuse these credentials. This could lead to
   * unauthorized access using your credentials and potentially compromise sensitive
   * data or functionality.
   */
  dangerouslyApiKey?: string
}

interface ArtRequestCustomOptions {
  /**
   * @description Custom fetch
   */
  fetch?: ArtFetchOptions['fetch']
}

export type ArtRequestOptions = ArtRequestBaseOptions & ArtRequestCustomOptions

type ArtRequestMessageContent = AnyObject | string

interface ArtRequestMessage extends AnyObject {
  role?: string
  content?: ArtRequestMessageContent
}

/**
 * Compatible with the parameters of OpenAI's chat.completions.create,
 * with plans to support more parameters and adapters in the future
 */
export interface ArtRequestParams {
  /**
   * @description Model name, e.g., 'gpt-3.5-turbo'
   * @default ArtRequestOptions.model
   */
  model?: string

  /**
   * @description Indicates whether to use streaming for the response
   */
  stream?: boolean

  /**
   * @description The messages to be sent to the model
   */
  messages?: ArtRequestMessage[]
}

export interface ArtRequestCallbacks<Output> {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (chunks: Output[]) => void

  /**
   * @description Callback when the request fails
   */
  onError: (error: Error) => void

  /**
   * @description Callback when the request is updated
   */
  onUpdate: (chunk: Output) => void

  /**
   * @description Callback monitoring and control the stream
   */
  onStream?: (abortController: AbortController) => void
}

export type ArtRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  params: ArtRequestParams & Input,
  callbacks: ArtRequestCallbacks<Output>,
  transformStream?: ArtStreamOptions<Output>['transformStream']
) => Promise<void>

class ArtRequestClass {
  readonly baseURL: string
  readonly model: string

  private defaultHeaders: RequestInit['headers']
  private customOptions: ArtRequestCustomOptions

  private constructor(options: ArtRequestOptions) {
    const { baseURL, model, dangerouslyApiKey, ...customOptions } = options

    this.baseURL = options.baseURL
    this.model = options.model!
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(options.dangerouslyApiKey && {
        Authorization: options.dangerouslyApiKey,
      }),
    }
    this.customOptions = customOptions
  }

  public static init(options: ArtRequestOptions): ArtRequestClass {
    if (!options.baseURL || typeof options.baseURL !== 'string')
      throw new Error('The baseURL is not valid!')

    return new ArtRequestClass(options)
  }

  public create = async <Input = AnyObject, Output = SSEOutput>(
    params: ArtRequestParams & Input,
    callbacks?: ArtRequestCallbacks<Output>,
    transformStream?: ArtStreamOptions<Output>['transformStream']
  ) => {
    const abortController = new AbortController()
    const requestInit = {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        ...params,
      }),
      headers: this.defaultHeaders,
      signal: abortController.signal,
    }

    callbacks?.onStream?.(abortController)

    try {
      const response = await ArtFetch(this.baseURL, {
        fetch: this.customOptions.fetch,
        ...requestInit,
      })

      if (transformStream) {
        await this.customResponseHandler<Output>(response, callbacks, transformStream)
        return
      }

      const contentType = response.headers.get('content-type') || ''

      const mimeType = contentType.split(';')[0].trim()

      switch (mimeType) {
        case 'text/event-stream':
          await this.sseResponseHandler<Output>(response, callbacks)
          break
        case 'application/json':
          await this.jsonResponseHandler<Output>(response, callbacks)
          break
        default:
          throw new Error(`The response content-type: ${contentType} is not support!`)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error!')

      callbacks?.onError?.(err)

      throw err
    }
  }

  private customResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: ArtRequestCallbacks<Output>,
    transformStream?: ArtStreamOptions<Output>['transformStream']
  ) => {
    const chunks: Output[] = []

    for await (const chunk of ArtStream({
      readableStream: response.body!,
      transformStream,
    })) {
      chunks.push(chunk)

      callbacks?.onUpdate?.(chunk)
    }

    callbacks?.onSuccess?.(chunks)
  }

  private sseResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: ArtRequestCallbacks<Output>
  ) => {
    const chunks: Output[] = []

    const stream = ArtStream<Output>({
      readableStream: response.body!,
    })

    for await (const chunk of stream) {
      chunks.push(chunk)

      callbacks?.onUpdate?.(chunk)
    }

    callbacks?.onSuccess?.(chunks)
  }

  private jsonResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: ArtRequestCallbacks<Output>
  ) => {
    const chunk: Output = await response.json()

    callbacks?.onUpdate?.(chunk)

    callbacks?.onSuccess?.([chunk])
  }
}

const ArtRequest = ArtRequestClass.init

export default ArtRequest
