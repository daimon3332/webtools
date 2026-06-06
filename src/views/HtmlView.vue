<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import PanelViewButtons from '../components/PanelViewButtons.vue'

const SAMPLE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 24px; color: #1f2d3d; }
    h1 { color: #3b9eff; }
    .tag { color: #34c759; }
  </style>
</head>
<body>
  <h1>Hello WebTools</h1>
  <p>左侧编辑 <span class="tag">HTML</span>，右侧实时预览 ✨</p>
  <button onclick="alert('clicked!')">点我</button>
</body>
</html>`

const input = ref('')
const srcdoc = ref('')
const panelView = ref('split')
function run() {
  srcdoc.value = input.value
}
watch(input, run)
function clear() {
  input.value = ''
  srcdoc.value = ''
}
</script>

<template>
  <ToolLayout resizable :view-mode="panelView" title="HTML 渲染" desc="左侧编写 HTML，右侧沙箱实时预览（iframe 已隔离，无法访问父页面）">
    <template #toolbar>
      <ToolButton variant="primary" @click="run">运行</ToolButton>
      <PanelViewButtons v-model="panelView" />
      <ToolButton @click="input = SAMPLE">示例</ToolButton>
      <ToolButton @click="clear">清空</ToolButton>
    </template>

    <template #left>
      <EditorPane v-model="input" mode="code" lang="html" placeholder="在此输入 HTML 代码…" />
    </template>

    <template #right-label>渲染结果</template>

    <template #right>
      <iframe :srcdoc="srcdoc" sandbox="allow-scripts" class="h-full w-full border-0 bg-white" title="HTML 预览" />
    </template>
  </ToolLayout>
</template>
