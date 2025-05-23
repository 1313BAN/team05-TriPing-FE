<template>
  <transition name="slide-up">
    <div
      v-if="visible"
      class="absolute bottom-0 left-0 w-full z-[9999] bg-white rounded-t-2xl h-[300px] flex flex-col items-center shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
    >
      <!-- h2 중앙 영역 -->
      <div class="flex-1 flex items-center justify-center w-full">
        <h2 class="text-2xl font-bold text-center">{{ attractionTitle }} 안에 있어요</h2>
      </div>

      <!-- 버튼 영역 -->
      <div class="flex flex-col w-full justify-around px-4 gap-5 pb-6">
        <Button
          label="AI 가이드 확인하기"
          class="btn-primary w-[80%] mx-auto text-lg"
          @click="onGuideClick"
        ></Button>
        <Button
          label="관광지 정보 보기"
          severity="secondary"
          class="w-[80%] mx-auto text-lg"
          @click="onInfoClick"
        ></Button>
      </div>
    </div>
  </transition>
</template>


<script setup>
import { storeToRefs } from 'pinia'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { useRouter } from 'vue-router'

const { isEntered, attractionTitle, attractionId } = storeToRefs(useEnteredZoneStore())
const visible = isEntered

const router = useRouter()

function onGuideClick() {
  console.log('AI 가이드 클릭')
}

function onInfoClick() {
  if (!attractionId.value) return
  router.push(`/attraction/${attractionId.value}`)
}
</script>


<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0%);
}
</style>
