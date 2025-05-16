<script setup lang="ts">
import type { BubbleListProps } from '@artmate/chat'
import { BubbleList } from '@artmate/chat'
import { Loading } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
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

// const useRolesAsFunction = ref(false);

const items = computed(() => [
  {
    key: 'welcome',
    role: 'ai',
    content: 'Mock welcome content. '.repeat(10),
  },
  {
    key: 'ask',
    role: 'user',
    content: 'Mock user content.',
  },
  {
    key: 'ai',
    role: 'ai',
    loading: true,
  },
])
</script>

<template>
  <BubbleList
    ref="BubbleListRef"
    :items="items"
    :roles="rolesAsObject"
    auto-scroll
    :style="{ maxHeight: '300px' }"
  >
    <template #loading="{ info }">
      <div v-if="info.role === 'ai'">
        Custom loading...
        <ElIcon>
          <Loading />
        </ElIcon>
      </div>
    </template>
  </BubbleList>
</template>

<style lang="scss" scoped>
.btns {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}
</style>
