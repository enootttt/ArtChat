<script setup lang="ts">
import type { PlaceholderUploaderProps } from './interface'

import { ElUpload } from 'element-plus'

import { ref } from 'vue'

import { useNamespace } from '../hooks/useNamespace'

const props = withDefaults(defineProps<PlaceholderUploaderProps>(), {
  disabled: false,
})

const ns = useNamespace('attachment-placeholder')

const dragIn = ref(false)
const uploadRef = ref<InstanceType<typeof ElUpload>>()

function onDragEnter() {
  dragIn.value = true
}
function onDragLeave(e: DragEvent) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
    dragIn.value = false
  }
}
function onDrop() {
  dragIn.value = false
}

defineExpose({
  uploadRef,
})
</script>

<template>
  <div
    :aria-hidden="disabled"
    :class="[ns.b(), { [ns.b('drag-in')]: dragIn, [ns.b('disabled')]: disabled }, className]"
    :style="style"
    @drag="onDrop"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
  >
    <ElUpload
      v-bind="props.upload"
      ref="uploadRef"
      :auto-upload="false"
      :class="[ns.b('upload-wrapper')]"
      :show-file-list="false"
      action="#"
      drag
    >
      <div :class="[ns.b('inner')]">
        <template v-if="$slots.default">
          <slot />
        </template>
        <template v-else>
          <div :class="[ns.b('icon')]">
            <slot name="icon" />
          </div>
          <div :class="[ns.b('title')]">
            <slot name="title" />
          </div>
          <div :class="[ns.b('description')]">
            <slot name="description" />
          </div>
        </template>
      </div>
    </ElUpload>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
