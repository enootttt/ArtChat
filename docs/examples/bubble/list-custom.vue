<script setup lang="ts">
import type { BubbleListProps, PromptProps } from '@artmate/chat'
import { BubbleList, FileList, Prompts } from '@artmate/chat'

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

  // ReactNode
  {
    key: 1,
    role: 'ai',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    content: 'ReactNode message',
  },

  // Role: suggestion
  {
    key: 2,
    role: 'suggestion',
    variant: 'borderless',
    avatar: '123',
    prompts: promptItems,
  },
  // Role: file
  {
    key: 3,
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
      <div v-if="info.role !== 'ai'" style="margin-left: 32px; visibility: hidden" />
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
    </template>
  </BubbleList>
</template>

<style lang="scss" scoped></style>
