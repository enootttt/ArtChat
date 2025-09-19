import type { ArtNotificationOpenArgs, useNotificationType } from './interface'
import { ref } from 'vue'

let uuid = 0

class ArtNotification {
  private static permissionMap: Map<string, any> = new Map()
  static permissible: boolean
  constructor() {
    ArtNotification.permissible = !!globalThis?.Notification
    if (!ArtNotification.permissible) {
      console.warn('Notification API is not supported in this environment.')
    }
  }

  public get permission(): NotificationPermission {
    if (!ArtNotification.permissible) {
      return 'denied'
    }
    return globalThis.Notification?.permission
  }

  public open(arg: ArtNotificationOpenArgs): void {
    if (!ArtNotification.permissible) return
    const { title, tag, onClick, duration, onClose, onError, onShow, ...config } = arg || {}
    if (tag && ArtNotification.permissionMap.has(tag)) return
    uuid += 1
    const mergeKey = tag || `x_notification_${uuid}`
    const notification: Notification = new globalThis.Notification(title, config || {})
    const close = notification.close.bind(notification)

    if (typeof duration === 'number') {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId)
        close()
      }, duration * 1000)
    }
    notification.onclick = (event) => {
      onClick?.(event, close)
    }

    notification.onshow = (event) => {
      onShow?.(event)
      ArtNotification.permissionMap.set(mergeKey, {
        close,
      })
    }

    notification.onclose = (event) => {
      onClose?.(event)
      ArtNotification.permissionMap.delete(mergeKey)
    }

    notification.onerror = (event) => {
      onError?.(event)
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    return this._requestPermission()
  }

  private async _requestPermission(
    setPermissionState?: (permission: NotificationPermission) => void
  ): Promise<NotificationPermission> {
    if (!ArtNotification.permissible) {
      return 'denied'
    }
    const permissionRes = await globalThis.Notification.requestPermission()

    if (typeof setPermissionState === 'function') {
      setPermissionState?.(permissionRes)
    }
    return permissionRes
  }

  public useNotification(): useNotificationType {
    const permission = ref<NotificationPermission>(this?.permission)
    return [
      {
        permission,
      },
      {
        open: this.open,
        close: this.close,
        requestPermission: () =>
          this._requestPermission((val: NotificationPermission) => (permission.value = val)),
      },
    ]
  }

  public close(tags?: string[]): void {
    if (!ArtNotification.permissible) return
    Array.from(ArtNotification.permissionMap.keys()).forEach((key) => {
      if (tags === undefined) {
        ArtNotification.permissionMap.get(key)?.close?.()
      }
      if (tags?.includes(key)) {
        ArtNotification.permissionMap.get(key)?.close?.()
      }
    })
  }
}

export type { ArtNotificationOpenArgs }
export default new ArtNotification()
export { ArtNotification }
