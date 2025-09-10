import type { CascaderOption } from 'element-plus'
import type { MaybeRefOrGetter } from 'vue'
import { ref, toValue, watch } from 'vue'
import { useEventCallback } from '../hooks/useEventCallback'

/**
 * Since Cascader not support ref active, we use `value` to mock the active item.
 */
export default function useActive(
  items: MaybeRefOrGetter<CascaderOption[]>,
  open: MaybeRefOrGetter<boolean>,
  rtl: MaybeRefOrGetter<boolean>,
  onSelect: (value: string[]) => void,
  onCancel: () => void
) {
  const activePaths = ref<string[]>([])

  /** Get items by column index */
  const getItems = (colIndex: number, paths = activePaths.value) => {
    let currentItems = toValue(items)

    for (let i = 0; i < colIndex - 1; i += 1) {
      const activePath = paths[i]
      const activeItem = currentItems.find((item) => item.value === activePath)

      if (!activeItem) {
        break
      }
      currentItems = activeItem.children || []
    }

    return currentItems
  }

  const getValues = (paths: string[]) => {
    return paths.map((path, index) => {
      const currentItems = getItems(index + 1, paths)
      const currentItem = currentItems.find((item) => item.value === path)

      return currentItem?.value
    }) as string[]
  }

  const offsetRow = (offset: number) => {
    const currentColIndex = activePaths.value.length || 1

    const currentItems = getItems(currentColIndex)
    const currentRowIndex = currentItems.findIndex(
      (item) => item.value === activePaths.value[currentColIndex - 1]
    )
    const itemCount = currentItems.length

    const nextItem = currentItems[(currentRowIndex + offset + itemCount) % itemCount]
    activePaths.value = [
      ...activePaths.value.slice(0, currentColIndex - 1),
      nextItem.value as string,
    ]
  }

  const offsetPrev = () => {
    if (activePaths.value.length > 1) {
      activePaths.value = activePaths.value.slice(0, activePaths.value.length - 1)
    }
  }

  const offsetNext = () => {
    const nextItems = getItems(activePaths.value.length + 1)
    if (nextItems.length) {
      activePaths.value = [...activePaths.value, nextItems[0].value as string]
    }
  }

  const onKeyDown: (e: KeyboardEvent) => void = useEventCallback((e) => {
    if (!toValue(open)) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        offsetRow(1)
        e.preventDefault()
        break

      case 'ArrowUp':
        offsetRow(-1)
        e.preventDefault()
        break

      case 'ArrowRight':
        if (toValue(rtl)) {
          offsetPrev()
        } else {
          offsetNext()
        }
        e.preventDefault()
        break

      case 'ArrowLeft':
        if (toValue(rtl)) {
          offsetNext()
        } else {
          offsetPrev()
        }
        e.preventDefault()
        break

      case 'Enter':
        // Submit if not have children
        if (!getItems(activePaths.value.length + 1).length) {
          onSelect(getValues(activePaths.value))
        }
        e.preventDefault()
        break

      case 'Escape':
        onCancel()
        e.preventDefault()
        break
    }
  })

  watch(
    () => toValue(open),
    () => {
      if (toValue(open)) {
        activePaths.value = [toValue(items)[0].value as string]
      }
    },
    { immediate: true }
  )

  return [activePaths, onKeyDown] as const
}
