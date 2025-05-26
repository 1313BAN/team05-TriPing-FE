import { useDevStore } from '../../stores/devStore'
import { useLocationStore } from '../../stores/locationStore'
import { animateMarker } from '@/utils/mapUtils'
// 전역에서 선언되어야 유지됨
let watchId = null
let mockPosition = { lat: 37.5665, lng: 126.978 } // 초기 mock 위치
let marker = null

export function setMockMarker(m) {
  marker = m
}

export function startGlobalGeolocation(minDistance = 5) {
  stopGlobalGeolocation() // 항상 초기화하고 시작

  const store = useLocationStore()
  const devStore = useDevStore()

  if (devStore.devMode) {
    store.update(mockPosition.lat, mockPosition.lng)
    // console.log('[DEV MODE] Mock 위치 초기 설정됨')

    // 방향키 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyMove)

    return
  }

  // 실제 위치 추적
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handlePosition = (pos) => {
    const { latitude, longitude } = pos.coords
    const { lat, lng } = store

    const shouldUpdate =
      lat === null || lng === null || getDistance(lat, lng, latitude, longitude) >= minDistance

    if (shouldUpdate) {
      store.update(latitude, longitude)
    }
  }

  watchId = navigator.geolocation.watchPosition(handlePosition, console.error, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000
  })
}

export function stopGlobalGeolocation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }

  // 방향키 이벤트 제거
  window.removeEventListener('keydown', handleKeyMove)
}

function handleKeyMove(e) {
  const step = 0.0001
  switch (e.key) {
    case 'ArrowUp':
      mockPosition.lat += step
      break
    case 'ArrowDown':
      mockPosition.lat -= step
      break
    case 'ArrowLeft':
      mockPosition.lng -= step
      break
    case 'ArrowRight':
      mockPosition.lng += step
      break
    default:
      return
  }

  const store = useLocationStore()
  store.update(mockPosition.lat, mockPosition.lng)

  if (marker) {
    const current = marker.getPosition()
    animateMarker(marker, current.lat(), current.lng(), mockPosition.lat, mockPosition.lng)
  }

  // console.log('[DEV MODE] 방향키 위치 갱신:', mockPosition.lat, mockPosition.lng)
}
