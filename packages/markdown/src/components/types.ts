import type { BuiltinTheme } from 'shiki'
import type { Component, VNodeChild } from 'vue'

export interface MdComponent {
  raw: any
}
export type codeXRenderer =
  | ((params: { language?: string; content: string }) => VNodeChild)
  | Component
export type codeXSlot = ((params: any) => VNodeChild) | Component
export interface HighlightProps {
  theme?: BuiltinTheme | null
  isDark?: boolean
  language?: string
  content?: string
}
// 定义颜色替换的类型
export interface ColorReplacements {
  [theme: string]: Record<string, string>
}
