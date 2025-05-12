import type { Component, CSSProperties, VNode } from 'vue'

import type { DropDownItemProps } from '../dropdown/interface'

type GroupType = string

export interface MenuProps {
  items: DropDownItemProps[]
  teleported?: boolean
  onClick?: (value: Conversation) => void
}
/**
 * @desc 会话数据
 * @descEN Conversation data
 */
export interface Conversation extends Record<PropertyKey, any> {
  /**
   * @desc 唯一标识
   * @descEN Unique identifier
   */
  key: string

  /**
   * @desc 会话名称
   * @descEN Conversation name
   */
  label?: string

  /**
   * @desc 会话时间戳
   * @descEN Conversation timestamp
   */
  timestamp?: number

  /**
   * @desc 会话分组类型，与 {@link ConversationsProps.groupable} 联动
   * @descEN Conversation type
   */
  group?: GroupType

  /**
   * @desc 会话图标
   * @descEN conversation icon
   */
  icon?: string | VNode

  /**
   * @desc 是否禁用
   * @descEN Whether to disable
   */
  disabled?: boolean
}

export interface ItemProps {
  direction?: 'ltr' | 'rtl'
  className?: string
  active?: boolean
  info?: Conversation
  menu?: MenuProps | DropDownItemProps[]
  inEllipsis?: boolean
  line?: number
}

export type GroupSorter = Parameters<GroupType[]['sort']>[0]

export interface GroupTitleRenderComponents {
  components: {
    // GroupTitleProps
    GroupTitle: Component<any>
  }
}

export type GroupTitleRender =
  | ((group: GroupType, info: GroupTitleRenderComponents | string) => number | string | VNode)
  | undefined

export interface Groupable {
  /**
   * @desc 分组排序函数
   * @descEN Group sorter
   */
  sort?: GroupSorter
  /**
   * @desc 自定义分组标签渲染
   * @descEN Semantic custom rendering
   */
  title?: GroupTitleRender
}

export interface ConversationsProps {
  style?: CSSProperties // 最外层样式
  className?: string // 最外层class
  direction?: 'ltr' | 'rtl' // 文本方向
  groupable?: boolean | Groupable // 是否开启分组
  items?: Conversation[] // 会话数据
  defaultActiveKey?: string // 默认选中会话
  activeKey?: string // 选中会话
  onActiveChange?: (value: string) => boolean // 选中会话变化
  // 样式class
  classNames?: {
    item: string
  }
  // 样式
  styles?: {
    item: CSSProperties
  }
  // 菜单
  menu?: ((value: Conversation) => MenuProps) | DropDownItemProps[]
}

export interface GroupTitleProps {
  direction?: ItemProps['direction']
}
