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

    <!-- 더미 데이터 안내 -->
    <div class="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
      <p class="text-yellow-700 text-xs md:text-sm text-center">
        ⚠️ OpenAI API 사용 중지로 인해 더미 데이터가 표시됩니다
      </p>
    </div>


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

async function fetchGuide(id) {
  const start = Date.now()
  try {
    // 기존 API 호출 주석 처리
    // const res = await fetch(`http://localhost:8080/attraction/guide/${id}`)
    // if (!res.ok) throw new Error('가이드 API 호출 실패')
    // const data = await res.json()

    // 더미 데이터
    const data = {
      title: props.title || "관광지",
      description: [
        "소개: 아름다운 자연경관과 역사적 가치를 지닌 대표적인 관광명소입니다",
        "특징: 사계절 내내 다양한 볼거리와 체험거리를 제공합니다",
        "추천: 가족단위 방문객과 사진 애호가들에게 특히 인기가 높습니다"
      ],
      operationInfo: [
        "runtime: 09:00 - 18:00",
        "holiday: 매주 월요일",
        "fee: 성인 5,000원, 청소년 3,000원, 어린이 2,000원"
      ],
      contactInfo: [
        "phone number: 02-1234-5678",
        "website: www.example-tourist-site.kr"
      ],
      info: "이곳은 오랜 역사와 전통을 자랑하는 대표적인 관광명소입니다.\n\n자연의 아름다움과 인공의 조화가 완벽하게 어우러진 이 장소는 방문객들에게 잊을 수 없는 추억을 선사합니다. 특히 봄과 가을에는 더욱 아름다운 풍경을 감상할 수 있어 많은 관광객들이 찾아옵니다.\n\n다양한 문화체험 프로그램과 교육프로그램도 운영되고 있어 학습과 힐링을 동시에 경험할 수 있습니다.",
      history: "이 관광지는 수백 년의 역사를 간직하고 있습니다.\n\n조선시대부터 중요한 역할을 해온 이곳은 시대의 변천사와 함께 발전해왔습니다. 일제강점기와 한국전쟁을 거치면서도 그 원형을 잘 보존하고 있어 역사적 가치가 매우 높습니다.\n\n현재는 문화재로 지정되어 체계적인 관리와 보존이 이루어지고 있으며, 후세에 소중한 문화유산을 전해주기 위해 지속적인 노력을 기울이고 있습니다.",
      tip: [
        "이른 아침이나 늦은 오후에 방문하시면 더욱 아름다운 풍경을 감상할 수 있습니다",
        "편한 신발을 착용하시고 충분한 물을 준비해주세요",
        "사진 촬영 시 플래시 사용을 금지하는 구역이 있으니 안내판을 확인해주세요",
        "주말과 공휴일에는 방문객이 많으니 평일 방문을 추천합니다"
      ],
      photoSpots: [
        "정문 입구의 전통 건축물 앞",
        "중앙 정원의 연못과 다리",
        "전망대에서 바라본 전체 전경",
        "계절별 꽃밭과 나무들"
      ],
      restaurants: [
        {
          name: "전통찻집 향기",
          description: "전통차와 한과를 맛볼 수 있는 고풍스러운 찻집",
          distance: "도보 3분"
        },
        {
          name: "맛있는 한정식",
          description: "신선한 재료로 만든 정갈한 한정식 전문점",
          distance: "도보 5분"
        },
        {
          name: "카페 브리즈",
          description: "관광지 전망을 감상하며 커피를 즐길 수 있는 카페",
          distance: "도보 2분"
        }
      ],
      video: {
        title: "관광지 소개 영상",
        description: "관광지 소개 영상입니다.",
        url: "https://www.youtube.com/watch?v=0JCGDm9NqzI"
      },
      amenities: [
        "주차장 (무료, 200대 수용 가능)",
        "화장실 (장애인 전용 화장실 포함)",
        "매점 및 기념품샵",
        "안내센터 및 가이드 서비스",
        "휠체어 대여 서비스"
      ]
    }

    const visitedStore = useVisitedGuideStore()
    const alreadyVisited = visitedStore.has(id)
    visitedStore.add(id)

    const elapsed = Date.now() - start
    const delay = !alreadyVisited && elapsed < 2000 ? 2000 - elapsed : 0

    // 최소 지연 이후에 guide 표시
    await new Promise((resolve) => setTimeout(resolve, delay))
    guide.value = data
  } catch (err) {
    console.error('[GuidePage] 더미 데이터 처리 오류:', err)
    guide.value = null
  }
}



</script>