<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import ResultStatus from '../components/ResultStatus.vue'
import { decodeBase64Image } from '../utils/base64'

const input = ref('')
const image = ref(null)
const status = ref({ type: '', message: '' })

const checker = {
  backgroundImage:
    'linear-gradient(45deg,#e3eaf2 25%,transparent 25%,transparent 75%,#e3eaf2 75%),linear-gradient(45deg,#e3eaf2 25%,transparent 25%,transparent 75%,#e3eaf2 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0,10px 10px'
}

function revoke() {
  if (image.value) {
    URL.revokeObjectURL(image.value.url)
    image.value = null
  }
}

function run() {
  revoke()
  if (!input.value.trim()) {
    status.value = { type: '', message: '' }
    return
  }
  try {
    image.value = decodeBase64Image(input.value)
    status.value = {
      type: 'success',
      message: `${image.value.type} · ${(image.value.size / 1024).toFixed(1)} KB`
    }
  } catch (e) {
    status.value = { type: 'error', message: e.message }
  }
}
watch(input, run)
function clear() {
  input.value = ''
  revoke()
  status.value = { type: '', message: '' }
}
function onImgError() {
  revoke()
  status.value = { type: 'error', message: '数据无法渲染为图片（可能仅头部字节合法或文件已损坏）' }
}
function doDownload() {
  if (!image.value) return
  const a = document.createElement('a')
  a.href = image.value.url
  a.download = `image.${image.value.type.split('/')[1]}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
onBeforeUnmount(revoke)
</script>

<template>
  <ToolLayout title="Base64 转图片" desc="粘贴 Base64 或 data URL，自动识别格式并预览（仅 PNG / JPEG / GIF / WebP）">
    <template #toolbar>
      <ToolButton variant="primary" :disabled="!image" @click="doDownload">下载图片</ToolButton>
      <ToolButton @click="clear">清空</ToolButton>
    </template>

    <template #status>
      <ResultStatus :type="status.type" :message="status.message" />
    </template>

    <template #left>
      <EditorPane v-model="input" placeholder="粘贴 Base64 字符串或 data:image/...;base64,... …" />
    </template>

    <template #right-label>图片预览</template>

    <template #right>
      <div class="flex h-full items-center justify-center overflow-auto p-4" :style="checker">
        <img v-if="image" :src="image.url" class="max-h-full max-w-full object-contain shadow-md" alt="预览" @error="onImgError" />
        <p v-else class="rounded bg-surface/80 px-3 py-1.5 text-sm text-ink-soft">解码后的图片将在此显示</p>
      </div>
    </template>
  </ToolLayout>
</template>
