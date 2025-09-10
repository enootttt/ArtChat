import type { Ref } from 'vue'

import type { ListItemType } from './useListData'
import { ref, watch } from 'vue'

export type useDisplayDataReturnType = [
  displayData: Ref<ListItemType[]>,
  onTypingComplete: (key: number | string) => void,
  ItemsWatch: () => void,
]

export default function useDisplayData(items: Ref<ListItemType[]>): useDisplayDataReturnType {
  const displayCount = ref(items.value.length)

  const displayList = ref<ListItemType[]>(items.value.slice(0, displayCount.value))

  const displayListLastKey = () => {
    const lastItem = displayList.value[displayList.value.length - 1]
    return lastItem ? lastItem.key : null
  }

  watch(
    () => items.value,
    (newVal) => {
      displayCount.value = newVal.length
      displayList.value = newVal.slice(0, displayCount.value)
    }
  )

  const ItemsWatch = () => {
    if (
      displayList.value.length > 0 &&
      displayList.value.every((item: ListItemType, index: number) => {
        return item.key === items.value[index]?.key
      })
    ) {
      return
    }

    if (displayList.value.length === 0) {
      displayCount.value = 1
    } else {
      for (let i = 0; i < displayList.value.length; i += 1) {
        if (displayList.value[i]?.key !== items.value[i]?.key) {
          displayCount.value = i
          break
        }
      }
    }
  }

  ItemsWatch()

  // Continue to show if last one finished typing
  const onTypingComplete = (key: number | string) => {
    if (key === displayListLastKey()) {
      displayCount.value = displayCount.value + 1
    }
  }

  return [displayList, onTypingComplete, ItemsWatch] as const
}
