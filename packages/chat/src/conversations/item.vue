<script setup lang="ts">
import type { ItemProps } from './interface'

import { MoreFilled } from '@element-plus/icons-vue'

import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import { computed, ref } from 'vue'

import DropDown from '../dropdown/index.vue'
import { useNamespace } from '../hooks/useNamespace'

const props = withDefaults(defineProps<ItemProps>(), {
  inEllipsis: true,
  line: 1,
})

const emit = defineEmits(['click'])

const opened = ref(false)

const ns = useNamespace('conversations')

const mergedCls = computed(() => [
  props.className,
  ns.b('item'),
  { [ns.b('item-active')]: props.active && !props.info?.disabled },
  { [ns.b('item-disabled')]: props.info?.disabled },
])

function stopPropagation(e: Event) {
  e.stopPropagation()
}

const textRef = ref<HTMLElement>()
function textRefMouseenter() {
  if (props.info?.disabled) {
    opened.value = false
    return
  }
  if (!textRef.value) return
  opened.value = !!(
    textRef.value?.scrollWidth > textRef.value?.offsetWidth ||
    textRef.value?.scrollHeight > textRef.value?.offsetHeight
  )
}

function onInternalClick() {
  if (!props.info?.disabled) {
    emit('click', props.info)
  }
}

function handleCommand(e: any) {
  if (Array.isArray(props.menu)) return
  if (!props.info) return
  props.menu?.onClick?.({ ...props.info, key: e })
}
</script>

<template>
  <ElTooltip
    v-model:visible="opened"
    :content="info?.label"
    :disabled="inEllipsis && !opened"
    :placement="direction === 'rtl' ? 'left' : 'right'"
  >
    <li :class="mergedCls" @click="onInternalClick">
      <slot class="icon">
        <div v-if="info!.icon" :class="ns.b('icon')">
          <ElIcon v-if="typeof info!.icon === 'string'">
            <component :is="info!.icon" />
          </ElIcon>
          <component :is="info!.icon" v-else />
        </div>
      </slot>
      <div
        ref="textRef"
        :class="ns.b('label')"
        :style="{ 'textOverflow': 'ellipsis', '-webkit-line-clamp': line }"
        @mouseenter="textRefMouseenter"
      >
        <slot :item="info" name="label">
          {{ info!.label }}
        </slot>
      </div>
      <DropDown
        v-if="menu && !info?.disabled"
        :disabled="info?.disabled"
        :menu="Array.isArray(menu) ? menu : menu.items"
        :placement="direction === 'rtl' ? 'bottom-start' : 'bottom-end'"
        trigger="click"
        :teleported="!Array.isArray(menu) ? menu?.teleported : true"
        @command="handleCommand"
      >
        <ElButton :disabled="info?.disabled" link @click="stopPropagation">
          <slot name="menu-icon" :info="info">
            <ElIcon :class="ns.b('menu-icon')">
              <MoreFilled />
            </ElIcon>
          </slot>
        </ElButton>
      </DropDown>
    </li>
  </ElTooltip>
</template>

<style lang="scss">
@import './index';
</style>
