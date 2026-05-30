<script setup>
defineProps({
  type: { type: String, default: '' },
  message: String
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="message"
      class="flex items-center gap-2 px-3 py-1.5 text-xs"
      :class="type === 'error' ? 'bg-red-50 text-red-500' : 'bg-accent/10 text-accent-600'"
    >
      <span class="font-bold">{{ type === 'error' ? '✕' : '✓' }}</span>
      <span class="break-all">{{ message }}</span>
    </div>
  </transition>
</template>
