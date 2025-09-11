<script setup lang="ts">
import type { ConversationsProps } from '@artmate/chat'
import { Conversations } from '@artmate/chat'
import { useArtConversations } from '@artmate/sdk'
import { Delete } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'

const activeKey = ref('')

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}))

const ConversationsStore = useArtConversations({ defaultConversations: items })

const conversations = computed(() => ConversationsStore.conversations.value)

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [
    {
      label: 'Delete',
      key: 'delete',
      icon: Delete,
      onClick: () => {
        ConversationsStore.removeConversation(conversation.key)
      },
    },
  ],
})
</script>

<template>
  <div style="width: 300px;">
    <Conversations
      v-model:active-key="activeKey"
      default-active-key="item1"
      :menu="menuConfig"
      :items="conversations"
    ></Conversations>
  </div>
</template>

<style lang="scss" scoped></style>
