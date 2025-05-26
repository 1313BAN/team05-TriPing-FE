<template>
  <div class="p-6 max-w-3xl mx-auto space-y-8 pb-32">
    <h1 class="text-3xl font-bold text-gray-800">📍 서브 관광지 가이드</h1>

    <!-- 탭 버튼 -->
    <div class="sticky top-0 z-40 pt-4 pb-6 blur-gradient-header">
      <div class="relative">
        <button
          @click="scrollLeft"
          class="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow w-8 h-8"
        >
          <i class="pi pi-angle-left text-gray-600"></i>
        </button>

        <div
          ref="tabScrollRef"
          class="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none px-1 -mx-1 pl-10 pr-10"
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="scrollToSection(tab.key)"
            class="px-4 py-2 rounded-3xl border text-sm font-medium transition shrink-0 bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          >
            {{ tab.label }}
          </button>
        </div>

        <button
          @click="scrollRight"
          class="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow w-8 h-8"
        >
          <i class="pi pi-angle-right text-gray-600"></i>
        </button>
      </div>
    </div>

    <!-- 기본 정보 -->
    <Card
      id="basic"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📌 기본 정보</template>
      <template #content>
        <div class="space-y-6">
          <div>
            <h3 class="text-base font-semibold text-gray-800 mb-1">소개</h3>
            <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
              <li>예시 소개 항목 1</li>
              <li>예시 소개 항목 2</li>
            </ul>
          </div>

          <div>
            <h3 class="text-base font-semibold text-gray-800 mb-1">운영 정보</h3>
            <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
              <li>운영 시간: 09:00 ~ 18:00</li>
              <li>휴관일: 매주 월요일</li>
              <li>입장료: 무료</li>
            </ul>
          </div>

          <div>
            <h3 class="text-base font-semibold text-gray-800 mb-1">문의처</h3>
            <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
              <li>전화번호: 02-1234-5678</li>
              <li>웹사이트: www.example.com</li>
            </ul>
          </div>
        </div>
      </template>
    </Card>

    <div class="border-t-2 border-gray-200"></div>

    <!-- 상세 정보 -->
    <Card
      id="info"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>🗽️ 상세 정보</template>
      <template #content>
        <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line p-2">
          여기에 상세 설명이 들어갑니다.
        </p>
      </template>
    </Card>

    <div class="border-t-2 border-gray-200"></div>

    <!-- 꿀팁 -->
    <Card
      id="tip"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>✨ 꿀팁</template>
      <template #content>
        <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
          <li>사진 찍기 좋은 시간은 오후 4시</li>
          <li>사람 적을 때 방문하려면 평일 오전 추천</li>
        </ul>
      </template>
    </Card>

    <div class="border-t-2 border-gray-200"></div>

    <!-- 역사 -->
    <Card
      id="history"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📚 역사</template>
      <template #content>
        <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line">
          이곳은 조선 후기 왕실의 건축물로 사용되었던 장소입니다.
        </p>
      </template>
    </Card>

    <div class="border-t-2 border-gray-200"></div>

    <!-- 포토스팟 -->
    <Card
      id="photospot"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📸 포토스팟</template>
      <template #content>
        <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
          <li>정문 앞 분수대</li>
          <li>돌담길 옆 벤치</li>
        </ul>
      </template>
    </Card>

    <div class="border-t-2 border-gray-200"></div>

    <!-- 주변 맛집 -->
    <Card
      id="restaurants"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>🍽️ 주변 맛집</template>
      <template #content>
        <ul class="space-y-3">
          <li class="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
            <div class="font-semibold text-gray-800">한옥식당</div>
            <div class="text-sm text-gray-600">전통 한식 전문점</div>
            <div class="text-xs text-gray-500">도보 5분 거리</div>
          </li>
        </ul>
      </template>
    </Card>

    <div class="border-t-2 border-gray-200"></div>

    <!-- 관련 동영상 -->
    <Card
      id="video"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>📺 관련 동영상</template>
      <template #content>
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-800">관광지 소개 영상</h3>
          <p class="text-sm text-gray-600 mt-1">AI가 추천하는 유튜브 영상입니다.</p>
        </div>
        <div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="관광지 소개 영상"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </template>
    </Card>

    <div class="border-t-2 border-gray-200"></div>

    <!-- 편의시설 -->
    <Card
      id="amenities"
      class="scroll-mt-24 md:shadow-sm md:border-gray-100 md:border-1 border-0 shadow-none"
    >
      <template #title>🚻 편의시설</template>
      <template #content>
        <ul class="list-disc pl-6 text-base text-gray-700 leading-relaxed space-y-2">
          <li>화장실</li>
          <li>휴게 공간</li>
        </ul>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'

const tabScrollRef = ref(null)
const tabs = [
  { label: '기본정보', key: 'basic' },
  { label: '꿀팁', key: 'tip' },
  { label: '상세 정보', key: 'info' },
  { label: '포토스팟', key: 'photospot' },
  { label: '역사', key: 'history' },
  { label: '맛집', key: 'restaurants' },
  { label: '관련 동영상', key: 'video' },
  { label: '편의시설', key: 'amenities' }
]

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function scrollLeft() {
  tabScrollRef.value?.scrollBy({ left: -150, behavior: 'smooth' })
}

function scrollRight() {
  tabScrollRef.value?.scrollBy({ left: 150, behavior: 'smooth' })
}
</script>
