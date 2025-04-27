import type { BubbleProps } from '../bubble/interface'

export type BubbleDataType = {
  key?: number | string
  role?: string
  [key: string]: any
} & BubbleProps

export type RoleType = Partial<Omit<BubbleProps, 'content'>>

export type RolesType =
  | Record<string, RoleType>
  | ((bubbleDataP: BubbleDataType, index: number) => RoleType)

export interface BubbleListProps {
  autoScroll?: boolean
  className?: string
  items: BubbleDataType[]
  roles?: RolesType
  rootClassName?: string
}

export interface scrollTopParameters {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  key?: number | string
  offset?: number
}
