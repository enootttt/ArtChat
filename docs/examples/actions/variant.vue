<script setup lang='ts'>
import type { ActionsProps } from '@artmate/chat'
import { Actions } from '@artmate/chat'

import { ElMessage } from 'element-plus'
import { RefreshRight, DocumentCopy } from '@element-plus/icons-vue'

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
]

const onClick = ({ keyPath }: { keyPath: string[]  }) => {
  ElMessage.success(`you clicked ${keyPath.join(',')}`)
}
</script>

<template>
  <div>
    <Actions :items="actionItems" variant="border" @click="onClick" />
  </div>
</template>

<style lang="scss" scoped>

</style>
