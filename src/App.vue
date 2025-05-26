<script setup>
import MenuBar from './components/MenuBar.vue'
import VisitLogToast from '@/components/VisitLogToast.vue'
import VisitPrefModal from '@/components/VisitPrefModal.vue'
import { ref, onMounted, watch } from 'vue'
import { useDevStore } from '@/stores/devStore'
import { useLocationStore } from '@/stores/locationStore'
import { storeToRefs } from 'pinia'
import { startGlobalGeolocation, stopGlobalGeolocation } from '@/composables/useGlobalGeolocation'
import { getCurrentPositionFromStore } from '@/composables/useLocationUtils'
import { useGeoFenceChecker } from '@/composables/useGeoFenceChecker'
import { useVisitTracker } from '@/composables/visit/useVisitTracker'
import { useVisitPrefController } from '@/composables/visit/useVisitPrefController'

// 상태 직접 선언
const visitPrefVisible = ref(false)
const visitPrefId = ref(null)
const visitPrefTitle = ref('')

const devStore = useDevStore()
const toastRef = ref()

// useVisitPrefController에 상태 전달
const { handleSubmit, init } = useVisitPrefController(visitPrefVisible, visitPrefId, visitPrefTitle)

watch(
  () => devStore.devMode,
  () => {
    stopGlobalGeolocation()
    startGlobalGeolocation()
  },
  { immediate: true }
)

watch(visitPrefVisible, (val) => {
  console.log('[App.vue] visitPrefVisible changed:', val)
})

const { lat, lng } = storeToRefs(useLocationStore())
const { startChecking } = useGeoFenceChecker()

onMounted(() => {
  startChecking(() => getCurrentPositionFromStore(lat, lng))

  const tracker = useVisitTracker()
  tracker.setToastRef(toastRef)
  init(tracker) // 모달 오픈 트리거 등록
})
</script>

<template>
  <VisitLogToast ref="toastRef" />
  <VisitPrefModal
    :visible="visitPrefVisible"
    @update:visible="visitPrefVisible = $event"
    :visit-log-id="visitPrefId"
    :title="visitPrefTitle"
    @submit="handleSubmit"
  />

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
