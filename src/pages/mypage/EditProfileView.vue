<template>
  <div class="flex justify-center items-center h-full bg-white">
    <!-- ✅ 수정 완료 Dialog -->
    <Dialog v-model:visible="showDialog" modal header="알림" :closable="false">
      <div class="text-gray-800 text-base">수정이 완료되었습니다.</div>
      <template #footer>
        <Button label="확인" class="btn-primary" @click="showDialog = false" />
      </template>
    </Dialog>

    <Card class="w-full max-w-md rounded-none shadow-none border-none" style="overflow: visible">
      <template #content>
        <div class="p-6 space-y-6 text-base">
          <h2 class="text-2xl font-bold text-center text-gray-800">정보 수정</h2>

          <!-- 이름 -->
          <div class="space-y-2 w-full">
            <label class="text-gray-700 block">이름</label>
            <input
              v-model="name"
              type="text"
              readonly
              class="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
            />
          </div>

          <!-- 이메일 -->
          <div class="space-y-2 w-full">
            <label class="text-gray-700 block">이메일</label>
            <input
              v-model="email"
              type="email"
              readonly
              class="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
            />
          </div>

          <!-- 닉네임 -->
          <div class="space-y-2 w-full">
            <label class="text-gray-700 block">닉네임</label>
            <input
              v-model="nickname"
              @input="validateNickname"
              type="text"
              class="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <!-- 오류 메시지 -->
          <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

          <!-- 저장 버튼 -->
          <Button class="w-full btn-primary" @click="handleUpdate">
            정보 저장
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { userStore } from '@/stores/user'
import { updateMyInfo } from '@/api/user'

const router = useRouter()

// ✅ 초기값은 비어 있는 상태로 선언
const name = ref('')
const email = ref('')
const nickname = ref('')
const password = ref('') // 비밀번호도 보내야 하므로 포함

// ✅ userStore.user가 준비되면 초기값 설정
watchEffect(() => {
  if (userStore.user) {
    name.value = userStore.user.name
    email.value = userStore.user.email
    nickname.value = userStore.user.nickname
    password.value = userStore.user.password // 실제 DB 저장된 비밀번호가 있는 경우만
  }
})

const errorMessage = ref('')
const showDialog = ref(false)

const nicknameRegex = /^[가-힣a-zA-Z0-9 ]{2,16}$/

const validateNickname = () => {
  if (!nickname.value) {
    errorMessage.value = '닉네임을 입력해주세요.'
  } else if (!nicknameRegex.test(nickname.value)) {
    errorMessage.value = '닉네임은 한글, 영문, 숫자, 공백 포함 2~16자로 입력해주세요.'
  } else {
    errorMessage.value = ''
  }
}

const handleUpdate = async () => {
  validateNickname()
  if (errorMessage.value) return

  const updatedData = {
    name: name.value,
    email: email.value,
    nickname: nickname.value,
    password: null
  }

  console.log('🔍 서버로 전송할 데이터:', updatedData) // ✅ 이 줄 추가

  try {
    await updateMyInfo(updatedData)
    userStore.setUser(updatedData)
    showDialog.value = true

    // ✅ 1초 후 마이페이지 이동
    setTimeout(() => {
      showDialog.value = false
      router.push('/mypage')
    }, 1000)
  } catch (err) {
    console.error('❌ 정보 수정 실패:', err)
    errorMessage.value = '서버 오류로 인해 저장에 실패했습니다.'
  }
}
</script>

<style scoped>
/* 필요 시 추가 스타일 작성 가능 */
</style>
