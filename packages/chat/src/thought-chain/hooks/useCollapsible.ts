import type { Ref } from 'vue'
import { computed, ref, unref } from 'vue'

export interface CollapsibleOptions {
  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: string[]

  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: (expandedKeys: string[]) => void
}

export type Collapsible = boolean | CollapsibleOptions

type RequiredCollapsibleOptions = Required<CollapsibleOptions>

type UseCollapsible = (
  collapsible?: Collapsible
) => [
  boolean,
  Ref<RequiredCollapsibleOptions['expandedKeys']>,
  ((curKey: string) => void) | undefined,
]

const useCollapsible: UseCollapsible = (collapsible) => {
  const baseConfig = ref<RequiredCollapsibleOptions>({
    expandedKeys: [],
    onExpand: () => {},
  })
  // ============================ Collapsible ============================
  //  [enableCollapse, customizeExpandedKeys, customizeOnExpand] =
  const collapsibleOptions = computed<[boolean, string[], RequiredCollapsibleOptions['onExpand']]>(
    () => {
      const config = unref(baseConfig)
      if (!collapsible) {
        return [false, config.expandedKeys, config.onExpand]
      }

      if (typeof collapsible === 'object') {
        baseConfig.value = { ...baseConfig, ...collapsible } as RequiredCollapsibleOptions
      }

      return [true, config.expandedKeys, config.onExpand]
    }
  )

  // ============================ ExpandedKeys ============================
  const mergedExpandedKeys = ref(collapsibleOptions.value[1])

  // ============================ Event ============================
  const onItemExpand = (curKey: string) => {
    const customizeOnExpand = collapsibleOptions.value[2]
    const preKeys = mergedExpandedKeys.value
    const keys = preKeys.includes(curKey)
      ? preKeys.filter((key) => key !== curKey)
      : [...preKeys, curKey]
    customizeOnExpand?.(keys)
    mergedExpandedKeys.value = keys
  }

  // ============================ Return ============================
  return [
    collapsibleOptions.value[0],
    mergedExpandedKeys,
    collapsibleOptions.value[0] ? onItemExpand : undefined,
  ]
}

export default useCollapsible
