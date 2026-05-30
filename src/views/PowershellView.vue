<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import ResultStatus from '../components/ResultStatus.vue'
import { useClipboard } from '../composables/useClipboard'
import { joinPowershell } from '../utils/cmdJoin'

const SAMPLE = `Invoke-RestMethod \`
  -Uri "https://api.example.com/data" \`
  -Method Post \`
  -Headers @{ Authorization = "Bearer token" } \`
  -Body $json`

const input = ref('')
const output = ref('')
const status = ref({ type: '', message: '' })
const { copy } = useClipboard()

function run() {
  if (!input.value.trim()) {
    output.value = ''
    status.value = { type: '', message: '' }
    return
  }
  output.value = joinPowershell(input.value)
  status.value = { type: 'success', message: '已转换为单行命令' }
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
  <ToolLayout title="PowerShell 多行转单行" desc="移除行尾反引号续行符并合并为一行（按行处理，不解析引号 / here-string）">
    <template #toolbar>
      <ToolButton @click="doCopy">复制</ToolButton>
      <ToolButton @click="input = SAMPLE">示例</ToolButton>
      <ToolButton @click="clear">清空</ToolButton>
    </template>

    <template #status>
      <ResultStatus :type="status.type" :message="status.message" />
    </template>

    <template #left>
      <EditorPane v-model="input" placeholder="粘贴多行 PowerShell 命令…" />
    </template>

    <template #right>
      <EditorPane :model-value="output" readonly placeholder="单行命令…" />
    </template>
  </ToolLayout>
</template>
