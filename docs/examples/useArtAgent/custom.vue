<script setup lang="ts">
import { useArtAgent } from '@artmate/chat'
import { ElButton, ElDivider, ElForm, ElFormItem, ElInput } from 'element-plus'
import { reactive, ref } from 'vue'

const lines = ref<string[]>([])

const modelRef = reactive({
  question: '',
})

function log(text: string) {
  lines.value = [...lines.value, text]
}

const [agent] = useArtAgent<string, { message: string }, string>({
  request: ({ message }, { onUpdate, onSuccess }) => {
    let times = 0

    const id = setInterval(() => {
      times += 1
      onUpdate(`Thinking...(${times}/3)`)

      if (times >= 3) {
        onSuccess([`It's funny that you ask: ${message}`])
        clearInterval(id)
      }
    }, 500)
  },
})

function onFinish({ question }: { question: string }) {
  log(`[You] Ask: ${question}`)
  agent.request(
    { message: question },
    {
      onUpdate: (message) => {
        log(`[Agent] Update: ${message}`)
      },
      onSuccess: (message) => {
        log(`[Agent] Answer: ${message}`)
        modelRef.question = ''
      },
      // Current demo not use error
      onError: () => {},
    }
  )
}
</script>

<template>
  <ElForm label-position="top">
    <ElFormItem label="Question">
      <ElInput v-model="modelRef.question" />
    </ElFormItem>
    <ElFormItem>
      <ElButton type="primary" @click="onFinish(modelRef)">submit</ElButton>
    </ElFormItem>
  </ElForm>

  <ElDivider />

  <div style="padding: 0 32px">
    <ul style=" padding-left: 0;list-style: circle">
      <li v-for="(line, index) in lines" :key="index">
        {{ line }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
