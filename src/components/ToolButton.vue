<script setup>
defineProps({
  variant: { type: String, default: 'default' }
})
const styles = {
  default: 'border-line bg-surface text-ink-soft hover:border-primary hover:text-primary',
  primary: 'border-primary bg-primary text-white hover:bg-primary-600',
  accent: 'border-accent bg-accent text-white hover:bg-accent-600'
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="styles[variant]"
  >
    <slot />
  </button>
</template>
