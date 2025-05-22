import { ref, onUnmounted } from 'vue'
import { checkIfEntered } from '@/api/attraction'

export function useGeoFenceChecker(intervalSec = 5) {
  const isInZone = ref(false)
  const polygonData = ref(null)

  let intervalId = null

  const startChecking = (getCurrentPosition) => {
    intervalId = setInterval(async () => {
      const { lat, lng } = getCurrentPosition()
      try {
        const res = await checkIfEntered({ lat, lng })
        if (res.status === 200) {
          isInZone.value = true
          polygonData.value = res.data
        } else if (res.status === 204) {
          isInZone.value = false
          polygonData.value = null
        }
      } catch (e) {
        console.error('지오펜싱 체크 실패:', e)
      }
    }, intervalSec * 1000)
  }

  const stopChecking = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onUnmounted(() => {
    stopChecking()
  })

  return {
    isInZone,
    polygonData,
    startChecking,
    stopChecking
  }
}
