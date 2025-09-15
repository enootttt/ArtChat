<script setup lang="ts">
import type { MermaidToolbarConfig, MermaidToolbarEmits } from './types'
import {
  Aim,
  Check,
  CopyDocument,
  Download,
  FullScreen,
  ZoomIn,
  ZoomOut,
} from '@element-plus/icons-vue'
import { ElIcon, ElTabPane, ElTabs } from 'element-plus'
import { computed, ref } from 'vue'

interface MermaidToolbarInternalProps {
  toolbarConfig?: MermaidToolbarConfig
  isSourceCodeMode?: boolean
  sourceCode?: string
}

const props = withDefaults(defineProps<MermaidToolbarInternalProps>(), {
  toolbarConfig: () => ({}),
  isSourceCodeMode: false,
  sourceCode: '',
})

const emit = defineEmits<MermaidToolbarEmits>()

// 复制成功状态
const isCopySuccess = ref(false)

// 当前激活的 tab
const activeTab = computed({
  get: () => (props.isSourceCodeMode ? 'code' : 'diagram'),
  set: (value: string) => {
    if (value === 'code' && !props.isSourceCodeMode) {
      handleToggleCode()
    } else if (value === 'diagram' && props.isSourceCodeMode) {
      handleToggleCode()
    }
  },
})

// 合并默认配置
const config = computed(() => {
  return {
    showToolbar: true,
    showFullscreen: true,
    showZoomIn: true,
    showZoomOut: true,
    showReset: true,
    showDownload: true,
    toolbarStyle: {},
    toolbarClass: '',
    iconColor: undefined,
    tabTextColor: undefined,
    hoverBackgroundColor: undefined,
    tabActiveBackgroundColor: undefined,
    ...props.toolbarConfig,
  }
})

// 动态图标颜色
const iconColorStyle = computed(() => {
  const style: Record<string, string> = {}

  if (config.value.iconColor) {
    style.color = config.value.iconColor
    style['--custom-icon-color'] = config.value.iconColor
  }

  // 设置hover背景色
  if (config.value.hoverBackgroundColor) {
    style['--custom-hover-bg'] = config.value.hoverBackgroundColor
  } else if (config.value.iconColor) {
    // 如果设置了图标颜色但没有设置hover背景色，使用稍暗的背景
    style['--custom-hover-bg'] = 'rgba(0, 0, 0, 0.1)'
  }

  return style
})

// 动态 tab 文字颜色
const tabTextColorStyle = computed(() => {
  const style: Record<string, string> = {}

  if (config.value.tabTextColor) {
    style['--tab-text-color'] = config.value.tabTextColor
  }

  // 设置tab激活状态背景色
  if (config.value.tabActiveBackgroundColor) {
    style['--tab-active-bg'] = config.value.tabActiveBackgroundColor
  } else if (config.value.tabTextColor) {
    // 如果设置了文字颜色但没有设置激活背景色，使用稍暗的背景
    style['--tab-active-bg'] = 'rgba(0, 0, 0, 0.1)'
  }

  return style
})

function handleZoomIn(event: Event) {
  event.stopPropagation()
  event.preventDefault()
  emit('onZoomIn')
}

function handleZoomOut(event: Event) {
  event.stopPropagation()
  event.preventDefault()
  emit('onZoomOut')
}

function handleReset(event: Event) {
  event.stopPropagation()
  event.preventDefault()
  emit('onReset')
}

function handleFullscreen(event: Event) {
  event.stopPropagation()
  event.preventDefault()
  emit('onFullscreen')
}

function handleToggleCode(event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  emit('onToggleCode')
}

function handleDownload(event: Event) {
  event.stopPropagation()
  event.preventDefault()
  emit('onDownload')
}

async function handleCopyCode(event: Event) {
  event.stopPropagation()
  event.preventDefault()

  // 如果正在显示成功状态，不执行复制操作
  if (isCopySuccess.value) {
    return
  }

  try {
    if (!props.sourceCode) {
      emit('onCopyCode')
      return
    }

    // 使用现代剪贴板 API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.sourceCode)
    } else {
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = props.sourceCode
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }

    // 设置复制成功状态
    isCopySuccess.value = true

    setTimeout(() => {
      isCopySuccess.value = false
    }, 1500)

    emit('onCopyCode')
  } catch (err) {
    console.error('Failed to copy code: ', err)
    // 如果复制失败，也通知父组件，让父组件决定如何处理
    emit('onCopyCode')
  }
}

function handleToolbarClick(event: Event) {
  event.stopPropagation()
  event.preventDefault()
}

function handleTabClick(tabName: string) {
  activeTab.value = tabName
}

interface TabClickEvent {
  paneName: string
}

function handleTabClickEvent(pane: Record<string, any>) {
  handleTabClick((pane as TabClickEvent).paneName)
}
</script>

