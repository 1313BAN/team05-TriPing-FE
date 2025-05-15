<script setup>
import { onMounted, watch } from 'vue'
import { useLocationStore } from '../stores/locationStore'
import { storeToRefs } from 'pinia'
import { setMockMarker } from '@/composables/useGlobalGeolocation'
import MyLocationButton from '@/components/MyLocationButton.vue'

const { lat, lng } = storeToRefs(useLocationStore())

let map = null
let marker = null

onMounted(() => {
  if (window.naver && lat.value && lng.value) {
    initMap()
  }

  watch([lat, lng], ([newLat, newLng]) => {
    if (!map && newLat && newLng) {
      initMap()
    }
    updateMarker(newLat, newLng)
  })
})

function initMap() {
  const mapOptions = {
    center: new naver.maps.LatLng(lat.value, lng.value),
    zoom: 18,
    keyboardShortcuts: false
  }
  map = new naver.maps.Map('map', mapOptions)
  window.map = map // ✅ 전역 등록

  marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(lat.value, lng.value),
    map: map
  })

  setMockMarker(marker)
}

function updateMarker(newLat, newLng) {
  if (marker && map) {
    const position = new naver.maps.LatLng(newLat, newLng)
    marker.setPosition(position)
    // map.setCenter(position) ← 끊김 방지로 주석 처리
  }
}
</script>

<template>
  <div class="w-full h-full relative">
    <div id="map" class="w-full h-full md:border-1 md:border-gray-200 md:rounded-3xl"></div>
    <MyLocationButton />
  </div>
</template>
