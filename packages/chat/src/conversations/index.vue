<script setup lang="ts">
import type { Conversation, ConversationsProps } from './interface'

import { computed } from 'vue'

import { useNamespace } from '../hooks/useNamespace'
import GroupTitle from './GroupTitle.vue'
import useGroupable from './hooks/useGroupable'
import ConversationItem from './item.vue'

const props = defineProps<ConversationsProps>()

const emit = defineEmits(['update:activeKey'])

const ns = useNamespace('conversations')

const mergedActiveKey = computed(() => props.activeKey || props.defaultActiveKey || '')

const [groupList, enableGroup] = useGroupable(props.groupable, props.items)

const mergedCls = computed(() => [
  ns.b(),
  props.className,
  {
    [ns.b('rtl')]: props.direction === 'rtl',
  },
])

function onConversationItemClick(info: Conversation) {
  if (props.onActiveChange) {
    const next = props.onActiveChange(info.key)
    if (next === false) return
  }
  emit('update:activeKey', info.key)
}
</script>

<template>
  <ul :class="mergedCls" :style="props.style">
    <template v-for="(groupInfo, groupIndex) in groupList" :key="groupIndex">
      <template v-if="enableGroup">
        <li :key="groupInfo.name || `key-${groupIndex}`">
          <template v-if="$slots.title">
            <slot name="title" :info="groupInfo" />
          </template>
          <GroupTitle v-else :key="groupInfo.name">
            {{ groupInfo.name }}
          </GroupTitle>
        </li>
        <ul :class="[ns.b('list')]">
          <ConversationItem
            v-for="(convInfo, convIndex) in groupInfo.data"
            :key="convInfo.key || `key-${convIndex}`"
            :active="mergedActiveKey === convInfo.key"
            :class-name="props.classNames?.item"
            :direction="props.direction"
            :info="convInfo"
            :menu="typeof props.menu === 'function' ? props.menu(convInfo) : props.menu"
            :style="props.styles?.item"
            @click="onConversationItemClick"
          >
            <template #label="{ item }">
              <slot :item="item" name="item" />
            </template>
            <template #icon>
              <slot name="icon" />
            </template>
          </ConversationItem>
        </ul>
      </template>
      <template v-else>
        <ConversationItem
          v-for="(convInfo, convIndex) in groupInfo.data"
          :key="convInfo.key || `key-${convIndex}`"
          :active="mergedActiveKey === convInfo.key"
          :class-name="props.classNames?.item"
          :direction="props.direction"
          :info="convInfo"
          :menu="typeof props.menu === 'function' ? props.menu(convInfo) : props.menu"
          :style="props.styles?.item"
          @click="onConversationItemClick"
        >
          <template #label="{ item }">
            <slot :item="item" name="item" />
          </template>
          <template #icon>
            <slot name="icon" />
          </template>
        </ConversationItem>
      </template>
    </template>
  </ul>
</template>

<style lang="scss">
@import './index';
</style>
