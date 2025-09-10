<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ThoughtChainItemProps, ThoughtChainProps } from './interface'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { computed, useId, useSlots } from 'vue'
import { useNamespace } from '../hooks/useNamespace'

interface ThoughtChainNodeProps {
  info?: ThoughtChainItemProps
  nextStatus?: ThoughtChainItemProps['status']
  headerClick?: (key: string) => void
  expandedKeys?: string[]
  className?: string
  style?: CSSProperties
  classNames?: ThoughtChainProps['classNames']
  styles?: ThoughtChainProps['styles']
  enableCollapse?: boolean
}

const props = withDefaults(defineProps<ThoughtChainNodeProps>(), {
  info: () => ({}),
  headerClick: () => {},
})

const ns = useNamespace('thought-chain-item')

const slots = useSlots()

const id = useId()

const onThoughtChainNodeClick = () => props.headerClick?.(id)

const contentOpen = computed(() => {
  return props.expandedKeys?.includes(id)
})
</script>

<template>
  <div
    :class="[
      ns.b(),
      props.info?.status && ns.b(`${props.info.status}${nextStatus ? `-${nextStatus}` : ''}`),
      props.className,
    ]"
    :style="props.style"
  >
    <!-- Header -->
    <div
      :class="[ns.b('header'), props.classNames?.itemHeader]"
      :style="props.styles?.itemHeader"
      @click="onThoughtChainNodeClick"
    >
      <!-- Icon -->
      <div :class="[ns.b('icon')]">
        <slot name="icon" :info="props.info" />
      </div>
      <!-- Header -->
      <div :class="[ns.b('header-box'), enableCollapse && slots.content]">
        <!-- Title -->
        <span :class="[ns.b('title')]">
          <strong>
            <div v-if="props.enableCollapse && slots.content">
              <ElIcon :class="[ns.b('collapse-icon'), contentOpen && 'rotate']">
                <ArrowRightBold />
              </ElIcon>
            </div>
            {{ props.info?.title }}
          </strong>
        </span>
        <span v-if="props.info?.description" :class="[ns.b('desc')]">
          {{ props.info?.description }}
        </span>
      </div>
      <div v-if="slots.extra" :class="[ns.b('extra')]">
        <slot name="extra" :info="props.info" />
      </div>
    </div>
    <!-- Content -->
    <template v-if="slots.content">
      <div v-show="props.enableCollapse ? contentOpen : true" :class="[ns.b('content')]">
        <div
          :class="[ns.b('content-box'), props.classNames?.itemContent]"
          :style="props.styles?.itemContent"
        >
          <slot name="content" :info="props.info" />
        </div>
      </div>
    </template>
    <!-- Footer -->
    <div
      v-if="slots.footer"
      :class="[ns.b('footer'), props.classNames?.itemFooter]"
      :style="props.styles?.itemFooter"
    >
      <slot name="footer" :info="props.info" />
    </div>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
