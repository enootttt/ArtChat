import type { Ref } from 'vue'

import type { Conversation, ConversationsProps, Groupable } from '../interface'
import { computed, ref } from 'vue'

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped'

type GroupList = {
  data: Conversation[]
  name?: string
  title?: Groupable['title']
}[]

type GroupMap = Record<string, Conversation[]>

function useGroupable(
  groupable?: ConversationsProps['groupable'],
  items: Ref<Conversation[]> = ref([])
): [groupList: Ref<GroupList>, enableGroup: Ref<boolean>] {
  const groupableWatch = computed(() => {
    if (!groupable) {
      return [false, undefined, undefined]
    }

    let baseConfig: Groupable = {
      sort: undefined,
      title: undefined,
    }

    if (typeof groupable === 'object') {
      baseConfig = { ...baseConfig, ...groupable }
    }

    return [true, baseConfig.sort, baseConfig.title]
  })

  const groupListComputed = computed<[groupList: GroupList, enableGroup: boolean]>(() => {
    if (!groupableWatch.value[0]) {
      const groupList = [
        {
          name: __UNGROUPED,
          data: items.value,
          title: undefined,
        },
      ]

      return [groupList, groupableWatch.value[0] as boolean]
    }

    // 1. 将 data 做数据分组，填充 groupMap

    const groupMap = items.value.reduce<GroupMap>((acc, item) => {
      const group = item.group || __UNGROUPED

      if (!acc[group]) {
        acc[group] = []
      }

      acc[group].push(item)

      return acc
    }, {})

    // 2. 存在 sort 时对 groupKeys 排序
    const groupKeys =
      groupableWatch.value[1] && typeof groupableWatch.value[1] !== 'boolean'
        ? Object.keys(groupMap).sort(groupableWatch.value[1] as any)
        : Object.keys(groupMap)

    // 3. groupMap 转 groupList
    const groupList = groupKeys.map((group) => ({
      name: group === __UNGROUPED ? undefined : group,
      title: groupableWatch.value[2],
      data: groupMap[group],
    }))

    return [groupList as GroupList, groupableWatch.value[0] as boolean]
  })

  return [computed(() => groupListComputed.value[0]), computed(() => groupListComputed.value[1])]
}

export default useGroupable
