<script setup>
import ToolButton from './ToolButton.vue'

const props = defineProps({
  modelValue: { type: String, default: 'split' }
})
const emit = defineEmits(['update:modelValue'])

function toggle(mode) {
  emit('update:modelValue', props.modelValue === mode ? 'split' : mode)
}
</script>

<template>
  <ToolButton :variant="modelValue === 'input' ? 'accent' : 'default'" @click="toggle('input')">只看原文</ToolButton>
  <ToolButton :variant="modelValue === 'output' ? 'accent' : 'default'" @click="toggle('output')">只看结果</ToolButton>
</template>
