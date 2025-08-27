# Actions 操作列表

用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 何时使用

Actions 组件用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 代码演示

### 基本

:::demo 基础用法。

actions/basic

:::

### 更多菜单项

:::demo 通过设置 children 属性来展示更多菜单项

actions/more

:::

### 使用变体

:::demo 使用 variant 切换变体。

actions/variant

:::

## API

### ActionsProps

| 属性    | 说明                 | 类型                     | 默认值     | 版本 |
| ------- | -------------------- | ------------------------ | ---------- | ---- |
| items   | 包含多个操作项的列表 | ActionItem[]             | -          | -    |
| variant | 样式变体             | 'borderless' \| 'border' | borderless | -    |
| trigger | 子操作项触发方式     | 'hover' \| 'click'       | hover      | -    |

### ItemType

| 属性        | 说明                           | 类型                       | 默认值 | 版本 |
| ----------- | ------------------------------ | -------------------------- | ------ | ---- |
| key         | 自定义操作的唯一标识           | string                     | -      | -    |
| label       | 自定义操作的显示标签           | string                     | -      | -    |
| icon        | 图标                           | Component                  | -      | -    |
| children    | 子操作项                       | ActionItem[]               | -      | -    |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: ActionItem) => void | -      | -    |

### SubItemType

| 属性        | 说明                           | 类型                       | 默认值 | 版本 |
| ----------- | ------------------------------ | -------------------------- | ------ | ---- |
| label       | 自定义操作的显示标签           | string                     | -      | -    |
| key         | 自定义操作的唯一标识           | string                     | -      | -    |
| icon        | 自定义操作的图标               | Component                  | -      | -    |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: ActionItem) => void | -      | -    |

## Actions Slots

| 插槽名 | 说明             |
| ------ | ---------------- |
| icon   | 自定义操作的图标 |
