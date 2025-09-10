import type { AnyObject } from '../_util/type'
import type { ArtRequestOptions } from '../artRequest'
import ArtRequest from '../artRequest'

export interface ArtMCPTool {
  name: string
  description?: string
  inputSchema: {
    type: 'object'
    properties: AnyObject
  }
  annotations?: {
    title?: string
    readOnlyHint?: boolean
    destructiveHint?: boolean
    idempotentHint?: boolean
    openWorldHint?: boolean
  }
}

export type ArtMCPClientOptions = Pick<
  ArtRequestOptions,
  'params' | 'headers' | 'timeout' | 'fetch'
>

class ArtMCPClientClass {
  readonly baseURL: string
  private options: ArtMCPClientOptions | undefined

  constructor(baseURL: string, options?: ArtMCPClientOptions) {
    if (!baseURL || typeof baseURL !== 'string') throw new Error('The baseURL is not valid!')
    this.baseURL = baseURL
    this.options = options
  }

  async tools(): Promise<ArtMCPTool[]> {
    return new Promise((resolve, reject) => {
      ArtRequest(this.baseURL, {
        ...this.options,
        callbacks: {
          onSuccess(chunks) {
            resolve(chunks[0] as ArtMCPTool[])
          },
          onError: (error: Error): void => {
            reject(error)
          },
        },
      })
    })
  }
}

function ArtMCPClient(baseURL: string, options?: ArtMCPClientOptions) {
  return new ArtMCPClientClass(baseURL, options)
}

export default ArtMCPClient
