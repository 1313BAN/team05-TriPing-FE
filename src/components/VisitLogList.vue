<!-- src/components/VisitLogList.vue -->
<template>
  <div class="w-full flex flex-col">
    <template v-if="logs.length > 0">
      <div v-for="(log, index) in logs" :key="log.visitLogId">
        <!-- 카드 -->
        <div class="border border-gray-200 rounded-2xl shadow-sm p-5 bg-white">
          <!-- 방문 시간 -->
          <div class="text-base text-gray-500 mb-2">
            {{ formatTime(log.enteredAt) }} ~ {{ formatTime(log.exitedAt) }} ({{
              getStayDurationText(log.enteredAt, log.exitedAt)
            }})
          </div>

          <!-- 장소명 + 평가 -->
          <div class="flex items-center justify-between gap-2">
            <!-- 왼쪽: 번호 + 장소명 -->
            <div class="flex items-center gap-2">
              <div
                class="bg-gray-800 w-5 h-5 font-semibold rounded-full text-white text-xs flex items-center justify-center"
              >
                {{ index + 1 }}
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ log.title }}
              </div>
            </div>

            <!-- 오른쪽: 평가 정보 -->
            <div class="flex items-center gap-2 text-sm text-gray-700 relative">
              <Button
                :label="log.preference != null ? '평점 수정' : '평점 남기기'"
                @click="$emit('preference-click', log)"
                :class="[
                  'relative transition-none text-xs',
                  log.preference != null ? 'btn-white-outline' : 'btn-primary'
                ]"
              ></Button>
              <!-- <span
                v-if="log.preference == null"
                class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"
              ></span> -->
            </div>
          </div>
        </div>

        <!-- 카드 사이 화살표 -->
        <div v-if="index < logs.length - 1" class="flex justify-center my-1 text-gray-400 text-2xl">
          ↓
        </div>
      </div>
    </template>

    <div v-else class="w-full text-center text-gray-500 text-lg py-16">
      방문한 관광지가 없습니다.
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

defineProps({
  logs: {
    type: Array,
    required: true
  }
})

defineEmits(['preference-click'])

const formatTime = (datetime) => dayjs(datetime).format('HH:mm')

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
