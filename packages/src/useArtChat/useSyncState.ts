import type { Ref } from 'vue'
import { ref } from 'vue'

type Getter<T> = () => T
type Setter<T> = (pre: T) => T

export default function useSyncState<T>(defaultState: T | Getter<T>) {
  const force = ref(0)

  const stateRef = ref(
    typeof defaultState === 'function' ? (defaultState as Getter<T>)() : defaultState
  )

  function setState(updater: Setter<T>) {
    const newValue = typeof updater === 'function' ? updater(stateRef.value) : updater
    stateRef.value = newValue

    force.value += 1
  }

  const getState: Getter<T> = () => {
    return stateRef.value
  }

  return [stateRef as Ref<T>, setState, getState] as const
}
