<script setup>
import { useGeolocationPermission } from '../composables/useGeolocationPermission'
import DynamicMap from '../components/DynamicMap.vue'

const { permissionState, errorMessage, requestPermission } = useGeolocationPermission(5)
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <div v-if="permissionState === 'checking'" class="text-gray-500">위치 권한 상태 확인 중...</div>

    <div v-else-if="permissionState === 'prompt'" class="text-center space-y-4">
      <p class="text-lg">원활한 서비스를 위해 위치 접근 권한이 필요합니다.</p>
      <button
        @click="requestPermission"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        위치 권한 요청하기
      </button>
    </div>

    <div v-else-if="permissionState === 'granted'" class="w-full h-full">
      <DynamicMap :zoom="18" />
    </div>

    <div v-else-if="permissionState === 'denied'" class="text-center px-4 text-red-600">
      <p class="text-lg font-semibold mb-2">서비스를 이용할 수 없습니다</p>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>
