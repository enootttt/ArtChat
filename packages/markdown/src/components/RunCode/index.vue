<script lang="ts" setup>
import type { ElxRunCodeHeaderTypes, ElxRunCodeProps } from './type'
import { CloseBold } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { ElButton, ElDialog, ElDrawer } from 'element-plus'
import { computed, h, ref, toValue } from 'vue'
import { useMarkdownContext } from '../MarkdownProvider'
import { SELECT_OPTIONS_ENUM } from './components/options'
import RunCodeContent from './components/run-code-content.vue'
import RunCodeHeader from './components/run-code-header.vue'

const props = withDefaults(defineProps<ElxRunCodeProps>(), {
  code: () => [],
  lang: '',
  mode: 'drawer',
})
const emit = defineEmits<{
  (e: 'update:visible'): void
}>()
const drawer = useVModel(props, 'visible', emit)

const selectValue = ref<ElxRunCodeHeaderTypes['options']>(SELECT_OPTIONS_ENUM.VIEW)

const isView = computed(() => selectValue.value === SELECT_OPTIONS_ENUM.VIEW)
const context = useMarkdownContext()
const { codeXSlot } = toValue(context) || {}

function changeSelectValue(val: ElxRunCodeHeaderTypes['options']) {
  selectValue.value = val
}

function close() {
  drawer.value = false
}

// 渲染插槽函数
function renderSlot(slotName: string) {
  if (!codeXSlot) {
    return 'div'
  }
  const slotFn = codeXSlot[slotName]
  if (typeof slotFn === 'function') {
    return slotFn({
      ...props,
      value: selectValue.value,
      close,
      changeSelectValue,
    })
  }

  return h(slotFn as any, {
    ...props,
    value: selectValue.value,
    close,
    changeSelectValue,
  })
}

const RunCodeCloseBtnComputed = computed(() => {
  if (codeXSlot?.viewCodeCloseBtn) {
    return renderSlot('viewCodeCloseBtn')
  }
  return CloseBold
})
const RunCodeHeaderComputed = computed(() => {
  if (codeXSlot?.viewCodeHeader) {
    return renderSlot('viewCodeHeader')
  }
  return RunCodeHeader
})

const RunCodeContentComputed = computed(() => {
  if (codeXSlot?.viewCodeContent) {
    return renderSlot('viewCodeContent')
  }
  return null
})
</script>

<template>
  <ElDialog
    v-if="props.mode === 'dialog'"
    v-model="drawer"
    :class="`${props.customClass} ${isView ? 'elx-run-code-dialog-view' : ''}`"
    :close-on-click-modal="props.dialogOptions?.closeOnClickModal ?? true"
    :close-on-press-escape="props.dialogOptions?.closeOnPressEscape ?? true"
    :show-close="false"
    class="elx-run-code-dialog"
    align-center
    destroy-on-close
    append-to-body
  >
    <template #header>
      <component :is="RunCodeHeaderComputed" v-model:value="selectValue" />
      <ElButton class="view-code-close-btn" @click="close">
        <component :is="RunCodeCloseBtnComputed" />
      </ElButton>
    </template>

    <template #default>
      <component :is="RunCodeContentComputed" v-if="RunCodeContentComputed" />
      <RunCodeContent v-else v-bind="props" :now-view="selectValue" />
    </template>
  </ElDialog>
  <ElDrawer
    v-if="props.mode === 'drawer'"
    v-model="drawer"
    :class="`${props.customClass} ${isView ? 'elx-run-code-drawer-view' : ''}`"
    :close-on-click-modal="props.drawerOptions?.closeOnClickModal ?? true"
    :close-on-press-escape="props.drawerOptions?.closeOnPressEscape ?? true"
    :show-close="false"
    class="elx-run-code-drawer"
    align-center
    destroy-on-close
    append-to-body
  >
    <template #header>
      <component :is="RunCodeHeaderComputed" v-model:value="selectValue" />
      <ElButton
        class="view-code-close-btn"
        :class="{ customCloseBtn: !!codeXSlot?.viewCodeCloseBtn }"
        @click="close"
      >
        <component :is="RunCodeCloseBtnComputed" />
      </ElButton>
    </template>

    <template #default>
      <component :is="RunCodeContentComputed" v-if="RunCodeContentComputed" />
      <RunCodeContent v-else v-bind="props" :now-view="selectValue" />
    </template>
  </ElDrawer>
</template>

<style src="./style.scss"></style>
