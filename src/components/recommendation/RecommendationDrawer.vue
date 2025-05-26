<template>
  <transition name="slide" appear>
    <div v-if="visible" class="absolute bottom-0 left-0 right-0 z-[9999]">
      <!-- Drawer -->
      <div
        class="bg-white rounded-t-2xl w-full h-[300px] flex flex-col justify-between text-center relative px-6 py-4"
        style="
          box-shadow:
            0 -4px 6px -1px rgba(0, 0, 0, 0.1),
            0 -2px 4px -2px rgba(0, 0, 0, 0.1);
        "
      >
        <!-- 텍스트 영역 -->
        <div class="flex-1 flex flex-col justify-center">
          <h2 class="md:text-2xl text-xl font-bold">AI 관광지 추천</h2>
<p class="text-gray-600 leading-relaxed md:text-base text-sm mt-3">
  현재 위치와 방문 이력을 분석했어요 🤖<br />
  다음 행선지는 <strong class="font-semibold">AI가 추천하는 곳</strong>으로 떠나보세요!<br />
</p>
        </div>

        <!-- 버튼 영역 -->
        <div class="flex flex-col items-center gap-3 pb-4">
          <Button
            label="시작하기"
            class="btn-primary w-[80%] md:text-lg text-base"
            @click="recommend"
            :loading="loading"
          ></Button>
          <Button
            label="닫기"
            severity="secondary"
            class="w-[80%] md:text-lg text-base"
            @click="closeDrawer"
          ></Button>
        </div>
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