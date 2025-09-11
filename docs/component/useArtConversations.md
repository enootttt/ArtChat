# useArtConversations 会话管理

## 何时使用

需要进行会话列表管理，包括会话创建、删除、更新等操作时使用。

## 代码演示

### 基本

:::demo 基础使用。

useArtConversations/basic

:::

### 会话操作

:::demo 添加、更新、重置会话。

useArtConversations/operations

:::

### 多实例

:::demo 多实例使用。

useArtConversations/multi-instance

:::

## API

### useArtConversations

```ts | pure
type useArtConversations = (config: ArtConversationConfig) => {
  conversations: ConversationData[]
  addConversation: (conversation: ConversationData) => boolean
  removeConversation: (key: string) => boolean
  setConversation: (key: string, conversation: ConversationData) => boolean
  getConversation: (key: string) => ConversationData
  setConversations: (conversations: ConversationData[]) => boolean
}
```

### ArtConversationConfig

```ts | pure
interface ArtConversationConfig {
  defaultConversations?: ConversationData[]
}
```

### ConversationData

```ts | pure
interface ConversationData extends AnyObject {
  key: string
  label?: string
}
```
