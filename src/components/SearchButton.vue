<script setup>
import searchIcon from '../assets/icons/search.png'
</script>

<template>
  <button
    class="absolute bottom-6 right-6 bg-white rounded-full p-3 border border-gray-200 shadow-md z-50 transition hover:cursor-pointer"
    @click="centerToCurrentLocation"
  >
    <img :src="searchIcon" alt="검색" class="w-8" />
  </button>
</template>
