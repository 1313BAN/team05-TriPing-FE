<template>
  <div class="flex justify-center items-center h-full bg-white">
    <!-- ✅ 변경 완료 Dialog -->
    <Dialog v-model:visible="showDialog" modal header="알림" :closable="false">
      <div class="text-gray-800 text-base">비밀번호가 변경되었습니다.</div>
      <template #footer>
        <Button label="확인" class="btn-primary" @click="showDialog = false" />
      </template>
    </Dialog>

    <!-- Card -->
    <Card class="w-full max-w-md rounded-none shadow-none border-none" style="overflow: visible">
      <template #content>
        <div class="p-6 space-y-6 text-base">
          <h2 class="text-2xl font-bold text-center text-gray-800">비밀번호 변경</h2>

          <!-- 현재 비밀번호 -->
          <div class="space-y-2 w-full">
            <label class="text-gray-700 block">현재 비밀번호</label>
            <Password
              v-model="currentPassword"
              toggleMask
              feedback="false"
              inputClass="w-full"
              class="w-full block"
            />
          </div>

          <!-- 새 비밀번호 -->
          <div class="space-y-2 w-full">
            <label class="text-gray-700 block">새 비밀번호</label>
            <Password
              v-model="newPassword"
              toggleMask
              feedback="false"
              inputClass="w-full"
              class="w-full block"
            />
          </div>

          <!-- 새 비밀번호 확인 -->
          <div class="space-y-2 w-full">
            <label class="text-gray-700 block">새 비밀번호 확인</label>
            <Password
              v-model="confirmPassword"
              toggleMask
              feedback="false"
              inputClass="w-full"
              class="w-full block"
            />
          </div>

          <!-- 오류 메시지 -->
          <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

          <!-- 버튼 -->
          <Button class="w-full btn-primary" @click="handleSubmit"> 비밀번호 변경 </Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { changePassword } from '@/api/user' // ✅ API 연동

// 상태 정의
const router = useRouter()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const showDialog = ref(false)

// 제출 처리
const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = '새 비밀번호가 일치하지 않습니다.'
    return
  }

  if (currentPassword.value === newPassword.value) {
    errorMessage.value = '새 비밀번호는 현재 비밀번호와 달라야 합니다.'
    return
  }

  if (!currentPassword.value || !newPassword.value) {
    errorMessage.value = '비밀번호를 모두 입력해주세요.'
    return
  }

  try {
    await changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })

    errorMessage.value = ''
    showDialog.value = true

    setTimeout(() => {
      showDialog.value = false
      router.push('/mypage')
    }, 1500)
  } catch (err) {
    console.error('❌ 비밀번호 변경 실패:', err)
    errorMessage.value = '현재 비밀번호가 일치하지 않거나 형식이 올바르지 않습니다.'
  }
}
</script>

<style scoped>
/* 필요 시 여기에 스타일 추가 */
</style>
