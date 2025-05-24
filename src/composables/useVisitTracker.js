import { watch } from 'vue'
import { useEnteredZoneStore } from '@/stores/enteredZoneStore'
import { useLocationStore } from '@/stores/locationStore'
import { useVisitTrackerStore } from '@/stores/visitTrackerStore'

export function useVisitTracker() {
  const store = useEnteredZoneStore()
  const locationStore = useLocationStore()
  const visitState = useVisitTrackerStore()

  // 테스트용 시간 (ms)
  const CONFIRM_TIME = 3000  // 관광지 확정 대기 시간 (배포환경 30초)
  const FINALIZE_TIME = 10000  // 외출 유예 시간 (배포환경 3분)
  const MIN_STAY_TIME = 15000  // 최소 체류 시간 (배포환경 5분)

  const finalizeVisit = () => {
    const duration = visitState.totalStayTime
    console.log(`🔍 최종 체류시간: ${Math.floor(duration / 1000)}초`)

    if (duration >= MIN_STAY_TIME) {
      console.log(
        `방문 처리: ${visitState.lastConfirmedId}, 체류 ${Math.floor(duration / 1000)}초`
      )
      // TODO: 서버 전송 로직 삽입 가능
    } else {
      console.log(`방문 실패: ${Math.floor(duration / 1000)}초 < ${MIN_STAY_TIME / 1000}초`)
    }

    visitState.reset() // 상태 초기화
  }

  const handleLocationChange = (attractionId, isEntered, prevEntered) => {
    const now = Date.now()

    if (isEntered) {
      if (attractionId === visitState.attractionId) {
        if (!visitState.isActive && visitState.confirmStartTime) {
          const elapsed = now - visitState.confirmStartTime
          if (elapsed >= CONFIRM_TIME) {
            visitState.entryTime = now - CONFIRM_TIME
            visitState.isActive = true
            visitState.isPending = false
            visitState.confirmStartTime = null
            visitState.pendingAttractionId = null
            visitState.lastConfirmedId = attractionId
            console.log(`✅ 관광지 확정: ${attractionId}`)
          }
        } else if (visitState.isActive) {
          visitState.entryTime = now
          console.log(`↩️ 재진입: ${attractionId}`)
        }
        return
      }

      if (attractionId !== visitState.pendingAttractionId && attractionId !== null) {
        visitState.pendingAttractionId = attractionId
        visitState.confirmStartTime = now
        console.log(`⏳ 새 관광지 후보: ${attractionId}`)
      }
    }

    if (!isEntered && prevEntered) {
      if (visitState.isActive && visitState.entryTime) {
        visitState.totalStayTime += now - visitState.entryTime
        visitState.entryTime = null
        visitState.lastExitTime = now
        visitState.exitedAttractionId = visitState.attractionId
        console.log(
          `🚪 이탈: ${visitState.attractionId}, 누적 ${Math.floor(visitState.totalStayTime / 1000)}초`
        )
      }
    }
  }

  watch(
    () => ({
      attractionId: store.attractionId,
      isEntered: store.isEntered
    }),
    (current, previous) => {
      const { attractionId, isEntered } = current
      const prevEntered = previous?.isEntered ?? false
      handleLocationChange(attractionId, isEntered, prevEntered)
    },
    { immediate: true }
  )

  watch(
    [() => locationStore.lat, () => locationStore.lng],
    () => {
      const now = Date.now()

      if (
        store.attractionId === null &&
        visitState.isActive &&
        visitState.lastExitTime &&
        visitState.exitedAttractionId &&
        Math.floor((now - visitState.lastExitTime) / 1000) >= FINALIZE_TIME / 1000
      ) {
        console.log(`⏰ ${FINALIZE_TIME / 1000}초 경과 (null 상태), 최종 처리`)
        visitState.attractionId = visitState.exitedAttractionId
        visitState.lastConfirmedId = visitState.exitedAttractionId
        finalizeVisit()
        return
      }

      const confirmedId = visitState.pendingAttractionId
      if (
        confirmedId &&
        visitState.confirmStartTime &&
        now - visitState.confirmStartTime >= CONFIRM_TIME
      ) {
        if (store.attractionId === confirmedId && store.isEntered) {
          if (
            visitState.attractionId &&
            visitState.attractionId !== confirmedId &&
            (visitState.isActive || visitState.totalStayTime > 0)
          ) {
            console.log(`🔄 다른 관광지 확정됨. 이전 방문 처리: ${visitState.attractionId}`)
            finalizeVisit()
          }

          visitState.attractionId = confirmedId
          visitState.entryTime = now - CONFIRM_TIME
          visitState.totalStayTime = CONFIRM_TIME
          visitState.isActive = true
          visitState.isPending = false
          visitState.pendingAttractionId = null
          visitState.confirmStartTime = null
          visitState.lastConfirmedId = confirmedId
          console.log(`✅ 관광지 확정됨: ${confirmedId}`)
        }
      }
    },
    { immediate: true }
  )

  return {
    getState: () => ({ ...visitState })
  }
}
