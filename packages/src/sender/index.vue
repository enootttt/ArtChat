<script setup lang="ts">
import type { SenderProps } from './interface'

import { useElementSize } from '@vueuse/core'
import { ElInput } from 'element-plus'

import { ref, watch } from 'vue'
import ArtCollapseTransition from '../collapseTransition/index.vue'
import { useNamespace } from '../hooks/useNamespace'

const props = withDefaults(defineProps<SenderProps>(), {
  disabled: false,
  loading: false,
  submitType: 'enter',
  classNames: undefined,
  rootClassName: '',
  placeholder: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
  (e: 'change', value: string): void
  (e: 'keyPress', value: KeyboardEvent): void
}>()

const slots = defineSlots<{
  header?: () => void
  footer?: () => void
  components?: () => void
  prefix?: () => void
  actions?: () => void
  tip?: () => void
}>()

const ns = useNamespace('sender')

const inputRef = ref<InstanceType<typeof ElInput>>()

// ------------------- Tip 插槽处理 -------------------
const inputTip = ref<HTMLElement>()
const { width: TipWidth } = useElementSize(inputTip)

watch(TipWidth, (newVal) => {
  const target = inputRef.value?.$el as HTMLElement | undefined
  if (!target) return
  const textarea = target.querySelector('textarea')
  if (textarea) {
    textarea.style.textIndent = `${newVal + 8}px`
  }
}, {
  flush: 'post'
})

// ------------------- End -------------------

function triggerValueChange(nextValue: string) {
  emit('change', nextValue)
}

function InputChangeFn(e: string) {
  triggerValueChange(e)
}

function triggerSend() {
  if (props.modelValue && !props.loading) {
    emit('submit')
  }
}

function onInternalKeyPress(e: KeyboardEvent) {
  const canSubmit = e.key === 'Enter'

  switch (props.submitType) {
    case 'enter': {
      if (canSubmit && !e.shiftKey) {
        e.preventDefault()
        triggerSend()
      }
      break
    }

    case 'shiftEnter': {
      if (canSubmit && e.shiftKey) {
        e.preventDefault()
        triggerSend()
      }
      break
    }
  }

  emit('keyPress', e)
}

defineExpose({
  inputRef,
})
</script>

<template>
  <div :class="[ns.b(), disabled && ns.b('disabled'), rootClassName]">
    <ArtCollapseTransition>
      <slot name="header" />
    </ArtCollapseTransition>
    <div :class="ns.b('content')">
      <div v-if="slots.prefix" :class="[ns.b('prefix'), classNames?.prefix]">
        <slot name="prefix" />
      </div>
      <slot name="components">
        <div :class="[ns.b('input'), classNames?.input]">
          <div v-if="slots.tip" ref="inputTip" :class="ns.b('input-tip')">
            <slot name="tip" />
          </div>
          <ElInput
            ref="inputRef"
            :autosize="autoSize || { maxRows: 8 }"
            :disabled="disabled"
            :model-value="modelValue"
            :readonly="readOnly"
            :placeholder="props.placeholder"
            resize="none"
            type="textarea"
            v-bind="$attrs"
            @change="InputChangeFn"
            @keydown="(e) => onInternalKeyPress(e as KeyboardEvent)"
            @update:model-value="emit('update:modelValue', $event)"
          />
        </div>
      </slot>
      <div v-if="slots.actions" :class="[ns.b('actions-list'), classNames?.actions]">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="slots.footer" :class="ns.b('footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
