<script setup lang="ts">
import type { ActionsProps, FEEDBACK_VALUE } from '@artmate/chat'
import { Actions, ActionsCopy, ActionsFeedback } from '@artmate/chat'
import { ElPagination } from 'element-plus'
import { ref } from 'vue'

const feedback = ref<`${FEEDBACK_VALUE}`>('default')

const actionItems: ActionsProps['items'] = [
  {
    key: 'pagination',
  },
  {
    key: 'feedback',
  },
  {
    key: 'copy',
  },
]
</script>

<template>
  <div class="demo">
    <Actions :items="actionItems">
      <template #icon="{ info }">
        <template v-if="info.key === 'pagination'">
          <ElPagination layout="prev, pager, next" :total="1000" :pager-count="2" />
        </template>
        <template v-if="info.key === 'feedback'">
          <ActionsFeedback :value="feedback" @change="(value) => (feedback = value)" />
        </template>
        <template v-else-if="info.key === 'copy'">
          <ActionsCopy text="这是我要复制的内容..." />
        </template>
      </template>
    </Actions>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  :deep(.el-pager) {
    li + li {
      margin-top: 0px;
    }
  }
}
</style>
