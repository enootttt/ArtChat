<script lang="ts" setup>
import type { MarkdownProps } from '../../shared/types'
import { computed, useSlots } from 'vue'
import { useShiki } from '../../hooks/useShiki'
import { MarkdownRenderer } from '../../index'
import { DEFAULT_PROPS } from '../../shared/constants'
import { useMarkdownContext } from '../MarkdownProvider'

const props = withDefaults(defineProps<MarkdownProps>(), DEFAULT_PROPS)

const slots = useSlots()
const customComponents = useMarkdownContext()
const colorReplacementsComputed = computed(() => {
  return props.colorReplacements
})
const needViewCodeBtnComputed = computed(() => {
  return props.needViewCodeBtn
})
useShiki()
</script>

<template>
  <div class="elx-xmarkdown-container">
    <MarkdownRenderer
      v-bind="props"
      :color-replacements="colorReplacementsComputed"
      :need-view-code-btn="needViewCodeBtnComputed"
    >
      <template v-for="(slot, name) in customComponents" :key="name" #[name]="slotProps">
        <component :is="slot" v-bind="slotProps" />
      </template>
      <template v-for="(_, name) in slots" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </MarkdownRenderer>
  </div>
</template>
