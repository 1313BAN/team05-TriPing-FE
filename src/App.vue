<script setup>
import MenuBar from './components/MenuBar.vue'
import { watch } from 'vue'
import { useDevStore } from '@/stores/devStore'
import { startGlobalGeolocation, stopGlobalGeolocation } from '@/composables/useGlobalGeolocation'

const devStore = useDevStore()

watch(
  () => devStore.devMode,
  (newVal) => {
    stopGlobalGeolocation()
    startGlobalGeolocation()
  },
  { immediate: true }
)
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
