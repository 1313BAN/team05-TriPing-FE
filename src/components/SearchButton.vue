<script setup>
import searchIcon from '../assets/icons/search.png'

// ✔️ 버튼 위치를 외부에서 조절할 수 있도록 prop 정의
const props = defineProps({
  offsetBottom: {
    type: Number,
    default: 24
  }
})
</script>

<template>
  <button
    class="absolute right-6 bg-white rounded-full p-3 border border-gray-200 shadow-md z-50 transition-all duration-300 hover:cursor-pointer"
    :style="{ bottom: `${offsetBottom}px` }"
    @click="$emit('click')"
  >
    <img :src="searchIcon" alt="검색" class="w-8" />
  </button>
</template>
