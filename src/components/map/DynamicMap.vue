<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLocationStore } from '@/stores/locationStore'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { useUiStore } from '@/stores/uiStore'
import { drawGeoPolygon, fadeOutPolygon } from '@/composables/geofence/useMapPolygons'
import { useMapController } from '@/composables/map/useMapController'
import RecommendationButton from '@/components/recommendation/RecommendationButton.vue'
import MyLocationButton from '@/components/map/MyLocationButton.vue'
import SearchByViewportButton from './SearchByViewportButton.vue'
import AttractionToggleButton from './AttractionToggleButton.vue'
import GeoFenceDrawer from '@/components/map/GeoFenceDrawer.vue'

const router = useRouter()

const { lat, lng } = storeToRefs(useLocationStore())
const enteredZoneStore = useEnteredZoneStore()
const uiStore = useUiStore()
const { isRecommendDrawerOpen } = storeToRefs(uiStore)
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
const buttonOffset = computed(() => (drawerVisible.value || isRecommendDrawerOpen.value ? 310 : 24))

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
  // 페이지 진입 시 추천 드로어 상태 초기화
  if (isRecommendDrawerOpen.value) {
    uiStore.closeRecommendDrawer() // 또는 적절한 메소드명
  }

  if (window.naver && lat.value && lng.value) {
    initMap()
  }
  if (map.value) {
    if (isEntered.value && polygonData.value) {
      geoPolygonRef.value = drawGeoPolygon(
        map.value,
        polygonData.value,
        geoPolygonRef.value,
        'parent'
      )
    }

    if (enteredSub.value) {
      subPolygonRef.value = drawGeoPolygon(
        map.value,
        enteredSub.value.subPolygonJson,
        subPolygonRef.value,
        'sub'
      )
    }
  }
})

// 페이지를 떠날 때도 상태 정리
onUnmounted(() => {
  if (isRecommendDrawerOpen.value) {
    uiStore.closeRecommendDrawer()
  }
})
</script>

<template>
  <div class="w-full h-full relative md:rounded-3xl">
    <div id="map" class="w-full h-full md:border-1 md:border-gray-200 md:rounded-3xl">
      <MyLocationButton :offsetBottom="buttonOffset" />
      <SearchByViewportButton
        :show="showAttractionPins && showSearchButton"
        @search="handleSearchCurrentMap"
      />
      <AttractionToggleButton
        :modelValue="showAttractionPins"
        @update:modelValue="toggleAttractionPins"
      />
      <GeoFenceDrawer />
      <RecommendationButton />
    </div>
  </div>
</template>
