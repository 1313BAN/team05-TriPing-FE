//DynamicMap.vue

<script setup>
import { onMounted, watch, ref } from 'vue'
import { useLocationStore } from '@/stores/locationStore'
import { storeToRefs } from 'pinia'
import { getMarkersInViewport } from '@/api/attraction'
import { setMockMarker } from '@/composables/useGlobalGeolocation'
import MyLocationButton from '@/components/MyLocationButton.vue'
import SearchButton from './SearchButton.vue'
import SearchByViewportButton from './SearchByViewportButton.vue'
import AttractionToggleButton from './AttractionToggleButton.vue'
import {
  renderMarkersOnMap,
  createMyLocationMarkerElement
} from '@/composables/useMapMarkers'


const { lat, lng } = storeToRefs(useLocationStore())

let map = null
let myMarker = null
const otherMarkers = ref([])
const showAttractionPins = ref(true)
const showSearchButton = ref(false)

function toggleAttractionPins() {
  showAttractionPins.value = !showAttractionPins.value
  showSearchButton.value = false
  otherMarkers.value.forEach(m => m.setMap(null))

  if (showAttractionPins.value) {
    loadMarkers()
  }
}

function initMap() {
  map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(lat.value, lng.value),
    zoom: 16,
    keyboardShortcuts: false
  })
  window.map = map

  myMarker = new naver.maps.Marker({
    position: new naver.maps.LatLng(lat.value, lng.value),
    map: map,
    icon: {
      content: createMyLocationMarkerElement(),
      size: new naver.maps.Size(32, 32),
      anchor: new naver.maps.Point(16, 32)
    },
    zIndex: 999999,
    title: '내 위치'
  })

  setMockMarker(myMarker)

  map.addListener('dragend', () => {
    if (showAttractionPins.value) showSearchButton.value = true
  })
  map.addListener('zoom_changed', () => {
    if (showAttractionPins.value) showSearchButton.value = true
  })

  loadMarkers()
}

function updateMyMarker(newLat, newLng) {
  if (myMarker && map) {
    const pos = new naver.maps.LatLng(newLat, newLng)
    myMarker.setPosition(pos)
  }
}

watch([lat, lng], ([newLat, newLng]) => {
  if (!map && newLat && newLng) {
    initMap()
  } else {
    updateMyMarker(newLat, newLng)
  }
})

onMounted(() => {
  if (window.naver && lat.value && lng.value) {
    initMap()
  }
})

async function loadMarkers() {
  if (!showAttractionPins.value) return

  const bounds = map.getBounds()
  const sw = bounds.getSW()
  const ne = bounds.getNE()
  const zoom = map.getZoom()

  const lat1 = sw.y
  const lat2 = ne.y
  const lng1 = sw.x
  const lng2 = ne.x

  try {
    const res = await getMarkersInViewport({ lat1, lat2, lng1, lng2, zoomLevel: zoom })
    otherMarkers.value.forEach(m => m.setMap(null))
    otherMarkers.value = renderMarkersOnMap(res.data, map, myMarker, showAttractionPins.value)
    showSearchButton.value = false

    if (myMarker) {
      myMarker.setMap(null)
      myMarker.setMap(map)
    }
  } catch (err) {
    console.error('마커 불러오기 실패', err)
  }
}

function handleSearchCurrentMap() {
  loadMarkers()
}
</script>

<template>
  <div class="w-full h-full relative">
    <div id="map" class="w-full h-full md:border-1 md:border-gray-200 md:rounded-3xl"></div>
    <MyLocationButton />
    <SearchButton />
    <SearchByViewportButton :show="showAttractionPins && showSearchButton" @search="handleSearchCurrentMap" />
    <AttractionToggleButton :modelValue="showAttractionPins" @update:modelValue="toggleAttractionPins" />
  </div>
</template>
