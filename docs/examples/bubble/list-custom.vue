<script setup lang="ts">
import type { BubbleListProps, PromptProps } from '@artmate/chat'
import { BubbleList, FileList, Prompts } from '@artmate/chat'
import { ElButton, ElImage } from 'element-plus'
import VueNode from './vue-node.vue'
import { h } from 'vue'

const promptItems: PromptProps[] = [
  {
    key: '6',
    description: 'How to rest effectively after long hours of work?',
  },
  {
    key: '7',
    description: 'What are the secrets to maintaining a positive mindset?',
  },
  {
    key: '8',
    description: 'How to stay calm under immense pressure?',
  },
]

const fileItems: any = [
  {
    uid: '1',
    name: 'excel-file.xlsx',
    size: 111111,
    description: 'Checking the data',
  },
  {
    uid: '2',
    name: 'word-file.docx',
    size: 222222,
    status: 'uploading',
    percent: 23,
  },
]

const items: BubbleListProps['items'] = [
  // Normal
  {
    key: 0,
    role: 'ai',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    content: 'Normal message',
  },

  // Custom content
  {
    key: 1,
    role: 'custom',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    content: {
      imageUrl: 'https://mtyui.asia/img/vite1.d070241e.png',
      text: 'ArtChat',
      actionNode: 'Click Me',
    },
  },

  // VueNode
  {
    key: 2,
    role: 'ai',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    content: VueNode,
    messageRender(content) {
      // 使用 h 函数渲染组件内容
      return h(content)
    },
  },

  // Role: suggestion
  {
    key: 3,
    role: 'suggestion',
    variant: 'borderless',
    avatar: '123',
    prompts: promptItems,
  },

  // Role: file
  {
    key: 4,
    role: 'file',
    variant: 'borderless',
    avatar: '123',
    fileList: fileItems,
  },
]
</script>

<template>
  <BubbleList :items="items">
    <template #avatar="{ info }">
      <div
        v-if="['file', 'suggestion'].includes(info.role as string)"
        style="margin-left: 32px; visibility: hidden"
      />
    </template>
    <template #content="{ info }">
      <FileList
        v-if="info.role === 'file'"
        :items="info.fileList"
        :disabled="true"
        :list-style="{
          flexDirection: 'column',
          padding: '6px 5px 0px 0px',
        }"
      />
      <Prompts v-else-if="info.role === 'suggestion'" :items="info.prompts" vertical />
      <template v-else-if="info.role === 'custom'">
        <div style="display: flex; align-items: center; gap: 10px">
          <ElImage
            :src="info.content.imageUrl"
            style="width: 55px; height: 50px"
            :preview-src-list="[info.content.imageUrl]"
          />
          <h1>{{ info.content.text }}</h1>
        </div>
      </template>
    </template>
    <template #footer="{ info }">
      <ElButton v-if="info.role === 'custom'" text>{{ info.content.actionNode }}</ElButton>
    </template>
  </BubbleList>
</template>

<style lang="scss" scoped></style>
