import type { Ref } from 'vue'
import type { GlobalShiki } from '../../hooks/useShiki'

import type { MarkdownContext } from './types'
import deepmerge from 'deepmerge'

import { computed, defineComponent, h, inject, provide, toValue, watch } from 'vue'
import { useDarkModeWatcher, usePlugins } from '../../hooks'
import { GLOBAL_SHIKI_KEY, MARKDOWN_PROVIDER_KEY } from '../../shared'
import { MARKDOWN_CORE_PROPS } from '../../shared/constants'
import { initThemeMode } from '../CodeBlock/shiki-header'
import '../../style/index.scss'

const MarkdownProvider = defineComponent({
  name: 'MarkdownProvider',
  props: MARKDOWN_CORE_PROPS,
  setup(props, { slots, attrs }) {
    const { rehypePlugins, remarkPlugins } = usePlugins(props)
    const { isDark } = useDarkModeWatcher()

    const globalShiki = inject<GlobalShiki>(GLOBAL_SHIKI_KEY)

    watch(
      () => props.defaultThemeMode,
      (v) => {
        if (v) {
          initThemeMode(v)
        }
      },
      { immediate: true }
    )

    const contextProps = computed(() => {
      return deepmerge(
        {
          rehypePlugins: toValue(rehypePlugins),
          remarkPlugins: toValue(remarkPlugins),
          isDark: toValue(isDark),
          globalShiki: toValue(globalShiki),
        },
        props
      )
    })
    provide(MARKDOWN_PROVIDER_KEY, contextProps)
    return () =>
      h('div', { class: 'elx-xmarkdown-provider', ...attrs }, slots.default && slots.default())
  },
})

function useMarkdownContext(): Ref<MarkdownContext> {
  const context = inject<Ref<MarkdownContext>>(
    MARKDOWN_PROVIDER_KEY,
    computed(() => ({}))
  )
  if (!context) {
    return computed(() => ({})) as unknown as Ref<MarkdownContext>
  }
  return context
}
export { MarkdownProvider, useMarkdownContext }
