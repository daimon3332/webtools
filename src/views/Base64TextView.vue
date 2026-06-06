<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import PanelViewButtons from '../components/PanelViewButtons.vue'
import ResultStatus from '../components/ResultStatus.vue'
import { useClipboard } from '../composables/useClipboard'
import { encodeBase64Text, decodeBase64Text } from '../utils/base64'

const input = ref('')
const output = ref('')
const mode = ref('encode')
const panelView = ref('split')
const status = ref({ type: '', message: '' })
const { copy } = useClipboard()

function run() {
  if (!input.value) {
    output.value = ''
    status.value = { type: '', message: '' }
    return
  }
  try {
    output.value = mode.value === 'encode' ? encodeBase64Text(input.value) : decodeBase64Text(input.value)
    status.value = { type: 'success', message: mode.value === 'encode' ? '已编码' : '已解码' }
  } catch (e) {
    output.value = ''
    status.value = { type: 'error', message: e.message }
  }
}
watch([input, mode], run)
function clear() {
  input.value = ''
  output.value = ''
  status.value = { type: '', message: '' }
}
function setSample() {
  input.value = mode.value === 'encode' ? '你好，WebTools 🚀' : '5L2g5aW977yMV2ViVG9vbHMg8J+agA=='
}
async function doCopy() {
  if (output.value && (await copy(output.value))) status.value = { type: 'success', message: '已复制到剪贴板' }
}

const seg = 'rounded px-3 py-1 text-sm transition'
</script>

<template>
  <ToolLayout resizable :view-mode="panelView" title="Base64 编解码" desc="UTF-8 文本 Base64 编码 / 解码，支持中文和 emoji">
    <template #toolbar>
      <div class="flex rounded-md border border-line p-0.5">
        <button :class="[seg, mode === 'encode' ? 'bg-primary text-white' : 'text-ink-soft']" @click="mode = 'encode'">编码</button>
        <button :class="[seg, mode === 'decode' ? 'bg-primary text-white' : 'text-ink-soft']" @click="mode = 'decode'">解码</button>
      </div>
      <ToolButton @click="doCopy">复制</ToolButton>
      <PanelViewButtons v-model="panelView" />
      <ToolButton @click="setSample">示例</ToolButton>
      <ToolButton @click="clear">清空</ToolButton>
    </template>

    <template #status>
      <ResultStatus :type="status.type" :message="status.message" />
    </template>

    <template #left>
      <EditorPane v-model="input" :placeholder="mode === 'encode' ? '输入要编码的文本…' : '输入要解码的 Base64 文本…'" />
    </template>

    <template #right>
      <EditorPane v-model="output" placeholder="结果…" />
    </template>
  </ToolLayout>
</template>
