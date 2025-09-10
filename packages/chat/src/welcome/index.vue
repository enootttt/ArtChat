<script setup lang="ts">
import type { WelcomeProps } from './interface'
import { computed } from 'vue'
import { useNamespace } from '../hooks/useNamespace'

const props = withDefaults(defineProps<WelcomeProps>(), {
  variant: 'filled',
})

const ns = useNamespace('welcome')

const mergedCls = computed(() => [
  props.rootClassName,
  {
    [ns.b('filled')]: props.variant === 'filled',
    [ns.b('borderless')]: props.variant === 'borderless',
  },
])
</script>

<template>
  <!-- 欢迎页面容器 -->
  <div :class="[ns.b(), mergedCls]">
    <!-- 左侧图标区域 -->
    <div v-if="$slots.icon || icon" :class="[ns.b('icon'), classNames?.icon]" :style="styles?.icon">
      <slot name="icon">
        <img v-if="typeof icon === 'string'" :src="icon" alt="欢迎图标">
        <component :is="icon" v-else />
      </slot>
    </div>

    <!-- 右侧内容区域 -->
    <div :class="ns.b('content-wrapper')">
      <!-- 标题区域 -->
      <div
        v-if="$slots.title || title"
        :class="[ns.b('title'), classNames?.title, ($slots.extra || extra) && 'extra']"
        :style="styles?.title"
      >
        <slot name="title">
          <h4>{{ title }}</h4>
        </slot>
        <!-- 右上角操作区域 -->
        <div
          v-if="$slots.extra || extra"
          :class="[ns.b('extra'), classNames?.extra]"
          :style="styles?.extra"
        >
          <slot name="extra">
            {{ extra }}
          </slot>
        </div>
      </div>

      <!-- 描述区域 -->
      <span :class="[ns.b('description'), classNames?.description]" :style="styles?.description">
        <slot name="description">
          {{ description }}
        </slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
