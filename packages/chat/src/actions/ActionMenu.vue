<script setup lang='ts'>
import type { ActionsEmits, ItemType } from './interface'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import { useNamespace } from '../hooks/useNamespace'

const props = defineProps<{ item: ItemType }>()

const emits = defineEmits<ActionsEmits>()

const ns = useNamespace('actions')

function handleCommand(item: ItemType) {
  if (item.onItemClick) {
    item.onItemClick(item)
    return
  }
  emits('click', {
    key: item.key,
    keyPath: [props.item.key, item.key],
    item,
  })
}
</script>

<template>
  <ElDropdown v-bind="$attrs">
    <div :class="ns.b('list-item')">
      <div :class="ns.b('list-item-icon')">
        <slot name="icon" :info="item" />
      </div>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <template v-for="menu in item.children" :key="menu.key">
          <ElDropdownItem v-bind="(menu as any)" @click="handleCommand(menu)">{{ menu.label }}</ElDropdownItem>
        </template>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss">
@import './index';
</style>
