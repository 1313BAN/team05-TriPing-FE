import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import buffer from '@turf/buffer'
import { feature } from '@turf/helpers'

export const useEnteredZoneStore = defineStore(
  'enteredZone',
  () => {
    const isEntered = ref(false)
    const attractionId = ref(null)
    const attractionTitle = ref(null)
    const polygonData = ref(null)
    const subAttractions = ref([])
    const enteredSubAttractionId = ref(null)

    const parsedSubAttractions = computed(() =>
      subAttractions.value.map((sub) => {
        const parsed =
          typeof sub.subPolygonJson === 'string'
            ? JSON.parse(sub.subPolygonJson)
            : sub.subPolygonJson

        let bufferedPolygon = parsed
        try {
          const polygonFeature = feature(parsed)
          const buffered = buffer(polygonFeature, 10, { units: 'meters' })
          bufferedPolygon = buffered.geometry
        } catch (e) {
          console.warn(`폴리곤 buffer 실패 (${sub.title}):`, e)
        }

        return {
          ...sub,
          subPolygonJson: bufferedPolygon
        }
      })
    )

    return {
      isEntered,
      attractionId,
      attractionTitle,
      polygonData,
      subAttractions,
      parsedSubAttractions,
      enteredSubAttractionId
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: [
        'isEntered',
        'attractionId',
        'attractionTitle',
        'polygonData',
        'subAttractions',
        'enteredSubAttractionId'
      ]
    }
  }
)
