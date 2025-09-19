import type { Ref } from 'vue'
import type { ArtNotification } from './useNotification'

type TypeOpen = NotificationOptions & {
  title: string
  onClick?: (event: Event, close?: Notification['close']) => void
  onClose?: (event: Event) => void
  onError?: (event: Event) => void
  onShow?: (event: Event) => void
  duration?: number
}

export type useNotificationType = [
  {
    permission: Ref<NotificationPermission>
  },
  {
    open: ArtNotification['open']
    close: ArtNotification['close']
    requestPermission: () => Promise<NotificationPermission>
  },
]

export type ArtNotificationOpenArgs = TypeOpen
