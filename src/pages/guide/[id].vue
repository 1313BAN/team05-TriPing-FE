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
  {{ guide.title }} 여행 가이드
</h1>


    <!-- 탭 버튼 -->
    <div class="sticky top-0 z-40 pt-4 pb-6 blur-gradient-header">
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

    <!-- 기본 정보 -->
    <Card
      v-if="hasBasicInfo"
      id="basic"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📌 기본 정보</template>
      <template #content>
        <div class="space-y-6">
          <!-- 소개 -->
          <div v-if="parsedDescription.length > 0">
            <h3 class="text-base font-semibold text-gray-800 mb-1">소개</h3>
            <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
              <li v-for="(item, index) in parsedDescription" :key="'desc-' + index">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- 운영 정보 -->
          <div v-if="parsedOperationInfo.length > 0">
            <h3 class="text-base font-semibold text-gray-800 mb-1">운영 정보</h3>
            <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
              <li v-for="(item, index) in parsedOperationInfo" :key="'op-' + index">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- 문의처 -->
          <div v-if="parsedContactInfo.length > 0">
            <h3 class="text-base font-semibold text-gray-800 mb-1">문의처</h3>
            <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
              <li v-for="(item, index) in parsedContactInfo" :key="'contact-' + index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </Card>

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

    <!-- 역사 -->
    <Card
      v-if="hasHistory"
      id="history"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📚 역사</template>
      <template #content>
        <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line">
          {{ guide.history }}
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

    <!-- 포토스팟 -->
    <Card
      v-if="hasPhotoSpots"
      id="photospot"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📸 포토스팟</template>
      <template #content>
        <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
          <li v-for="(spot, index) in guide.photoSpots" :key="'photo-' + index">{{ spot }}</li>
        </ul>
      </template>
    </Card>

    <!-- 주변 맛집 -->
    <Card
      v-if="hasRestaurants"
      id="restaurants"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>🍽️ 주변 맛집</template>
      <template #content>
        <ul class="space-y-3">
          <li
            v-for="(r, index) in guide.restaurants"
            :key="index"
            class="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50"
          >
            <div class="font-semibold text-gray-800">{{ r.name }}</div>
            <div class="text-sm text-gray-600">{{ r.description }}</div>
            <div class="text-xs text-gray-500">{{ r.distance }}</div>
          </li>
        </ul>
      </template>
    </Card>

    <!-- 관련 동영상 -->
    <Card
      v-if="hasVideo"
      id="video"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📺 관련 동영상</template>
      <template #content>
        <div class="mb-4" v-if="guide.video?.title || guide.video?.description">
          <h3 class="text-lg font-semibold text-gray-800" v-if="guide.video?.title">
            {{ guide.video.title }}
          </h3>
          <p class="text-sm text-gray-600 mt-1" v-if="guide.video?.description">
            {{ guide.video.description }}
          </p>
        </div>

        <div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl" v-if="guide.video?.url">
          <iframe
            width="100%"
            height="315"
            :src="getEmbedUrl(guide.video.url)"
            :title="guide.video?.title"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </template>
    </Card>

    <!-- 편의시설 -->
    <Card
      v-if="hasAmenities"
      id="amenities"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>🚻 편의시설</template>
      <template #content>
        <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
          <li v-for="(item, index) in guide.amenities" :key="'amenity-' + index">{{ item }}</li>
        </ul>
      </template>
    </Card>

    <ScrollTop class="z-50 text-primary bottom-8" behavior="smooth" :threshold="400" />
  </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Card from 'primevue/card'
import ScrollTop from 'primevue/scrolltop'
import { useVisitedGuideStore } from '@/stores/visitedGuideStore'

const props = defineProps({
  id: [String, Number],
  title: String
})

const guide = ref(null)
const guideLoaded = computed(() => guide.value !== null)

const parsedDescription = computed(() => {
  if (!guide.value?.description) return []
  return guide.value.description
    .filter((item) => item?.includes(':'))
    .map((item) => {
      const [, value] = item.split(/:(.+)/)
      return value?.trim()
    })
    .filter(Boolean)
})

const parsedOperationInfo = computed(() => {
  if (!guide.value?.operationInfo) return []
  return guide.value.operationInfo
    .map((item) => {
      const [key, value] = item.split(/:(.+)/)
      const labelMap = {
        runtime: '운영 시간',
        holiday: '휴관일',
        fee: '입장료'
      }
      return value && value.trim().toLowerCase() !== 'null'
        ? `${labelMap[key.trim()] || key.trim()}: ${value.trim()}`
        : null
    })
    .filter(Boolean)
})

const parsedContactInfo = computed(() => {
  if (!guide.value?.contactInfo) return []
  return guide.value.contactInfo
    .map((item) => {
      const [key, value] = item.split(/:(.+)/)
      const labelMap = {
        'phone number': '전화번호',
        website: '웹사이트'
      }
      return value && value.trim().toLowerCase() !== 'null'
        ? `${labelMap[key.trim()] || key.trim()}: ${value.trim()}`
        : null
    })
    .filter(Boolean)
})

const hasBasicInfo = computed(
  () =>
    parsedDescription.value.length > 0 ||
    parsedOperationInfo.value.length > 0 ||
    parsedContactInfo.value.length > 0
)

const hasInfo = computed(() => !!guide.value?.info)
const hasTip = computed(() => guide.value?.tip?.length > 0)
const hasHistory = computed(() => !!guide.value?.history)
const hasPhotoSpots = computed(() => guide.value?.photoSpots?.length > 0)
const hasRestaurants = computed(() => guide.value?.restaurants?.length > 0)
const hasAmenities = computed(() => guide.value?.amenities?.length > 0)
const hasVideo = computed(() => {
  const video = guide.value?.video
  return video && (video.title || video.description || video.url)
})

const tabs = computed(() => {
  const result = []
  if (hasBasicInfo.value) result.push({ label: '기본정보', key: 'basic' })
  if (hasInfo.value) result.push({ label: '상세 정보', key: 'info' })
  if (hasHistory.value) result.push({ label: '역사', key: 'history' })
  if (hasTip.value) result.push({ label: '꿀팁', key: 'tip' })
  if (hasPhotoSpots.value) result.push({ label: '포토스팟', key: 'photospot' })
  if (hasRestaurants.value) result.push({ label: '맛집', key: 'restaurants' })
  if (hasVideo.value) result.push({ label: '관련 동영상', key: 'video' })
  if (hasAmenities.value) result.push({ label: '편의시설', key: 'amenities' })
  return result
})

const selectedTab = ref('basic')
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

function getEmbedUrl(url) {
  if (!url) return ''
  return url.includes('watch?v=') ? url.replace('watch?v=', 'embed/') : url
}

watch(
  () => props.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) fetchGuide(newId)
    else guide.value = null
  },
  { immediate: true }
)


const visitedStore = useVisitedGuideStore()

async function fetchGuide(id) {
  const start = Date.now()
  try {
    const res = await fetch(`https://tri-ping.site/attraction/guide/${id}`)
    if (!res.ok) throw new Error('가이드 API 호출 실패')
    const data = await res.json()

    const alreadyVisited = visitedStore.has(id)
    visitedStore.add(id)

    const elapsed = Date.now() - start
    const delay = !alreadyVisited && elapsed < 2000 ? 2000 - elapsed : 0

    // 최소 지연 이후에 guide 표시
    await new Promise((resolve) => setTimeout(resolve, delay))
    guide.value = data
  } catch (err) {
    console.error('[GuidePage] API 오류:', err)
    guide.value = null
  }
}



</script>