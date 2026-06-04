<script setup>
import { computed, ref, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import EditorPane from '../components/EditorPane.vue'
import ToolButton from '../components/ToolButton.vue'
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
const selectedMirrors = ref(GITHUB_MIRRORS.filter(m => m.defaultSelected).map(m => m.id))
const status = ref({ type: '', message: '' })
const { copy } = useClipboard()

const outputText = computed(() => groups.value.map(group => {
  const links = group.links.map(item => `${item.name}: ${item.url}`)
  const warnings = group.warnings.map(item => `提示: ${item}`)
  return [`原始链接: ${group.source}`, ...links, ...warnings].join('\n')
}).join('\n\n'))

function run() {
  const lines = input.value.split(/\r?\n/).map(v => v.trim()).filter(Boolean)
  if (!lines.length) {
    groups.value = []
    status.value = { type: '', message: '' }
    return
  }
  if (!selectedMirrors.value.length) {
    groups.value = []
    status.value = { type: 'error', message: '请至少选择一个代理' }
    return
  }

  let count = 0
  groups.value = lines.map(line => {
    const result = convertGithubMirrors(line, selectedMirrors.value)
    count += result.links.length
    return { source: line, ...result }
  })
  status.value = { type: 'success', message: `已生成 ${count} 个镜像链接` }
}

watch([input, selectedMirrors], run, { deep: true })

function clear() {
  input.value = ''
  groups.value = []
  status.value = { type: '', message: '' }
}

async function doCopy() {
  if (outputText.value && (await copy(outputText.value))) status.value = { type: 'success', message: '已复制到剪贴板' }
}

function cardClass(name) {
  if (name.includes('jsDelivr')) return 'border-sky-200 bg-sky-50/70 text-sky-700'
  if (name === 'gh-proxy.com') return 'border-accent/40 bg-accent/10 text-accent-600'
  return 'border-primary/25 bg-primary/5 text-primary'
}
</script>

<template>
  <ToolLayout stacked title="GitHub 镜像转换" desc="普通代理使用原始链接前缀，jsDelivr 单独转换仓库文件路径">
    <template #toolbar>
      <label v-for="mirror in GITHUB_MIRRORS" :key="mirror.id" class="flex items-center gap-1.5 text-sm text-ink-soft">
        <input v-model="selectedMirrors" type="checkbox" class="accent-primary" :value="mirror.id" />
        {{ mirror.name }}
      </label>
      <ToolButton @click="doCopy">复制</ToolButton>
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

    <template #right-label>镜像链接</template>
    <template #right>
      <div class="h-full overflow-auto bg-canvas p-4">
        <div v-if="groups.length" class="space-y-4">
          <section v-for="group in groups" :key="group.source" class="rounded-xl border border-line bg-surface p-3 shadow-sm">
            <div class="mb-3 rounded-lg bg-canvas px-3 py-2 font-mono text-xs text-ink-soft break-all">
              {{ group.source }}
            </div>
            <div class="grid gap-2">
              <div
                v-for="link in group.links"
                :key="`${group.source}-${link.name}`"
                class="rounded-lg border p-3"
                :class="cardClass(link.name)"
              >
                <div class="mb-1 text-xs font-semibold">{{ link.name }}</div>
                <div class="font-mono text-[13px] leading-relaxed text-ink break-all">{{ link.url }}</div>
              </div>
              <div v-for="warning in group.warnings" :key="`${group.source}-${warning}`" class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {{ warning }}
              </div>
            </div>
          </section>
        </div>
        <div v-else class="grid h-full place-items-center text-sm text-ink-soft">
          转换后的镜像地址将在此显示
        </div>
      </div>
    </template>
  </ToolLayout>
</template>
