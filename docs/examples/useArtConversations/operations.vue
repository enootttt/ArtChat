<script setup lang="ts">
import type { ConversationsProps } from '@artmate/chat'
import { Conversations } from '@artmate/chat'
import { useArtConversations } from '@artmate/sdk'
import { computed, reactive, ref } from 'vue'
import { ElButton } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const activeKey = ref('item1')

const createItems: () => ConversationsProps['items'] = () =>
  Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label:
      index + 1 === 3
        ? "This's Conversation Item 3, you can click me!"
        : `Conversation Item ${index + 1}`,
    disabled: index === 3,
  }))

const items = createItems()

let idx = 5

const ConversationsStore = useArtConversations({ defaultConversations: items })

const conversations = computed(() => ConversationsStore.conversations.value)

const onAdd = () => {
  ConversationsStore.addConversation({ key: `item${idx}`, label: `Conversation Item ${idx}` })
  idx++
  console.log(ConversationsStore.conversations.value)
}

const onUpdate = () => {
  ConversationsStore.setConversation(activeKey.value, {
    key: activeKey.value,
    label: 'Updated Conversation Item',
  })
}

const onReset = () => {
  ConversationsStore.setConversations(createItems()!)
  activeKey.value = 'item1'
}

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
  <div style="width: 300px">
    <Conversations v-model:active-key="activeKey" :items="conversations" :menu="menuConfig" />
    <div class="btns">
      <ElButton @click="onAdd">Add</ElButton>
      <ElButton @click="onUpdate">Update</ElButton>
      <ElButton @click="onReset">Reset</ElButton>
    </div>
    <div>
      <div>Current Conversation Data:</div>
      <pre>{{ JSON.stringify(ConversationsStore.getConversation(activeKey), null, 2) }}</pre>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btns {
  margin-top: 20px;
}
</style>
