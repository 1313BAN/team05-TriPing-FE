<template>
  <div class="flex flex-col min-h-screen px-5 py-8 bg-white text-gray-900">
    <!-- 인사말 -->
    <h2 class="text-xl font-bold text-gray-800 mb-6">{{ user.nickname }}님 안녕하세요!</h2>

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

    <!-- 탈퇴하기 버튼 (훨씬 아래로 배치) -->
    <div class="mt-5 flex justify-between">
      <button class="btn-small" @click="editpassword">비밀번호 변경</button>
      <button class="btn-small" @click="withdraw">탈퇴하기</button>
    </div>
  </div>
</template>

<script setup>
import { Card } from 'primevue'

const user = {
  name: '장준우',
  nickname: '용감한 사자',
  email: 'email@example.com'
}

const goToEdit = () => {
  console.log('정보 수정 페이지로 이동')
}

const withdraw = () => {
  console.log('탈퇴 처리 로직 실행')
}
</script>
