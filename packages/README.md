# 🚀 ArtChat

**开箱即用的AI组件库（基于 Vue3 + ElementPlus）**

## 核心特性

- ✨ **AI 组件**：内置聊天机器人、思维链等场景化组件
- 🚀 **零配置集成**：基于 Element-Plus，开箱即用
- 📦 **按需加载**：提供 Tree Shaking 优化

## 📦 安装

```bash
# npm
npm install @artmate/chat

# pnpm（推荐）
pnpm install @artmate/chat

# yarn
yarn install @artmate/chat

```

## 📚 使用案例

1. **按需引入**

```html
<script>
  import { BubbleList, Sender } from '@artmate/chat'
  const list = [
    {
      content: 'Hello, ArtChat!',
      role: 'user',
    },
  ]
</script>

<template>
  <div>
    <BubbleList :list="list" />
    <Sender />
  </div>
</template>
```

2. **全局引入**

```ts
// main.ts
import ArtChat from '@artmate/chat'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(ArtChat)
app.mount('#app')
```

## 🤝 参与贡献

1. **Fork 仓库**
2. **创建 Feature 分支**
3. **提交 Pull Request**
