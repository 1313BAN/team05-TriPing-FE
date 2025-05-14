<script setup>
console.log('[DEBUG] script setup 진입함')
import DynamicMap from '../components/DynamicMap.vue'
import { useGeolocation } from '../composables/useGeolocation'

console.log('[GEO] useGeolocation 호출 시작')
useGeolocation(true, 5)
console.log('[GEO] useGeolocation 호출 완료')
</script>

<template>
  <DynamicMap :zoom="18" />
</template>
