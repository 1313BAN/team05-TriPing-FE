<template>
  <transition name="slide" appear>
    <div v-if="visible" class="absolute inset-0 z-[9999] flex flex-col justify-end">
      <!-- 오버레이 -->
      <div class="flex-1" @click.self="closeDrawer"></div>

      <!-- Drawer -->
      <div
        class="bg-white rounded-t-2xl w-full h-[300px] p-6 text-center"
        style="
          box-shadow:
            0 -4px 6px -1px rgba(0, 0, 0, 0.1),
            0 -2px 4px -2px rgba(0, 0, 0, 0.1);
        "
      >
        <h2 class="text-xl font-bold mb-3">AI 관광지 추천</h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          현재 위치와 방문 기록을 바탕으로<br />
          지금 가장 적합한 관광지를 AI가 분석하여 추천해드립니다.
        </p>
        <Button
          label="추천받기"
          class="btn-primary w-[80%] mx-auto"
          @click="recommend"
          :loading="loading"
        ></Button>
      </div>
    </div>
  </transition>
</template>


<script setup>
import { ref } from 'vue'
import { useUiStore } from '@/stores/uiStore'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const loading = ref(false)
const uiStore = useUiStore()

const recommend = async () => {
  loading.value = true
  try {
    await new Promise((r) => setTimeout(r, 1500))
    console.log('추천 완료!')
    emit('update:visible', false)
    uiStore.closeRecommendDrawer()
  } finally {
    loading.value = false
  }
}

const closeDrawer = () => {
  emit('update:visible', false)
  uiStore.closeRecommendDrawer()
}
</script>

<style scoped>
/* 슬라이드 업/다운 애니메이션 */
.slide-enter-from {
  transform: translateY(100%);
}
.slide-enter-to {
  transform: translateY(0%);
}
.slide-leave-from {
  transform: translateY(0%);
}
.slide-leave-to {
  transform: translateY(100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
</style>
