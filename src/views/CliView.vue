<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import PanelViewButtons from '../components/PanelViewButtons.vue'
import ResultStatus from '../components/ResultStatus.vue'
import { useClipboard } from '../composables/useClipboard'
import { reflowCli } from '../utils/cliReflow'

const SAMPLE = `  这个工具不是前端 UI 库，也不是组件库。它是一个 AI 设计 Skill，作用是让 AI 在改
  界面时有更强的设计规范、配色、排版建议。

  当前项目是 Go 后端 + 单文件 WebUI。
  前端是 internal/monitor/assets/index.html。`

const input = ref('')
const output = ref('')
const panelView = ref('split')
const status = ref({ type: '', message: '' })
const { copy } = useClipboard()

function run() {
  if (!input.value.trim()) {
    output.value = ''
    status.value = { type: '', message: '' }
    return
  }
  output.value = reflowCli(input.value)
  status.value = { type: 'success', message: '已去除每行前导 2 个空格' }
}
watch(input, run)
function clear() {
  input.value = ''
  output.value = ''
  status.value = { type: '', message: '' }
}
async function doCopy() {
  if (output.value && (await copy(output.value))) status.value = { type: 'success', message: '已复制到剪贴板' }
}
</script>

<template>
  <ToolLayout stacked resizable :view-mode="panelView" title="CLI 排版" desc="清理终端复制的文本：每行最多去除开头 2 个空格">
    <template #toolbar>
      <ToolButton @click="doCopy">复制</ToolButton>
      <PanelViewButtons v-model="panelView" />
      <ToolButton @click="input = SAMPLE">示例</ToolButton>
      <ToolButton @click="clear">清空</ToolButton>
    </template>

    <template #status>
      <ResultStatus :type="status.type" :message="status.message" />
    </template>

    <template #left>
      <EditorPane v-model="input" placeholder="粘贴从 CLI / 终端复制的文本…" />
    </template>

    <template #right>
      <EditorPane v-model="output" placeholder="整理后的文本…" />
    </template>
  </ToolLayout>
</template>
