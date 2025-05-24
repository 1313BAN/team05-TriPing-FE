<script setup>
defineProps({
  show: Boolean
})
defineEmits(['search'])

</script>

<template>
  <div
    v-if="show"
    class="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
  >

  <button
  class="bg-white border text-blue-500 border-blue-500 px-4 py-2 rounded-4xl shadow-md text-sm font-medium hover:bg-gray-100 cursor-pointer flex items-center gap-2"
  @click="$emit('search')"
>
  <i class="pi pi-refresh text-blue-500"></i>
  재검색
</button>

  </div>
</template>
