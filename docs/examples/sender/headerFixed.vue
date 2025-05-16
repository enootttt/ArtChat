<script setup lang="ts">
import { Sender, SenderHeader } from '@artmate/chat'
import { Promotion, TopLeft } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMessage, ElSpace, ElSwitch } from 'element-plus'
import { ref } from 'vue'

const value = ref('123')
const hasRef = ref(true)

function submit() {
  ElMessage.success('Send message successfully!')
}
</script>

<template>
  <ElSpace style="width: 100%" direction="vertical" alignment="align-start" fill>
    <ElSwitch
      v-model="hasRef"
      inline-prompt
      active-text="With Reference"
      inactive-text="With Reference"
    />
    <Sender
      v-model="value"
      submit-type="shiftEnter"
      placeholder="Press Shift + Enter to send message"
      @submit="submit"
    >
      <template #header>
        <SenderHeader :open="hasRef">
          <template #title>
            <ElSpace>
              <ElIcon><TopLeft /></ElIcon>
              <div>"Tell more about ArtChat"</div>
            </ElSpace>
          </template>
        </SenderHeader>
      </template>
      <template #actions>
        <ElButton circle type="primary" @click="submit">
          <ElIcon color="white">
            <Promotion />
          </ElIcon>
        </ElButton>
      </template>
    </Sender>
  </ElSpace>
</template>

<style lang="scss" scoped></style>
