import type { AnyObject } from '../_util/type'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ConversationStore } from './store'

export interface ConversationData extends AnyObject {
  key: string
}

interface ArtConversationConfig {
  defaultConversations?: ConversationData[]
}

export default function usArtConversations(config: ArtConversationConfig) {
  const store = ref<ConversationStore>(new ConversationStore(config?.defaultConversations || []))

  // 用于存储响应式的对话数据
  const conversations = ref<ConversationData[]>(store.value.getSnapshot())

  // 订阅存储变化的取消函数
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    // 订阅存储的变化，更新响应式数据
    unsubscribe = store.value.subscribe(() => {
      conversations.value = store.value.getSnapshot()
    })
    // 初始同步数据
    conversations.value = store.value.getSnapshot()
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
    store.value.destroy()
  })

  // 返回响应式数据和操作方法
  return {
    conversations: computed(() => conversations.value), // 确保响应式
    addConversation: store.value.addConversation,
    removeConversation: store.value.removeConversation,
    setConversation: store.value.setConversation,
    getConversation: store.value.getConversation,
    setConversations: store.value.setConversations,
    getMessages: store.value.getMessages,
  }
}
