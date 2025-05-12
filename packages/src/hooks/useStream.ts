import type { ArtReadableStream, ArtStreamOptions, SSEOutput } from '../artStream'
import { ref, shallowRef } from 'vue'
import ArtStream from '../artStream'

export function useXStream() {
  const data = ref<SSEOutput[]>([])
  const error = ref<Error | null>(null)
  const isLoading = ref<boolean>(false)
  const currentStream = shallowRef<ArtReadableStream<SSEOutput> | null>(null)

  // 启动流式请求
  const startStream = async (options: ArtStreamOptions<SSEOutput>) => {
    isLoading.value = true
    error.value = null
    data.value = []
    currentStream.value = ArtStream(options)

    try {
      for await (const item of currentStream.value!) {
        data.value.push(item)
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err
      }
    } finally {
      isLoading.value = false
      currentStream.value = null // 释放流引用
    }
  }

  // 中断流式请求（强制关闭流）
  const cancel = () => {
    if (currentStream.value) {
      const reader = currentStream.value.getReader()
      reader.cancel()
    }
  }

  return {
    startStream,
    cancel, // 新增中断方法
    data,
    error,
    isLoading,
  }
}
