<script setup lang="ts">
import type { BubbleListProps } from '@artmate/chat'
import type { ArtRequestOptions } from '@artmate/sdk'
import { BubbleList, Sender } from '@artmate/chat'
import { ArtRequest, DefaultChatProvider, useArtChat } from '@artmate/sdk'
import { Promotion } from '@element-plus/icons-vue'
import { ElAvatar, ElButton, ElIcon, ElSpace } from 'element-plus'
import { computed, ref } from 'vue'

interface ChatInput {
  query: string
}

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000))

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
  },
  local: {
    placement: 'end',
    messageRender(content: any) {
      return content?.query
    },
  },
}

const content = ref('')

const provider = new DefaultChatProvider<string, ChatInput, string>({
  request: ArtRequest('https://api.example.com/chat', {
    manual: true,
    fetch: async (
      _: Parameters<typeof fetch>[0],
      options: ArtRequestOptions<ChatInput, string>
    ) => {
      await sleep()
      const params = options?.params
      return Promise.resolve(
        new Response(JSON.stringify([`Mock success return. You said: ${params?.query}`]), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    },
  }),
})

// Chat messages
const { onRequest, messages, requesting } = useArtChat({
  provider,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
})

const senderLoading = computed(() => requesting.value)

const messageList = computed(() => {
  return messages.value.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }))
})

function submit() {
  onRequest({
    query: content.value,
  })
  content.value = ''
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
    <Sender v-model="content" :loading="senderLoading" @submit="submit">
      <template #actions>
        <ElButton circle type="primary" :disabled="senderLoading || !content" @click="submit">
          <ElIcon color="white">
            <Promotion />
          </ElIcon>
        </ElButton>
      </template>
    </Sender>
  </ElSpace>
</template>