<template>
  <!-- 正常状态：显示工具栏 -->
  <div
    v-if="config.showToolbar"
    class="mermaid-toolbar"
    :class="config.toolbarClass"
    :style="config.toolbarStyle"
    @click="handleToolbarClick"
  >
    <!-- 左侧 Tabs -->
    <div class="toolbar-left" :style="tabTextColorStyle">
      <ElTabs :model-value="activeTab" class="toolbar-tabs" @tab-click="handleTabClickEvent">
        <ElTabPane label="图片" name="diagram" />
        <ElTabPane label="代码" name="code" />
      </ElTabs>
    </div>

    <!-- 右侧按钮组 -->
    <div class="toolbar-right">
      <!-- 代码视图：只显示复制按钮 -->
      <template v-if="props.isSourceCodeMode">
        <div
          class="toolbar-action-btn"
          :class="{ 'copy-success': isCopySuccess }"
          :style="iconColorStyle"
          @click="handleCopyCode($event)"
        >
          <ElIcon :size="16">
            <Check v-if="isCopySuccess" />
            <CopyDocument v-else />
          </ElIcon>
        </div>
      </template>

      <!-- 图片视图：显示所有操作按钮 -->
      <template v-else>
        <!-- 下载按钮 -->
        <div
          v-if="config.showDownload"
          class="toolbar-action-btn"
          :style="iconColorStyle"
          @click="handleDownload($event)"
        >
          <ElIcon :size="16">
            <Download />
          </ElIcon>
        </div>

        <!-- 分割线 -->
        <div v-if="config.showDownload" class="toolbar-divider" />

        <!-- 缩小按钮 -->
        <div
          v-if="config.showZoomOut"
          class="toolbar-action-btn"
          :style="iconColorStyle"
          @click="handleZoomOut($event)"
        >
          <ElIcon :size="16">
            <ZoomOut />
          </ElIcon>
        </div>

        <!-- 放大按钮 -->
        <div
          v-if="config.showZoomIn"
          class="toolbar-action-btn"
          :style="iconColorStyle"
          @click="handleZoomIn($event)"
        >
          <ElIcon :size="16">
            <ZoomIn />
          </ElIcon>
        </div>

        <!-- 适应按钮 (重置) -->
        <div
          v-if="config.showReset"
          class="toolbar-action-btn"
          :style="iconColorStyle"
          @click="handleReset($event)"
        >
          <ElIcon :size="16">
            <Aim />
          </ElIcon>
        </div>

        <!-- 全屏按钮 -->
        <div
          v-if="config.showFullscreen"
          class="toolbar-action-btn"
          :style="iconColorStyle"
          @click="handleFullscreen($event)"
        >
          <ElIcon :size="16">
            <FullScreen />
          </ElIcon>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mermaid-toolbar {
  display: flex;
  align-items: center;
  height: 42px;
  background: #ebecef;
  border-radius: 3px 3px 0 0;
  padding: 0 12px;
  pointer-events: auto;
  position: relative;
  z-index: 10;

  .toolbar-left {
    flex: 1;

    .toolbar-tabs {
      :deep(.el-tabs__header) {
        margin: 0;
        border-bottom: none;
      }

      :deep(.el-tabs__nav) {
        background: #dddee1;
        padding: 2px;
        border-radius: 10px;
      }

      :deep(.el-tabs__nav-wrap) {
        &::after {
          display: none;
        }
      }

      :deep(.el-tabs__item) {
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        font-size: 12px;
        border: none;
        color: var(--tab-text-color, var(--el-text-color-regular));
        width: 60px;
        text-align: center;
        box-sizing: border-box;
        font-weight: 700;

        &.is-active {
          color: var(--tab-text-color, var(--el-text-color-primary));
          background: var(--tab-active-bg, rgba(255, 255, 255, 0.8));
          border-radius: 10px;
        }

        &:hover:not(.is-active) {
          color: var(--tab-text-color, var(--el-text-color-primary));
          background: #d1d2d5;
          border-radius: 10px;
        }
      }

      :deep(.el-tabs__active-bar) {
        display: none;
      }
    }
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 0;

    .toolbar-action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--el-text-color-regular);
      border-radius: 4px;
      position: relative;

      &:hover:not(.disabled) {
        color: var(--custom-icon-color, var(--el-text-color-primary));

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: #dddee1;
          border-radius: 4px;
          z-index: -1;
        }
      }

      &:active:not(.disabled) {
        transform: scale(0.95);
      }

      &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none !important;
        background: none !important;
      }

      &.toolbar-action-btn-last {
        margin-right: 0;
      }

      &.copy-success {
        cursor: default;
        transform: none !important;
      }
    }

    .toolbar-divider {
      width: 1px;
      height: 16px;
      background: var(--el-border-color);
      margin: 0 8px;
    }
  }
}

/* 父容器悬停时显示工具栏 */
:global(.markdown-mermaid:hover .mermaid-toolbar) {
  opacity: 1;
  visibility: visible;
}

/* 全屏状态下的样式调整 */
:global(.markdown-mermaid:fullscreen .mermaid-toolbar) {
  background: rgba(0, 0, 0, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.1);

  .toolbar-left .toolbar-tabs {
    :deep(.el-tabs__item) {
      color: rgba(255, 255, 255, 0.7);

      &.is-active {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }

      &:hover:not(.is-active) {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .toolbar-right {
    .toolbar-action-btn {
      color: rgba(255, 255, 255, 0.7);

      &:hover:not(.disabled) {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
    }

    .toolbar-divider {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
