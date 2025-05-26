<template>
    <div
      class="w-full flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-200 rounded-2xl transition"
      @click="$emit('click', item)"
    >
      <div class="w-22 h-22 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : defaultImage"
          alt="추천 이미지"
          class="object-cover w-full h-full"
        />
      </div>
      <div class="text-left flex-1">
        <h3 class="font-bold text-base">{{ item.title }}</h3>
        <p class="text-gray-500 text-xs mb-1">{{ item.address }}</p>
        <p class="text-xs">{{ item.reason }}</p>
        <p class="text-primary text-sm font-bold mt-1">추천도: {{ item.score }}%</p>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    item: Object
  })
  
  defineEmits(['click'])
  
  // public 폴더 기준 경로
  const defaultImage = '/assets/icons/default_attraction_logo.png'
  </script>
  
  