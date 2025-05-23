<template>
    <div class="p-4 space-y-6">
      <Card class="border-0 shadow-none">
        <template #title>
          <div class="flex justify-between items-center px-2 mb-4">
            <div class="flex items-center gap-3">
              <i class="pi pi-angle-left text-2xl text-gray-500 cursor-pointer" @click="$router.back()"></i>
              <div class="text-2xl font-bold text-gray-900 leading-none">{{ attraction.title }}</div>
            </div>
            <div v-if="attraction.homepage">
              <a
                :href="extractHref(attraction.homepage)"
                target="_blank"
                title="홈페이지 이동"
                class="hover:text-primary/70 transition-colors p-2"
              >
                <i class="pi pi-external-link text-primary text-xl"></i>
              </a>
            </div>
          </div>
        </template>
  
        <template #content>
          <!-- 이미지 -->
          <div class="w-full overflow-hidden rounded-xl grid gap-2 mb-4" :class="{ 'grid-cols-2': hasTwoImages, 'grid-cols-1': hasOneImage }">
            <Image
              v-if="attraction.firstImage1"
              :src="attraction.firstImage1"
              alt="이미지1"
              imageClass="object-cover w-full h-64"
              preview
            />
            <Image
              v-if="attraction.firstImage2"
              :src="attraction.firstImage2"
              alt="이미지2"
              imageClass="object-cover w-full h-64"
              preview
            />
          </div>
  
          <!-- 다녀간 인원 -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center font-semibold text-primary">
            지금까지 총 {{ attraction.visitCount?.toLocaleString() ?? '0' }}명이 방문했어요!
          </div>
  
          <Card class="mt-4 border rounded-md border-gray-200 mb-4">
            <template #content>
              <div class="space-y-2 text-base">
                <div class="flex gap-4">
                  <span class="font-semibold text-gray-700 min-w-[5rem]">주소</span>
                  <span>{{ formatField(attraction.addr1) }}</span>
                </div>
                <div class="flex gap-4">
                  <span class="font-semibold text-gray-700 min-w-[5rem]">전화번호</span>
                  <span>{{ formatField(attraction.tel) }}</span>
                </div>
              </div>
            </template>
          </Card>
  
          <Panel header="개요">
            <p class="text-gray-700 whitespace-pre-line leading-relaxed">
              {{ attraction.overview || '-' }}
            </p>
          </Panel>
        </template>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getAttractionByNo } from '@/api/attraction'
  
  const route = useRoute()
  const router = useRouter()
  const attraction = ref({})
  const loading = ref(true)
  
  const hasOneImage = computed(() => !!(attraction.value.firstImage1 || attraction.value.firstImage2))
  const hasTwoImages = computed(() => !!(attraction.value.firstImage1 && attraction.value.firstImage2))
  
  function formatField(value) {
    return value && value.trim() ? value : '-'
  }
  
  function extractHref(htmlString) {
    const match = htmlString.match(/href=["']([^"']+)["']/i)
    return match ? match[1] : '-'
  }
  
  onMounted(async () => {
    try {
      const { data } = await getAttractionByNo(route.params.id)
      attraction.value = data
    } catch (e) {
      console.error('상세 정보 조회 실패:', e)
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  </style>
  