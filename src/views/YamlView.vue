<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import PanelViewButtons from '../components/PanelViewButtons.vue'
import ResultStatus from '../components/ResultStatus.vue'
import { useClipboard } from '../composables/useClipboard'
import { useDownload } from '../composables/useDownload'
import { formatYaml, yamlToJson, jsonToYaml, yamlError } from '../utils/yaml'

const SAMPLE = `  rule-providers:
    apple:
      type: http
      behavior: domain
      url: https://example.com/geosite/apple.mrs

    google:
      type: http
      behavior: domain
      url: https://example.com/geosite/google.mrs`

const input = ref('')
const output = ref('')
const panelView = ref('split')
const status = ref({ type: '', message: '' })
const { copy } = useClipboard()
const { download } = useDownload()

function run(fn, ok) {
  if (!input.value.trim()) {
    status.value = { type: 'error', message: '请输入内容' }
    return
  }
  try {
    output.value = fn(input.value)
    status.value = { type: 'success', message: ok }
  } catch (e) {
    status.value = { type: 'error', message: yamlError(e) }
  }
}
const doFormat = () => run(formatYaml, '格式化成功')
const doToJson = () => run(yamlToJson, '已转换为 JSON')
const doToYaml = () => run(jsonToYaml, '已转换为 YAML')
function clear() {
  input.value = ''
  output.value = ''
  status.value = { type: '', message: '' }
}
async function doCopy() {
  if (output.value && (await copy(output.value))) status.value = { type: 'success', message: '已复制到剪贴板' }
}
function doDownload() {
  if (output.value) download(output.value, 'output.yaml', 'text/yaml')
}
</script>

<template>
  <ToolLayout
    resizable
    :view-mode="panelView"
    title="YAML 格式化"
    desc="美化 YAML、YAML⇄JSON 互转（自动去除 CLI 复制的多余缩进）"
  >
    <template #toolbar>
      <ToolButton variant="primary" @click="doFormat">格式化</ToolButton>
      <ToolButton @click="doToJson">YAML→JSON</ToolButton>
      <ToolButton @click="doToYaml">JSON→YAML</ToolButton>
      <ToolButton @click="doCopy">复制</ToolButton>
      <ToolButton @click="doDownload">下载</ToolButton>
      <PanelViewButtons v-model="panelView" />
      <ToolButton @click="input = SAMPLE">示例</ToolButton>
      <ToolButton @click="clear">清空</ToolButton>
    </template>

    <template #status>
      <ResultStatus :type="status.type" :message="status.message" />
    </template>

    <template #left>
      <EditorPane v-model="input" mode="code" lang="yaml" placeholder="在此粘贴 YAML 或 JSON…" />
    </template>

    <template #right>
      <EditorPane v-model="output" mode="code" lang="yaml" placeholder="结果…" />
    </template>
  </ToolLayout>
</template>
