<script setup lang="ts">
import { Sender } from '@artmate/chat'
import { ArrowLeftBold, Promotion } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'

import { ref } from 'vue'
import StopLoading from './loading.vue'

const value = ref('')
const loading = ref(false)

function submit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div>
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
      <template #tip>
        <div class="tip">
          <ElIcon><ArrowLeftBold /></ElIcon>
          图像编辑
        </div>
      </template>
    </Sender>
  </div>
</template>

<style lang="scss" scoped>
.tip {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #e1e1fe;
  color: #615ced;
  padding-inline: 8px;
  border-radius: 999px;
  user-select: none;
}
</style>
