<script setup lang="ts">
import { Sender } from '@artmate/chat'
import { Promotion } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMessage, ElSpace } from 'element-plus'
import { onWatcherCleanup, ref, watch } from 'vue'
import StopLoading from './loading.vue'

const loading = ref(false)
const value = ref('')

// Mock send message
watch(loading, () => {
  if (loading.value) {
    const timer = setTimeout(() => {
      loading.value = false
      ElMessage.success('Send message successfully!')
    }, 3000)
    onWatcherCleanup(() => {
      clearTimeout(timer)
    })
  }
})

function submit() {
  if (!loading.value) {
    value.value = ''
    loading.value = true
    ElMessage.info('Send message!')
  } else {
    loading.value = false
    ElMessage.error('Cancel sending!')
  }
}
</script>

<template>
  <ElSpace style="width: 100%" direction="vertical" fill>
    <Sender v-model="value" placeholder="Please input your message...">
      <template #actions>
        <ElButton circle type="primary" :disabled="!value && !loading" @click="submit">
          <ElIcon v-if="!loading" color="white">
            <Promotion />
          </ElIcon>
          <ElIcon v-else color="white" size="32">
            <StopLoading />
          </ElIcon>
        </ElButton>
      </template>
    </Sender>

    <Sender model-value="Force as loading" read-only>
      <template #actions>
        <ElButton circle type="primary">
          <ElIcon color="white" size="32">
            <StopLoading />
          </ElIcon>
        </ElButton>
      </template>
    </Sender>

    <Sender model-value="Set to disabled" disabled>
      <template #actions>
        <ElButton circle type="primary" disabled>
          <ElIcon color="white">
            <Promotion />
          </ElIcon>
        </ElButton>
      </template>
    </Sender>
  </ElSpace>
</template>

<style lang="scss" scoped></style>
