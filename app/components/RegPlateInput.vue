<template>
  <div class="plate-wrapper">
    <span class="plate-icon">🚗</span>
    <input
      class="plate-input"
      type="text"
      :value="modelValue"
      maxlength="10"
      autocomplete="off"
      autocapitalize="characters"
      spellcheck="false"
      v-bind="$attrs"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9-]/g, '')
  emit('update:modelValue', cleaned)
}
</script>

<style scoped>
.plate-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #dbeafe;
  border: 3px solid #003087;
  border-radius: 6px;
  padding: 0.5rem 1rem;
}

.plate-icon {
  font-size: 1.2rem;
}

.plate-input {
  background: transparent;
  border: none;
  outline: none;
  font-family: monospace;
  font-size: 1.5rem;
  font-weight: bold;
  color: #003087;
  text-align: center;
  letter-spacing: 0.1em;
  width: 8rem;
}
</style>
