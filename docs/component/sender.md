# Sender 输入框

用于聊天的输入框组件。

## 何时使用

需要构建一个对话场景下的输入框

## 代码演示

### 基本用法

:::demo 基础用法，受控进行状态管理。自定义触发器。

sender/basic

:::

### 提交用法

:::demo 通过 `submitType` 控制换行与提交模式。

sender/submitType

:::

<!-- ### 语音输入

:::demo 语音输入，需要用户同意麦克风权限。

sender/speech

:::

### 自定义语音输入

:::demo 自定义语音逻辑，从而实现调用三方库的语音识别功能。

sender/speechCustom

::: -->

### 展开面板

:::demo 使用 `header` 自定义文件上传示例。

sender/header

:::

### 引用

:::demo 使用 `header` 做引用效果。

sender/headerFixed

:::

### 黏贴图片

:::demo 配合 Attachments 进行黏贴文件上传。

sender/pasteImage

:::

### 聚焦

:::demo 使用 `ref` 选项控制聚焦。

sender/focus

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### SenderProps

| 属性          | 说明               | 类型                                                       | 默认值                  | 版本 |
| ------------- | ------------------ | ---------------------------------------------------------- | ----------------------- | ---- |
| v-model       | 双向绑定           | string                                                     | -                       | -    |
| classNames    | 样式类名           | Partial<Record<SemanticType, string>>                      | -                       | -    |
| placeholder   | 占位符             | string                                                     | -                       | -    |
| disabled      | 是否禁用           | boolean                                                    | false                   | -    |
| loading       | 是否加载中         | boolean                                                    | false                   | -    |
| readOnly      | 是否让输入框只读   | boolean                                                    | false                   | -    |
| rootClassName | 根元素样式类       | string                                                     | -                       | -    |
| styles        | 语义化定义样式     | Partial<Record<SemanticType, CSSProperties>>               | -                       | -    |
| submitType    | 提交模式           | SubmitType                                                 | `enter` \| `shiftEnter` | -    |
| onChange      | 输入框值改变的回调 | (value: string, event?: FormEvent \| ChangeEvent ) => void | -                       | -    |
| onKeyPress    | 键盘按键按下的回调 | (event: KeyboardEvent) => void                             | -                       | -    |

#### SemanticType

```typescripts | pure
type SemanticType = 'actions' | 'input' | 'prefix';
```

### Sender Slots

| 插槽名     | 说明                           |
| ---------- | ------------------------------ |
| header     | 头部面板                       |
| footer     | 底部面板                       |
| components | 自定义组件,会覆盖内置input组件 |
| actions    | 操作按钮                       |
| prefix     | 前缀内容                       |

### SenderHeader

| 属性         | 说明               | 类型                    | 默认值 | 版本 |
| ------------ | ------------------ | ----------------------- | ------ | ---- |
| closable     | 是否可关闭         | boolean                 | true   | -    |
| open         | 是否展开           | boolean                 | -      | -    |
| title        | 标题               | string                  | -      | -    |
| onOpenChange | 展开状态改变的回调 | (open: boolean) => void | -      | -    |

### SenderHeader Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 内容区域 |
| title   | 标题区域 |
