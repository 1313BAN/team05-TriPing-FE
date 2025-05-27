import { ref } from 'vue'
import { loadAttractionMarkers, updateMyMarkerPosition } from '@/composables/map/useMapMarkers'
import { setMockMarker } from '@/composables/location/useGlobalGeolocation'
import { useLocationStore } from '@/stores/locationStore'
import { storeToRefs } from 'pinia'

export function useMapController({ router }) {
  const map = ref(null)
  const myMarker = ref(null)
  const otherMarkers = ref([])

  const locationStore = useLocationStore()
  const { lat, lng } = storeToRefs(locationStore)

  const showAttractionPins = ref(false)
  const showSearchButton = ref(false)

  function initMap() {
    map.value = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat.value, lng.value),
      zoom: 16,
      keyboardShortcuts: false
    })

    myMarker.value = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat.value, lng.value),
      map: map.value,
      icon: {
        url: '/assets/icons/my-location.png',
        size: new naver.maps.Size(36, 36),
        anchor: new naver.maps.Point(18, 18),
        scaledSize: new naver.maps.Size(36, 36)
      },
      zIndex: 999999,
      title: '내 위치'
    })

    window.map = map.value
    setMockMarker(myMarker.value)

    map.value.addListener('dragend', () => {
      if (showAttractionPins.value) showSearchButton.value = true
    })

    map.value.addListener('zoom_changed', () => {
      if (showAttractionPins.value) showSearchButton.value = true
    })

    if (showAttractionPins.value) {
      loadAttractionMarkers({
        map: map.value,
        myMarker: myMarker.value,
        setMarkersRef: otherMarkers,
        showSearchButtonRef: showSearchButton,
        router
      })
    }
  }

  function toggleAttractionPins() {
    showAttractionPins.value = !showAttractionPins.value
    showSearchButton.value = false

    otherMarkers.value.forEach(({ marker }) => {
      marker.setMap(null)
    })

    if (showAttractionPins.value) {
      loadAttractionMarkers({
        map: map.value,
        myMarker: myMarker.value,
        setMarkersRef: otherMarkers,
        showSearchButtonRef: showSearchButton,
        router
      })
    }
  }

  function updateMarker(lat, lng) {
    updateMyMarkerPosition(myMarker.value, lat, lng)
  }

  function handleSearchCurrentMap() {
    loadAttractionMarkers({
      map: map.value,
      myMarker: myMarker.value,
      setMarkersRef: otherMarkers,
      showSearchButtonRef: showSearchButton,
      router
    })
  }

  return {
    map,
    myMarker,
    otherMarkers,
    showAttractionPins,
    showSearchButton,
    initMap,
    toggleAttractionPins,
    updateMarker,
    handleSearchCurrentMap
  }
}
