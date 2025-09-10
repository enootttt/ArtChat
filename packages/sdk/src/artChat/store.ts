import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type ConversationKey = string | number

// 存储助手类，管理所有对话的消息存储实例
export const chatMessagesStoreHelper = {
  _chatMessagesStores: new Map<string | number, ChatMessagesStore<any>>(),

  get: (conversationKey: ConversationKey) => {
    return chatMessagesStoreHelper._chatMessagesStores.get(conversationKey)
  },

  set: (key: ConversationKey, store: ChatMessagesStore<any>) => {
    chatMessagesStoreHelper._chatMessagesStores.set(key, store)
  },

  delete: (key: ConversationKey) => {
    chatMessagesStoreHelper._chatMessagesStores.delete(key)
  },

  getMessages: (conversationKey: ConversationKey) => {
    const store = chatMessagesStoreHelper._chatMessagesStores.get(conversationKey)
    return store?.getMessages()
  },
}

// 聊天消息存储类，管理单一会话的消息
export class ChatMessagesStore<T extends { id: number | string }> {
  private messages: T[] = []
  private listeners: (() => void)[] = []
  private conversationKey: ConversationKey | undefined

  // 通知所有监听器数据已更新
  private emitListeners() {
    this.listeners.forEach((listener) => {
      listener()
    })
  }

  constructor(defaultMessages: T[], conversationKey?: ConversationKey) {
    this.setMessages(defaultMessages)
    if (conversationKey) {
      this.conversationKey = conversationKey
      chatMessagesStoreHelper.set(this.conversationKey, this)
    }
  }

  // 设置消息列表，可以是新数组或基于旧数组的修改函数
  setMessages = (messages: T[] | ((ori: T[]) => T[])) => {
    let list: T[]
    if (typeof messages === 'function') {
      list = messages(this.messages)
    } else {
      list = messages as T[]
    }
    this.messages = [...list]
    this.emitListeners()
    return true
  }

  // 获取当前消息列表
  getMessages = () => {
    return [...this.messages] // 返回副本防止外部直接修改
  }

  // 根据ID获取单个消息
  getMessage = (id: string | number) => {
    return this.messages.find((item) => item.id === id)
  }

  // 添加新消息（如果不存在）
  addMessage = (message: T) => {
    const exist = this.getMessage(message.id)
    if (!exist) {
      this.setMessages([...this.messages, message])
      return true
    }
    return false
  }

  // 更新指定ID的消息
  setMessage = (id: string | number, message: Partial<T>) => {
    const exist = this.getMessage(id)
    if (exist) {
      Object.assign(exist, message)
      this.setMessages([...this.messages])
      return true
    }
    return false
  }

  // 删除指定ID的消息
  removeMessage = (id: string | number) => {
    const index = this.messages.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.messages.splice(index, 1)
      this.setMessages([...this.messages])
      return true
    }
    return false
  }

  // 获取当前消息快照
  getSnapshot = () => {
    return this.getMessages()
  }

  // 订阅消息变化
  subscribe = (callback: () => void) => {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }
}

type Getter<T> = () => T

// Vue3 组合式函数，用于在组件中使用聊天消息存储
export function useChatStore<T extends { id: number | string }>(
  defaultValue: T[] | Getter<T[]>,
  conversationKey?: ConversationKey
) {
  // 创建或获取存储实例的函数
  const createStore = () => {
    if (conversationKey && chatMessagesStoreHelper.get(conversationKey)) {
      return chatMessagesStoreHelper.get(conversationKey) as ChatMessagesStore<T>
    }

    const messages =
      typeof defaultValue === 'function' ? (defaultValue as Getter<T[]>)() : defaultValue

    const store = new ChatMessagesStore<T>(messages || [], conversationKey)
    return store
  }

  // 存储实例的响应式引用
  const store = ref<ChatMessagesStore<T>>(createStore())

  // 当对话密钥变化时重新创建存储
  watch(
    () => conversationKey,
    () => {
      store.value = createStore()
    },
    { immediate: false }
  )

  // 用于跟踪消息变化的响应式变量
  const messages = ref<T[]>(store.value.getMessages())

  // 订阅存储的变化，更新响应式变量
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    // 订阅消息变化
    unsubscribe = store.value.subscribe(() => {
      messages.value = store.value.getMessages()
    })
    // 初始同步
    messages.value = store.value.getMessages()
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  // 返回响应式数据和操作方法
  return {
    messages: computed(() => messages.value), // 使用computed确保响应式
    addMessage: store.value.addMessage,
    removeMessage: store.value.removeMessage,
    setMessage: store.value.setMessage,
    getMessage: store.value.getMessage,
    setMessages: store.value.setMessages,
    getMessages: store.value.getMessages,
  }
}
