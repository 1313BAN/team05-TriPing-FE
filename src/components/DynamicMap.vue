<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useLocationStore } from '@/stores/locationStore'
import GeoFenceDrawer from '@/components/GeoFenceDrawer.vue'
import { computed } from 'vue'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { storeToRefs } from 'pinia'
import { useGeoFenceChecker } from '@/composables/useGeoFenceChecker'
import { setMockMarker } from '@/composables/useGlobalGeolocation'
import { drawGeoPolygon, fadeOutPolygon } from '@/composables/useMapPolygons'
import { getCurrentPositionFromStore } from '@/composables/useLocationUtils'
import MyLocationButton from '@/components/MyLocationButton.vue'
import SearchButton from './SearchButton.vue'
import SearchByViewportButton from './SearchByViewportButton.vue'
import AttractionToggleButton from './AttractionToggleButton.vue'
import {
  updateMyMarkerPosition,
  loadAttractionMarkers
} from '@/composables/useMapMarkers'
import { useRouter } from 'vue-router' 


const { lat, lng } = storeToRefs(useLocationStore())
const enteredZoneStore = useEnteredZoneStore()
const { isEntered, polygonData, enteredSubAttractionId, parsedSubAttractions } =
  storeToRefs(enteredZoneStore)
const router = useRouter()
const enteredSub = computed(() =>
  parsedSubAttractions.value.find((sub) => sub.no === enteredSubAttractionId.value)
)

let map = null
let myMarker = null
const geoPolygonRef = ref(null)
const subPolygonRef = ref(null)
const otherMarkers = ref([])
const showAttractionPins = ref(false)
const showSearchButton = ref(false)
const { startChecking, stopChecking } = useGeoFenceChecker()

// 버튼 위치 조정
const drawerVisible = computed(() => useEnteredZoneStore().isEntered)
const buttonOffset = computed(() => (drawerVisible.value ? 310 : 24))

function toggleAttractionPins() {
  showAttractionPins.value = !showAttractionPins.value
  showSearchButton.value = false
  otherMarkers.value.forEach(({ marker }) => {
  marker.setMap(null)
})

  if (showAttractionPins.value) {
    loadAttractionMarkers({
      map,
      myMarker,
      setMarkersRef: otherMarkers,
      showSearchButtonRef: showSearchButton,
      router
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
    url: '/assets/icons/gps.png',
    size: new naver.maps.Size(32, 32),
    anchor: new naver.maps.Point(16, 32),
    scaledSize: new naver.maps.Size(32, 32) // 고해상도 디스플레이 대응
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
      showSearchButtonRef: showSearchButton,
      router
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

watch([isEntered, polygonData], ([entered, data]) => {
  if (entered && data && map) {
    geoPolygonRef.value = drawGeoPolygon(map, data, geoPolygonRef.value, 'parent')
  } else if (!entered && geoPolygonRef.value) {
    fadeOutPolygon(geoPolygonRef.value)
    geoPolygonRef.value = null
  }
})

watch(enteredSub, (sub) => {
  if (sub && map) {
    subPolygonRef.value = drawGeoPolygon(map, sub.subPolygonJson, subPolygonRef.value, 'sub')
  } else if (!sub && subPolygonRef.value) {
    fadeOutPolygon(subPolygonRef.value)
    subPolygonRef.value = null
  }
})

onMounted(() => {
  if (window.naver && lat.value && lng.value) {
    initMap()
    startChecking(() => getCurrentPositionFromStore(lat, lng))
  }

  if (isEntered.value && polygonData.value && map) {
    geoPolygonRef.value = drawGeoPolygon(map, polygonData.value, geoPolygonRef.value, 'parent')
  }

  if (enteredSub.value && map) {
    subPolygonRef.value = drawGeoPolygon(
      map,
      enteredSub.value.subPolygonJson,
      subPolygonRef.value,
      'sub'
    )
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
  <div class="w-full h-full relative md:border-1 md:border-gray-200 md:rounded-3xl">
    <div id="map" class="w-full h-full md:border-1 md:border-gray-200 md:rounded-3xl">
      <MyLocationButton :offsetBottom="buttonOffset" />
      <SearchButton :offsetBottom="buttonOffset" />
      <SearchByViewportButton
        :show="showAttractionPins && showSearchButton"
        @search="handleSearchCurrentMap"
      />
      <AttractionToggleButton
        :modelValue="showAttractionPins"
        @update:modelValue="toggleAttractionPins"
      />
      <GeoFenceDrawer />
    </div>
  </div>
</template>
