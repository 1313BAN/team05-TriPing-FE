<!-- components/recommendation/NavigationEndToast.vue -->
<template>
    <Toast />
  </template>
  
  <script setup>
  import Toast from 'primevue/toast'
  import { useToast } from 'primevue/usetoast'
  import { formatDurationToReadable } from '@/utils/formatDuration'
  
  const toast = useToast()
  
  function show() {
  
    toast.add({
      severity: 'info',
      summary: '안내 종료',
      detail: '특정 관광지에 진입하여 종료합니다.',
      life: 3000
    })
  }
  
  defineExpose({ show })
  </script>
  