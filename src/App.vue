<script setup>
import MenuBar from './components/MenuBar.vue'
import { watch, onMounted, ref } from 'vue'
import { useDevStore } from '@/stores/devStore'
import { useLocationStore } from '@/stores/locationStore'
import { storeToRefs } from 'pinia'
import { startGlobalGeolocation, stopGlobalGeolocation } from '@/composables/useGlobalGeolocation'
import { useGeoFenceChecker } from '@/composables/useGeoFenceChecker'
import { getCurrentPositionFromStore } from '@/composables/useLocationUtils'
import { useVisitTracker } from '@/composables/useVisitTracker'
import VisitLogToast from '@/components/VisitLogToast.vue'

const devStore = useDevStore()
const toastRef = ref()

watch(
  () => devStore.devMode,
  () => {
    stopGlobalGeolocation()
    startGlobalGeolocation()
  },
  { immediate: true }
)

const { lat, lng } = storeToRefs(useLocationStore())
const { startChecking } = useGeoFenceChecker()

onMounted(() => {
  startChecking(() => getCurrentPositionFromStore(lat, lng))

  const tracker = useVisitTracker()
  tracker.setToastRef(toastRef)
})

</script>

<template>
  <Toast />
  <VisitLogToast ref="toastRef" />

  <div class="h-screen flex flex-col md:justify-center">
    <div class="hidden md:block fixed top-0 left-0 p-4 z-50">
      <h1 class="text-2xl font-extrabold p-2 text-primary">TriPing.</h1>
    </div>

    <MenuBar />

    <div class="max-w-4xl md:w-2/3 md:h-4/5 w-full h-[calc(100vh-64px)] mx-auto">
      <router-view />
    </div>
  </div>
</template>
