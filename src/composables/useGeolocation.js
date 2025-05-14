// 위치 추적 로직을 분리한 커스텀 훅
import { onMounted, onUnmounted } from 'vue'
import { useLocationStore } from '../stores/locationStore'

// 지속적 위치 추적을 위한 훅
// - watch: true일 경우 지속 추적 (기본값)
// - minDistance: 최소 위치 변화 거리 (m)
export function useGeolocation(watch = true, minDistance = 5) {
  const store = useLocationStore()
  let watchId = null

  // 두 지점 간 거리 계산 (Haversine 공식을 사용)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000 // 지구 반지름 (m)
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // 위치 업데이트 콜백
  const handlePosition = (pos) => {
    const { latitude, longitude } = pos.coords
    const { lat, lng } = store

    const shouldUpdate =
      lat === null || lng === null || getDistance(lat, lng, latitude, longitude) >= minDistance

    if (shouldUpdate) {
      store.update(latitude, longitude)
    }
  }

  onMounted(() => {
    if (watch) {
      watchId = navigator.geolocation.watchPosition(handlePosition, console.error, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
      })
    } else {
      navigator.geolocation.getCurrentPosition(handlePosition, console.error)
    }
  })

  onUnmounted(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
    }
  })
}