<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const isActive = computed(() => props.modelValue)

function toggle() {
  emit('update:modelValue', !isActive.value)
}
</script>

<template>
  <div class="absolute top-4 left-4 z-30">
    <button
      @click="toggle"
      :class="[
        'cursor-pointer px-3 py-2 rounded-4xl shadow text-sm font-medium border transition duration-150 bg-white',
        isActive ? 'border-primary text-primary' : 'border-gray-300 text-gray-800 hover:bg-gray-100'
      ]"
    >
      📍 모든 관광지
    </button>
  </div>
</template>
