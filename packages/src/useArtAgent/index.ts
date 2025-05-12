import type { AnyObject } from '../_util/type'

import type { ArtStreamOptions, SSEOutput } from '../artStream'

import { computed, unref } from 'vue'

import ArtRequest from '../artRequest'

export interface ArtAgentConfigPreset {
  baseURL: string
  key: string
  model: string
  dangerouslyApiKey: string
}

interface RequestFnInfo<Message> extends AnyObject {
  messages?: Message[]
  message?: Message
}

export type RequestFn<Message, Input, Output> = (
  info: Input,
  callbacks: {
    onError: (error: Error) => void
    onSuccess: (message: Output[]) => void
    onUpdate: (message: Output) => void
    onStream?: (abortController: AbortController) => void
  },
  transformStream?: ArtStreamOptions<Message>['transformStream']
) => void

export interface ArtAgentConfigCustom<Message, Input, Output> {
  request?: RequestFn<Message, Input, Output>
}

export type ArtAgentConfig<Message, Input, Output> = Partial<ArtAgentConfigPreset> &
  ArtAgentConfigCustom<Message, Input, Output>

let uuid = 0

/** This is a wrap class to avoid developer can get too much on origin object */
export class ArtAgent<Message = string, Input = RequestFnInfo<Message>, Output = SSEOutput> {
  config: ArtAgentConfig<Message, Input, Output>

  private requestingMap: Record<number, boolean> = {}

  public request: RequestFn<Message, Input, Output> = (info, callbacks) => {
    const { request } = this.config
    const { onUpdate, onSuccess, onError, onStream } = callbacks

    const id = uuid
    uuid += 1
    this.requestingMap[id] = true

    request?.(info, {
      onStream: (abortController) => {
        if (this.requestingMap[id]) {
          onStream?.(abortController)
        }
      },
      // Status should be unique.
      // One get success or error should not get more message
      onUpdate: (chunks) => {
        if (this.requestingMap[id]) {
          onUpdate(chunks)
        }
      },
      onSuccess: (chunks) => {
        if (this.requestingMap[id]) {
          onSuccess(chunks)
          this.finishRequest(id)
        }
      },
      onError: (error) => {
        if (this.requestingMap[id]) {
          onError(error)
          this.finishRequest(id)
        }
      },
    })
  }

  constructor(config: ArtAgentConfig<Message, Input, Output>) {
    this.config = config
  }

  private finishRequest(id: number) {
    delete this.requestingMap[id]
  }

  public isRequesting() {
    return Object.keys(this.requestingMap).length > 0
  }
}

export default function useArtAgent<
  Message = string,
  Input = RequestFnInfo<Message>,
  Output = SSEOutput,
>(config: ArtAgentConfig<Message, Input, Output>) {
  const { request, ...restConfig } = config

  const memo = computed(
    () =>
      [
        new ArtAgent<Message, Input, Output>({
          request:
            request! ||
            ArtRequest({
              baseURL: restConfig.baseURL!,
              model: restConfig.model,
              dangerouslyApiKey: restConfig.dangerouslyApiKey,
            }).create,
          ...restConfig,
        }),
      ] as const
  )
  return unref(memo)
}
