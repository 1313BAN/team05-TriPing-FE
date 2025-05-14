// 사용자의 위치 정보를 전역에서 관리하는 Pinia 스토어
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
  state: () => ({
    lat: null,
    lng: null,
    isDevMode: false
  }),
  actions: {
    // 위도, 경도 업데이트
    update(lat, lng) {
      this.lat = lat
      this.lng = lng
    },

    // 개발자 모드용 위치 이동
    moveBy(deltaLat, deltaLng) {
      if (this.lat !== null && this.lng !== null) {
        this.lat += deltaLat
        this.lng += deltaLng
      }
    },

    toggleDevMode() {
      this.isDevMode = !this.isDevMode
    }
  }
})
