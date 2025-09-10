<script setup lang="ts">
import type { Slots } from 'vue'

import type { PromptsProps } from './interface'
import { ElIcon } from 'element-plus'

import { computed, useSlots } from 'vue'

import { useNamespace } from '../hooks/useNamespace'

defineOptions({
  name: 'Prompts',
})

const props = withDefaults(defineProps<PromptsProps>(), {})

const ns = useNamespace('prompts')

const slots: Slots = useSlots()

const mergedCls = computed(() => [
  props.className,
  props.rootClassName,
  {
    [ns.b('rtl')]: props.direction === 'rtl',
  },
])

const mergedListCls = computed(() => [
  ns.b('list'),
  props.classNames?.list,
  { [ns.b('list-wrap')]: props.wrap },
  { [ns.b('list-vertical')]: props.vertical },
])
</script>

<template>
  <div :class="[ns.b(), mergedCls]" :style="{ ...props.style }">
    <template v-if="slots.title || props.title">
      <h5 :class="[ns.b('title')]">
        <slot name="title">
          {{ props.title }}
        </slot>
      </h5>
    </template>
    <!-- /* Prompt List */ -->
    <div :class="mergedListCls" :style="{ ...props.styles?.list }">
      <div
        v-for="(info, index) in props.items"
        :key="index"
        :class="[
          ns.b('item'),
          props.classNames?.item,
          {
            [ns.b('item-disabled')]: info.disabled,
            [ns.b('item-has-nest')]: info.children && info.children.length > 0,
          },
        ]"
        :style="{ ...props.styles?.item }"
        @click="
          () => {
            if (!(info.children && info.children.length > 0) && props.onItemClick) {
              props.onItemClick({ data: info })
            }
          }
        "
      >
        <div v-if="slots.icon || info.icon" :class="[ns.b('icon')]">
          <slot :info="info" name="icon">
            <ElIcon><component :is="info.icon" /></ElIcon>
          </slot>
        </div>
        <div
          :class="[ns.b('content'), props.classNames?.itemContent]"
          :style="{ ...props.styles?.itemContent }"
        >
          <h6 v-if="slots.label || info.label" :class="[ns.b('label')]">
            <slot :info="info" name="label">
              {{ info.label }}
            </slot>
          </h6>
          <p :class="[ns.b('desc')]">
            <slot :info="info" name="description">
              {{ info.description }}
            </slot>
          </p>
          <Prompts
            v-if="info.children && info.children.length > 0"
            :class="[ns.b('nested')]"
            :class-names="{
              list: props.classNames?.subList,
              item: props.classNames?.subItem,
            }"
            :items="info.children"
            :on-item-click="onItemClick"
            :styles="{
              list: props.styles?.subList,
              item: props.styles?.subItem,
            }"
            vertical
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
