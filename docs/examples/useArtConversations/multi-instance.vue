<script setup lang="ts">
import { Conversations, ConversationsProps } from '@artmate/chat'
import { useArtConversations } from '@artmate/sdk'
import { ElButton } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}))

const others: ConversationsProps['items'] = Array.from({ length: 2 }).map((_, index) => ({
  key: `other${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}))

let idx = 5
let otherIdx = 3

const active = ref('item1')

const otherActive = ref('other1')

const handler = useArtConversations({ defaultConversations: items })

const otherHandler = useArtConversations({ defaultConversations: others })

const onActiveChange = (value: string, type?: string) => {
  if (type === 'other') {
    otherActive.value = value
  } else {
    active.value = value
  }
}

const onAdd = (type?: string) => {
  const instance = type === 'other' ? otherHandler : handler
  instance.addConversation({
    key: `other${type === 'other' ? otherIdx : idx}`,
    label: `Conversation Item ${type === 'other' ? otherIdx : idx}`,
  })
  if (type === 'other') {
    otherIdx = otherIdx + 1
  } else {
    idx = idx + 1
  }
}

const onUpdate = (type?: string) => {
  const instance = type === 'other' ? otherHandler : handler
  const realActive = type === 'other' ? otherActive.value : active.value
  instance.setConversation(realActive, { key: realActive, label: 'Updated Conversation Item' })
}

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [
    {
      label: 'Delete',
      key: 'delete',
      icon: Delete,
      onClick: () => {
        handler.removeConversation(conversation.key)
      },
    },
  ],
})

const otherMenuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [
    {
      label: 'Delete',
      key: 'delete',
      icon: Delete,
      onClick: () => {
        otherHandler.removeConversation(conversation.key)
      },
    },
  ],
})

const conversationItems = computed(() => handler.conversations.value)

const otherConversationItems = computed(() => otherHandler.conversations.value)
</script>

<template>
  <div class="demo">
    <div class="item">
      <h3>List 1</h3>
      <Conversations
        v-model:active-key="active"
        :items="conversationItems"
        :menu="menuConfig"
      />
      <div class="btns">
        <ElButton @click="onAdd()">Add</ElButton>
        <ElButton @click="onUpdate()">Update</ElButton>
      </div>
    </div>
    <div class="item">
      <h3>List 2</h3>
      <Conversations
        v-model:active-key="otherActive"
        :items="otherConversationItems"
        :menu="otherMenuConfig"
      />
      <div class="btns">
        <ElButton @click="onAdd('other')">Add</ElButton>
        <ElButton @click="onUpdate('other')">Update</ElButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  display: flex;
  gap: 20px;
  .item {
    flex: 1;
  }
  .btns {
    margin-top: 20px;
  }
}
</style>
