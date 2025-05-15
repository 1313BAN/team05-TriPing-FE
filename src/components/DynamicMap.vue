<script setup>
import { onMounted, watch } from 'vue'
import { useLocationStore } from '../stores/locationStore'
import { storeToRefs } from 'pinia'
import { setMockMarker } from '@/composables/useGlobalGeolocation'

const { lat, lng } = storeToRefs(useLocationStore())

let map = null
let marker = null

onMounted(() => {
  if (window.naver && lat.value && lng.value) {
    initMap()
  }

  // 초기화 딜레이 방지: lat/lng 변경될 때마다 체크
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
    zoom: 18
  }
  map = new naver.maps.Map('map', mapOptions)

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
    // map.setCenter(position)
  }
}
</script>

<template>
  <div id="map" class="w-full h-full md:border-1 md:border-gray-200 md:rounded-3xl"></div>
</template>
