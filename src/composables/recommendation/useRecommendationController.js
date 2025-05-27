// composables/recommendation/useRecommendationController.js
import { ref } from 'vue'

export function useRecommendationController(mapRef, latRef, lngRef) {
  const recommendationMarker = ref(null)
  const routeLine = ref(null)
  const isNavigating = ref(false)

  const moveToLocation = (locationData) => {
    if (!mapRef.value) return

    const { latitude, longitude, title } = locationData

    if (recommendationMarker.value) {
      recommendationMarker.value.setMap(null)
      recommendationMarker.value = null
    }

    const newCenter = new naver.maps.LatLng(latitude, longitude)
    mapRef.value.morph(newCenter, 16, { duration: 1000, easing: 'easeOutCubic' })

    addRecommendationMarker(latitude, longitude, title)
  }

  const addRecommendationMarker = (lat, lng, title) => {
    const position = new naver.maps.LatLng(lat, lng)

    recommendationMarker.value = new naver.maps.Marker({
      position,
      map: mapRef.value,
      title,
      icon: {
        content: `
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            white-space: nowrap;
            position: relative;
            animation: bounce 0.6s ease-out;
          ">
            🤖 ${title}
          </div>
          <style>
            @keyframes bounce {
              0% { transform: scale(0) translateY(20px); opacity: 0; }
              50% { transform: scale(1.1) translateY(-5px); opacity: 0.8; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
          </style>
        `,
        anchor: new naver.maps.Point(50, 30)
      },
      zIndex: 1000
    })

    naver.maps.Event.addListener(recommendationMarker.value, 'click', () => {
      drawRouteToDestination(lat, lng)
    })
  }

  const drawRouteToDestination = (destLat, destLng) => {
    if (routeLine.value) routeLine.value.setMap(null)

    const myLocation = new naver.maps.LatLng(latRef.value, lngRef.value)
    const destination = new naver.maps.LatLng(destLat, destLng)

    routeLine.value = new naver.maps.Polyline({
      map: mapRef.value,
      path: [myLocation, destination],
      strokeColor: '#667eea',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      strokeStyle: [10, 5],
      strokeLineCap: 'round',
      strokeLineJoin: 'round'
    })

    isNavigating.value = true
  }

  const stopNavigation = () => {
    if (routeLine.value) {
      routeLine.value.setMap(null)
      routeLine.value = null
    }

    if (recommendationMarker.value) {
      recommendationMarker.value.setMap(null)
      recommendationMarker.value = null
    }

    isNavigating.value = false
  }

  const updateRouteLineIfNeeded = (newLat, newLng) => {
    if (isNavigating.value && routeLine.value && recommendationMarker.value) {
      const myLocation = new naver.maps.LatLng(newLat, newLng)
      const destination = recommendationMarker.value.getPosition()
      routeLine.value.setPath([myLocation, destination])
    }
  }

  return {
    moveToLocation,
    stopNavigation,
    isNavigating,
    updateRouteLineIfNeeded
  }
}
