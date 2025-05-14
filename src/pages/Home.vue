<script setup>
import DynamicMap from '../components/DynamicMap.vue'
import { useGeolocation } from '../composables/useGeolocation'
useGeolocation(true, 5) // 위치 지속 추적, 5m 이상 이동 시 갱신
</script>

<template>
  <DynamicMap :zoom="18" />
</template>