import type { UploadFile, UploadProps } from 'element-plus'

import type { CSSProperties } from 'vue'

export interface DropUploaderProps {
  className?: string
  getDropContainer?: (() => HTMLElement | null) | null
  disabled?: boolean
}

export interface SilentUploaderProps extends Partial<UploadProps> {
  upload?: Partial<UploadProps>
  rootClassName?: string
}

export interface PlaceholderUploaderProps {
  disabled?: boolean
  className?: string
  style?: CSSProperties
  upload?: Partial<UploadProps>
}

export type Attachment = {
  description?: string
  status?: UploadFile['status']
  uid?: number | string
  [key: string]: any
} & Partial<UploadProps['fileList'][number]>

type SemanticType = 'item' | 'list' | 'placeholder'

export interface AttachmentProps {
  direction?: 'ltr' | 'rtl'
  uploadProps?: SilentUploaderProps
  items?: Attachment[]
  rootClassName?: string
  getDropContainer?: () => HTMLElement | null
  className?: string
  classNames?: Partial<Record<SemanticType, string>>
  styles?: Partial<Record<SemanticType, CSSProperties>>
  rootStyle?: CSSProperties
  onChange?: (files: { file: Attachment; fileList: Attachment[] }) => void
  disabled?: boolean
  overflow?: 'scrollX' | 'scrollY' | 'wrap'
}
