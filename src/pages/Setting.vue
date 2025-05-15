<script setup>
import ToggleSwitch from 'primevue/toggleswitch'
import Divider from 'primevue/divider'
import { useDevStore } from '@/stores/devStore'
import { storeToRefs } from 'pinia'

const devStore = useDevStore()
const { devMode } = storeToRefs(devStore)
</script>

<template>
  <h2 class="text-2xl font-bold text-center mt-8 mb-12">설정</h2>

  <div class="w-4/5 md:w-full mx-auto">
    <div class="flex justify-between items-center">
      <span class="text-lg">개발자 모드</span>
      <ToggleSwitch v-model="devMode" />
    </div>
    <Divider />
  </div>
</template>
