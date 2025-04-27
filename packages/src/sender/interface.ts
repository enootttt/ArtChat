export type SubmitType = 'enter' | 'shiftEnter' | false

export interface HeaderProps {
  open?: boolean
  title?: string
  closable?: boolean
  className?: string
}

export interface SenderProps {
  modelValue: string
  classNames?: {
    actions?: string
    input?: string
    prefix?: string
  }
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  readOnly?: boolean
  rootClassName?: string
  submitType?: SubmitType
  autoSize?: { minRows?: number; maxRows?: number }
  onChange?: (value: string) => void
  onKeyPress?: (e: KeyboardEvent) => void
}
