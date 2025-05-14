<!-- <script setup>
import { onMounted, watch } from 'vue'
import { useLocationStore } from '../stores/locationStore'
import { storeToRefs } from 'pinia'

const { lat, lng } = storeToRefs(useLocationStore())

let map = null
let marker = null

onMounted(() => {
  // wait for lat/lng to be ready
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
    zoom: 18,
  }
  map = new naver.maps.Map('map', mapOptions)

  marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(lat.value, lng.value),
    map: map,
  })
}

function updateMarker(newLat, newLng) {
  if (marker && map) {
    const position = new naver.maps.LatLng(newLat, newLng)
    marker.setPosition(position)
    map.setCenter(position)
  }
}
</script>

<template>
  <div id="map" class="w-40 h-40"></div>
</template> -->

<script setup>
import { onMounted, watch } from 'vue'
import { useLocationStore } from '../stores/locationStore'
import { storeToRefs } from 'pinia'

const { lat, lng } = storeToRefs(useLocationStore())

let map = null
let marker = null

onMounted(() => {
  console.log('[NAVER] onMounted 진입', window.naver)

  if (window.naver && lat.value && lng.value) {
    console.log('[NAVER] 조건 충족 - initMap 호출')
    initMap()
  }

  // 위치 변경 감지하여 지도 초기화 및 마커 이동
  watch([lat, lng], ([newLat, newLng]) => {
    console.log('[WATCH] 위치 변경됨:', newLat, newLng)

    if (!map && newLat && newLng) {
      console.log('[WATCH] 지도 아직 없어서 initMap 재호출')
      initMap()
    }
    updateMarker(newLat, newLng)
  })
})

function initMap() {
  console.log('[NAVER] initMap 호출됨, 위치:', lat.value, lng.value)

  const mapOptions = {
    center: new naver.maps.LatLng(lat.value, lng.value),
    zoom: 18,
  }
  map = new naver.maps.Map('map', mapOptions)

  marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(lat.value, lng.value),
    map: map,
  })
}

function updateMarker(newLat, newLng) {
  console.log('[NAVER] updateMarker 호출됨:', newLat, newLng)

  if (marker && map) {
    const position = new naver.maps.LatLng(newLat, newLng)
    marker.setPosition(position)
    map.setCenter(position)
  }
}
</script>

<template>
  <div id="map" class="w-full h-full"></div>
</template>
