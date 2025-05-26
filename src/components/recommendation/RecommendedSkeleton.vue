<template>
  <div class="w-full flex items-center gap-4 py-3 animate-pulse">
    <!-- 이미지 자리 -->
    <Skeleton shape="rectangle" width="80px" height="80px" class="rounded-xl" />

    <!-- 텍스트 자리 -->
    <div class="flex-1 space-y-3">
      <Skeleton width="90%" height="18px" />
      <Skeleton width="100%" height="12px" />
      <Skeleton width="60%" height="12px" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton'
</script>
