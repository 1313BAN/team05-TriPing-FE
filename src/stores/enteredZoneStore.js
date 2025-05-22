import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEnteredZoneStore = defineStore(
  'enteredZone',
  () => {
    const isEntered = ref(false)
    const attractionId = ref(null)
    const polygonData = ref(null)

    return {
      isEntered,
      attractionId,
      polygonData
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['isEntered', 'attractionId', 'polygonData']
    }
  }
)
