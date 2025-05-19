<script setup>
import MenuBar from './components/MenuBar.vue'
import { ref, watch, onMounted } from 'vue' // ✅ 생명주기 훅 반드시 포함!
import { useDevStore } from '@/stores/devStore'
import { userStore } from '@/stores/user'       // ✅ 사용자 전역 상태 저장소
import { getMyInfo } from '@/api/user'         // ✅ 사용자 정보 조회 API
import { startGlobalGeolocation, stopGlobalGeolocation } from '@/composables/useGlobalGeolocation'

// 상태 변수
const text = ref('')
const devStore = useDevStore()

// ✅ 앱 시작 시 로그인 토큰 유효성 확인 및 사용자 정보 로드
onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) return // 토큰 없으면 로그인 안한 상태니까 아무것도 안 함

  try {
    const res = await getMyInfo() // /user/me 요청
    userStore.setUser(res.data)   // 응답 받은 사용자 정보 저장
    console.log('✅ 사용자 정보 로드 완료:', res.data)
  } catch (err) {
    console.warn('❌ 유효하지 않은 토큰 → 로그아웃 처리')
    localStorage.removeItem('accessToken') // 잘못된 토큰이면 제거
    userStore.clearUser()                  // 사용자 상태 초기화
  }
})

// ✅ 개발 모드 변경 시 위치 추적 리셋
watch(
  () => devStore.devMode,
  (newVal) => {
    console.log('[devMode 변경]', newVal)
    stopGlobalGeolocation()
    startGlobalGeolocation()
  },
  { immediate: true }
)
</script>

<template>
  <div class="h-screen flex flex-col md:justify-center">
    <!-- 로고 -->
    <div class="hidden md:block fixed top-0 left-0 p-4 z-50">
      <h1 class="text-2xl font-extrabold p-2 text-primary">TriPing.</h1>
    </div>

    <!-- 메뉴바 -->
    <MenuBar />

    <!-- 메인 화면 -->
    <div class="md:w-2/3 md:h-4/5 w-full h-[calc(100vh-64px)] mx-auto border-gray-200">
      <router-view />
    </div>
  </div>
</template>
