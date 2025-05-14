<!-- components/DynamicMap.vue -->
<script setup>
defineOptions({ name: 'DynamicMap' })

import { onMounted, ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  lat: { type: Number, default: 37.5665 },
  lng: { type: Number, default: 126.978 },
  zoom: { type: Number, default: 14 }
})

const mapRef = ref(null)
let mapInstance = null

onMounted(() => {
  mapInstance = new naver.maps.Map(mapRef.value, {
    center: new naver.maps.LatLng(props.lat, props.lng),
    zoom: props.zoom
  })
})

onBeforeUnmount(() => {
  mapInstance = null
})
</script>

<template>
  <div
    ref="mapRef"
    class="w-full h-full md:w-[70%] md:h-[80%] mx-auto border-gray-200 md:rounded-3xl overflow-hidden md:shadow-xl"
  ></div>
</template>
