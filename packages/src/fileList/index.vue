<script setup lang="ts">
import type { fileListProps } from './interface'

import { ArrowLeftBold, ArrowRightBold, UploadFilled } from '@element-plus/icons-vue'

import { ElButton, ElIcon } from 'element-plus'

import { nextTick, onMounted, ref, watch } from 'vue'

import SilentUploader from '../attachment/silentUploader.vue'
import { useNamespace } from '../hooks/useNamespace'
import fileListCard from './fileListCard.vue'

const props = withDefaults(defineProps<fileListProps>(), {
  disabled: false,
  overflow: 'wrap',
  listClassName: '',
  listStyle: undefined,
  itemClassName: '',
  itemStyle: undefined,
})

const ns = useNamespace('attachment-list')

const TOLERANCE = 1
const containerRef = ref<HTMLElement>()
const pingStart = ref(false)
const pingEnd = ref(false)

function checkPing() {
  const containerEle = containerRef.value
  if (!containerEle) return
  if (props.overflow === 'scrollX') {
    pingStart.value = Math.abs(containerEle.scrollLeft) >= TOLERANCE
    pingEnd.value =
      containerEle.scrollWidth - containerEle.clientWidth - Math.abs(containerEle.scrollLeft) >=
      TOLERANCE
  } else if (props.overflow === 'scrollY') {
    pingStart.value = containerEle.scrollTop !== 0
    pingEnd.value = containerEle.scrollHeight - containerEle.clientHeight !== containerEle.scrollTop
  }
}

watch(
  () => [props.overflow, props.items],
  () => {
    nextTick(() => {
      checkPing()
    })
  }
)

function onScrollOffset(offset: -1 | 1) {
  const containerEle = containerRef.value
  if (containerEle) {
    containerEle.scrollTo({
      left: containerEle.scrollLeft + offset * containerEle.clientWidth,
      behavior: 'smooth',
    })
  }
}

function onScrollLeft() {
  onScrollOffset(-1)
}

function onScrollRight() {
  onScrollOffset(1)
}

onMounted(() => {
  checkPing()
})
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      ns.b(),
      props.overflow && ns.b(`overflow-${props.overflow}`),
      pingStart && ns.b('overflow-ping-start'),
      pingEnd && ns.b('overflow-ping-end'),
      props.listClassName,
    ]"
    :style="props.listStyle"
    @scroll="checkPing"
  >
    <transition-group :name="ns.b('card-motion')">
      <div v-for="item in props.items" :key="item.uid">
        <fileListCard :key="item.uid" :item="item" :on-remove="onRemove" :style="props.itemStyle" />
      </div>
    </transition-group>
    <SilentUploader v-if="!props.disabled" :upload="props.upload">
      <ElButton :class="[ns.b('upload-btn')]" type="info">
        <template #icon>
          <ElIcon :class="[ns.b('upload-btn-icon')]">
            <UploadFilled />
          </ElIcon>
        </template>
      </ElButton>
    </SilentUploader>
    <template v-if="props.overflow === 'scrollX'">
      <ElButton :class="[ns.b('prev-btn')]" circle size="small" @click="onScrollLeft">
        <template #icon>
          <ArrowLeftBold />
        </template>
      </ElButton>
      <ElButton :class="[ns.b('next-btn')]" circle icon="" size="small" @click="onScrollRight">
        <template #icon>
          <ArrowRightBold />
        </template>
      </ElButton>
    </template>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
