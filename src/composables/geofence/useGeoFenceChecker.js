import { ref, watch, onUnmounted } from 'vue'
import { checkIfEntered, getSubAttractions } from '@/api/attraction'
import debounce from 'lodash.debounce'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { storeToRefs } from 'pinia'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'

export function useGeoFenceChecker() {
  const store = useEnteredZoneStore()
  const {
    isEntered,
    attractionId,
    attractionTitle,
    polygonData,
    subAttractions,
    enteredSubAttractionId,
    parsedSubAttractions
  } = storeToRefs(store)

  let stopWatching = null

  const resetEnteredZone = () => {
    isEntered.value = false
    attractionId.value = null
    attractionTitle.value = null
    polygonData.value = null
    subAttractions.value = []
    enteredSubAttractionId.value = null
  }

  const isInsideGeoJson = (geoJson, lat, lng) => {
    try {
      return booleanPointInPolygon(point([lng, lat]), geoJson)
    } catch (e) {
      console.error('Turf.js 검사 실패:', e)
      return false
    }
  }

  const checkSubAttractionEntry = (lat, lng) => {
    const found = parsedSubAttractions.value.find((sub) =>
      isInsideGeoJson(sub.subPolygonJson, lat, lng)
    )
    enteredSubAttractionId.value = found ? found.no : null
  }

  const startChecking = (getCurrentPosition) => {
    const runCheck = debounce(async () => {
      const { lat, lng } = getCurrentPosition()

      // 이미 진입 상태면 polygon 직접 판단
      if (isEntered.value && polygonData.value && polygonData.value.type === 'Polygon') {
        const inside = isInsideGeoJson(polygonData.value, lat, lng)
        if (!inside) {
          resetEnteredZone()
        } else {
          checkSubAttractionEntry(lat, lng)
        }
        return
      }

      // 서버 기반 판단
      try {
        const res = await checkIfEntered({ lat, lng })

        if (res.status === 200) {
          isEntered.value = true
          attractionId.value = res.data.no
          attractionTitle.value = res.data.title
          polygonData.value = JSON.parse(res.data.polygonJson)

          const subRes = await getSubAttractions(res.data.no)
          subAttractions.value = subRes.data

          checkSubAttractionEntry(lat, lng)
        } else {
          resetEnteredZone()
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
