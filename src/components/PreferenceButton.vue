<!-- src/components/PreferenceButton.vue -->
<template>
  <Button class="btn-sub transition-none text-xs px-3 py-2" @click="$emit('click')">
    {{ label }}
  </Button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  }
})
</script>
