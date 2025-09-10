import type { CSSProperties } from 'vue'

export type ThoughtSemanticType = 'item' | 'itemHeader' | 'itemContent' | 'itemFooter'

export type SizeType = 'small' | 'middle' | 'large'

export enum THOUGHT_CHAIN_ITEM_STATUS {
  /**
   * @desc 等待状态
   */
  PENDING = 'pending',
  /**
   * @desc 成功状态
   */
  SUCCESS = 'success',
  /**
   * @desc 错误状态
   */
  ERROR = 'error',
}

export interface ThoughtChainItemProps {
  /**
   * @desc 思维节点唯一标识符
   */
  key?: string

  /**
   * @desc 思维节点标题
   */
  title?: string

  /**
   * @desc 思维节点描述
   */
  description?: string

  /**
   * @desc 思维节点状态
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`
  /**
   * @desc 剩余参数
   */
  [key: string]: any
}

export interface ThoughtChainProps {
  /**
   * @desc 思维节点集合
   */
  items?: ThoughtChainItemProps[]
  /**
   * @desc 是否可折叠
   */
  collapsible?: boolean
  /**
   * @desc 组件大小
   */
  size?: SizeType
  /**
   * @desc 语义化结构 style
   */
  styles?: Partial<Record<ThoughtSemanticType, CSSProperties>>
  /**
   * @desc 语义化结构 className
   */
  classNames?: Partial<Record<ThoughtSemanticType, string>>
  /**
   * @desc 自定义前缀
   */
  prefixCls?: string
  /**
   * @desc 自定义根标签类名
   */
  rootClassName?: string
  /**
   * @desc 自定义根标签样式
   */
  rootStyle?: CSSProperties
}
