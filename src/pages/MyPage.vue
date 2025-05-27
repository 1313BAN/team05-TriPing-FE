<template>
  <div v-if="userStore.user" class="flex flex-col min-h-screen px-5 py-8 bg-white text-gray-900">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">{{ userStore.user.nickname }}님 안녕하세요!</h2>
      <Button
        icon="pi pi-sign-out"
        label="로그아웃"
        severity="secondary"
        rounded
        text
        @click="logout"
        class="md:text-base text-sm"
        aria-label="로그아웃"
      />
    </div>

    <Card class="shadow-md rounded-2xl bg-gray-50" style="width: 100%; overflow: hidden">
      <template #content>
        <div class="p-6 space-y-10 text-lg">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">이름</span>
            <span class="text-gray-800">{{ userStore.user.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">닉네임</span>
            <span class="text-gray-800">{{ userStore.user.nickname }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">이메일</span>
            <span class="text-gray-800 break-all">{{ userStore.user.email }}</span>
          </div>
        </div>
      </template>
    </Card>

    <div class="mt-6">
      <button class="w-full btn-primary" @click="goToEdit">정보 수정</button>
    </div>

    <div class="mt-5 flex justify-between">
      <button class="btn-small" @click="editPassword">비밀번호 변경</button>
      <button class="btn-small" @click="handleWithdrawConfirm">탈퇴하기</button>
    </div>

    <ConfirmDialog />
  </div>

  <div v-else class="text-center text-gray-400 py-20">사용자 정보를 불러오는 중입니다...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/user' // ✅ 변경된 import
import { deleteMyAccount, getMyInfo } from '@/api/user'

const router = useRouter()
const confirm = useConfirm()
const userStore = useUserStore() // ✅ Pinia 인스턴스 생성

onMounted(async () => {
  if (!userStore.user) {
    try {
      const res = await getMyInfo()
      userStore.setUser(res.data)
    } catch (err) {
      console.warn('❌ 사용자 정보 로딩 실패:', err)
    }
  }
})

const goToEdit = () => router.push('/mypage/edit')
const editPassword = () => router.push('/mypage/change-password')

const logout = () => {
  localStorage.removeItem('accessToken')
  userStore.clearUser()
  router.push('/login')
}

const withdraw = async () => {
  try {
    await deleteMyAccount()
    logout()
  } catch (err) {
    console.error('탈퇴 실패:', err)
  }
}

const handleWithdrawConfirm = () => {
  confirm.require({
    message: '정말 탈퇴하시겠습니까?',
    header: '탈퇴 확인',
    rejectLabel: '아니요',
    acceptLabel: '네, 탈퇴할게요',
    acceptClass: 'p-button-danger',
    accept: () => withdraw(),
    reject: () => console.log('탈퇴 취소')
  })
}
</script>
