<script lang="ts" setup>
import type { ElxRunCodeHeaderTypes } from '../type'
import { useVModel } from '@vueuse/core'
import { ElSegmented } from 'element-plus'
import { SELECT_OPTIONS_ENUM } from './options'

interface ElxRunCodeProps {
  value: ElxRunCodeHeaderTypes['options']
}

const props = withDefaults(defineProps<ElxRunCodeProps>(), {})

const emit = defineEmits<{
  (e: 'changeSelect', val: string): void
  (e: 'update:value'): void
}>()

const options = Object.values(SELECT_OPTIONS_ENUM)

const selectValue = useVModel(props, 'value', emit)

function change(val: string) {
  emit('changeSelect', val)
}
</script>

<template>
  <div class="custom-style">
    <ElSegmented v-model="selectValue" :options="options" @change="change" />
  </div>
</template>

<style src="./style/index.scss"></style>
