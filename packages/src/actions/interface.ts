import type { dropdownItemProps } from 'element-plus'
import type { Component } from 'vue'

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
  variant?: 'borderless' | 'border'
  /**
   *
   */
  trigger?: 'hover' | 'click'
}

export interface ActionsEmits {
  (e: 'click', menuInfo: { item: ActionItem; key: string; keyPath: string[] }): void
}
