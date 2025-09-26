import copy from 'copy-to-clipboard'
import { onMounted, ref } from 'vue'

export interface CopyConfig {
  text?: string | (() => string | Promise<string>)
  onCopy?: (event?: Event) => void
  format?: 'text/plain' | 'text/html'
}

export function useCopyClick({ copyConfig }: { copyConfig: CopyConfig }) {
  const copied = ref(false)

  const copyLoading = ref(false)

  const copyId = ref<ReturnType<typeof setTimeout> | null>(null)

  const cleanCopyId = () => {
    if (copyId.value) {
      clearTimeout(copyId.value)
    }
  }

  const copyOptions: Pick<CopyConfig, 'format'> = {}
  if (copyConfig.format) {
    copyOptions.format = copyConfig.format
  }

  onMounted(() => cleanCopyId())

  // Keep copy action up to date
  const onClick = async (e?: Event) => {
    e?.preventDefault()
    e?.stopPropagation()
    copyLoading.value = true
    try {
      const text = typeof copyConfig.text === 'function' ? await copyConfig.text() : copyConfig.text
      copy(text || '', copyOptions)
      copyLoading.value = false

      copied.value = true

      // Trigger tips update
      cleanCopyId()
      copyId.value = setTimeout(() => {
        copied.value = false
      }, 3000)

      copyConfig.onCopy?.(e)
    } catch (error) {
      copyLoading.value = false
      throw error
    }
  }

  return {
    copied,
    copyLoading,
    onClick,
  }
}
