<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLocationStore } from '@/stores/locationStore'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { useUiStore } from '@/stores/uiStore'
import { drawGeoPolygon, fadeOutPolygon } from '@/composables/geofence/useMapPolygons'
import { useMapController } from '@/composables/map/useMapController'
import { useRecommendationController } from '@/composables/recommendation/useRecommendationController'
import RecommendationButton from '@/components/recommendation/RecommendationButton.vue'
import MyLocationButton from '@/components/map/MyLocationButton.vue'
import SearchByViewportButton from './SearchByViewportButton.vue'
import AttractionToggleButton from './AttractionToggleButton.vue'
import GeoFenceDrawer from '@/components/map/GeoFenceDrawer.vue'
import NavigationEndToast from '@/components/recommendation/NavigationEndToast.vue'


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

const {
  moveToLocation,
  stopNavigation,
  isNavigating,
  updateRouteLineIfNeeded
} = useRecommendationController(map, lat, lng)

const geoPolygonRef = ref(null)
const subPolygonRef = ref(null)
const navigationToastRef = ref(null)

const drawerVisible = computed(() => isEntered.value)
const buttonOffset = computed(() => (drawerVisible.value || isRecommendDrawerOpen.value ? 310 : 24))

watch([lat, lng], ([newLat, newLng]) => {
  if (!map.value && newLat && newLng) {
    initMap()
  } else {
    updateMarker(newLat, newLng)
    updateRouteLineIfNeeded(newLat, newLng)
  }
})


watch([isEntered, polygonData], ([entered, data]) => {
  if (entered && data && map.value) {
    // 폴리곤 렌더링
    geoPolygonRef.value = drawGeoPolygon(map.value, data, geoPolygonRef.value, 'parent')

    // 안내 중지
    if (isNavigating.value) {
      navigationToastRef.value?.show()
      stopNavigation()
    }
  } else if (!entered && geoPolygonRef.value) {
    // 폴리곤 제거
    fadeOutPolygon(geoPolygonRef.value)
    geoPolygonRef.value = null
  }
})


// 서브 관광지 진입 시 서브 폴리곤
watch(enteredSub, (sub) => {
  if (sub && map.value) {
    subPolygonRef.value = drawGeoPolygon(map.value, sub.subPolygonJson, subPolygonRef.value, 'sub')
  } else if (!sub && subPolygonRef.value) {
    fadeOutPolygon(subPolygonRef.value)
    subPolygonRef.value = null
  }
})

// 최초 진입 시 지도 초기화 및 폴리곤 렌더링
onMounted(() => {
  if (isRecommendDrawerOpen.value) uiStore.closeRecommendDrawer()

  if (window.naver && lat.value && lng.value) initMap()

  if (map.value) {
    if (isEntered.value && polygonData.value) {
      geoPolygonRef.value = drawGeoPolygon(map.value, polygonData.value, geoPolygonRef.value, 'parent')
    }

    if (enteredSub.value) {
      subPolygonRef.value = drawGeoPolygon(map.value, enteredSub.value.subPolygonJson, subPolygonRef.value, 'sub')
    }
  }
})

// 페이지 떠날 때 정리
onUnmounted(() => {
  if (isRecommendDrawerOpen.value) uiStore.closeRecommendDrawer()
  stopNavigation()
})
</script>

<template>
  <div class="w-full h-full relative md:rounded-3xl">
    <div id="map" class="w-full h-full md:border-1 md:border-gray-200 md:rounded-3xl">
      <NavigationEndToast ref="navigationToastRef" />
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

      <!-- 💡 추천 장소 이동 및 안내 -->
      <RecommendationButton
        v-if="!isNavigating"
        @move-to-location="moveToLocation"
      />
      

      <!-- 안내 중지 버튼 -->
      <transition name="fade-up">
        <button
          v-if="isNavigating"
          @click="stopNavigation"
          class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50
                 bg-red-500 hover:bg-red-600 text-white font-semibold
                 px-6 py-3 rounded-full shadow-lg border-0
                 transition-all duration-200 hover:scale-105
                 flex items-center gap-2"
        >
          <span class="text-lg">🛑</span>
          안내 중지
        </button>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px); /* 아래에서 올라오도록 */
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px); /* 아래로 내려가며 사라짐 */
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

</style>
