// useMapMarkers.js

import { createCustomMarkerElement, createMyLocationMarkerElement } from './markerElements'
export { createMyLocationMarkerElement }


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
