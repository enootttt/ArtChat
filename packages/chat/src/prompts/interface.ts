import type { CSSProperties } from 'vue'

export interface BasePromptItem {
  /**
   * @desc 唯一标识用于区分每个提示项。
   * @descEN Unique identifier used to distinguish each prompt item.
   */
  key: string

  /**
   * @desc 提示图标显示在提示项的左侧。
   * @descEN Prompt icon displayed on the left side of the prompt item.
   */
  icon?: string

  /**
   * @desc 提示标签显示提示的主要内容。
   * @descEN Prompt label displaying the main content of the prompt.
   */
  label?: string

  /**
   * @desc 提示描述提供额外的信息。
   * @descEN Prompt description providing additional information.
   */
  description?: string

  /**
   * @desc 设置为 true 时禁用点击事件。
   * @descEN When set to true, click events are disabled.
   */
  disabled?: boolean
}

export interface PromptProps extends BasePromptItem {
  children?: BasePromptItem[]
}

export type SemanticType = 'item' | 'itemContent' | 'list' | 'subItem' | 'subList' | 'title'
export interface PromptsProps {
  title?: string
  className?: string
  rootClassName?: string
  direction?: 'ltr' | 'rtl'
  style?: CSSProperties
  classNames?: Partial<Record<SemanticType, string>>
  wrap?: boolean
  vertical?: boolean
  styles?: Partial<Record<SemanticType, CSSProperties>>
  items?: PromptProps[]
  onItemClick?: (info: { data: PromptProps }) => void
}
