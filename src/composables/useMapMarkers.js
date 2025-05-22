// useMapMarkers.js

import { createCustomMarkerElement, createMyLocationMarkerElement } from './markerElements'
export { createMyLocationMarkerElement }
import { getMarkersInViewport } from '@/api/attraction'

let selectedMarker = null
let skipNextClickClear = false
let dragInProgress = false
let mapClickListenerAttached = false

export function renderMarkersOnMap(data, map, myMarker) {
  const markers = []

  data.forEach((item, index) => {
    const container = createCustomMarkerElement(item.title)

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(item.latitude, item.longitude),
      map,
      icon: {
        content: container,
        size: new naver.maps.Size(30, 44),
        anchor: new naver.maps.Point(15, 44),
        clickable: true
      },
      title: item.title,
      zIndex: 100 + index,
      hideCollidedMarkers: true,
      hideCollidedCaptions: true
    })

    marker.originalZIndex = marker.getZIndex()
    marker.domElement = container

    naver.maps.Event.addListener(marker, 'click', (e) => {
      e.domEvent.stopPropagation()
      skipNextClickClear = true

      if (selectedMarker && selectedMarker !== marker) {
        resetMarkerAppearance(selectedMarker)
      }

      const isSelected = selectedMarker === marker

      if (isSelected) {
        resetMarkerAppearance(marker)
        selectedMarker = null
      } else {
        marker.setZIndex(99999)
        marker.setIcon({
          ...marker.getIcon(),
          content: createCustomMarkerElement(
            marker.getTitle(),
            '/assets/icons/location.png',
            32,
            true
          )
        })
        selectedMarker = marker
      }
    })

    markers.push(marker)
  })

  attachMapClickListener()

  if (myMarker) {
    myMarker.setZIndex(10000)
    myMarker.setMap(null)
    myMarker.setMap(map)
  }

  return markers
}

export function updateMyMarkerPosition(myMarker, lat, lng) {
  if (myMarker && lat && lng) {
    const pos = new naver.maps.LatLng(lat, lng)
    myMarker.setPosition(pos)
  }
}

export async function loadAttractionMarkers({ map, myMarker, setMarkersRef, showSearchButtonRef }) {
  const bounds = map.getBounds()
  const sw = bounds.getSW()
  const ne = bounds.getNE()
  const zoom = map.getZoom()

  const lat1 = sw.y
  const lat2 = ne.y
  const lng1 = sw.x
  const lng2 = ne.x

  try {
    const res = await getMarkersInViewport({ lat1, lat2, lng1, lng2, zoomLevel: zoom })

    // 기존 마커 제거
    setMarkersRef.value.forEach((m) => m.setMap(null))

    // 새 마커 추가
    const newMarkers = renderMarkersOnMap(res.data, map, myMarker)
    setMarkersRef.value = newMarkers

    // UI 상태 갱신
    showSearchButtonRef.value = false

    if (myMarker) {
      myMarker.setMap(null)
      myMarker.setMap(map)
    }
  } catch (err) {
    console.error('마커 불러오기 실패', err)
  }
}

function resetMarkerAppearance(marker) {
  marker.setZIndex(marker.originalZIndex)
  marker.setIcon({
    ...marker.getIcon(),
    content: createCustomMarkerElement(marker.getTitle(), '/assets/icons/location.png', 32, false)
  })
}

function attachMapClickListener() {
  if (mapClickListenerAttached) return

  const mapContainer = document.getElementById('map')
  if (!mapContainer) return

  mapContainer.addEventListener('mousedown', () => {
    skipNextClickClear = false
    dragInProgress = false
  })

  mapContainer.addEventListener('mousemove', () => {
    dragInProgress = true
  })

  mapContainer.addEventListener('mouseup', () => {
    setTimeout(() => {
      if (skipNextClickClear || dragInProgress) return

      if (selectedMarker) {
        resetMarkerAppearance(selectedMarker)
        selectedMarker = null
      }
    }, 0)
  })

  mapClickListenerAttached = true
}
