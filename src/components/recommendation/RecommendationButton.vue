<template>
  <transition name="fade-up" appear>
    <Button
      v-if="visible"
      :class="`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50
               font-semibold text-white text-md w-32 py-2 rounded-xl shadow-md border-0
               bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-sub)]
               transition-transform duration-200 hover:scale-105 ${shakeClass}`"
      @click="handleClick"
    >
      AI 추천 명소
    </Button>
  </transition>

  <RecommendationDrawer v-model:visible="showDrawer" @item-click="handleItemClick"/>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { useUiStore } from '@/stores/uiStore'
import RecommendationDrawer from './RecommendationDrawer.vue'

const shakeClass = ref('')
const showDrawer = ref(false)

const enteredZoneStore = useEnteredZoneStore()
const { isEntered } = storeToRefs(enteredZoneStore)
const emit = defineEmits(['move-to-location'])

const uiStore = useUiStore()

const visible = ref(false)
let timeout = null
let shakeInterval = null

function setupRecommendationTimer() {
  clearTimeout(timeout)
  if (!isEntered.value) {
    timeout = setTimeout(() => {
      if (!isEntered.value) {
        visible.value = true
      }
    }, 5000)
  } else {
    visible.value = false
  }
}

function triggerShakeEffect() {
  shakeClass.value = 'shake'
  setTimeout(() => {
    shakeClass.value = ''
  }, 400)
}

function handleClick() {
  showDrawer.value = true
  uiStore.openRecommendDrawer()
}

const handleItemClick = (locationData) => {
  console.log('🗺️ 지도 이동 요청:', locationData)
  
  // 부모 컴포넌트(DynamicMap)로 위치 정보 전달
  emit('move-to-location', locationData)
  showDrawer.value = false
  uiStore.closeRecommendDrawer()  // ✅ 추가
}

watch(visible, (newVal) => {
  if (newVal) {
    shakeInterval = setInterval(triggerShakeEffect, 1500)
  } else {
    clearInterval(shakeInterval)
    shakeClass.value = ''
  }
})

watch(isEntered, setupRecommendationTimer)
onMounted(setupRecommendationTimer)
</script>

<style scoped>
@keyframes shake-x2 {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-6px); }
}
.shake {
  animation: shake-x2 0.4s ease;
}
</style>
