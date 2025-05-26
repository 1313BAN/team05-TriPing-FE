<template>
  <div class="p-4">
    <!-- 날짜 이동 버튼과 제목 -->
    <div class="flex items-center justify-between mb-6">
      <!-- 이전 버튼 -->
      <Button
        icon="pi pi-arrow-left"
        class="btn-primary text-sm md:w-32 w-16"
        :disabled="page <= 1"
        @click="goToPrevPage"
      >
        <span class="hidden md:inline">← 이전 날짜로</span>
        <span class="inline md:hidden">이전</span>
      </Button>

      <!-- 날짜 -->
      <div class="text-xl text-center font-semibold">
        {{ dayjs(logs[0]?.enteredAt).format('YYYY년 M월 D일') }}
      </div>

      <!-- 다음 버튼 -->
      <Button
        icon="pi pi-arrow-right"
        iconPos="right"
        class="btn-primary text-sm md:w-32 w-16"
        :disabled="page >= totalCount"
        @click="goToNextPage"
      >
        <span class="hidden md:inline">다음 날짜로 →</span>
        <span class="inline md:hidden">다음</span>
      </Button>
    </div>

    <!-- 방문기록 카드 리스트 -->
    <div v-if="logs.length > 0" class="w-full flex flex-col">
      <div v-for="(log, index) in logs" :key="log.visitLogId">
        <!-- 카드 -->
        <div class="border border-gray-200 rounded-2xl shadow-sm p-5 bg-white">
          <!-- 방문 시간 -->
          <div class="text-sm text-gray-500 mb-2">
            {{ formatTime(log.enteredAt) }} ~ {{ formatTime(log.exitedAt) }} ({{
              getStayDurationText(log.enteredAt, log.exitedAt)
            }})
          </div>

          <!-- 장소명 -->
          <div class="text-lg font-semibold text-gray-800 border-l-4 border-primary pl-4">
            {{ log.title }}
          </div>
        </div>

        <!-- 카드와 카드 사이의 화살표 -->
        <div v-if="index < logs.length - 1" class="flex justify-center my-1 text-primary text-2xl">
          ↓
        </div>
      </div>
    </div>

    <!-- 하단 페이지네이션 -->
    <div class="flex justify-center mt-10">
      <Paginator :rows="1" :totalRecords="totalCount" :first="page - 1" @page="onPageChange" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import Paginator from 'primevue/paginator'

import { ref, onMounted } from 'vue'
import { getMyVisitLog } from '@/api/visitLog'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/ko'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale('ko')

const page = ref(1)
const logs = ref([])
const totalCount = ref(0)

const fetchLogs = async () => {
  try {
    const res = await getMyVisitLog(page.value)
    logs.value = res.data.visitLogs
    totalCount.value = res.data.totalCount
  } catch (err) {
    console.error('방문기록 불러오기 실패:', err)
  }
}

onMounted(fetchLogs)

const onPageChange = (event) => {
  page.value = event.page + 1
  fetchLogs()
}

const goToPrevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchLogs()
  }
}

const goToNextPage = () => {
  if (page.value < totalCount.value) {
    page.value++
    fetchLogs()
  }
}

const formatTime = (datetime) => {
  return dayjs(datetime).format('HH:mm')
}

const fromNow = (datetime) => {
  return dayjs(datetime).fromNow()
}

const getStayDurationText = (enteredAt, exitedAt) => {
  const start = dayjs(enteredAt)
  const end = dayjs(exitedAt)
  const diff = end.diff(start, 'minute')

  const hours = Math.floor(diff / 60)
  const minutes = diff % 60

  if (hours && minutes) return `${hours}시간 ${minutes}분`
  if (hours) return `${hours}시간`
  return `${minutes}분`
}
</script>
