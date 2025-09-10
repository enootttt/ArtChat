import type { CSSProperties, VNode } from 'vue'
import type { AnyObject } from '../_util/type'

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

export type BubbleContentType = string | VNode | AnyObject | number

export interface BubbleProps<ContentType extends BubbleContentType = string> {
  avatar?: string | VNode
  classNames?: {
    avatar?: string
    content?: string
    footer?: string
    header?: string
  }
  content?: ContentType
  loading?: boolean
  loadingRender?: () => VNode
  messageRender?: (content: string) => string | VNode
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
