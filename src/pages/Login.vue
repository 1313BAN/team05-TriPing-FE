<template>
  <div class="h-full flex items-center justify-center">
    <div class="w-full max-w-sm p-6 bg-white rounded-lg">
      <!-- 제목 + 설명 -->
      <h2 class="text-2xl font-bold text-center mb-2">더 편한 여행을 원하시나요?</h2>
      <p class="text-gray-500 text-center mb-10">
        자동으로 안내하고, 기록하는 스마트 여행 서비스
      </p>

      <!-- 이메일 입력 -->
      <div class="mb-4">
        <label class="block text-sm mb-1">이메일</label>
        <InputText v-model="email" class="w-full" />
        <p v-if="email && !isEmailValid" class="text-red-500 text-xs mt-1">
          올바른 이메일 형식을 입력해주세요.
        </p>
      </div>

      <!-- 비밀번호 입력 -->
      <div class="mb-4">
        <label class="text-sm block mb-1">비밀번호</label>
        <Password
          v-model="password"
          toggleMask
          class="w-full"
          inputClass="w-full"
          :feedback="false"
        />
        <p v-if="password && !isPasswordValid" class="text-red-500 text-xs mt-1">
          영문자와 숫자를 포함한 8~20자 비밀번호여야 합니다.
        </p>
      </div>

      <!-- 자동 로그인 -->
      <!-- <div class="mb-4 flex items-center">
        <Checkbox v-model="rememberMe" :binary="true" inputId="remember" />
        <label for="remember" class="ml-2 text-sm text-gray-600">자동 로그인</label>
      </div> -->

      <!-- 로그인 실패 메시지 -->
      <div v-if="loginFailMessage" class="text-red-500 text-sm mb-4 text-center">
        {{ loginFailMessage }}
      </div>

      <!-- 로그인 버튼 -->
      <Button label="로그인" class="btn-primary w-full" @click="handleLogin" />

      <!-- 하단 링크 -->
      <div class="flex justify-between text-sm mt-4 text-blue-600">
        <a
          href="#"
          class="pointer-events-none text-gray-400 hover:underline opacity-0 cursor-default"
        >
          비밀번호 찾기
        </a>
        <RouterLink to="/signup" class="hover:underline">회원가입</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { RouterLink } from 'vue-router'
import { login } from '@/api/auth'
import { getMyInfo } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loginFailMessage = ref('')
const userStore = useUserStore()

const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/

const isEmailValid = computed(() => EMAIL_REGEX.test(email.value))
const isPasswordValid = computed(() => PASSWORD_REGEX.test(password.value))

const handleLogin = async () => {
  loginFailMessage.value = ''

  if (!isEmailValid.value || !isPasswordValid.value) return

  try {
    const response = await login(email.value, password.value)

    const authHeader = response.headers['authorization'] || response.headers['Authorization']

    if (response.status === 200 && authHeader) {
      const token = authHeader.replace('Bearer ', '')

      localStorage.setItem('accessToken', token)
      const res = await getMyInfo()
      userStore.setUser(res.data)

      router.push('/')
    } else {
      // 상태 코드가 200이 아니면 message 표시
      loginFailMessage.value = response.data?.message || '로그인에 실패했습니다.'
    }
  } catch (error) {
    // 서버에서 에러 메시지를 보내는 경우 처리
    const serverMessage = error.response?.data?.message
    loginFailMessage.value = serverMessage || '서버 오류가 발생했습니다.'
  }
}

</script>
