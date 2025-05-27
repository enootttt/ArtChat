import Bubble from '../bubble/index.vue'
import BubbleLoading from '../bubble/loading.vue'
import BubbleList from './index.vue'

export type * from './interface'

export type BubbleListType = {
  Bubble: typeof Bubble
  Loading: typeof BubbleLoading
} & typeof BubbleList
;(BubbleList as BubbleListType).Bubble = Bubble
;(BubbleList as BubbleListType).Loading = BubbleLoading

export default BubbleList as BubbleListType

export { Bubble, BubbleList, BubbleLoading }
