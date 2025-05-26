<template>
  <div class="p-4">
    <!-- 날짜 이동 버튼과 제목 -->
    <div class="flex items-center justify-between mb-6">
      <!-- 이전 버튼 -->
      <Button
        icon="pi pi-arrow-left"
        class="btn-primary text-sm md:w-32 w-16"
        :class="{ 'opacity-0 pointer-events-none': page <= 1 }"
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
        :class="{ 'opacity-0 pointer-events-none': page >= totalCount }"
        @click="goToNextPage"
      >
        <span class="hidden md:inline">다음 날짜로 →</span>
        <span class="inline md:hidden">다음</span>
      </Button>
    </div>

    <VisitMap :logs="logs" />
    <VisitLogList :logs="logs" @preference-click="handlePreferenceClick" />
    <VisitPrefModal
      :visible="visitPrefVisible"
      :visit-log-id="visitPrefId"
      :title="visitPrefTitle"
      @update:visible="visitPrefVisible = $event"
      @submit="handlePrefSubmit"
    />

    <!-- 하단 페이지네이션 -->
    <div class="flex justify-center mt-10 md:mb-0 mb-12">
      <Paginator :rows="1" :totalRecords="totalCount" :first="page - 1" @page="onPageChange" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import VisitLogList from '@/components/visitLog/VisitLogList.vue'
import { ref, onMounted } from 'vue'
import { getMyVisitLog } from '@/api/visitLog'
import VisitPrefModal from '@/components/visitLog/VisitPrefModal.vue'
import { useVisitPrefController } from '@/composables/visit/useVisitPrefController'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/ko'
import VisitMap from '@/components/visitLog/VisitMap.vue'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale('ko')

const page = ref(1)
const logs = ref([])
const totalCount = ref(0)
const visitPrefVisible = ref(false)
const visitPrefId = ref(null)
const visitPrefTitle = ref('')

const fetchLogs = async () => {
  try {
    const res = await getMyVisitLog(page.value)
    logs.value = res.data.visitLogs.reverse()
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

const handlePreferenceClick = (log) => {
  visitPrefId.value = log.visitLogId
  visitPrefTitle.value = log.title
  visitPrefVisible.value = true
}
const { handleSubmit: handlePrefSubmit } = useVisitPrefController(
  visitPrefVisible,
  visitPrefId,
  visitPrefTitle,
  fetchLogs // ✅ 필요 시 최신 데이터 다시 불러오기
)
</script>
