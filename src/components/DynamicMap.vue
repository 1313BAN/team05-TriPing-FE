<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useLocationStore } from '@/stores/locationStore'
import { storeToRefs } from 'pinia'
import { useGeoFenceChecker } from '@/composables/useGeoFenceChecker'
import { setMockMarker } from '@/composables/useGlobalGeolocation'
import { drawGeoPolygon } from '@/composables/useMapPolygons'
import { getCurrentPositionFromStore } from '@/composables/useLocationUtils'
import MyLocationButton from '@/components/MyLocationButton.vue'
import SearchButton from './SearchButton.vue'
import SearchByViewportButton from './SearchByViewportButton.vue'
import AttractionToggleButton from './AttractionToggleButton.vue'
import {
  renderMarkersOnMap,
  createMyLocationMarkerElement,
  updateMyMarkerPosition,
  loadAttractionMarkers
} from '@/composables/useMapMarkers'

const { lat, lng } = storeToRefs(useLocationStore())

let map = null
let myMarker = null
let geoPolygon = null
const otherMarkers = ref([])
const showAttractionPins = ref(true)
const showSearchButton = ref(false)
const { isInZone, polygonData, startChecking, stopChecking } = useGeoFenceChecker(5)

function toggleAttractionPins() {
  showAttractionPins.value = !showAttractionPins.value
  showSearchButton.value = false
  otherMarkers.value.forEach(m => m.setMap(null))

  if (showAttractionPins.value) {
    loadAttractionMarkers({
      map,
      myMarker,
      setMarkersRef: otherMarkers,
      showSearchButtonRef: showSearchButton
    })
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

  if (showAttractionPins.value) {
    loadAttractionMarkers({
      map,
      myMarker,
      setMarkersRef: otherMarkers,
      showSearchButtonRef: showSearchButton
    })
  }
}

watch([lat, lng], ([newLat, newLng]) => {
  if (!map && newLat && newLng) {
    initMap()
    startChecking(() => getCurrentPositionFromStore(lat, lng))
  } else {
    updateMyMarkerPosition(myMarker, newLat, newLng)
  }
})

watch(polygonData, (newVal) => {
  if (newVal && map) {
    geoPolygon = drawGeoPolygon(map, newVal, geoPolygon)
  } else if (geoPolygon) {
    geoPolygon.setMap(null)
  }
})

onMounted(() => {
  if (window.naver && lat.value && lng.value) {
    initMap()
    startChecking(() => getCurrentPositionFromStore(lat, lng))
  }
})

onUnmounted(() => {
  stopChecking()
})

function handleSearchCurrentMap() {
  loadAttractionMarkers({
    map,
    myMarker,
    setMarkersRef: otherMarkers,
    showSearchButtonRef: showSearchButton
  })
}
</script>

<template>
  <div class="w-full h-full relative">
    <div id="map" class="w-full h-full md:border-1 md:border-gray-200 md:rounded-3xl"></div>
    <MyLocationButton />
    <SearchButton />
    <SearchByViewportButton
      :show="showAttractionPins && showSearchButton"
      @search="handleSearchCurrentMap"
    />
    <AttractionToggleButton
      :modelValue="showAttractionPins"
      @update:modelValue="toggleAttractionPins"
    />
  </div>
</template>
