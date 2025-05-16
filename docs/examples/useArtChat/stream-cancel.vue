<script setup lang="ts">
import type { BubbleListProps } from '@artmate/chat'
import { ArtStream, BubbleList, Sender, useArtAgent, useArtChat } from '@artmate/chat'
import { Promotion } from '@element-plus/icons-vue'
import { ElAvatar, ElButton, ElIcon, ElSpace } from 'element-plus'
import { computed, ref } from 'vue'
import SenderLoading from './loading.vue'

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
  },
  local: {
    placement: 'end',
  },
}

const contentChunks = [
  'He',
  'llo',
  ', w',
  'or',
  'ld!',
  ' Ant',
  ' Design',
  ' X',
  ' is',
  ' the',
  ' best',
  '!',
]

function mockReadableStream() {
  const sseChunks: string[] = []

  for (let i = 0; i < contentChunks.length; i++) {
    const sseEventPart = `event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n`
    sseChunks.push(sseEventPart)
  }

  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseChunks) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        controller.enqueue(new TextEncoder().encode(chunk))
      }
      controller.close()
    },
  })
}

const content = ref('')
const senderLoading = ref(false)
const abort = ref(() => {})

// Agent for request
const [agent] = useArtAgent<string, { message: string }, string>({
  request: async (_, { onUpdate, onSuccess }) => {
    senderLoading.value = true
    const stream = ArtStream({
      readableStream: mockReadableStream(),
    })

    const reader = stream.getReader()
    abort.value = () => reader.cancel()

    let current = ''
    while (reader) {
      const { value, done } = await reader.read()
      if (done) {
        senderLoading.value = false
        onSuccess([current])
        break
      }
      if (!value) continue
      const data = JSON.parse(value.data)
      current += data.content || ''
      onUpdate(current)
    }
  },
})

// Chat messages
const { onRequest, messages } = useArtChat({
  agent,
})

const messageList = computed(() => {
  return messages.value.map(({ id, message, status }) => ({
    key: id,
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }))
})

function submit() {
  console.log(senderLoading.value)
  if (senderLoading.value) {
    abort.value()
    senderLoading.value = false
  } else {
    if (!content.value) return
    onRequest(content.value)
    content.value = ''
  }
}
</script>

<template>
  <ElSpace direction="vertical" style="width: 100%" fill>
    <BubbleList :roles="roles" :style="{ maxHeight: '300px' }" :items="messageList">
      <template #avatar="{ info }">
        <ElAvatar>
          {{ info.role === 'ai' ? 'AI' : 'You' }}
        </ElAvatar>
      </template>
    </BubbleList>
    <Sender v-model="content" :loading="senderLoading">
      <template #actions>
        <ElButton circle type="primary" @click="submit">
          <ElIcon v-if="!senderLoading" color="white">
            <Promotion />
          </ElIcon>
          <ElIcon v-else color="white" size="32">
            <SenderLoading />
          </ElIcon>
        </ElButton>
      </template>
    </Sender>
  </ElSpace>
</template>
