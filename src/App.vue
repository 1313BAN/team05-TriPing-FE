<script setup>
import MenuBar from './components/MenuBar.vue'
import { watch, onMounted } from 'vue'
import { useDevStore } from '@/stores/devStore'
import { useLocationStore } from '@/stores/locationStore'
import { storeToRefs } from 'pinia'
import { startGlobalGeolocation, stopGlobalGeolocation } from '@/composables/useGlobalGeolocation'
import { useGeoFenceChecker } from '@/composables/useGeoFenceChecker'
import { getCurrentPositionFromStore } from '@/composables/useLocationUtils' // 현재 위치 getter

// 💡 dev 모드 대응
const devStore = useDevStore()

// ✅ 위치 추적 (이미 잘 되어 있음)
watch(
  () => devStore.devMode,
  (newVal) => {
    stopGlobalGeolocation()
    startGlobalGeolocation()
  },
  { immediate: true }
)

// ✅ 지오펜싱 감지 전역 실행 (추가된 부분)
const { lat, lng } = storeToRefs(useLocationStore())
const { startChecking } = useGeoFenceChecker()

onMounted(() => {
  startChecking(() => getCurrentPositionFromStore(lat, lng))
})
</script>

<template>
  <div class="h-screen flex flex-col md:justify-center">
    <div class="hidden md:block fixed top-0 left-0 p-4 z-50">
      <h1 class="text-2xl font-extrabold p-2 text-primary">TriPing.</h1>
    </div>

    <MenuBar />

    <div class="max-w-4xl md:w-2/3 md:h-4/5 w-full h-[calc(100vh-64px)] mx-auto border-gray-200">
      <router-view />
    </div>
  </div>
</template>
