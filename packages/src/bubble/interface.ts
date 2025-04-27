import type { CSSProperties, VNode } from 'vue'

export interface TypingOption {
  /**
   * @default 50
   */
  interval?: number
  /**
   * @default 1
   */
  step?: number
  /**
   * @default null
   */
  suffix?: string | null
}

export interface BubbleProps {
  avatar?: string | VNode
  classNames?: {
    avatar?: string
    content?: string
    footer?: string
    header?: string
  }
  content?: string
  loading?: boolean
  loadingRender?: () => VNode
  messageRender?: (content: string) => string | VNode
  onTypingComplete?: () => void
  onUpdate?: () => void
  placement?: 'end' | 'start'
  shape?: 'corner' | 'round'
  styles?: {
    avatar?: CSSProperties
    content?: CSSProperties
    footer?: CSSProperties
    header?: CSSProperties
  }
  typing?: boolean | TypingOption
  variant?: 'borderless' | 'filled' | 'outlined' | 'shadow'
}

export interface LoadingProps {
  prefixCls?: string
}
