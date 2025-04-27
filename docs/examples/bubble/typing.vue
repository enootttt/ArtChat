<script setup lang="ts">
import { Bubble } from '@artmate/chat'
import { ElButton, ElSpace } from 'element-plus'
import { ref } from 'vue'

const repeat = ref(1)
const text = ref('hello world！')
</script>

<template>
  <ElSpace direction="vertical" alignment="align-start" style="width: 100%">
    <div class="btns">
      <ElButton style="float: right" type="primary" @click="repeat = repeat < 5 ? repeat + 1 : 1">
        Repeat {{ repeat }} Times
      </ElButton>
    </div>
    <Bubble
      :content="text.repeat(repeat)"
      avatar="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      :typing="{ step: 2, interval: 50 }"
    />
    <Bubble
      :content="text.repeat(repeat)"
      avatar="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      :typing="{ step: 2, interval: 50, suffix: '👋' }"
    />
  </ElSpace>
</template>

<style lang="scss" scoped>
.btns {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
