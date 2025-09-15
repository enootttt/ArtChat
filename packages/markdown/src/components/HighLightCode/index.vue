<script lang="ts" setup>
import { ElScrollbar } from 'element-plus'
import { computed } from 'vue'

export interface HighLightCodeProps {
  code: string[]
  lang: string
  enableCodeLineNumber: boolean
}

const props = defineProps<HighLightCodeProps>()

const codeClass = computed(() => `language-${props.lang || 'text'}`)
</script>

<template>
  <div class="elx-highlight-code-wrapper">
    <div v-if="props.enableCodeLineNumber" class="line-numbers">
      <span v-for="(_line, index) in props.code" :key="index" class="line-number">
        {{ index + 1 }}
      </span>
    </div>
    <ElScrollbar class="elx-highlight-code-scrollbar">
      <div class="code-lines" :class="codeClass">
        <span v-for="(line, index) in props.code" :key="index" class="line-content" v-html="line" />
      </div>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" src="./style.scss"></style>
