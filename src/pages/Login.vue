<template>
  <div class="h-full flex items-center justify-center">
    <div class="w-full max-w-sm p-6 bg-white rounded-lg">
      <h2 class="text-2xl font-bold text-center mb-6">로그인</h2>

      <div class="mb-4">
        <label class="block text-sm mb-1">이메일</label>
        <InputText v-model="email" class="w-full" />
      </div>

      <div class="mb-4">
        <label class="block text-sm mb-1">비밀번호</label>
        <Password
          v-model="password"
          toggleMask
          class="w-full"
          inputClass="w-full"
          :feedback="false"
        />
      </div>

      <div class="mb-4 flex items-center">
        <Checkbox v-model="rememberMe" :binary="true" inputId="remember" />
        <label for="remember" class="ml-2 text-sm text-gray-600">자동 로그인</label>
      </div>

      <Button label="로그인" class="btn-primary w-full" />

      <div class="flex justify-between text-sm mt-4 text-blue-600">
        <a href="#" class="hover:underline">비밀번호 찾기</a>
        <a href="#" class="hover:underline">회원가입</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
</script>
