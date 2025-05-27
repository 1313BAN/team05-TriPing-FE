<template>
    <div
      class="w-full flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-100 rounded-2xl transition"
      @click="$emit('click', item)"
    >
      <div class="w-22 h-22 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
        <img
          :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : defaultImage"
          alt="추천 이미지"
          class="object-cover w-full h-full"
        />
      </div>
      <div class="text-left flex-1">
        <h3 class="font-bold md:text-base text-sm">{{ item.title }}</h3>
        <p class="text-gray-400 md:text-sm text-[11px] my-1">{{ item.address }}</p>
        <p class="md:text-sm text-[11px]">{{ item.reason }}</p>
        <p class="text-primary md:text-sm text-xs font-semibold mt-1">추천도: {{ item.score }}%</p>
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
  
  