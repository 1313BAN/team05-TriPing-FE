<template>
  <transition name="slide" appear>
    <div v-if="visible" class="absolute bottom-0 left-0 right-0 z-[9999]">
      <div
        class="bg-white rounded-t-2xl w-full px-6 py-6 overflow-hidden transition-all duration-500 ease-out"
        :class="{
          'max-h-[80vh]': loading || results.length > 0,
          'max-h-[300px]': !loading && results.length === 0
        }"
        style="box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -2px rgba(0,0,0,0.1);"
      >
        <div class="overflow-y-auto flex flex-col gap-4 items-center justify-center">
          <!-- ✅ 추천 전 텍스트 -->
          <transition name="fade-smooth">
            <div v-if="!started" class="text-center flex flex-col items-center justify-center w-full">
              <h2 class="md:text-2xl text-xl font-bold">AI 관광지 추천</h2>
              <p class="text-gray-600 leading-relaxed md:text-base text-sm mt-3">
                현재 위치와 방문 이력을 분석했어요 🤖<br />
                다음 행선지는 <strong class="font-semibold">AI가 추천하는 곳</strong>으로 떠나보세요!
              </p>
            </div>
          </transition>

          <!-- ⏳ 로딩 중 -->
          <transition name="fade-smooth">
            <div v-if="loading" class="text-center flex flex-col items-center justify-center w-full">
              <p class="text-gray-600 mb-4">방문 기록 분석 중... 🤖</p>
              <RecommendedSkeleton v-for="i in 3" :key="i" />
            </div>
          </transition>

          <!-- ✅ 추천 결과 -->
          <transition-group name="fade-stagger" tag="div" class="flex flex-col gap-3 w-full">
            <RecommendedCard
              v-for="item in results"
              :key="item.id"
              :item="item"
              @click="onItemClick"
            />
          </transition-group>
        </div>

        <!-- ✅ 버튼 영역 (닫기 유지) -->
        <div class="flex flex-col items-center gap-3 pt-4">
          <Button
            v-if="!started"
            label="시작하기"
            class="btn-primary w-[80%] md:text-lg text-base"
            @click="recommend"
          />
          <Button
            label="닫기"
            class="btn-dark w-[80%] md:text-lg text-base"
            @click="closeDrawer"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useLocationStore } from '@/stores/locationStore'
import { fetchRecommendedAttractions } from '@/api/visitLog'
import RecommendedCard from './RecommendedCard.vue'
import RecommendedSkeleton from './RecommendedSkeleton.vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible', 'item-click'])

const uiStore = useUiStore()
const locationStore = useLocationStore()
const results = ref([])
const loading = ref(false)
const started = ref(false)

const recommend = async () => {
  const mockData = [
    {
      id: 57314,
      title: "정동전망대",
      address: "서울특별시 중구 덕수궁길 15",
      latitude: 37.5644099957,
      longitude: 126.9755269079,
      imageUrl: "",
      reason: "예전에 정동전망대에서의 짧은 시간을 즐기셨던 걸 보면, 이곳의 멋진 경치가 또 마음에 드실 것 같아요.",
      score: 90,
    },
    {
      id: 57034,
      title: "서울광장",
      address: "서울특별시 중구 세종대로 110",
      latitude: 37.5657098894,
      longitude: 126.978015533,
      imageUrl: "",
      reason: "여유로운 공간에서 시간을 보내는 걸 좋아하셨던 것 같아요. 서울광장도 편하게 산책하시기 좋을 거예요.",
      score: 88,
    },
    {
      id: 57450,
      title: "환구단",
      address: "서울특별시 중구 소공로 112",
      latitude: 37.5651627568,
      longitude: 126.9794848592,
      imageUrl: "",
      reason: "자연과 역사적인 장소에서의 경험을 즐기신 걸 보면, 환구단의 고즈넉한 분위기도 마음에 드실 거예요.",
      score: 86,
    },
  ]

  started.value = true
  loading.value = true
  results.value = []

  try {
    await new Promise((r) => setTimeout(r, 1000)) // 사용자 경험용 로딩
    results.value = mockData
  } catch (e) {
    console.error('추천 실패 (모의 데이터):', e)
  } finally {
    loading.value = false
  }
}


const closeDrawer = () => {
  emit('update:visible', false)
  uiStore.closeRecommendDrawer()
}

const onItemClick = (item) => {
  console.log('🔍 클릭된 장소:', item)
  emit('item-click', item)
  // TODO: 추천 상세 페이지 or 지도 마커 이동 등
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      results.value = []
      loading.value = false
      started.value = false
    }
  }
)
</script>