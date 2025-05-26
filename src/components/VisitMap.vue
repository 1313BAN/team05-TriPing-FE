<template>
  <div id="visit-map" class="w-full h-80 rounded-xl border border-gray-200 mb-6"></div>
</template>

<script setup>
import { onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    required: true
  }
})

let map = null
let markers = []

const renderMap = () => {
  if (!props.logs.length) return

  // 중심 좌표 계산
  const center = getCenter(props.logs)

  // 지도 생성 또는 초기화
  map = new naver.maps.Map('visit-map', {
    center: new naver.maps.LatLng(center.lat, center.lng),
    zoom: 14
  })

  // 이전 마커 제거
  markers.forEach((marker) => marker.setMap(null))
  markers = []

  const bounds = new naver.maps.LatLngBounds()

  // 마커 생성
  props.logs.forEach((log, index) => {
    if (!log.latitude || !log.longitude) return

    const latlng = new naver.maps.LatLng(log.latitude, log.longitude)

    const marker = new naver.maps.Marker({
      position: latlng,
      map,
      title: log.title,
      icon: {
        content: `<div style="background:#0064FF;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:semibold;">${index + 1}</div>`,
        size: new naver.maps.Size(28, 28),
        anchor: new naver.maps.Point(14, 14)
      }
    })

    markers.push(marker)
    bounds.extend(latlng)
  })

  // 모든 마커가 화면에 보이도록
  map.fitBounds(bounds)
}

const getCenter = (logs) => {
  const latSum = logs.reduce((sum, log) => sum + parseFloat(log.latitude), 0)
  const lngSum = logs.reduce((sum, log) => sum + parseFloat(log.longitude), 0)

  return {
    lat: latSum / logs.length,
    lng: lngSum / logs.length
  }
}

onMounted(() => {
  renderMap()
})

watch(
  () => props.logs,
  () => {
    nextTick(renderMap)
  }
)
</script>
