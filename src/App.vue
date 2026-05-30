<script setup>
import TheNavbar from './components/TheNavbar.vue'
</script>

<template>
  <div class="flex h-full flex-col">
    <TheNavbar />
    <main class="min-h-0 flex-1">
      <router-view />
    </main>
  </div>
</template>
