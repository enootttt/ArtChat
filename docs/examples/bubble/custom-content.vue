<script setup lang="ts">
import { Bubble } from '@artmate/chat'
import { ElButton, ElImage } from 'element-plus'
import { ref } from 'vue'

interface ContentType {
  imageUrl: string
  text: string
  actionBtnText: string
}

const BubbleChat = Bubble<ContentType>

const contentObj = ref<ContentType>({
  imageUrl: 'https://mtyui.asia/img/vite1.d070241e.png',
  text: 'ArtChat',
  actionBtnText: 'Click me',
})
</script>

<template>
  <BubbleChat :content="contentObj">
    <template #content="{ content }">
      <div style="display: flex; align-items: center; gap: 10px">
        <ElImage
          :src="content.imageUrl"
          style="width: 55px; height: 50px"
          :preview-src-list="[content.imageUrl]"
        />
        <span style="font-size: 18px; font-weight: bold">{{ content.text }}</span>
      </div>
    </template>
    <template #footer="{ content }">
      <ElButton text @click="contentObj.actionBtnText = '🎉 Happy ArtChat !'">
        {{ content.actionBtnText }}
      </ElButton>
    </template>
  </BubbleChat>
</template>

<style lang="scss" scoped></style>
