<script setup lang="ts">
import type { BubbleListProps } from '@artmate/chat'
import { BubbleList } from '@artmate/chat'
import { ElCheckbox, ElSpace, ElTag } from 'element-plus'
import { computed, ref } from 'vue'

const BubbleListRef = ref<InstanceType<typeof BubbleList>>()

const rolesAsObject: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    typing: { step: 5, interval: 20 },
  },
  user: {
    placement: 'end',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  },
}

const count = ref<number>(10)

// const useRolesAsFunction = ref(false);

const items = computed<BubbleListProps['items']>(() =>
  Array.from({ length: count.value }).map((_, i) => {
    const isAI = !!(i % 2)
    const content = isAI ? 'Mock AI content. '.repeat(20) : 'Mock user content.'

    return {
      key: `${i}`,
      role: isAI ? 'ai' : 'user',
      // 保证只有最新的一条回话会打印输出
      typing: isAI && i === count.value - 1 && { step: 5, interval: 20 },
      content,
    }
  })
)

const selectList = ref<Array<string | number | undefined>>([])

const selectCheckbox = (key: string | number | undefined) => {
  console.log(key)
  if (selectList.value.includes(key)) {
    selectList.value = selectList.value.filter((item) => item !== key)
  } else {
    selectList.value.push(key)
  }
}
</script>

<template>
  <ElSpace direction="vertical" alignment="align-start">
    <BubbleList
      ref="BubbleListRef"
      :items="items"
      :roles="rolesAsObject"
      auto-scroll
      :style="{ maxHeight: '300px' }"
    >
      <template #leading="{ info }">
        <ElCheckbox :checked="selectList.includes(info.key)" @click="selectCheckbox(info.key)" />
      </template>
    </BubbleList>
    <div style="display: flex; flex-wrap: wrap; gap: 4px">
      已选中：<ElTag v-for="key in selectList" :key="key">
        key为 {{ key }} 的消息
      </ElTag>
    </div>
  </ElSpace>
</template>

<style lang="scss" scoped>
.btns {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}
</style>
