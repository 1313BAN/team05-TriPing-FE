<template>
  <div class="flex flex-col min-h-screen px-5 py-8 bg-white text-gray-900">

    <!-- ✅ 인사말 + 로그아웃 버튼 영역 -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">{{ user.nickname }}님 안녕하세요!</h2>
      <Button
        icon="pi pi-sign-out"
        label="로그아웃"
        severity="secondary"
        rounded
        text
        @click="logout"
        aria-label="로그아웃"
      />
    </div>

    <!-- 사용자 정보 카드 -->
    <Card class="shadow-md rounded-2xl bg-gray-50" style="width: 100%; overflow: hidden">
      <template #content>
        <div class="p-6 space-y-10 text-lg">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">이름</span>
            <span class="text-gray-800">{{ user.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">닉네임</span>
            <span class="text-gray-800">{{ user.nickname }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">이메일</span>
            <span class="text-gray-800 break-all">{{ user.email }}</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- 정보 수정 버튼 -->
    <div class="mt-6">
      <button class="w-full btn-primary" @click="goToEdit">정보 수정</button>
    </div>

    <!-- 탈퇴하기 & 비밀번호 변경 버튼 -->
    <div class="mt-5 flex justify-between">
      <button class="btn-small" @click="editpassword">비밀번호 변경</button>
      <button class="btn-small" @click="handleWithdrawConfirm">탈퇴하기</button>
    </div>

    <!-- ✅ ConfirmDialog 삽입 -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { userStore } from '@/stores/user'
import { deleteMyAccount } from '@/api/user' // ✅ [1] 탈퇴 API import

const router = useRouter()
const confirm = useConfirm()

const user = userStore.user

const goToEdit = () => {
  router.push('/mypage/edit')
}

const editpassword = () => {
  router.push('/mypage/change-password')
}

const logout = () => {
  // ✅ 로그아웃 처리
  localStorage.removeItem('accessToken')
  userStore.clearUser()
  router.push('/login')
}

const withdraw = async () => {
  try {
    console.log('✅ 탈퇴 API 요청 전송')
    await deleteMyAccount()   // ✅ [2] 탈퇴 API 호출
    logout()                  // ✅ [3] 공통 로그아웃 처리
  } catch (err) {
    console.error('❌ 탈퇴 실패:', err)
  }
}

const handleWithdrawConfirm = () => {
  confirm.require({
    message: '정말 탈퇴하시겠습니까?',
    header: '탈퇴 확인',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '아니요',
    acceptLabel: '네, 탈퇴할게요',
    acceptClass: 'p-button-danger',
    accept: () => withdraw(),   // ✅ [4] 탈퇴 확정 시 실행
    reject: () => console.log('탈퇴 취소')
  })
}
</script>