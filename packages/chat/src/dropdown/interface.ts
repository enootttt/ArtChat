import type { Component } from 'vue'

export interface DropDownItemProps {
  command?: number | object | string
  disabled?: boolean
  divided?: boolean
  icon?: Component | string
  label?: string
}
export interface DropDownProps {
  placement?: 'bottom' | 'bottom-end' | 'bottom-start' | 'top' | 'top-end' | 'top-start'
  trigger?: 'click' | 'contextmenu' | 'hover'
  disabled?: boolean
  menu?: DropDownItemProps[]
}
