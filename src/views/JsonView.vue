<script setup>
import { ref, shallowRef } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import PanelViewButtons from '../components/PanelViewButtons.vue'
import ResultStatus from '../components/ResultStatus.vue'
import { useClipboard } from '../composables/useClipboard'
import { useDownload } from '../composables/useDownload'
import { formatJson, minifyJson, parseJson, jsonError } from '../utils/json'

const SAMPLE = '{"name":"WebTools","version":1,"tools":["json","yaml","cli"],"meta":{"author":"dev","stars":42,"open":true}}'

const input = ref('')
const output = ref('')
const tree = shallowRef(null)
const view = ref('text')
const panelView = ref('split')
const status = ref({ type: '', message: '' })
const { copy } = useClipboard()
const { download } = useDownload()

function run(fn) {
  if (!input.value.trim()) {
    status.value = { type: 'error', message: '请输入 JSON 内容' }
    return
  }
  try {
    tree.value = parseJson(input.value)
    output.value = fn(input.value)
    status.value = { type: 'success', message: '解析成功' }
  } catch (e) {
    status.value = { type: 'error', message: jsonError(input.value, e) }
  }
}
const doFormat = () => run(t => formatJson(t))
const doMinify = () => run(t => minifyJson(t))
function clear() {
  input.value = ''
  output.value = ''
  tree.value = null
  status.value = { type: '', message: '' }
}
async function doCopy() {
  if (output.value && (await copy(output.value))) status.value = { type: 'success', message: '已复制到剪贴板' }
}
function doDownload() {
  if (output.value) download(output.value, 'formatted.json', 'application/json')
}

const tabBase = 'rounded px-2 py-0.5 text-xs transition'
</script>

<template>
  <ToolLayout
    resizable
    :view-mode="panelView"
    title="JSON 格式化"
    desc="解析 / 格式化 / 压缩，支持树形查看（自动兼容 CLI 复制的缩进）"
  >
    <template #toolbar>
      <ToolButton variant="primary" @click="doFormat">格式化</ToolButton>
      <ToolButton @click="doMinify">压缩</ToolButton>
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
      <EditorPane v-model="input" mode="code" lang="json" placeholder="在此粘贴 JSON…" />
    </template>

    <template #right-label>
      <span>输出</span>
      <div class="ml-auto flex items-center gap-1">
        <button :class="[tabBase, view === 'text' ? 'bg-primary text-white' : 'text-ink-soft hover:bg-primary/10']" @click="view = 'text'">文本</button>
        <button :class="[tabBase, view === 'tree' ? 'bg-primary text-white' : 'text-ink-soft hover:bg-primary/10']" @click="view = 'tree'">树形</button>
      </div>
    </template>

    <template #right>
      <EditorPane v-if="view === 'text'" v-model="output" mode="code" lang="json" placeholder="格式化结果…" />
      <div v-else class="h-full overflow-auto p-3">
        <VueJsonPretty v-if="tree !== null" :data="tree" :deep="3" show-length show-line />
        <p v-else class="text-sm text-ink-soft">点击「格式化」后查看树形结构</p>
      </div>
    </template>
  </ToolLayout>
</template>
