<script setup>
import { computed, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'

const props = defineProps({
  modelValue: { type: String, default: '' },
  lang: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  readonly: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const extensions = shallowRef([])
const loaders = {
  json: () => import('@codemirror/lang-json').then(m => m.json()),
  html: () => import('@codemirror/lang-html').then(m => m.html()),
  yaml: () => import('@codemirror/lang-yaml').then(m => m.yaml())
}
loaders[props.lang]?.().then(ext => { extensions.value = [ext] })

const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <Codemirror
    v-model="value"
    :placeholder="placeholder"
    :extensions="extensions"
    :disabled="readonly"
    :indent-with-tab="true"
    :tab-size="2"
    :style="{ height: '100%' }"
  />
</template>
