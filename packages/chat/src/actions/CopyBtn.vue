<script setup lang="ts">
import type { Component } from 'vue'
import type { CopyConfig } from '../hooks/useCopyClick'
import { Check } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'
import { useCopyClick } from '../hooks/useCopyClick'
import { LoadingOutlined } from '../icon'

interface Props {
  text?: CopyConfig['text']
  icon?: Component
}

const props = defineProps<Props>()

const { copied, copyLoading, onClick } = useCopyClick({
  copyConfig: {
    text: props.text,
  },
})
</script>

<template>
  <ElButton link @click="onClick">
    <template #icon>
      <ElIcon>
        <Check v-if="copied" />
        <LoadingOutlined v-else-if="copyLoading" />
        <component :is="icon" v-else />
      </ElIcon>
    </template>
  </ElButton>
</template>

<style lang="scss" scoped></style>
