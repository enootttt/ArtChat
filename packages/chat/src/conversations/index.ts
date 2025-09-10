import ConversationsGroupTitle from './GroupTitle.vue'
import Conversations from './index.vue'
import ConversationsItem from './item.vue'

export type * from './interface'

type ConversationsType = {
  GroupTitle: typeof ConversationsGroupTitle
  Item: typeof ConversationsItem
} & typeof Conversations
;(Conversations as ConversationsType).GroupTitle = ConversationsGroupTitle
;(Conversations as ConversationsType).Item = ConversationsItem

export default Conversations as ConversationsType

export { Conversations, ConversationsGroupTitle, ConversationsItem }
