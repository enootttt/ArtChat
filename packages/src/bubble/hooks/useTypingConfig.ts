import type { TypingOption } from '../interface'

import { computed } from 'vue'

function useTypingConfig(typing: boolean | TypingOption) {
  const typingConfig = computed(() => {
    if (!typing) {
      return [false, 0, 0, null]
    }

    let baseConfig: TypingOption = {
      step: 1,
      interval: 50,
      suffix: null,
    }

    if (typeof typing === 'object') {
      baseConfig = { ...baseConfig, ...typing }
    }

    return [true, baseConfig.step, baseConfig.interval, baseConfig.suffix]
  })
  return typingConfig.value
}

export default useTypingConfig
