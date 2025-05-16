import type { CascaderOption } from 'element-plus'
import type { CSSProperties } from 'vue'

export interface RenderChildrenProps<T> {
  onTrigger: (info?: T | false) => void
  onKeyDown: (e: KeyboardEvent) => void
}

export interface SuggestionProps<T = any> {
  direction?: 'ltr' | 'rtl'
  open?: boolean
  className?: string
  rootClassName?: string
  style?: CSSProperties
  items: CascaderOption[] | ((info?: T) => CascaderOption[])
  block?: boolean
  styles?: Partial<Record<string, CSSProperties>>
  classNames?: Partial<Record<string, string>>
}
