import path from 'node:path'
import { defineConfig } from 'vitepress'
import { mdPlugin } from './config/plugins'
import { MarkdownTransform } from './plugins/markdown-transform'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ArtChat',
  description: 'Ant Design X For Vue (Element Plus)',
  vite: {
    resolve: {
      alias: [
        {
          find: /^@artmate\/chat$/,
          replacement: path.resolve(__dirname, '../../packages/chat/src'),
        },
        {
          find: /^@artmate\/markdown$/,
          replacement: path.resolve(__dirname, '../../packages/markdown/src'),
        },
        {
          find: /^@artmate\/sdk$/,
          replacement: path.resolve(__dirname, '../../packages/sdk/src'),
        },
      ],
    },
    ssr: {
      noExternal: ['element-plus', '@element-plus/icons-vue', '@artmate/chat'], // 避免打包为 CommonJS
    },
    build: {
      rollupOptions: {
        output: {
          globals: {
            'art-chat': 'ArtChat',
          },
        },
      },
    },
    plugins: [MarkdownTransform() as any],
  },
  markdown: {
    config: (md) => mdPlugin(md),
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*k0oYSZQMoBwAAAAAAAAAAAAADgCCAQ/original',
    nav: [
      { text: '组件', link: '/component/overview' },
      {
        text: '更多',
        items: [
          { text: 'Ant Design X of React', link: 'https://x.ant.design/index-cn' },
          { text: 'Ant Design X of Vue', link: 'https://antd-design-x-vue.netlify.app' },
        ],
      },
    ],

    sidebar: [
      {
        text: '总览',
        link: '/component/overview',
      },
      {
        text: '组件',
        items: [
          {
            text: '通用',
            items: [
              { text: 'Bubble 对话气泡框', link: '/component/bubble' },
              { text: 'Conversations 管理对话', link: '/component/conversations' },
            ],
          },
          {
            text: '唤醒',
            items: [
              { text: 'Welcome 欢迎', link: '/component/welcome' },
              { text: 'Prompts 提示集', link: '/component/prompts' },
            ],
          },
          {
            text: '表达',
            items: [
              { text: 'Sender 输入框', link: '/component/sender' },
              { text: 'Attachments 输入附件', link: '/component/attachments' },
              { text: 'Suggestion 快捷指令', link: '/component/suggestion' },
            ],
          },
          {
            text: '确认',
            items: [{ text: 'ThoughtChain 思维链', link: '/component/thought-chain' }],
          },
          {
            text: '反馈',
            items: [{ text: 'Actions 操作列表', link: '/component/actions' }],
          },
        ],
      },
      {
        text: 'SDK',
        items: [
          {
            text: '数据流',
            items: [
              { text: 'useArtChat 会话数据', link: '/component/useArtChat' },
              { text: 'useArtConversations 会话管理', link: '/component/useArtConversations' },
              { text: 'Chat Provider 数据提供', link: '/component/chat-provider' },
            ],
          },
          {
            text: '工具',
            items: [
              { text: 'ArtStream 流', link: '/component/ArtStream' },
              { text: 'ArtRequest 请求', link: '/component/ArtRequest' },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/asd1232rq3123/artmate-chat' },
      { icon: 'github', link: 'https://github.com/enootttt/ArtChat' },
    ],
  },
})
