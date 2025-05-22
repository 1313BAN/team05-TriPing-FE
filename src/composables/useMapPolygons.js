// @/composables/useMapPolygons.js

export function drawGeoPolygon(map, geoJson, prevPolygon) {
  if (!geoJson?.coordinates?.[0]) return prevPolygon

  const coords = geoJson.coordinates[0]
  const path = coords.map((coord) => new naver.maps.LatLng(coord[1], coord[0]))

  if (prevPolygon) fadeOutPolygon(prevPolygon)

  const polygon = new naver.maps.Polygon({
    map,
    paths: path,
    strokeColor: '#0064FF',
    strokeOpacity: 0,
    strokeWeight: 3,
    fillColor: '#0064FF',
    fillOpacity: 0
  })

  animatePolygonFadeIn(polygon, {
    targetFillOpacity: 0.15,
    targetStrokeOpacity: 1,
    duration: 300
  })

  return polygon
}

export function fadeOutPolygon(polygon, duration = 300) {
  const startFill = polygon.getOptions('fillOpacity') || 0.15
  const startStroke = polygon.getOptions('strokeOpacity') || 1
  const start = performance.now()

  function step(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)

    polygon.setOptions({
      fillOpacity: startFill * (1 - progress),
      strokeOpacity: startStroke * (1 - progress)
    })

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      polygon.setMap(null)
    }
  }

  requestAnimationFrame(step)
}

function animatePolygonFadeIn(
  polygon,
  { targetFillOpacity = 0.15, targetStrokeOpacity = 1, duration = 300 }
) {
  const start = performance.now()

  function step(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)

    polygon.setOptions({
      fillOpacity: targetFillOpacity * progress,
      strokeOpacity: targetStrokeOpacity * progress
    })

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}
