import type { CSSProperties, VNode } from 'vue'

// Welcome 组件属性接口定义
export interface WelcomeProps {
  // 各部分的自定义类名
  classNames?: Partial<Record<'icon' | 'title' | 'description' | 'extra', string>>
  // 描述文本
  description?: string | number
  // 额外的操作区域内容
  extra?: string | number
  // 图标内容
  icon?: string | VNode
  // 根元素类名
  rootClassName?: string
  // 各部分的自定义样式
  styles?: Partial<Record<'icon' | 'title' | 'description' | 'extra', CSSProperties>>
  // 标题文本
  title?: string | number
  // 组件变体类型
  variant?: 'filled' | 'borderless'
}
