import type { Ref } from 'vue'
import { ref } from 'vue'

type Getter<T> = () => T
type Setter<T> = (pre: T) => T

export default function useSyncState<T>(defaultValue: T | Getter<T>) {
  // 初始化状态值，支持函数式默认值
  const initialValue =
    typeof defaultValue === 'function' ? (defaultValue as Getter<T>)() : defaultValue

  // 创建基础响应式引用
  const stateRef: Ref<T> = ref(initialValue) as Ref<T>

  // 用于强制更新的触发变量
  const updateTrigger = ref(0)

  // 强制组件更新的方法
  const forceUpdate = () => {
    updateTrigger.value = updateTrigger.value + 1
  }

  // 设置状态的方法，支持函数式更新
  const setState = (action: T | Setter<T>) => {
    const newValue = typeof action === 'function' ? (action as Setter<T>)(stateRef.value) : action

    // 如果值有变化才更新
    if (newValue !== stateRef.value) {
      stateRef.value = newValue
      forceUpdate()
    }
  }

  // 获取当前状态的方法
  const getState: Getter<T> = () => stateRef.value

  // 返回当前状态、设置方法和获取方法
  // 使用 watchEffect 确保组件能响应 updateTrigger 的变化
  return [stateRef.value, setState, getState, updateTrigger]
}
