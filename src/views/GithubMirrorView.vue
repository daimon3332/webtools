<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
import PanelViewButtons from '../components/PanelViewButtons.vue'
import ResultStatus from '../components/ResultStatus.vue'
import { useClipboard } from '../composables/useClipboard'
import { GITHUB_MIRRORS, convertGithubMirrors } from '../utils/githubMirror'

const SAMPLE = [
  'https://github.com/yazi-rs/flavors',
  'https://github.com/seakee/CPA-Manager/blob/main/index.html',
  'https://github.com/seakee/CPA-Manager/releases/download/v1.5.5/cpa-manager_v1.5.5_windows_arm64.zip'
].join('\n')

const input = ref('')
const groups = ref([])
const output = ref('')
const resultView = ref('cards')
const panelView = ref('split')
const selectedMirrors = ref(GITHUB_MIRRORS.filter(m => m.defaultSelected).map(m => m.id))
const status = ref({ type: '', message: '' })
const { copy } = useClipboard()

function formatOutputText(items) {
  return items.map(group => {
    const links = group.links.map(item => `${item.name}: ${item.url}`)
    const warnings = group.warnings.map(item => `提示: ${item}`)
    return [`原始链接: ${group.source}`, ...links, ...warnings].join('\n')
  }).join('\n\n')
}

function run() {
  const lines = input.value.split(/\r?\n/).map(v => v.trim()).filter(Boolean)
  if (!lines.length) {
    groups.value = []
    output.value = ''
    status.value = { type: '', message: '' }
    return
  }
  if (!selectedMirrors.value.length) {
    groups.value = []
    output.value = ''
    status.value = { type: 'error', message: '请至少选择一个代理' }
    return
  }

  let count = 0
  const nextGroups = lines.map(line => {
    const result = convertGithubMirrors(line, selectedMirrors.value)
    count += result.links.length
    return { source: line, ...result }
  })
  groups.value = nextGroups
  output.value = formatOutputText(nextGroups)
  status.value = { type: 'success', message: `已生成 ${count} 个镜像链接` }
}

watch([input, selectedMirrors], run, { deep: true })

function clear() {
  input.value = ''
  groups.value = []
  output.value = ''
  status.value = { type: '', message: '' }
}

async function doCopy() {
  if (output.value && (await copy(output.value))) status.value = { type: 'success', message: '已复制到剪贴板' }
}

async function copyLink(link) {
  if (await copy(link.url)) status.value = { type: 'success', message: `已复制 ${link.name}` }
}

function openLink(link) {
  window.open(link.url, '_blank', 'noopener,noreferrer')
}

function sourceType(source) {
  try {
    const url = new URL(source)
    const parts = url.pathname.split('/').filter(Boolean)
    if (url.hostname === 'raw.githubusercontent.com') return 'Raw'
    if (parts[2] === 'releases') return 'Release'
    if (parts[2] === 'blob' || parts[2] === 'raw') return '文件'
    if (parts[2] === 'tree') return '目录'
    if (url.hostname === 'github.com' && parts.length >= 2) return '仓库'
  } catch {}
  return '未知'
}

function mirrorStyle(name) {
  if (name.includes('jsDelivr')) {
    return {
      card: 'border-sky-200 bg-gradient-to-br from-sky-50 to-white',
      badge: 'border-sky-200 bg-sky-100 text-sky-700',
      accent: 'bg-sky-400'
    }
  }
  if (name === 'gh-proxy.com') {
    return {
      card: 'border-accent/40 bg-gradient-to-br from-emerald-50 to-white',
      badge: 'border-accent/30 bg-accent/10 text-accent-600',
      accent: 'bg-accent'
    }
  }
  return {
    card: 'border-primary/25 bg-gradient-to-br from-blue-50 to-white',
    badge: 'border-primary/25 bg-primary/10 text-primary',
    accent: 'bg-primary'
  }
}

const tabBase = 'rounded px-2 py-0.5 text-xs transition'
</script>

