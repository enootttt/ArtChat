# useArtChat 数据管理

配合 Agent hook 进行对话数据管理。

## 何时使用

通过 Agent 进行会话数据管理，并产出供页面渲染使用的数据。

## 代码演示

### 基本

:::demo 基础用法。

useArtChat/basic

:::

## API

```ts | pure
type useArtChat<AgentMessage, ParsedMessage = AgentMessage> = (
  config: ArtChatConfig<AgentMessage, ParsedMessage>
) => ArtChatConfigReturnType
```

### ArtChatConfig

| 属性               | 说明                                                                                                                                                                                       | 类型                                                        | 默认值 | 版本 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ------ | ---- |
| provider           | 数据提供方，用于将不同结构的数据及请求转换为useArtChat能消费的格式，平台内置了 `DefaultChatProvider` 和 `OpenAIChatProvider`，你也可以通过继承 `AbstractChatProvider` 实现自己的Provider。 | -                                                           | -      |      |
| defaultMessages    | 默认展示信息                                                                                                                                                                               | { status, message }[]                                       | -      |      |
| parser             | 将 ChatMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 ChatMessage。支持将一条 ChatMessage 转换成多条 ParsedMessage                                                             | (message: AgentMessage) => BubbleMessage \| BubbleMessage[] | -      |      |
| requestFallback    | 请求失败的兜底信息，不提供则不会展示                                                                                                                                                       | AgentMessage \| () => AgentMessage                          | -      |      |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示                                                                                                                                                         | AgentMessage \| () => AgentMessage                          | -      |      |

### ArtChatConfigReturnType

| 属性           | 说明                                                   | 类型                                                            | 版本 |
| -------------- | ------------------------------------------------------ | --------------------------------------------------------------- | ---- |
| abort          | 取消请求                                               | () => void                                                      | -    |
| requesting     | 是否正在请求中                                         | boolean                                                         | -    |
| messages       | 当前管理消息列表的内容                                 | ChatMessage[]                                                   | -    |
| parsedMessages | 经过 `parser` 转译过的内容                             | ParsedMessages[]                                                | -    |
| onReload       | 重新生成，会发送请求到后台，使用新返回数据更新该条消息 | (id: string \| number, requestParams: Partial\<Input\>) => void | -    |
| onRequest      | 添加一条 Message，并且触发请求                         | (requestParams: Partial\<Input\>) => void                       | -    |
| setMessages    | 直接修改 messages，不会触发请求                        | (messages: { message, status }[]) => void                       | -    |
| setMessage     | 直接修改单条 message，不会触发请求                     | (id: string \| number, data: { message, status }) => void       | -    |
