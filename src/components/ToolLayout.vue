<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  title: String,
  desc: String,
  stacked: { type: Boolean, default: false },
  resizable: { type: Boolean, default: false },
  viewMode: { type: String, default: 'split' }
})

const splitRef = ref(null)
const splitPercent = ref(50)
const dragging = ref(false)

const showLeft = computed(() => props.viewMode !== 'output')
const showRight = computed(() => props.viewMode !== 'input')
const isSplit = computed(() => showLeft.value && showRight.value)
const canResize = computed(() => props.resizable && isSplit.value)
const separatorOrientation = computed(() => props.stacked ? 'horizontal' : 'vertical')
const dragCursor = computed(() => props.stacked ? 'row-resize' : 'col-resize')
const splitStyle = computed(() => ({
  '--left-size': `${splitPercent.value}%`,
  '--right-size': `${100 - splitPercent.value}%`
}))

function setSplitPercent(event) {
  const box = splitRef.value?.getBoundingClientRect()
  const size = props.stacked ? box?.height : box?.width
  if (!size) return
  const minPane = Math.min(props.stacked ? 220 : 320, size * 0.38)
  const minPercent = (minPane / size) * 100
  const pointer = props.stacked ? event.clientY - box.top : event.clientX - box.left
  const next = (pointer / size) * 100
  splitPercent.value = Math.min(100 - minPercent, Math.max(minPercent, next))
}

function stopDrag() {
  dragging.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', stopDrag)
  window.removeEventListener('pointercancel', stopDrag)
}

function onDrag(event) {
  setSplitPercent(event)
}

function startDrag(event) {
  if (!canResize.value) return
  dragging.value = true
  event.preventDefault()
  setSplitPercent(event)
  document.body.style.cursor = dragCursor.value
  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', onDrag)
  window.addEventListener('pointerup', stopDrag)
  window.addEventListener('pointercancel', stopDrag)
}

onBeforeUnmount(stopDrag)
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-4 py-2.5">
      <div class="min-w-0">
        <h1 class="text-base font-semibold text-ink">{{ title }}</h1>
        <p v-if="desc" class="truncate text-xs text-ink-soft">{{ desc }}</p>
      </div>
      <div class="ml-auto flex flex-wrap items-center gap-2">
        <slot name="toolbar" />
      </div>
    </div>

    <slot name="status" />

    <div
      ref="splitRef"
      class="tool-layout-body min-h-0 flex-1"
      :class="{ stacked, resizable: canResize, single: !isSplit }"
      :style="splitStyle"
    >
      <section
        v-show="showLeft"
        class="tool-layout-pane flex min-h-0 flex-col border-line"
        :class="stacked ? 'border-b' : isSplit ? 'border-b md:border-b-0' : ''"
      >
        <div class="flex items-center justify-between gap-2 border-b border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink-soft">
          <slot name="left-label">输入</slot>
        </div>
        <div class="relative min-h-0 flex-1 overflow-auto bg-surface">
          <slot name="left" />
        </div>
      </section>

      <button
        v-if="canResize"
        type="button"
        class="split-gutter"
        :class="{ active: dragging, vertical: stacked }"
        aria-label="调整输入输出区域大小"
        role="separator"
        :aria-orientation="separatorOrientation"
        :aria-valuenow="Math.round(splitPercent)"
        aria-valuemin="20"
        aria-valuemax="80"
        @pointerdown="startDrag"
      />

      <section v-show="showRight" class="tool-layout-pane flex min-h-0 flex-col">
        <div class="flex items-center justify-between gap-2 border-b border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink-soft">
          <slot name="right-label">输出</slot>
        </div>
        <div class="relative min-h-0 flex-1 overflow-auto bg-surface">
          <slot name="right" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tool-layout-body {
  display: grid;
  grid-template-columns: 1fr;
}

.tool-layout-body.stacked {
  grid-template-rows: minmax(170px, 0.42fr) minmax(0, 1fr);
}

.tool-layout-body.stacked.resizable {
  grid-template-rows: minmax(170px, calc(var(--left-size) - 4px)) 8px minmax(160px, calc(var(--right-size) - 4px));
}

.tool-layout-body.stacked.single {
  grid-template-rows: minmax(0, 1fr);
}

.split-gutter {
  display: none;
}

.split-gutter.vertical {
  display: block;
  cursor: row-resize;
  border: 0;
  border-block: 1px solid theme('colors.line');
  background: linear-gradient(180deg, transparent, theme('colors.canvas'), transparent);
  padding: 0;
  touch-action: none;
}

.split-gutter.vertical::after {
  content: '';
  display: block;
  height: 100%;
  background: radial-gradient(circle, theme('colors.ink.soft') 1px, transparent 1.5px) center / 12px 4px repeat-x;
  opacity: 0.45;
}

@media (min-width: 768px) {
  .tool-layout-body:not(.stacked) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .tool-layout-body:not(.stacked).resizable {
    grid-template-columns: minmax(260px, calc(var(--left-size) - 4px)) 8px minmax(260px, calc(var(--right-size) - 4px));
  }

  .tool-layout-body:not(.stacked).single {
    grid-template-columns: minmax(0, 1fr);
  }

  .tool-layout-body:not(.stacked) > .tool-layout-pane:first-child {
    border-right: 1px solid theme('colors.line');
  }

  .tool-layout-body.single > .tool-layout-pane:first-child,
  .tool-layout-body:not(.stacked).resizable > .tool-layout-pane:first-child {
    border-right: 0;
  }

  .split-gutter:not(.vertical) {
    display: block;
    cursor: col-resize;
    border: 0;
    border-inline: 1px solid theme('colors.line');
    background: linear-gradient(90deg, transparent, theme('colors.canvas'), transparent);
    padding: 0;
    touch-action: none;
  }

  .split-gutter:not(.vertical)::after {
    content: '';
    display: block;
    height: 100%;
    background: radial-gradient(circle, theme('colors.ink.soft') 1px, transparent 1.5px) center / 4px 12px repeat-y;
    opacity: 0.45;
  }

  .split-gutter:not(.vertical):hover,
  .split-gutter:not(.vertical).active {
    background: rgb(59 158 255 / 12%);
  }
}

.split-gutter.vertical:hover,
.split-gutter.vertical.active {
  background: rgb(59 158 255 / 12%);
}
</style>
