import type { UploadProps } from 'element-plus'

import type { CSSProperties } from 'vue'

import type { Attachment } from '../attachment/interface'

export interface FileListCardProps {
  item: {
    file?: Attachment
    percent?: number
    thumbUrl?: string
  } & Attachment
  onRemove?: (item: Attachment) => void
  className?: string
  style?: CSSProperties
  disabled?: boolean
}

export interface fileListProps {
  items: Attachment[]
  onRemove?: FileListCardProps['onRemove']
  overflow?: 'scrollX' | 'scrollY' | 'wrap'
  upload?: Partial<UploadProps>
  disabled?: boolean

  // Semantic
  listClassName?: string
  listStyle?: CSSProperties
  itemClassName?: string
  itemStyle?: CSSProperties
}

export interface ProgressProps {
  percent: number
}
