<template>
  <div class="h-full flex items-center justify-center">
    <div class="w-full max-w-sm p-6">
      <h2 class="text-2xl font-bold text-center mb-6">회원가입</h2>

      <!-- 이름 입력 -->
      <div class="mb-4">
        <label class="block text-sm mb-1">이름</label>
        <InputText v-model="name" class="w-full" />
        <p v-if="name && !isNameValid" class="text-red-500 text-xs mt-1">
          이름은 한글 또는 영문 2~20자여야 합니다.
        </p>
      </div>

      <!-- 닉네임 입력 (필수) -->
      <div class="mb-4">
        <label class="block text-sm mb-1">닉네임</label>
        <InputText v-model="nickname" class="w-full" />
        <p v-if="!isNicknameValid" class="text-red-500 text-xs mt-1">
          닉네임은 한글, 영문, 숫자, 공백 포함 2~16자로 입력해주세요.
        </p>
      </div>

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
        <label class="block text-sm mb-1">비밀번호</label>
        <p v-if="password && !isPasswordValid" class="text-red-500 text-xs mb-1">
          영문자와 숫자를 포함한 8~20자 비밀번호여야 합니다.
        </p>
        <Password
          v-model="password"
          toggleMask
          :feedback="true"
          :mediumRegex="MEDIUM_REGEX"
          :strongRegex="STRONG_REGEX"
          class="w-full"
          inputClass="w-full"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div class="mb-4">
        <label class="block text-sm mb-1">비밀번호 확인</label>
        <Password
          v-model="passwordConfirm"
          toggleMask
          :feedback="false"
          class="w-full"
          inputClass="w-full"
        />
        <p v-if="passwordConfirm && passwordConfirm !== password" class="text-red-500 text-xs mt-1">
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <!-- 가입 버튼 -->
      <Button label="회원가입" class="btn-primary w-full" @click="handleSignUp" />

      <!-- 가입 결과 메시지 -->
      <p v-if="signupMessage" class="text-center text-sm mt-4 text-red-500">
        {{ signupMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { getRandomNickname } from '@/utils/nicknameGenerator'

// 입력 상태
const name = ref('')
const nickname = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const signupMessage = ref('')

// 정규표현식
const NAME_REGEX = /^[가-힣a-zA-Z]{2,20}$/
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9\s]{2,16}$/ // 공백 허용
const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/

// 비밀번호 강도 기준 완화
const MEDIUM_REGEX = /^.*(?=.{5,})(?=.*[a-zA-Z])(?=.*\d).*$/
const STRONG_REGEX = /^.*(?=.{7,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/

// 유효성 검사
const isNameValid = computed(() => NAME_REGEX.test(name.value))

const isNicknameValid = computed(() => {
  const trimmed = nickname.value.trim()
  return trimmed.length > 0 && NICKNAME_REGEX.test(trimmed)
})

const isEmailValid = computed(() => EMAIL_REGEX.test(email.value))
const isPasswordValid = computed(() => PASSWORD_REGEX.test(password.value))

// 닉네임 자동 추천
onMounted(() => {
  nickname.value = getRandomNickname()
})

// 회원가입 처리
const handleSignUp = () => {
  if (!isNameValid.value) {
    signupMessage.value = '이름 형식을 확인해주세요.'
    return
  }

  if (!isNicknameValid.value) {
    signupMessage.value = '닉네임 형식을 확인해주세요.'
    return
  }

  if (!isEmailValid.value) {
    signupMessage.value = '이메일 형식을 확인해주세요.'
    return
  }

  if (!isPasswordValid.value) {
    signupMessage.value = '비밀번호 형식을 확인해주세요.'
    return
  }

  if (password.value !== passwordConfirm.value) {
    signupMessage.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  signupMessage.value = '회원가입 성공! (API 연결 예정)'
  console.log('✅ 회원가입 진행 중...')
}
</script>
