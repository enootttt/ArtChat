<script setup lang="ts">
import type { GroupTitleProps } from './interface'

import { ElDivider, ElText } from 'element-plus'

const props = defineProps<GroupTitleProps>()

const slots = defineSlots<{
  default?: () => void
}>()
</script>

<template>
  <ElDivider :content-position="props.direction === 'rtl' ? 'right' : 'left'">
    <ElText v-if="slots.default">
      <slot />
    </ElText>
  </ElDivider>
</template>

<style lang="scss"></style>
