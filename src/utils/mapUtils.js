export function animateMarker(marker, fromLat, fromLng, toLat, toLng, duration = 300) {
  const startTime = performance.now()

  function animate(currentTime) {
    const elapsed = currentTime - startTime
    const t = Math.min(elapsed / duration, 1)

    const currentLat = fromLat + (toLat - fromLat) * t
    const currentLng = fromLng + (toLng - fromLng) * t

    marker.setPosition(new naver.maps.LatLng(currentLat, currentLng))

    if (t < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}
