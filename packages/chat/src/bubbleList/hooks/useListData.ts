import type { Ref } from 'vue'
import type { BubbleProps } from '../../bubble/interface'

import type { BubbleDataType, BubbleListProps } from '../interface'
import { ref, watch } from 'vue'

export interface UseListDataReturnType {
  ListData: Ref<BubbleListProps['items']>
  setListData: (value: BubbleListProps['items']) => void
}

export type ListItemType = ReturnType<typeof useListData>['ListData']['value'][number]

export default function useListData(
  items: BubbleListProps['items'],
  roles?: BubbleListProps['roles']
): UseListDataReturnType {
  let getRoleBubbleProps: (bubble: BubbleDataType, index: number) => Partial<BubbleProps>

  watch(
    () => roles,
    () => {
      getRoleBubbleProps = (bubble: BubbleDataType, index: number): Partial<BubbleProps> => {
        if (typeof roles === 'function') {
          return roles(bubble, index)
        }

        if (roles) {
          return roles[bubble.role as string] || {}
        }

        return {}
      }
    },
    {
      immediate: true,
    }
  )

  const ListData = ref<BubbleListProps['items']>([])
  const setListData = (value: BubbleListProps['items']) => {
    const arr = (value || []).map((bubbleData, i) => {
      const mergedKey = bubbleData.key ?? `preset_${i}`

      return {
        ...getRoleBubbleProps(bubbleData, i),
        ...bubbleData,
        key: mergedKey,
      }
    })
    ListData.value = arr
  }

  setListData(items)

  return {
    ListData,
    setListData,
  }
}
