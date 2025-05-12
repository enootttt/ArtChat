<script setup lang="ts">
import type { Component } from 'vue'

import type { FileListCardProps } from './interface'
import { CircleCloseFilled } from '@element-plus/icons-vue'

import { ElIcon, ElImage } from 'element-plus'
import { computed, ref, toRaw, watch } from 'vue'

import { previewImage } from '../attachment/util'
import { useNamespace } from '../hooks/useNamespace'
import AudioIcon from './AudioIcon.vue'
import ExcelIcon from './ExcelIcon.vue'
import ImageIcon from './ImageIcon.vue'
import MarkdownIcon from './MarkdownIcon.vue'
import PdfIcon from './PdfIcon.vue'
import PptIcon from './PptIcon.vue'
import Progress from './Progress.vue'
import TxtIcon from './TxtIcon.vue'
import VideoIcon from './VideoIcon.vue'
import WordIcon from './WordIcon.vue'
import ZipIcon from './ZipIcon.vue'

const props = withDefaults(defineProps<FileListCardProps>(), {
  disabled: false,
  onRemove: () => {},
  className: '',
  style: undefined,
})

const ns = useNamespace('attachment-list-card')

const EMPTY = '\u00A0'
const DEFAULT_ICON_COLOR = '#8c8c8c'
const IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']
const PRESET_FILE_ICONS: {
  color: string
  ext: string[]
  icon: Component
}[] = [
  {
    icon: toRaw(ExcelIcon),
    color: '#22b35e',
    ext: ['xlsx', 'xls'],
  },
  {
    icon: toRaw(ImageIcon),
    color: DEFAULT_ICON_COLOR,
    ext: IMG_EXTS,
  },
  {
    icon: toRaw(MarkdownIcon),
    color: DEFAULT_ICON_COLOR,
    ext: ['md', 'mdx'],
  },
  {
    icon: toRaw(PdfIcon),
    color: '#ff4d4f',
    ext: ['pdf'],
  },
  {
    icon: toRaw(PptIcon),
    color: '#ff6e31',
    ext: ['ppt', 'pptx'],
  },
  {
    icon: toRaw(WordIcon),
    color: '#1677ff',
    ext: ['doc', 'docx'],
  },
  {
    icon: toRaw(ZipIcon),
    color: '#fab714',
    ext: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
  {
    icon: toRaw(VideoIcon),
    color: '#ff4d4f',
    ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
  },
  {
    icon: toRaw(AudioIcon),
    color: '#8c8c8c',
    ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
  },
]

const previewImg = ref<string | undefined>()

const previewUrl = ref('')
watch(
  () => props.item,
  async (newVal) => {
    if (newVal?.raw) {
      let synced = true
      const url = await previewImage(newVal.raw)
      if (synced) {
        previewImg.value = url
      }
      synced = false
    } else {
      previewImg.value = undefined
    }
    previewUrl.value = props.item?.thumbUrl || props.item?.url || (previewImg.value as string)
  },
  {
    immediate: true,
  }
)

const fileName = computed(() => {
  const nameStr = props.item?.name || ''
  const match = nameStr.match(/^(.*)\.[^.]+$/)
  return match ? [match[1], nameStr.slice(match[1]!.length)] : [nameStr, '']
})

function matchExt(suffix: string, ext: string[]) {
  return ext.some((e) => suffix.toLowerCase() === `.${e}`)
}

function getSize(size: number) {
  let retSize = size
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
  let unitIndex = 0

  while (retSize >= 1024 && unitIndex < units.length - 1) {
    retSize /= 1024
    unitIndex++
  }

  return `${retSize.toFixed(0)} ${units[unitIndex]}`
}

const desc = computed(() => {
  if (props.item?.description) {
    return props.item?.description
  }

  if (props.item?.status === 'uploading') {
    return `${props.item?.percent || 0}%`
  }

  if (props.item?.status === 'fail') {
    return props.item?.response || EMPTY
  }

  return props.item?.size ? getSize(props.item?.size) : EMPTY
})

const ICON = computed<[Component, string]>(() => {
  for (const { ext, icon, color } of PRESET_FILE_ICONS) {
    if (matchExt(fileName.value[1] as string, ext)) {
      return [icon, color]
    }
  }
  return [toRaw(TxtIcon), DEFAULT_ICON_COLOR]
})

const isImg = computed(() => matchExt(fileName.value[1] as string, IMG_EXTS))

const isImgPreview = computed(() => isImg.value && (props.item?.file || previewUrl))
</script>

<template>
  <div
    :class="[
      ns.b(),
      {
        [ns.b(`status-${props.item?.status}`)]: props.item?.status,
        [ns.b(`type-preview`)]: isImgPreview,
        [ns.b(`type-overview`)]: !isImgPreview,
      },
    ]"
  >
    <template v-if="isImgPreview">
      <ElImage v-if="previewUrl" :src="previewUrl" alt="preview" :preview-src-list="[previewUrl]" preview-teleported hide-on-click-modal loading="lazy" />
      <div
        v-if="props.item?.status && props.item?.status !== 'ready'"
        :class="[`${ns.b('img-mask')}`]"
      >
        <Progress v-if="props.item?.status === 'uploading'" :percent="props?.item?.percent || 0" />
        <div v-else-if="props.item?.status === 'fail'" :class="[ns.b('desc')]">
          <div :class="[ns.b('ellipsis-prefix')]">
            {{ desc }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div :class="[ns.b(`icon`)]" :style="{ color: ICON[1] }">
        <ElIcon size="32">
          <component :is="ICON[0]" />
        </ElIcon>
      </div>
      <div :class="[ns.b('content')]">
        <div :class="[ns.b('name')]">
          <div :class="[ns.b('ellipsis-prefix')]">
            {{ fileName[0] ?? EMPTY }}
          </div>
          <div :class="[ns.b('ellipsis-suffix')]">
            {{ fileName[1] ?? EMPTY }}
          </div>
        </div>
        <div :class="[ns.b('desc')]">
          <div :class="[ns.b('ellipsis-prefix')]">
            {{ desc }}
          </div>
        </div>
      </div>
    </template>
    <template v-if="!props.disabled && props.onRemove">
      <button :class="[ns.b('remove')]" type="button" @click="onRemove(item)">
        <ElIcon size="20">
          <CircleCloseFilled />
        </ElIcon>
      </button>
    </template>
  </div>
</template>

<style lang="scss">
@import './index';
</style>
