<script setup lang="ts" generic="T = any">
import type { RenderChildrenProps, SuggestionProps } from './interface'
import { onClickOutside } from '@vueuse/core'
import { ElCascaderPanel, ElTooltip } from 'element-plus'
import { computed, ref } from 'vue'
import { useNamespace } from '../hooks/useNamespace'
import useActive from './useActive'

const props = withDefaults(defineProps<SuggestionProps<T>>(), {
  rootClassName: '',
})

const emit = defineEmits<{
  (e: 'openChange', open: boolean): void
  (e: 'select', value: string): void
}>()

defineSlots<{
  default: (options: {
    onTrigger: RenderChildrenProps<T>['onTrigger']
    onKeyDown: (e: KeyboardEvent) => void
  }) => RenderChildrenProps<T>
}>()

const ns = useNamespace('suggestion')

const CascaderPanelRef = ref<InstanceType<typeof ElCascaderPanel>>()

const info = ref<T | undefined>()

const isRTL = computed(() => props.direction === 'rtl')

const defaultContainer = ref<HTMLElement>()
// popperRef
const popperRef = ref<InstanceType<typeof ElTooltip>>()

// =========================== Trigger ============================
const mergedOpen = ref(props.open)

// ============================ Items =============================
const itemList = computed(() => {
  return typeof props.items === 'function' ? props.items(info.value) : props.items
})

function triggerOpen(nextOpen: boolean) {
  mergedOpen.value = nextOpen
  emit('openChange', nextOpen)
  if (!nextOpen) {
    CascaderPanelRef.value?.clearCheckedNodes()
  }
}

function onInternalChange(valuePath: string[]) {
  emit('select', valuePath[valuePath.length - 1])
  triggerOpen(false)
}

function onClose() {
  triggerOpen(false)
}

const onTrigger: RenderChildrenProps<T>['onTrigger'] = (nextInfo) => {
  if (nextInfo === false) {
    triggerOpen(false)
  } else {
    info.value = nextInfo
    triggerOpen(true)
  }
}

const [activePath, onKeyDown] = useActive(itemList, mergedOpen, isRTL, onInternalChange, onClose)

function onDropdownVisibleChange(nextOpen: boolean) {
  if (!nextOpen) {
    onClose()
  } else {
    onInternalChange(activePath.value)
  }
}

const popoverWidth = computed(() => {
  if (props.block && defaultContainer.value) {
    return `${defaultContainer.value.offsetWidth}px`
  }
  return 'max-content'
})

// ============================ Document Click =============================
onClickOutside(defaultContainer, () => {
  if (popperRef.value?.isFocusInsideContent()) return
  mergedOpen.value && onClose()
})
</script>

<template>
  <ElTooltip
    ref="popperRef"
    :class-name="[props.rootClassName]"
    trigger="click"
    :placement="isRTL ? 'top-end' : 'top-start'"
    :visible="mergedOpen"
    :gpu-acceleration="false"
    effect="light"
    pure
    manual-mode
    persistent
    role="listbox"
    @hide="onDropdownVisibleChange"
  >
    <div
      ref="defaultContainer"
      :class="[ns.b(), props.rootClassName, props.className, ns.b('wrapper')]"
      :style="props.style"
    >
      <slot :on-trigger="onTrigger" :on-key-down="onKeyDown" />
    </div>
    <template #content>
      <ElCascaderPanel
        ref="CascaderPanelRef"
        :style="{ width: popoverWidth }"
        :class="ns.b('cascader-panel')"
        :options="itemList"
        :border="false"
        :model-value="activePath"
        @close="onDropdownVisibleChange(true)"
      />
    </template>
  </ElTooltip>
</template>

<style lang="scss" scoped>
@import './index';
</style>
