<script setup lang="ts">
import { View } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'

const props = defineProps<{
  onView: () => void
}>()

function handleClick() {
  props.onView()
}
</script>

<template>
  <ElButton class="shiki-header-button markdown-elxLanguage-header-button" @click="handleClick">
    <View />
  </ElButton>
</template>
