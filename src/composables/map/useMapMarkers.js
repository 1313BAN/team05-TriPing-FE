// useMapMarkers.js
import { getMarkersInViewport } from '@/api/attraction'


let selectedMarkerSet = null
let skipNextClickClear = false
let dragInProgress = false
let mapClickListenerAttached = false

const SELECTED_Z_INDEX = 9999

export function renderMarkersOnMap(data, map, myMarker, router) {
  const markers = []

  // 북쪽(위쪽)에 있는 마커가 더 위에 보이도록 위도 내림차순 정렬
  const sortedData = [...data].sort((a, b) => b.latitude - a.latitude)

  sortedData.forEach((item, index) => {
    const content = document.createElement('div')
    content.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateY(-8px);
        position: relative;
      ">
        <img src="/assets/icons/location.png"
             class="custom-marker"
             style="
               width: 28px;
               height: 28px;
               transition: transform 0.2s ease;
             " />
        <span style="
          margin-top: 2px;
          background: white;
          padding: 2px 6px;
          font-size: 12px;
          font-weight: bold;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          white-space: nowrap;
          transition: transform 0.2s ease;
        ">${item.title}</span>
        <button class="detail-popup" style="
          display: none;
          position: absolute;
          top: 100%;
          margin-top: 8px;
          width: 72px;
          transform: translateX(-50%);
          left: 50%;
          background-color: #e85f5c;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 4px 8px;
          font-size: 11px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          z-index: 10000;
          cursor: pointer;
        ">관광지 정보</button>
      </div>
    `

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(item.latitude, item.longitude),
      map,
      icon: {
        content,
        anchor: new naver.maps.Point(14, 28),
        size: new naver.maps.Size(28, 28)
      },
      zIndex: 1000 - index,
      clickable: true
    })

    marker._originalZIndex = 1000 - index
    marker._customContent = content.firstElementChild

    const detailButton = marker._customContent.querySelector('.detail-popup')
    detailButton.addEventListener('click', (event) => {
      event.stopPropagation()
      router.push(`/attraction/${item.no}`)
    })
    

    naver.maps.Event.addListener(marker, 'click', (e) => {
      e.domEvent.stopPropagation()
      skipNextClickClear = true

      const isSame = selectedMarkerSet?.marker === marker
      if (selectedMarkerSet && !isSame) resetAppearance(selectedMarkerSet)
      if (isSame) {
        resetAppearance(selectedMarkerSet)
        selectedMarkerSet = null
      } else {
        enlargeAppearance({ marker })
        selectedMarkerSet = { marker }
      }
    })

    markers.push({ marker })
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

export async function loadAttractionMarkers({ map, myMarker, setMarkersRef, showSearchButtonRef, router }) {
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

    setMarkersRef.value.forEach(({ marker }) => {
      marker.setMap(null)
    })

    const newMarkers = renderMarkersOnMap(res.data, map, myMarker, router)
    setMarkersRef.value = newMarkers
    showSearchButtonRef.value = false
  } catch (err) {
    console.error('마커 불러오기 실패', err)
  }
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
      if (selectedMarkerSet) {
        resetAppearance(selectedMarkerSet)
        selectedMarkerSet = null
      }
    }, 0)
  })

  mapClickListenerAttached = true
}

function enlargeAppearance(markerObj) {
  const { marker } = markerObj
  const container = marker._customContent
  if (!container) return
  const img = container.querySelector('img')
  const label = container.querySelector('span')
  const detailPopup = container.querySelector('.detail-popup')
  if (img) img.style.transform = 'scale(1.1)'
  if (label) label.style.transform = 'scale(1.1)'
  if (detailPopup) detailPopup.style.display = 'block'
  marker.setZIndex(SELECTED_Z_INDEX)
}

function resetAppearance(markerObj) {
  const { marker } = markerObj
  const container = marker._customContent
  if (!container) return
  const img = container.querySelector('img')
  const label = container.querySelector('span')
  const detailPopup = container.querySelector('.detail-popup')
  if (img) img.style.transform = 'scale(1)'
  if (label) label.style.transform = 'scale(1)'
  if (detailPopup) detailPopup.style.display = 'none'
  if (marker._originalZIndex !== undefined) {
    marker.setZIndex(marker._originalZIndex)
  }
}
