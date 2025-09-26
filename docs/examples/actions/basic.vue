<script setup lang="ts">
import type { ActionsProps } from '@artmate/chat'
import { Actions } from '@artmate/chat'

import { DocumentCopy, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    label: 'Retry',
    icon: RefreshRight,
  },
  {
    key: 'copy',
    label: 'Copy',
    icon: DocumentCopy,
  },
]

function onClick({ keyPath }: { keyPath: string[] }) {
  ElMessage.success(`you clicked ${keyPath.join(',')}`)
}
</script>

<template>
  <div>
    <Actions :items="actionItems" @click="onClick" />
  </div>
</template>

<style lang="scss" scoped></style>
