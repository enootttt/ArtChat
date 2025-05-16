<script setup lang="ts">
import { Attachment, Sender, SenderHeader } from '@artmate/chat'
import { Link, Promotion, UploadFilled } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMessage, ElSpace } from 'element-plus'
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
            <Attachment title="Upload files">
              <template #icon>
                <ElIcon size="50">
                  <UploadFilled />
                </ElIcon>
              </template>
              <template #title>Upload Sample</template>
              <template #description>Click or drag files to this area to upload</template>
            </Attachment>
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
