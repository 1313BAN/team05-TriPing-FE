<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLocationStore } from '@/stores/locationStore'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { drawGeoPolygon, fadeOutPolygon } from '@/composables/useMapPolygons'
import { useMapController } from '@/composables/map/useMapController'

import MyLocationButton from '@/components/MyLocationButton.vue'
import SearchButton from './SearchButton.vue'
import SearchByViewportButton from './SearchByViewportButton.vue'
import AttractionToggleButton from './AttractionToggleButton.vue'
import GeoFenceDrawer from '@/components/GeoFenceDrawer.vue'

const router = useRouter()

const { lat, lng } = storeToRefs(useLocationStore())
const enteredZoneStore = useEnteredZoneStore()
const { isEntered, polygonData, enteredSubAttractionId, parsedSubAttractions } =
  storeToRefs(enteredZoneStore)

const enteredSub = computed(() =>
  parsedSubAttractions.value.find((sub) => sub.no === enteredSubAttractionId.value)
)

const {
  map,
  showAttractionPins,
  showSearchButton,
  initMap,
  toggleAttractionPins,
  handleSearchCurrentMap,
  updateMarker
} = useMapController({ router })

const geoPolygonRef = ref(null)
const subPolygonRef = ref(null)

const drawerVisible = computed(() => isEntered.value)
const buttonOffset = computed(() => (drawerVisible.value ? 310 : 24))

watch([lat, lng], ([newLat, newLng]) => {
  if (!map.value && newLat && newLng) {
    initMap()
  } else {
    updateMarker(newLat, newLng)
  }
})

watch([isEntered, polygonData], ([entered, data]) => {
  if (entered && data && map.value) {
    geoPolygonRef.value = drawGeoPolygon(map.value, data, geoPolygonRef.value, 'parent')
  } else if (!entered && geoPolygonRef.value) {
    fadeOutPolygon(geoPolygonRef.value)
    geoPolygonRef.value = null
  }
})

watch(enteredSub, (sub) => {
  if (sub && map.value) {
    subPolygonRef.value = drawGeoPolygon(map.value, sub.subPolygonJson, subPolygonRef.value, 'sub')
  } else if (!sub && subPolygonRef.value) {
    fadeOutPolygon(subPolygonRef.value)
    subPolygonRef.value = null
  }
})

onMounted(() => {
  if (window.naver && lat.value && lng.value) {
    initMap()
  }
  if (map.value) {
    if (isEntered.value && polygonData.value) {
      geoPolygonRef.value = drawGeoPolygon(map.value, polygonData.value, geoPolygonRef.value, 'parent')
    }

    if (enteredSub.value) {
      subPolygonRef.value = drawGeoPolygon(map.value, enteredSub.value.subPolygonJson, subPolygonRef.value, 'sub')
    }
  }
})
</script>

<template>
  <div class="w-full h-full relative md:rounded-3xl">
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
