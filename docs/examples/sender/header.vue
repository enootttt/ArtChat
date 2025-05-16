<script setup lang="ts">
import { Sender, SenderHeader } from '@artmate/chat'
import { Link, Promotion, UploadFilled } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMessage, ElSpace, ElText } from 'element-plus'
import { ref } from 'vue'

const value = ref('')
const open = ref(false)

function submit() {
  ElMessage.success('Send message successfully!')
}
</script>

<template>
  <ElSpace style="width: 100%; height: 300px" fill alignment="end">
    <Sender v-model="value" @submit="submit">
      <template #header>
        <SenderHeader title="Upload Sample" :open="open">
          <template #default>
            <ElSpace style="width: 100%" direction="vertical" alignment="center">
              <ElIcon size="50">
                <UploadFilled />
              </ElIcon>
              <div>Drag file here(just demo)</div>
              <ElText type="info">Support pdf, doc, xlsx, ppt, txt, image file types</ElText>
              <ElButton @click="ElMessage.success('Upload file successfully!')">
                Select File
              </ElButton>
            </ElSpace>
          </template>
        </SenderHeader>
      </template>
      <template #prefix>
        <ElButton circle text @click="open = !open">
          <ElIcon>
            <Link />
          </ElIcon>
        </ElButton>
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
