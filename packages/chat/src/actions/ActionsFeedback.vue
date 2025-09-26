<script setup lang="ts">
import type { ActionsFeedbackProps } from './interface'
import { ElIcon, ElTooltip } from 'element-plus'
import { computed } from 'vue'
import { useNamespace } from '../hooks/useNamespace'
import { DislikeFiled, DislikeOutlined, LikeFilled, LikeOutlined } from '../icon'
import { FEEDBACK_VALUE } from './interface'

const props = withDefaults(defineProps<ActionsFeedbackProps>(), {
  value: 'default',
  likeColor: '#f759ab',
  dislikeColor: '#1f1f1f',
})

const ns = useNamespace('actions-feedback')

const mergedCls = computed(() => [ns.b(), props.classNames?.root])

function onFeedBacKClick() {
  return props.onChange?.(
    props.value === FEEDBACK_VALUE.dislike ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.dislike
  )
}
</script>

<template>
  <div :class="mergedCls" :style="props.styles?.root">
    <template
      v-if="[FEEDBACK_VALUE.default, FEEDBACK_VALUE.like].includes(value as FEEDBACK_VALUE)"
    >
      <ElTooltip content="喜欢" placement="top">
        <span
          :class="[
            ns.b('item'),
            ns.b('item-like'),
            {
              [`${classNames?.liked}`]: classNames?.liked && value === 'like',
              [ns.b('item-like-active')]: value === 'like',
            },
          ]"
          :style="{ ...styles?.like, ...(value === 'like' ? styles?.liked : {}) }"
          @click="
            () =>
              onChange?.(
                value === FEEDBACK_VALUE.like ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.like,
              )
          "
        >
          <ElIcon :size="13" :color="value === FEEDBACK_VALUE.like ? props.likeColor : ''">
            <LikeFilled v-if="value === FEEDBACK_VALUE.like ? props.likeColor : ''" />
            <LikeOutlined v-else />
          </ElIcon>
        </span>
      </ElTooltip>
    </template>
    <template
      v-if="[FEEDBACK_VALUE.default, FEEDBACK_VALUE.dislike].includes(value as FEEDBACK_VALUE)"
    >
      <ElTooltip content="不喜欢" placement="top">
        <span
          :class="[
            ns.b('item'),
            ns.b('item-dislike'),
            {
              [`${classNames?.disliked}`]: classNames?.disliked && value === 'like',
              [ns.b('item-like-dislike-active')]: value === 'dislike',
            },
          ]"
          :style="{ ...styles?.dislike, ...(value === 'dislike' ? styles?.disliked : {}) }"
          @click="onFeedBacKClick"
        >
          <ElIcon :size="13" :class="value === FEEDBACK_VALUE.dislike ? props.dislikeColor : ''">
            <DislikeFiled v-if="value === FEEDBACK_VALUE.dislike" />
            <DislikeOutlined v-else />
          </ElIcon>
        </span>
      </ElTooltip>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
