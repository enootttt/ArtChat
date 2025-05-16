<script setup lang="ts">
import type { PromptProps, PromptsProps } from '@artmate/chat'
import { Prompts } from '@artmate/chat'

const items: PromptsProps['items'] = [
  {
    key: '1',
    label: 'Hot Topics',
    description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: `What's new in X?`,
      },
      {
        key: '1-2',
        description: `What's AGI?`,
      },
      {
        key: '1-3',
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: '2',
    label: 'Design Guide',
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        description: `Know the well`,
      },
      {
        key: '2-2',
        description: `Set the AI role`,
      },
      {
        key: '2-3',
        description: `Express the feeling`,
      },
    ],
  },
  {
    key: '3',
    label: 'Start Creating',
    description: 'How to start a new project?',
    children: [
      {
        key: '3-1',
        label: 'Fast Start',
        description: `Install Ant Design X`,
      },
      {
        key: '3-2',
        label: 'Online Playground',
        description: `Play on the web without installing`,
      },
    ],
  },
]

const style = {
  item: {
    flex: 'none',
    width: 'calc(30% - 6px)',
    backgroundImage: `linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)`,
    border: 0,
    color: '#000',
  },
  subItem: {
    background: 'rgba(255,255,255,0.45)',
    border: '1px solid #FFF',
  },
}
</script>

<template>
  <div class="prompts">
    <Prompts title="Do you want?" :items="items" wrap :styles="style" />
  </div>
</template>

<style lang="scss" scoped>
.prompts {
  padding: 24px;
  background: #ffffff;
  --color-text-tertiary: #999999;
}
</style>