<template>
  <ToolLayout stacked resizable :view-mode="panelView" title="GitHub 镜像转换" desc="普通代理使用原始链接前缀，jsDelivr 单独转换仓库文件路径">
    <template #toolbar>
      <label v-for="mirror in GITHUB_MIRRORS" :key="mirror.id" class="flex items-center gap-1.5 text-sm text-ink-soft">
        <input v-model="selectedMirrors" type="checkbox" class="accent-primary" :value="mirror.id" />
        {{ mirror.name }}
      </label>
      <ToolButton @click="doCopy">复制</ToolButton>
      <PanelViewButtons v-model="panelView" />
      <ToolButton @click="input = SAMPLE">示例</ToolButton>
      <ToolButton @click="clear">清空</ToolButton>
    </template>

    <template #status>
      <ResultStatus :type="status.type" :message="status.message" />
    </template>

    <template #left-label>GitHub 原始链接</template>
    <template #left>
      <EditorPane v-model="input" placeholder="粘贴 GitHub 仓库、文件、raw 或 releases/download 链接，多个链接可换行输入..." />
    </template>

    <template #right-label>
      <span>镜像链接</span>
      <div class="ml-auto flex items-center gap-1">
        <button :class="[tabBase, resultView === 'cards' ? 'bg-primary text-white' : 'text-ink-soft hover:bg-primary/10']" @click="resultView = 'cards'">卡片</button>
        <button :class="[tabBase, resultView === 'text' ? 'bg-primary text-white' : 'text-ink-soft hover:bg-primary/10']" @click="resultView = 'text'">文本</button>
      </div>
    </template>
    <template #right>
      <EditorPane v-if="resultView === 'text'" v-model="output" placeholder="镜像链接文本，可直接编辑…" />
      <div v-else class="h-full overflow-auto bg-canvas p-4">
        <div v-if="groups.length" class="space-y-4">
          <section v-for="group in groups" :key="group.source" class="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
            <div class="border-b border-line bg-gradient-to-r from-canvas via-white to-canvas px-4 py-3">
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink-soft">{{ sourceType(group.source) }}</span>
                <span class="text-xs font-medium text-ink-soft">原始链接</span>
              </div>
              <div class="break-all font-mono text-[13px] leading-relaxed text-ink">
                {{ group.source }}
              </div>
            </div>

            <div class="grid gap-3 p-3">
              <div
                v-for="link in group.links"
                :key="`${group.source}-${link.name}`"
                class="relative overflow-hidden rounded-xl border p-3 shadow-sm"
                :class="mirrorStyle(link.name).card"
              >
                <div class="absolute inset-y-0 left-0 w-1.5" :class="mirrorStyle(link.name).accent" />
                <div class="mb-2 flex flex-wrap items-center gap-2 pl-1">
                  <span class="rounded-full border px-2 py-0.5 text-xs font-semibold" :class="mirrorStyle(link.name).badge">{{ link.name }}</span>
                  <span class="text-xs text-ink-soft">镜像前缀</span>
                  <div class="ml-auto flex items-center gap-1">
                    <button class="rounded border border-line bg-surface px-2 py-0.5 text-xs text-ink-soft hover:border-primary hover:text-primary" @click="copyLink(link)">复制</button>
                    <button class="rounded border border-line bg-surface px-2 py-0.5 text-xs text-ink-soft hover:border-primary hover:text-primary" @click="openLink(link)">打开</button>
                  </div>
                </div>
                <div class="break-all rounded-lg bg-white/70 px-3 py-2 font-mono text-[13px] leading-relaxed text-ink">
                  {{ link.url }}
                </div>
              </div>

              <div v-for="warning in group.warnings" :key="`${group.source}-${warning}`" class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-700">
                <span class="font-semibold">提示：</span>{{ warning }}
              </div>
            </div>
          </section>
        </div>
        <div v-else class="grid h-full place-items-center p-6 text-center">
          <div class="rounded-2xl border border-dashed border-line bg-surface/80 px-6 py-5 shadow-sm">
            <div class="mb-1 text-sm font-semibold text-ink">等待转换</div>
            <div class="text-sm text-ink-soft">转换后的彩色镜像卡片将在此显示</div>
          </div>
        </div>
      </div>
    </template>
  </ToolLayout>
</template>
