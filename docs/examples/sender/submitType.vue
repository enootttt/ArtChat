<script setup lang="ts">
import { Sender } from '@artmate/chat'
import { Promotion } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMessage } from 'element-plus'
import { ref } from 'vue'

const value = ref('')

function submit() {
  ElMessage.success('Send message successfully!')
}
</script>

<template>
  <Sender
    v-model="value"
    submit-type="shiftEnter"
    placeholder="Press Shift + Enter to send message"
    @submit="submit"
  >
    <template #actions>
      <ElButton circle type="primary" @click="submit">
        <ElIcon color="white">
          <Promotion />
        </ElIcon>
      </ElButton>
    </template>
  </Sender>
</template>

<style lang="scss" scoped></style>
