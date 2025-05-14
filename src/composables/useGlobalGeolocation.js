// src/composables/useGlobalGeolocation.js
import { useLocationStore } from '../stores/locationStore'

let watchId = null // 전역 위치 추적 ID

export function startGlobalGeolocation(minDistance = 5) {
  const store = useLocationStore()

  if (watchId !== null) return // 이미 추적 중이면 무시

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
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

  watchId = navigator.geolocation.watchPosition(
    handlePosition,
    console.error,
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    }
  )
}

export function stopGlobalGeolocation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
}
