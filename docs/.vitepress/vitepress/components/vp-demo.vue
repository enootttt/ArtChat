<script setup lang="ts">
import { ArrowDownBold } from '@element-plus/icons-vue'
import { useClipboard, useToggle } from '@vueuse/core'
import { ElCollapseTransition, ElIcon } from 'element-plus'
import { computed, ref } from 'vue'
import SourceCode from './demo/vp-source-code.vue'
import 'element-plus/dist/index.css'

const props = defineProps<{
  source: string
  path: string
  rawSource: string
  description: string
}>()

useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
})

const [sourceVisible, toggleSourceVisible] = useToggle()

const sourceCodeRef = ref<HTMLButtonElement>()

const decodedDescription = computed(() => decodeURIComponent(props.description))

function onSourceVisibleKeydown(e: KeyboardEvent) {
  if (['Enter', 'Space'].includes(e.code)) {
    e.preventDefault()
    toggleSourceVisible(false)
    sourceCodeRef.value?.focus()
  }
}
</script>

<template>
  <div style="margin-top: 16px; margin-bottom: 16px" v-html="decodedDescription" />
  <div class="example">
    <div class="example-showcase">
      <slot name="source" />
    </div>

    <div>
      <ElCollapseTransition>
        <SourceCode :visible="sourceVisible" :source="source" />
      </ElCollapseTransition>

      <div
        class="example-float-control"
        tabindex="0"
        role="button"
        @click="toggleSourceVisible(!sourceVisible)"
        @keydown="onSourceVisibleKeydown"
      >
        <ElIcon class="example-float-control-icon" :class="{ 'example-active': sourceVisible }">
          <ArrowDownBold />
        </ElIcon>
        <span>{{ sourceVisible ? '隐藏源代码' : '查看源代码' }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.example {
  .example-showcase {
    ul {
      list-style: none;
    }
  }
}
</style>

<style scoped lang="scss">
.example {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;

  .example-showcase {
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--vp-c-divider);

    :deep(table) {
      margin: 0;

      tr {
        border: unset;
        background-color: unset;
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--vp-border-color);
    height: 44px;
    box-sizing: border-box;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: var(--vp-code-block-bg);

    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &-icon {
      transform-origin: center center;
      transition: all 0.2s ease-in-out;
      &.example-active {
        transform: rotate(180deg);
      }
    }
  }
}

.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
  transition: opacity 0.2s linear;
}

.fade-in-linear-enter-from,
.fade-in-linear-leave-to {
  opacity: 0;
}
</style>
