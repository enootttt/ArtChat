<script setup lang="ts">
import type { DropDownProps } from './interface'

import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'

const props = withDefaults(defineProps<DropDownProps>(), {
  menu: () => [],
  disabled: false,
})
const emit = defineEmits(['onOpenChange'])
</script>

<template>
  <ElDropdown @visible-change="emit('onOpenChange', $event)">
    <slot />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="(item, index) in props.menu" :key="index" v-bind="item">
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss"></style>
