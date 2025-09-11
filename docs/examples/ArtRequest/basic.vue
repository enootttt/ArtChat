<script setup lang="ts">
import type { ThoughtChainItemProps } from '@artmate/chat'
import { ThoughtChain } from '@artmate/chat'
import { ArtRequest } from '@artmate/sdk'
import { Discount, Loading } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElSpace } from 'element-plus'
import { computed, ref } from 'vue'
/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com'
const PATH = '/get-user-info'

const status = ref<ThoughtChainItemProps['status']>()
const lines = ref<Record<string, string>[]>([])

async function request() {
  status.value = 'pending'

  await ArtRequest(BASE_URL + PATH, {
    callbacks: {
      onSuccess: (message) => {
        status.value = 'success'
        console.log('onSuccess', message)
      },
      onError: (error) => {
        status.value = 'error'
        console.error('onError', error)
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, msg]
        console.log('onUpdate', msg)
      },
    },
  })
}

const description = computed(() => {
  if (status.value === 'error') {
    return 'Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.'
  }
  return ''
})

const items = computed<ThoughtChainItemProps[]>(() => [
  {
    title: 'Request Log',
    status: status.value,
    description: description.value,
  },
])
</script>

<template>
  <div class="demo">
    <ElButton type="primary" :disabled="status === 'pending'" @click="request">
      Agent Request
    </ElButton>
    <ThoughtChain :items="items">
      <template #icon="{ info }">
        <ElIcon size="20" :color="info.status ? 'white' : 'block'">
          <Loading v-if="info.status === 'pending'" />
          <Discount v-else />
        </ElIcon>
      </template>
      <template #content="{ info }">
        <ElSpace direction="vertical" alignment="flex-start">
          <div>Status：{{ info.status || '-' }}</div>
          <div>Update Times：{{ lines.length }}</div>
        </ElSpace>
      </template>
    </ThoughtChain>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-x: auto;
}
</style>
