<template>
  <transition
    name="slide"
    style="
      box-shadow:
        0 -4px 6px -1px rgba(0, 0, 0, 0.1),
        0 -2px 4px -2px rgba(0, 0, 0, 0.1);
    "
  >
    <div
      v-if="visible"
      class="absolute bottom-0 left-0 w-full z-[9999] bg-white rounded-t-2xl h-[300px] overflow-hidden"
    >
      <!-- 슬라이드 컨테이너 -->
      <div class="relative w-full h-full">
        <!-- ➡️ 오른쪽 이동 버튼 (메인 관광지 화면에서만) -->
        <button
          v-if="!isSubActive"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:cursor-pointer"
        >
          <i class="pi pi-angle-right text-3xl text-gray-700"></i>
        </button>

        <!-- ⬅️ 왼쪽 이동 버튼 (서브 관광지 화면에서만) -->
        <button
          v-if="isSubActive"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:cursor-pointer"
        >
          <i class="pi pi-angle-left text-3xl text-gray-700"></i>
        </button>

        <!-- 메인 관광지 -->
        <div
          class="absolute w-full h-full transition-transform duration-300"
          :class="{ 'translate-x-0': !isSubActive, '-translate-x-full': isSubActive }"
        >
          <div class="flex flex-col h-full items-center">
            <div class="flex-1 flex flex-col items-center justify-center w-full">
              <h2 class="text-2xl font-bold text-center">{{ attractionTitle }} 안에 있어요</h2>
              <p class="text-lg font-normal text-center text-gray-500 mt-4">
                처음 왔다면 꼭 봐야 해요! AI가 정리한
                <strong class="font-semibold">{{ attractionTitle }}</strong> 핵심 가이드 🗺️
              </p>
            </div>
            <div class="flex flex-col w-full justify-around px-4 gap-5 pb-6">
              <Button
                label="AI 가이드 확인하기"
                class="btn-primary w-[80%] mx-auto text-lg"
                @click="onGuideClick(attractionTitle)"
              ></Button>
              <Button
                label="관광지 정보 보기"
                severity="secondary"
                class="w-[80%] mx-auto text-lg"
                @click="onInfoClick"
              ></Button>
            </div>
          </div>
        </div>

        <!-- 서브 관광지 -->
        <div
          class="absolute w-full h-full transition-transform duration-300"
          :class="{ 'translate-x-full': !isSubActive, 'translate-x-0': isSubActive }"
        >
          <div class="flex flex-col h-full items-center">
            <div
              class="flex-1 flex flex-col items-center justify-center w-full transition-opacity duration-0"
              :class="[
                isSubActive
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none invisible'
              ]"
            >
              <h2 class="text-2xl font-bold text-center">
                {{ subAttractionTitle }} 근처에 도착했어요
              </h2>
              <p class="text-lg font-normal text-center text-gray-500 mt-4 mb-2">
                {{ attractionTitle }} 탐방은 즐거우신가요? <br />
                AI가 들려주는 <strong class="font-semibold">{{ subAttractionTitle }}</strong
                >의 이야기를 확인해보세요!
              </p>
            </div>

            <div class="flex flex-col w-full justify-around px-4 gap-5 pb-6">
              <Button
                label="AI 가이드 확인하기"
                class="btn-primary w-[80%] mx-auto text-lg"
                @click="onGuideClick(subAttractionTitle)"
              ></Button>
              <!-- 관광지 정보 버튼 없음 -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { useRouter } from 'vue-router'

const { isEntered, attractionTitle, attractionId, enteredSubAttractionId, subAttractions } =
  storeToRefs(useEnteredZoneStore())
const router = useRouter()

const visible = isEntered
const isSubActive = computed(() => enteredSubAttractionId.value !== null)

const subAttractionTitle = computed(() => {
  const sub = subAttractions.value.find((s) => s.no === enteredSubAttractionId.value)
  return sub?.title || ''
})

function onGuideClick(title) {
  console.log(`${title} 가이드 클릭`)
}

function onInfoClick() {
  if (!attractionId.value) return
  router.push(`/attraction/${attractionId.value}`)
}
</script>

<style scoped>
.translate-x-0 {
  transform: translateX(0%);
}
.translate-x-full {
  transform: translateX(100%);
}
.-translate-x-full {
  transform: translateX(-100%);
}

/* 슬라이드 업/다운 애니메이션 */
.slide-enter-from {
  transform: translateY(100%);
}
.slide-enter-to {
  transform: translateY(0%);
}
.slide-leave-from {
  transform: translateY(0%);
}
.slide-leave-to {
  transform: translateY(100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
</style>
