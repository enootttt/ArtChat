<script setup lang="ts">
import { CopyDocument, Select } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { ref } from 'vue'

const props = defineProps<{
  onCopy: () => void
}>()

const copied = ref(false)

function handleClick() {
  if (!copied.value) {
    props.onCopy()
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <ElButton class="shiki-header-button markdown-elxLanguage-header-button" @click="handleClick">
    <component
      :is="copied ? Select : CopyDocument"
      class="markdown-elxLanguage-header-button-text"
      :class="[copied && 'copied']"
    />
  </ElButton>
</template>
