import SenderHeader from './header.vue'
import Sender from './index.vue'

export type * from './interface'

type SenderType = {
  Header: typeof SenderHeader
} & typeof Sender
;(Sender as SenderType).Header = SenderHeader

export default Sender as SenderType

export { Sender, SenderHeader }
