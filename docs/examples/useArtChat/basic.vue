<script setup lang="ts">
import type { BubbleListProps } from '@artmate/chat'
import { BubbleList, Sender, useArtAgent, useArtChat } from '@artmate/chat'
import { Promotion } from '@element-plus/icons-vue'
import { ElAvatar, ElButton, ElIcon, ElSpace } from 'element-plus'
import { computed, ref } from 'vue'

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000))

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
  },
  local: {
    placement: 'end',
  },
}

const mockSuccess = ref(false)
const content = ref('')
const senderLoading = ref(false)

// Agent for request
const [agent] = useArtAgent<string, { message: string }, string>({
  request: async ({ message }, { onSuccess, onError }) => {
    senderLoading.value = true
    await sleep()

    senderLoading.value = false

    mockSuccess.value = !mockSuccess.value

    if (mockSuccess.value) {
      onSuccess([`Mock success return. You said: ${message}`])
    }

    onError(new Error('Mock request failed'))
  },
})

// Chat messages
const { onRequest, messages } = useArtChat({
  agent,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
})

const messageList = computed(() => {
  return messages.value.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }))
})

function submit() {
  onRequest(content.value)
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
    <Sender v-model="content" :loading="senderLoading">
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
