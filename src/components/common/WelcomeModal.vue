<script setup>
import { ref, onMounted } from 'vue'
import { Button, Dialog } from 'primevue'

// props 정의
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// emit 정의
const emit = defineEmits(['update:visible'])

// 로컬스토리지 키
const FIRST_VISIT_KEY = 'triPing_firstVisit'

// 컴포넌트 마운트 시 처음 방문 여부 확인
onMounted(() => {
  const hasVisited = localStorage.getItem(FIRST_VISIT_KEY)
  if (!hasVisited) {
    emit('update:visible', true)
    // 방문 기록 저장
    localStorage.setItem(FIRST_VISIT_KEY, 'true')
  }
})

// 모달 닫기
const closeModal = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog 
    :visible="visible" 
    @update:visible="(val) => emit('update:visible', val)"
    modal 
    :closable="false"
    :dismissableMask="true"
    header="TriPing 사용 가이드"
    class="w-full max-w-md"
  >
    <div class="space-y-4">
      <div class="text-center">
        <div class="mb-4">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
            개발자 모드 활성화됨
          </div>
        </div>
        
        <div class="space-y-6 text-left">
          <div class="flex items-start space-x-2">
            <span class="text-blue-500 text-lg">🎮</span>
            <div class="space-y-1">
              <p class="font-medium">방향키로 위치 이동</p>
              <p class="text-sm text-gray-600">키보드 방향키로 위치를 이동할 수 있습니다. </p>
            </div>
          </div>

          <div class="flex items-start space-x-2">
            <span class="text-blue-500 text-lg">🚩</span>
            <div class="space-y-1">
              <p class="font-medium">추천 코스</p>
              <p class="text-sm text-gray-600">덕수궁 -> 덕수궁 내부 관광지 -> AI 추천 명소 -> 안내 받기</p>
            </div>
          </div>

          <div class="flex items-start space-x-2">
            <span class="text-orange-500 text-lg">⚙️</span>
            <div class="space-y-1">
              <p class="font-medium">실제 위치로 체험하기</p>
              <p class="text-sm text-gray-600">모바일 기기로 접속 후 개발자 모드를 해제해주세요.</p>
              <p class="text-xs text-gray-500">[더보기 아이콘 -> 개발자 모드 해제]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-center">
        <Button 
          label="시작하기" 
          @click="closeModal"
          class="btn-primary"
        />
      </div>
    </template>
  </Dialog>
</template>
