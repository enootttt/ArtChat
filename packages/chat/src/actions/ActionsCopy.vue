<script setup lang="ts">
import type { ActionsCopyProps } from './interface'
import { DocumentCopy } from '@element-plus/icons-vue'
import { useNamespace } from '../hooks/useNamespace'
import CopyBtn from './CopyBtn.vue'

withDefaults(defineProps<ActionsCopyProps>(), {
  icon: DocumentCopy,
})

const ns = useNamespace('actions-copy')
</script>

<template>
  <CopyBtn :icon="icon" :text="text" :class="ns.b()" />
</template>

<style lang="scss" scoped></style>
