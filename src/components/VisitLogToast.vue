<template>
  <Toast />
</template>

<script setup>
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { defineExpose } from 'vue'
import { formatDurationToReadable } from '@/utils/formatDuration'

const toast = useToast()

function show(attractionName, durationMs) {
  const durationText = formatDurationToReadable(durationMs)

  toast.add({
    summary: '여행 기록을 저장했어요',
    detail: `${attractionName}에서 ${durationText} 동안 머물렀어요.`,
    life: 3000
  })
}

defineExpose({ show })
</script>
