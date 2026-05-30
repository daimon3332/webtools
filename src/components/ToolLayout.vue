<script setup>
defineProps({
  title: String,
  desc: String
})
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

    <div class="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
      <section class="flex min-h-0 flex-col border-line max-md:border-b md:border-r">
        <div class="flex items-center justify-between gap-2 border-b border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink-soft">
          <slot name="left-label">输入</slot>
        </div>
        <div class="relative min-h-0 flex-1 overflow-auto bg-surface">
          <slot name="left" />
        </div>
      </section>

      <section class="flex min-h-0 flex-col">
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
