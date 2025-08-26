<script setup lang='ts'>
import type { ActionItem, ActionsEmits, ActionsProps } from './interface'
import { ElIcon, ElTooltip } from 'element-plus'
import { computed } from 'vue'

import { useNamespace } from '../hooks/useNamespace'

import ActionMenu from './ActionMenu.vue'

withDefaults(defineProps<ActionsProps>(), {
  trigger: 'hover',
})

const emits = defineEmits<ActionsEmits>()

const ns = useNamespace('actions')

const mergedCls = computed(() => [
  ns.b(),
])

function handleItemClick(key: string, item: ActionItem) {
  if (item.onItemClick) {
    item.onItemClick(item)
    return
  }
  emits('click', {
    item,
    key,
    keyPath: [key],
  })
}
</script>

<template>
  <div :class="mergedCls">
    <div :class="[ns.b('list'), variant, block]">
      <template v-for="(item) in items" :key="item.key">
        <template v-if="'children' in item">
          <ActionMenu :key="item.key" :item="item" :trigger="trigger" @click="emits('click', $event)">
            <template #icon="{ info }">
              <slot name="icon" :info="info">
                <ElIcon>
                  <component :is="info.icon" />
                </ElIcon>
              </slot>
            </template>
          </ActionMenu>
        </template>
        <template v-else>
          <div :class="ns.b('list-item')" @click="handleItemClick(item.key, item)">
            <div :class="ns.b('list-item-icon')">
              <slot name="icon" :info="item">
                <template v-if="item.icon">
                  <ElTooltip :content="item.label">
                    <ElIcon>
                      <component :is="item.icon" />
                    </ElIcon>
                  </ElTooltip>
                </template>
              </slot>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index';
</style>
