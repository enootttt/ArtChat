import type { dropdownItemProps } from 'element-plus'
import type { Component, CSSProperties } from 'vue'

type DropdownItemProps = typeof dropdownItemProps

export interface SubItemType extends Omit<DropdownItemProps, 'icon' | 'disabled'> {
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon: Component
  /**
   * @desc 自定义是否禁用
   * @descEN Is customization disabled?
   */
  disabled: boolean
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void
}

export interface ItemType {
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon?: Component
  /**
   * @desc 子操作项
   * @descEN Child action items.
   */
  children?: ActionItem[]
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void
}

export type ActionItem = SubItemType | ItemType

export interface ActionsProps {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: ActionItem[]
  /**
   * @desc 子操作项是否占据一行
   * @descEN Whether the child action items occupy a line.
   * @default false
   */
  block?: boolean
  /**
   * @desc 变体
   * @descEN Variant.
   * @default 'borderless'
   */
  variant?: 'borderless' | 'filled' | 'outlined'
  /**
   * @desc 触发方式
   * @descEN Trigger mode.
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'

  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
}

export interface ActionsEmits {
  (e: 'click', menuInfo: { item: ActionItem; key: string; keyPath: string[] }): void
}

// --------------------- ActionsItem ---------------------

export enum ACTIONS_ITEM_STATUS {
  /**
   * @desc 等待状态
   */
  LOADING = 'loading',
  /**
   * @desc 失败状态
   */
  ERROR = 'error',
  /**
   * @desc 执行中
   */
  RUNNING = 'running',
  /**
   * @desc 默认
   */
  DEFAULT = 'default',
}

export interface ActionsItemProps {
  /**
   * @desc 状态
   * @descEN status
   */
  status?: `${ACTIONS_ITEM_STATUS}`
  /**
   * @desc 图标
   * @descEN icon
   */
  defaultIcon: Component
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string
  /**
   * @desc 执行中图标
   * @descEN running icon
   */
  runningIcon?: Component
}

// --------------------- ActionsCopy ---------------------
export interface ActionsCopyProps {
  /**
   * @desc 复制的文本
   * @descEN Text to be copied
   */
  text?: string

  /**
   * @desc 复制图标
   * @descEN Copy icon
   */
  icon?: Component
}

// --------------------- ActionsFeedback ---------------------
export type SemanticType = 'like' | 'liked' | 'dislike' | 'disliked' | 'root'

export enum FEEDBACK_VALUE {
  like = 'like',
  dislike = 'dislike',
  default = 'default',
}

export interface ActionsFeedbackProps {
  /**
   * @desc 喜欢图标选中颜色
   * @descEN Like icon selected color
   */
  likeColor?: string
  /**
   * @desc 不喜欢图标选中颜色
   * @descEN Dislike icon selected color
   */
  dislikeColor?: string
  /**
   * @desc 反馈状态值
   * @descEN Feedback status value
   */
  value?: `${FEEDBACK_VALUE}`
  /**
   * @desc 反馈状态变化回调
   * @descEN Feedback status change callback
   */
  onChange?: (value: `${FEEDBACK_VALUE}`) => void

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, CSSProperties>>
}
