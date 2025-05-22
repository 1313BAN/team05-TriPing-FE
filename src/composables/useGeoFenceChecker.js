import { ref, watch, onUnmounted } from 'vue'
import { checkIfEntered } from '@/api/attraction'
import debounce from 'lodash.debounce'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { storeToRefs } from 'pinia'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'

export function useGeoFenceChecker() {
  const store = useEnteredZoneStore()
  const { isEntered, attractionId, polygonData } = storeToRefs(store)

  let stopWatching = null

  const startChecking = (getCurrentPosition) => {
    const runCheck = debounce(async () => {
      const { lat, lng } = getCurrentPosition()

      // 이미 들어간 상태면 turf로 직접 판단 (API 호출 X)
      if (
        isEntered.value &&
        polygonData.value &&
        polygonData.value.type === 'Polygon' &&
        Array.isArray(polygonData.value.coordinates)
      ) {
        try {
          const inside = booleanPointInPolygon(point([lng, lat]), polygonData.value)
          if (!inside) {
            isEntered.value = false
            attractionId.value = null
            polygonData.value = null
          }
        } catch (e) {
          console.error('Turf.js polygon 검사 실패:', e)
        }
        return
      }

      try {
        const res = await checkIfEntered({ lat, lng })
        if (res.status === 200) {
          isEntered.value = true
          attractionId.value = res.data.id
          polygonData.value = JSON.parse(res.data.polygonJson) // ← GeoJSON으로 파싱해서 저장
        } else if (res.status === 204) {
          isEntered.value = false
          attractionId.value = null
          polygonData.value = null
        }
      } catch (e) {
        console.error('지오펜싱 체크 실패:', e)
      }
    }, 500)

    stopWatching = watch(
      () => getCurrentPosition(),
      () => runCheck(),
      { immediate: true, deep: false }
    )
  }

  const stopChecking = () => {
    if (stopWatching) {
      stopWatching()
      stopWatching = null
    }
  }

  onUnmounted(() => {
    stopChecking()
  })

  return {
    startChecking,
    stopChecking
  }
}
