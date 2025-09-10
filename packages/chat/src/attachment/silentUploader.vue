<script setup lang="ts">
import type { SilentUploaderProps } from './interface'

import { ElUpload } from 'element-plus'

import { ref } from 'vue'

const props = withDefaults(defineProps<SilentUploaderProps>(), {})
const uploadRef = ref<InstanceType<typeof ElUpload>>()

defineExpose({
  uploadRef,
})
</script>

<template>
  <ElUpload
    v-bind="props.upload"
    ref="uploadRef"
    :auto-upload="false"
    :show-file-list="false"
    action="#"
    :class="props.rootClassName"
  >
    <slot />
  </ElUpload>
</template>

<style lang="scss"></style>
