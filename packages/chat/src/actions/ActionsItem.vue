<script setup lang="ts">
import type { ActionsItemProps } from './interface'
import { CircleClose } from '@element-plus/icons-vue'
import { ElIcon, ElTooltip } from 'element-plus'
import { useNamespace } from '../hooks/useNamespace'
import { LoadingOutlined } from '../icon'
import { ACTIONS_ITEM_STATUS } from './interface'

const props = withDefaults(defineProps<ActionsItemProps>(), {
  status: ACTIONS_ITEM_STATUS.DEFAULT,
  rootClassName: '',
})

const ns = useNamespace('actions-button-item')

const StatusIcon = {
  [ACTIONS_ITEM_STATUS.LOADING]: LoadingOutlined,
  [ACTIONS_ITEM_STATUS.ERROR]: CircleClose,
  [ACTIONS_ITEM_STATUS.RUNNING]: props.runningIcon,
  [ACTIONS_ITEM_STATUS.DEFAULT]: props.defaultIcon,
}
</script>

<template>
  <ElTooltip :title="label">
    <div :class="ns.b()">
      <template v-if="status && StatusIcon[status]">
        <ElIcon>
          <component :is="StatusIcon[status]" />
        </ElIcon>
      </template>
      <template v-else>
        <ElIcon>
          <component :is="defaultIcon" />
        </ElIcon>
      </template>
    </div>
  </ElTooltip>
</template>

<style lang="scss" scoped></style>
