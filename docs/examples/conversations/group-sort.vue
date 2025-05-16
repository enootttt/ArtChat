<script setup lang="ts">
import type { ConversationsProps } from '@artmate/chat'
import { Conversations } from '@artmate/chat'
import { Service } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { ref } from 'vue'

const items: ConversationsProps['items'] = Array.from({ length: 6 }).map((_, index) => {
  const timestamp = index <= 3 ? 1732204800000 : 1732204800000 - 60 * 60 * 24

  return {
    key: `item${index + 1}`,
    label: `Conversation ${timestamp + index * 60 * 60}`,
    timestamp: timestamp + index * 60 * 60,
    group: index <= 3 ? 'Today' : 'Yesterday',
  }
})

const groupable = {
  sort(a: string, b: string) {
    if (a === b) return 0

    return a === 'Today' ? -1 : 1
  },
}

const activeKey = ref('item1')
</script>

<template>
  <Conversations
    v-model:active-key="activeKey"
    :groupable="groupable"
    :items="items"
    style="width: 300px"
  >
    <template #title="{ info }">
      <div>
        <ElIcon>
          <Service />
        </ElIcon>
        {{ info.name }}
      </div>
    </template>
  </Conversations>
</template>

<style lang="scss" scoped></style>
