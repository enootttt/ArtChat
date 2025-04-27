<script setup lang="ts">
import { Sender } from '@artmate/chat'
import { Promotion } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElSpace } from 'element-plus'
import { ref } from 'vue'

const senderRef = ref<InstanceType<typeof Sender>>()

const value = ref('欢迎使用 ArtChat！')

function focus() {
  senderRef.value?.inputRef?.focus()
}

function blur() {
  senderRef.value?.inputRef?.blur()
}

function select() {
  senderRef.value?.inputRef?.select()
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px">
    <ElSpace>
      <ElButton @click="focus">Focus</ElButton>
      <ElButton @click="blur">Blur</ElButton>
      <ElButton @click="select">Select</ElButton>
    </ElSpace>
    <Sender ref="senderRef" v-model="value">
      <template #actions>
        <ElButton circle type="primary">
          <ElIcon color="white">
            <Promotion />
          </ElIcon>
        </ElButton>
      </template>
    </Sender>
  </div>
</template>

<style lang="scss" scoped></style>
