<script setup>
import { defineAsyncComponent } from 'vue'

defineProps({
  modelValue: { type: String, default: '' },
  mode: { type: String, default: 'text' },
  lang: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  readonly: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

// CodeMirror 按需懒加载：textarea 类工具不会引入其体积
const CodeEditor = defineAsyncComponent(() => import('./CodeEditor.vue'))
</script>

<template>
  <textarea
    v-if="mode === 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :readonly="readonly"
    spellcheck="false"
    class="h-full w-full resize-none border-0 bg-transparent p-3 font-mono text-[13px] leading-relaxed text-ink outline-none placeholder:text-ink-soft/50"
    @input="emit('update:modelValue', $event.target.value)"
  />
  <CodeEditor
    v-else
    :model-value="modelValue"
    :lang="lang"
    :placeholder="placeholder"
    :readonly="readonly"
    @update:model-value="v => emit('update:modelValue', v)"
  />
</template>
