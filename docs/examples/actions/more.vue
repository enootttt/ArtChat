<script setup lang='ts'>
import type { ActionsProps } from '@artmate/chat'
import { Actions } from '@artmate/chat'

import { ElMessage } from 'element-plus'
import { RefreshRight, DocumentCopy, Delete, MoreFilled, Share } from '@element-plus/icons-vue'

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    label: 'Retry',
    icon: RefreshRight
  },
  {
    key: 'copy',
    label: 'Copy',
    icon: DocumentCopy
  },
  {
    key: 'more',
    label: 'more',
    icon: MoreFilled,
    children: [
      {
        key: 'share',
        label: 'Share',
        icon: Share
      },
      { key: 'import', label: 'Import' },
      {
        key: 'delete',
        label: 'Delete',
        disabled: true
      },
    ],
  },
  {
    key: 'clear',
    label: 'Clear',
    icon: Delete
  },
]

const onClick = ({ keyPath }: { keyPath: string[]  }) => {
  ElMessage.success(`you clicked ${keyPath.join(',')}`)
}
</script>

<template>
  <div>
    <Actions :items="actionItems" @click="onClick" />
  </div>
</template>

<style lang="scss" scoped></style>
