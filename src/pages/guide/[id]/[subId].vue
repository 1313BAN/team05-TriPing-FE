<template>
  <div v-if="!guideLoaded" class="p-6 max-w-3xl mx-auto space-y-4">
    <div class="text-center text-xl text-gray-500 my-8">AI 가이드북을 생성하고 있습니다... 🤖</div>
    <Skeleton height="2rem" width="70%" />
    <Skeleton height="1.5rem" width="90%" />
    <Skeleton height="10rem" />
    <Skeleton height="2rem" width="60%" />
    <Skeleton height="1.5rem" width="80%" />
    <Skeleton height="10rem" />
  </div>
  <transition name="fade-up" appear>
      <div v-if="guideLoaded" class="p-6 max-w-3xl mx-auto space-y-8 pb-32">
        <h1 class="md:text-3xl text-2xl font-bold text-gray-800 flex items-center gap-2">
      <i
        class="pi pi-angle-left text-gray-600 text-3xl cursor-pointer pr-2"
        @click="$router.go(-1)"
      ></i>
      {{ guide.title }} - {{ guide.subtitle }} 가이드
    </h1>

        <!-- 더미 데이터 안내 -->
        <div class="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p class="text-yellow-700 text-xs md:text-sm text-center">
            ⚠️ OpenAI API 사용 중지로 인해 더미 데이터가 표시됩니다
          </p>
        </div>
        <!-- 탭 버튼 -->
        <div class="sticky top-0 z-40 pt-4 pb-6 blur-gradient-header" v-if="tabs.length">
          <div class="relative">
            <button
              @click="scrollLeft"
              class="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow w-8 h-8 cursor-pointer"
            >
              <i class="pi pi-angle-left text-gray-600"></i>
            </button>

            <div
              ref="tabScrollRef"
              class="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none px-1 -mx-1 md:pl-10 md:pr-10"
            >
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="scrollToSection(tab.key)"
                :class="[
                  'px-4 py-2 rounded-3xl border text-sm font-medium transition shrink-0 cursor-pointer',
                  selectedTab === tab.key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>

            <button
              @click="scrollRight"
              class="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow w-8 h-8 cursor-pointer"
            >
              <i class="pi pi-angle-right text-gray-600"></i>
            </button>
          </div>
        </div>

        <!-- 상세 정보 -->
        <Card
          v-if="hasInfo"
          id="info"
          class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
        >
          <template #title>🗽️ 상세 정보</template>
          <template #content>
            <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line p-2">
              {{ guide.info }}
            </p>
          </template>
        </Card>

        <!-- 꿀팁 -->
        <Card
          v-if="hasTip"
          id="tip"
          class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
        >
          <template #title>✨ 꿀팁</template>
          <template #content>
            <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
              <li v-for="(item, index) in guide.tip" :key="index">{{ item }}</li>
            </ul>
          </template>
        </Card>

        <!-- 역사 -->
        <Card
          v-if="hasHistory"
          id="history"
          class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
        >
          <template #title>📚 역사</template>
          <template #content>
            <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line p-2">
              {{ guide.history }}
            </p>
          </template>
        </Card>
        
      </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Card from 'primevue/card'
import { useVisitedSubGuideStore } from '@/stores/visitedSubGuideStore'

const visitedSubStore = useVisitedSubGuideStore()

const route = useRoute()
const title = computed(() => route.query.title || '')
const subtitle = computed(() => route.query.subtitle || '')

const guide = ref(null)
const guideLoaded = computed(() => guide.value !== null)

const hasInfo = computed(() => !!guide.value?.info)
const hasTip = computed(() => guide.value?.tip?.length > 0)
const hasHistory = computed(() => !!guide.value?.history)

const tabs = computed(() => {
  const result = []
  if (hasInfo.value) result.push({ label: '상세 정보', key: 'info' })
  if (hasTip.value) result.push({ label: '꿀팁', key: 'tip' })
  if (hasHistory.value) result.push({ label: '역사', key: 'history' })
  return result
})

const selectedTab = ref('info')
const tabScrollRef = ref(null)

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  selectedTab.value = id
}

function scrollLeft() {
  tabScrollRef.value?.scrollBy({ left: -150, behavior: 'smooth' })
}

function scrollRight() {
  tabScrollRef.value?.scrollBy({ left: 150, behavior: 'smooth' })
}

async function fetchSubGuide(title, subtitle) {
  try {
    const start = Date.now()

    // 기존 API 호출 주석 처리
    // const res = await fetch(
    //   `http://localhost:8080/attraction/subguide?title=${encodeURIComponent(title)}&subTitle=${encodeURIComponent(subtitle)}`
    // )
    // if (!res.ok) throw new Error('서브 가이드 API 호출 실패')
    // const data = await res.json()

    // 더미 데이터
    const data = {
      title: title || "관광지",
      subtitle: subtitle || "세부 명소",
      info: `${subtitle || "세부 명소"}는 ${title || "관광지"}의 대표적인 볼거리 중 하나입니다.\n\n이 장소는 특별한 역사적 의미와 아름다운 경관을 자랑하며, 방문객들에게 깊은 인상을 남기는 곳입니다. 세심하게 관리되고 있는 이곳에서는 사계절 내내 다른 매력을 발견할 수 있습니다.\n\n전문 가이드의 설명과 함께 둘러보시면 더욱 풍부한 경험을 하실 수 있습니다.`,
      tip: [
        "이곳을 방문하실 때는 편안한 복장을 권장합니다",
        "사진 촬영 시 다른 관람객들을 배려해 주세요",
        "안내판의 설명을 꼼꼼히 읽어보시면 더 많은 정보를 얻을 수 있습니다",
        "날씨가 좋은 날에 방문하시면 더욱 아름다운 모습을 감상할 수 있습니다"
      ],
      history: `${subtitle || "세부 명소"}의 역사는 매우 오래되었습니다.\n\n과거부터 현재까지 이어져 온 이곳의 이야기는 우리나라의 문화와 전통을 잘 보여주는 소중한 자료입니다. 여러 차례의 보수와 복원을 거쳐 현재의 모습을 갖추게 되었으며, 앞으로도 지속적인 관리를 통해 후세에 전해질 예정입니다.\n\n각 시대별로 다른 특징을 보여주는 이곳은 역사 교육의 장으로도 활용되고 있습니다.`
    }

    const elapsed = Date.now() - start
    const alreadyVisited = visitedSubStore.has(title, subtitle)
    visitedSubStore.add(title, subtitle)

    const wait = !alreadyVisited && elapsed < 2000 ? 2000 - elapsed : 0
    await new Promise((resolve) => setTimeout(resolve, wait))

    guide.value = data
  } catch (err) {
    console.error('[SubGuidePage] 더미 데이터 처리 오류:', err)
    guide.value = null
  }
}

onMounted(() => {
  if (title.value && subtitle.value) {
    fetchSubGuide(title.value, subtitle.value)
  } else {
    console.warn('[SubGuidePage] 쿼리 파라미터 누락')
    guide.value = null
  }
})
</script>