import type { SELECT_OPTIONS_ENUM } from './components/options'

export interface ElxRunCodeHeaderTypes {
  /**
   * 视图 code 代码 view 预览
   */
  options: SELECT_OPTIONS_ENUM.CODE | SELECT_OPTIONS_ENUM.VIEW
}

export interface DialogOptions {
  /**
   * 点击遮罩层是否可以关闭
   */
  closeOnClickModal?: boolean
  /**
   * 是否可以通过按下 ESC 键关闭 Dialog
   */
  closeOnPressEscape?: boolean
}

export interface DrawerOptions extends DialogOptions {
  /**
   * 抽屉的方向
   */
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
}

export interface ElxRunCodeProps {
  /**
   * 代码块内容(高亮后的代码块内容)
   */
  code: string[]
  /**
   * 代码块内容(原文)
   */
  content: string
  /**
   * 高亮后pre标签的类名
   */
  preClass: string
  /**
   * 高亮后pre标签的样式
   */
  preStyle: any
  /**
   * 语言
   */
  lang: string
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 自定义类名
   */
  customClass?: string
  /**
   * 弹窗模式
   */
  mode?: 'dialog' | 'drawer'
  /**
   * 弹窗主题（暂时不支持）
   */
  theme?: string
  /**
   * 弹窗选项
   */
  dialogOptions?: DialogOptions
  /**
   * 抽屉选项
   */
  drawerOptions?: DrawerOptions
}

export type ElxRunCodeOptions = Pick<
  ElxRunCodeProps,
  'mode' | 'customClass' | 'dialogOptions' | 'drawerOptions'
>

export type OmitOfElxRunCodeContent = Omit<
  ElxRunCodeProps,
  'visible' | 'customClass' | 'dialogOptions' | 'drawerOptions'
>

export interface ElxRunCodeContentProps extends OmitOfElxRunCodeContent {
  /**
   * 当前内容区域显示的视图
   */
  nowView: ElxRunCodeHeaderTypes['options']
}

export interface ElxRunCodeExposeProps extends ElxRunCodeProps {
  /**
   * 当前选中的视图
   */
  value: ElxRunCodeHeaderTypes['options']
  /**
   * 切换视图
   */
  changeSelectValue: (value: ElxRunCodeHeaderTypes['options']) => void
}

export interface ElxRunCodeContentExposeProps extends ElxRunCodeContentProps {
  /**
   * 当前选中的视图
   */
  value: ElxRunCodeHeaderTypes['options']
  /**
   * 当前内容区域显示的视图
   */
  nowView: ElxRunCodeHeaderTypes['options']
}

export interface ElxRunCodeCloseBtnExposeProps {
  close: () => void
}
