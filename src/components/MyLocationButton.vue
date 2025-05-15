<script setup>
import { useLocationStore } from '@/stores/locationStore'
import gpsIcon from '../assets/icons/gps.png'
const store = useLocationStore()

function centerToCurrentLocation() {
  if (!window.naver || !window.map) return
  const { lat, lng } = store
  if (lat && lng) {
    const position = new naver.maps.LatLng(lat, lng)
    window.map.panTo(position)
  }
}
</script>

<template>
  <button
    class="absolute bottom-6 left-6 bg-white rounded-full p-3 border border-gray-200 shadow-md z-50 transition hover:cursor-pointer"
    @click="centerToCurrentLocation"
  >
    <img :src="gpsIcon" alt="내 위치" class="w-8" />
  </button>
</template>
