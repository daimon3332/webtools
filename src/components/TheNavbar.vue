<script setup>
import { tools } from '../router'
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
    <div class="flex h-14 items-center gap-6 px-4">
      <RouterLink to="/" class="flex shrink-0 items-center gap-2">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-primary font-bold text-white">W</span>
        <span class="text-lg font-semibold text-ink">WebTools</span>
      </RouterLink>
      <nav class="flex items-center gap-1 overflow-x-auto">
        <RouterLink
          v-for="t in tools"
          :key="t.path"
          :to="t.path"
          class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-ink-soft transition hover:bg-primary/10 hover:text-primary"
          active-class="!bg-primary !text-white hover:!text-white"
        >
          {{ t.meta.title }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
