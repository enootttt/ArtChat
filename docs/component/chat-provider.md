# Chat Provider 数据提供

`Chat Provider` 用于为 `useArtChat` 提供统一的请求管理和数据格式转换，通过实现 `AbstractChatProvider`，你可以将不同的模型提供商、或者Agent服务数据转换为统一的 `useArtChat` 可消费的格式，从而实现不同模型、Agent之间的无缝接入和切换。

## 使用示例

`Chat Provider` 实例化需要传入一个 `ArtRequest` 调用，并且需要设置参数 `manual=true`，以便 `useArtChat` 可以控制请求的发起。

```ts
import type { ArtRequestOptions } from '@artmate/sdk'
import { DefaultChatProvider, useArtChat, ArtRequest } from '@artmate/sdk'

interface ChatInput {
  query: string
}

const provider = new DefaultChatProvider<string, ChatInput, string>({
  request: ArtRequest('https://api.example.com/chat', {
    manual: true,
  }),
})

const { onRequest, messages, requesting } = useArtChat({
  provider,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
})
```

## 内置Provider

`@artmate/sdk` 内置了一些常用模型服务商的 `Chat Provider`，你可以直接使用。

### DefaultChatProvider

`DefaultChatProvider` 是一个默认的` Chat Provider`，几乎没有对数据进行转换，直接将请求参数和响应数据返回给 `useArtChat`。它兼容了普通请求和 stream 请求的数据格式，你可以直接使用。

:::demo DefaultChatProvider使用

chat-provider/basic

:::

### OpenAIChatProvider

`OpenAIChatProvider` 是 `OpenAI` 兼容的 `Chat Provider`，它会将请求参数和响应数据转换为 `OpenAI` 接口兼容的格式。

`ArtModelMessage` `ArtModelParams` `ArtModelResponse` 是 `OpenAIChatProvider` 输入、输出的类型定义，可以在 `useArtChat` 的泛型 `ChatMessage` `Input` `Output` 中直接使用。

:::demo OpenAIChatProvider使用

chat-provider/openai

:::

### DeepSeekChatProvider

`DeepSeekChatProvider` 是 `DeepSeek` 兼容的 `Chat Provider`，和 `OpenAIChatProvider` 相差不大，唯一的差异点是，该Provider会自动解析DeepSeek特有的 `reasoning_content` 字段，作为模型思考过程的输出，配合 `Think` 组件可以快捷展示模型思考过程。详细的使用示例，可以参考独立式样板间代码。

## AbstractChatProvider

`AbstractChatProvider` 是一个抽象类，用于定义 `Chat Provider` 的接口。当你需要使用自定义的数据服务时，你可以继承 `AbstractChatProvider` 并实现其方法。

```ts | pure
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error'

interface ChatProviderConfig<Input, Output> {
  request: ArtRequestClass<Input, Output> | (() => ArtRequestClass<Input, Output>)
}

interface TransformMessage<ChatMessage, Output> {
  originMessage?: ChatMessage
  chunk: Output
  chunks: Output[]
  status: MessageStatus
}

abstract class AbstractChatProvider<ChatMessage, Input, Output> {
  constructor(config: ChatProviderConfig<Input, Output>): void

  /**
   * 转换onRequest传入的参数，你可以和Provider实例化时request配置中的params进行合并或者额外处理
   * @param requestParams 请求参数
   * @param options 请求配置，从Provider实例化时request配置中来
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: ArtRequestOptions<Input, Output>
  ): Input

  /**
   * 将onRequest传入的参数转换为本地（用户发送）的ChatMessage，用于消息渲染
   * @param requestParams onRequest传入的参数
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage

  /**
   * 可在更新返回数据时对messages做转换，同时会更新到messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage
}
```
