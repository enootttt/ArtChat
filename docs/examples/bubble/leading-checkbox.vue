<script setup lang="ts">
import type { BubbleListProps } from '@artmate/chat'
import type { CheckboxValueType } from 'element-plus'
import { BubbleList } from '@artmate/chat'
import { ElCheckbox, ElCheckboxGroup, ElSpace, ElTag } from 'element-plus'
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

const items = computed<BubbleListProps['items']>(() =>
  Array.from({ length: count.value }).map((_, i) => {
    const isAI = !!(i % 2)
    const content = isAI ? 'Mock AI content. '.repeat(20) : 'Mock user content.'

    return {
      key: `${i + 1}`,
      role: isAI ? 'ai' : 'user',
      // 保证只有最新的一条回话会打印输出
      typing: isAI && i === count.value - 1 && { step: 5, interval: 20 },
      content,
    }
  })
)

// ------------ 选中数据 ------------
const selectList = ref<Array<string>>([])

// ------------ 全选逻辑 ------------
const checkAll = ref(false)
const isIndeterminate = ref(false)

function handleCheckAllChange(val: CheckboxValueType) {
  selectList.value = val ? items.value.map((item) => item.key as string) : []
  isIndeterminate.value = false
}

function handleCheckedCitiesChange(value: CheckboxValueType[]) {
  const checkedCount = value.length
  checkAll.value = checkedCount === items.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < items.value.length
}
</script>

<template>
  <ElSpace direction="vertical" alignment="align-start">
    <div>
      <ElCheckbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        全选
      </ElCheckbox>
    </div>
    <ElCheckboxGroup v-model="selectList" @change="handleCheckedCitiesChange">
      <BubbleList
        ref="BubbleListRef"
        :items="items"
        :roles="rolesAsObject"
        auto-scroll
        :style="{ maxHeight: '300px' }"
      >
        <template #leading="{ info }">
          <ElCheckbox :value="info.key" />
        </template>
      </BubbleList>
    </ElCheckboxGroup>
    <div style="display: flex; flex-wrap: wrap; gap: 4px">
      已选中：
      <ElTag v-for="key in selectList" :key="key">key为 {{ key }} 的消息</ElTag>
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
