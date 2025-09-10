import type { ArtRequestOptions } from '.'

export interface ArtFetchMiddlewares<Input, Output> {
  onRequest?: (
    baseURL: Parameters<typeof fetch>[0],
    options: ArtRequestOptions<Input, Output>
  ) => Promise<[Parameters<typeof fetch>[0], ArtRequestOptions<Input, Output>]>
  onResponse?: (response: Response) => Promise<Response>
}

export type ArtFetchType<Input, Output> = (
  baseURL: Parameters<typeof fetch>[0],
  options?: ArtRequestOptions<Input, Output>
) => Promise<Response>

async function ArtFetch<Input, Output>(
  baseURL: Parameters<typeof fetch>[0],
  options: ArtRequestOptions<Input, Output> = {}
) {
  const { fetch: fetchFn = globalThis.fetch, middlewares = {}, ...requestInit } = options

  if (typeof fetchFn !== 'function') {
    throw new TypeError('The options.fetch must be a typeof fetch function!')
  }

  /** ---------------------- request init ---------------------- */
  let fetchArgs: [Parameters<typeof fetch>[0], ArtRequestOptions<Input, Output>] = [
    baseURL,
    requestInit,
  ]

  /** ---------------------- request middleware ---------------------- */
  if (typeof middlewares.onRequest === 'function') {
    const modifiedFetchArgs = await middlewares.onRequest(...fetchArgs)

    fetchArgs = modifiedFetchArgs
  }

  /** ---------------------- fetch ---------------------- */
  let response = await fetchFn(...fetchArgs)

  /** ---------------------- response middleware ---------------------- */
  if (typeof middlewares.onResponse === 'function') {
    const modifiedResponse = await middlewares.onResponse(response)

    if (!(modifiedResponse instanceof Response)) {
      throw new TypeError('The options.onResponse must return a Response instance!')
    }

    response = modifiedResponse
  }

  /** ---------------------- response check ---------------------- */
  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`)
  }

  if (!response.body) {
    throw new Error('The response body is empty.')
  }

  /** ---------------------- return ---------------------- */
  return response
}

export default ArtFetch
