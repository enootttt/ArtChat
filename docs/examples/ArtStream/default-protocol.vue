<script setup lang="ts">
import type { ThoughtChainItemProps } from '@artmate/chat'
import { Bubble, ThoughtChain } from '@artmate/chat'
import { ArtStream } from '@artmate/sdk'
import { Discount } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElSpace } from 'element-plus'
import { computed, ref } from 'vue'

const contentChunks = ['He', 'llo', ', w', 'or', 'ld!']

function mockReadableStream() {
  const sseChunks: string[] = []

  for (let i = 0; i < contentChunks.length; i++) {
    const sseEventPart = `event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n`
    sseChunks.push(sseEventPart)
  }

  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseChunks) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        controller.enqueue(new TextEncoder().encode(chunk))
      }
      controller.close()
    },
  })
}

const lines = ref<Record<string, string>[]>([])
const content = computed(() => lines.value.map((line) => JSON.parse(line.data).content).join(''))

async function readStream() {
  // 🌟 Read the stream
  for await (const chunk of ArtStream({
    readableStream: mockReadableStream(),
  })) {
    console.log(chunk)
    lines.value = [...lines.value, chunk]
  }
}

const items = computed<ThoughtChainItemProps[]>(() => {
  if (!content.value) return []
  return [
    {
      title: 'Mock Default Protocol - Log',
      status: 'success',
      content: lines.value,
    },
  ]
})
</script>

<template>
  <ElSpace alignment="flex-start" :size="20" wrap>
    <ElSpace alignment="flex-start" direction="vertical">
      <ElButton type="primary" @click="readStream">Mock Default Protocol - SSE</ElButton>
      <Bubble v-if="content" :content="content" />
    </ElSpace>
    <ThoughtChain :items="items">
      <template #icon="{ info }">
        <ElIcon size="20" :color="info.status ? 'white' : 'block'">
          <Discount />
        </ElIcon>
      </template>
      <template #content="{ info }">
        <pre v-if="content">
          <code v-for="(item, index) in info.content" :key="index">{{ item.data }}</code>
        </pre>
      </template>
    </ThoughtChain>
  </ElSpace>
</template>

<style lang="scss" scoped>
pre {
  width: auto;
  margin: 0;
  overflow: scroll;

  code {
    display: block;
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
