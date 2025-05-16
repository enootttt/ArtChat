<script setup lang="ts">
import type { BubbleDataType, BubbleListProps, PromptProps } from '@artmate/chat'
import { BubbleList, Prompts, Sender, useArtAgent, useArtChat } from '@artmate/chat'
import { Promotion } from '@element-plus/icons-vue'
import { ElAvatar, ElButton, ElIcon, ElSpace } from 'element-plus'
import { computed, ref } from 'vue'
import SenderLoading from './loading.vue'

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000))

const roles: BubbleListProps['roles'] = {
  user: {
    placement: 'end',
  },
  text: {
    placement: 'start',
    typing: true,
  },
  suggestion: {
    placement: 'start',
    variant: 'borderless',
  },
}

interface AgentUserMessage {
  type: 'user'
  content: string
}

interface AgentAIMessage {
  type: 'ai'
  content?: string
  list?: {
    type: 'text' | 'suggestion'
    content?: string
    prompts?: PromptProps[]
  }[]
}

type AgentMessage = AgentUserMessage | AgentAIMessage

const content = ref('')
const senderLoading = ref(false)

// Agent for request
const [agent] = useArtAgent<AgentMessage, { message: AgentMessage }, AgentMessage>({
  request: async ({ message }, { onSuccess }) => {
    senderLoading.value = true
    await sleep()

    const { content } = message || {}

    senderLoading.value = false
    onSuccess([
      {
        type: 'ai',
        list: [
          {
            type: 'text',
            content: `Do you want?`,
          },
          {
            type: 'suggestion',
            prompts: [
              {
                key: '1',
                description: `Look at: ${content}`,
              },
              {
                key: '2',
                description: `Search: ${content}`,
              },
              {
                key: '3',
                description: `Try: ${content}`,
              },
            ],
          },
        ],
      },
    ])
  },
})

// Chat messages
const { onRequest, parsedMessages } = useArtChat({
  agent,
  defaultMessages: [
    {
      id: 'init',
      message: {
        type: 'ai',
        content: 'Hello, what can I do for you?',
      },
      status: 'success',
    },
  ],

  requestPlaceholder: {
    type: 'ai',
    content: 'Waiting...',
  },

  // Convert AgentMessage to BubbleMessage
  parser: (agentMessages) => {
    const list = agentMessages.content ? [agentMessages] : (agentMessages as AgentAIMessage).list

    return (list || []).map((msg) => ({
      role: msg.type,
      content: msg?.content || '',
      prompts: msg.type === 'suggestion' ? msg.prompts : undefined,
    }))
  },
})

const messageList = computed(() => {
  // 处理消息列表，将最后一条消息的 prompts 传递给 BubbleList
  return parsedMessages.value.map(({ id, message, status }, index) => ({
    key: id,
    loading: status === 'loading',
    ...message,
    prompts: index === parsedMessages.value.length - 1 ? message?.prompts : undefined,
  })).filter(item => item.content || item.prompts?.length) as BubbleDataType[]
})

function submit() {
  if (!content.value) return
  onRequest({
    type: 'user',
    content: content.value,
  })
  content.value = ''
}
</script>

<template>
  <ElSpace direction="vertical" style="width: 100%" fill>
    <BubbleList :roles="roles" :style="{ maxHeight: '300px' }" :items="messageList">
      <template #avatar="{ info }">
        <ElAvatar :style="info.role === 'suggestion' ? { visibility: 'hidden' } : {}">
          <template v-if="info.role !== 'suggestion'">
            {{ info.role || info.key }}
          </template>
        </ElAvatar>
      </template>
      <template #content="{ info }">
        <template v-if="info.role === 'suggestion'">
          <Prompts :items="info.prompts" />
        </template>
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
