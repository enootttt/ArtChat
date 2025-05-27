import type { Component } from 'vue'
import type { ComponentExposed, ComponentProps, ComponentType } from 'vue-component-type-helpers'
/** 泛型组件出口类型 */
export type GenericComponentExports<D extends Component> = ComponentType<D> &
  ComponentExposed<D> &
  ComponentProps<D>

export type AnyObject = Record<PropertyKey, any>
