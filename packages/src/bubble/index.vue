<script setup lang="ts">
import type { Ref, Slots, VNode } from 'vue'

import type { BubbleProps } from './interface'
import { ElAvatar } from 'element-plus'

import { computed, ref, useSlots, watch } from 'vue'

import { useNamespace } from '../hooks/useNamespace'
import useTypedEffect from './hooks/useTypedEffect'
import useTypingConfig from './hooks/useTypingConfig'
import Loading from './loading.vue'

const props = withDefaults(defineProps<BubbleProps>(), {
  styles: () => ({}),
  placement: 'start',
  loading: false,
  loadingRender: undefined,
  variant: 'filled',
  content: '',
  avatar: '',
  typing: false,
})

const emit = defineEmits<{
  (e: 'update'): void
  (e: 'typingComplete'): void
}>()

const ns = useNamespace('bubble')

const slots: Slots = useSlots()

const divRef = ref<HTMLDivElement>()

const [typingEnabled, typingStep, typingInterval, typingSuffix] = useTypingConfig(props.typing)

const contents = computed(() => {
  return props.content
})
const [typedContent, isTyping]: [Ref<() => string | VNode>, Ref<boolean>] = useTypedEffect(
  contents,
  typingEnabled as boolean,
  typingStep as number,
  typingInterval as number
)

watch(
  () => typedContent.value,
  () => {
    emit('update')
  }
)

const mergeContent = computed(() =>
  props.messageRender
    ? props.messageRender((typedContent.value as () => string)?.() ?? '')
    : typedContent.value
)

const triggerTypingCompleteRef = ref(false)
watch(
  () => isTyping.value || props.loading,
  () => {
    if (!isTyping.value && !props.loading) {
      if (!triggerTypingCompleteRef.value) {
        triggerTypingCompleteRef.value = true
        emit('typingComplete')
      }
    } else {
      triggerTypingCompleteRef.value = false
    }
  }
)

const mergedCls = computed(() => {
  return [
    ns.b(),
    ns.b(props.placement),
    {
      [ns.b('typing')]: isTyping.value && !props.loading && !props.messageRender && !typingSuffix,
    },
  ]
})

function isString(content: any) {
  return typeof content === 'string'
}

defineExpose({
  nativeElement: divRef,
})
</script>

<template>
  <div
    ref="divRef"
    :class="mergedCls"
    :style="[typingSuffix ? `--cursor-char: ${typingSuffix}` : '']"
  >
    <div
      v-if="slots.avatar || avatar"
      :class="[ns.b('avatar'), props.classNames?.avatar]"
      :style="props.styles?.avatar"
    >
      <slot name="avatar">
        <ElAvatar v-if="typeof avatar === 'string'" :size="32" :src="avatar" />
        <component :is="avatar" v-else />
      </slot>
    </div>
    <div v-if="slots.header || slots.footer" :class="[ns.b('content-wrapper')]">
      <div
        v-if="slots.header"
        :class="[ns.b('header'), props.classNames?.header]"
        :style="props.styles?.header"
      >
        <slot name="header" />
      </div>
      <div
        :class="[
          ns.b('content'),
          ns.b(`content-${props.variant}`),
          props.classNames?.content,
          props.shape && ns.b(`content-${props.placement}-${props.shape}`),
        ]"
        :style="props.styles?.content"
      >
        <template v-if="props.loading">
          <slot v-if="slots.loading" name="loading" />
          <component :is="loadingRender()" v-else-if="loadingRender" />
          <Loading v-else :prefix-cls="ns.b()" />
        </template>
        <template v-else>
          <!-- 根据 mergedContent 类型选择渲染方式 -->
          <slot name="content">
            <component :is="mergeContent" v-if="!isString(mergeContent)" />
            <template v-else>
              <div v-html="mergeContent" />
            </template>
            <template v-if="isTyping">
              <slot name="suffix">
                {{ typingSuffix }}
              </slot>
            </template>
          </slot>
        </template>
      </div>
      <div
        v-if="slots.footer"
        :class="[ns.b('footer'), props.classNames?.footer]"
        :style="props.styles?.footer"
      >
        <slot name="footer" />
      </div>
    </div>
    <template v-else>
      <div
        :class="[
          ns.b('content'),
          ns.b(`content-${props.variant}`),
          props.classNames?.content,
          props.shape && ns.b(`content-${props.placement}-${props.shape}`),
        ]"
        :style="props.styles?.content"
      >
        <template v-if="props.loading">
          <slot v-if="slots.loading" name="loading" />
          <component :is="loadingRender()" v-else-if="loadingRender" />
          <Loading v-else :prefix-cls="ns.b()" />
        </template>
        <template v-else>
          <slot name="content">
            <!-- 根据 mergedContent 类型选择渲染方式 -->
            <component :is="mergeContent" v-if="!isString(mergeContent)" />
            <template v-else>
              <div v-html="mergeContent" />
            </template>
            <template v-if="isTyping">
              <slot name="suffix">
                {{ typingSuffix }}
              </slot>
            </template>
          </slot>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
