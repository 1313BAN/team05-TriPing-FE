export function drawGeoPolygon(map, polygonData, prevPolygon) {
  if (!polygonData?.polygonJson) return prevPolygon

  const geoJson = JSON.parse(polygonData.polygonJson)
  const coords = geoJson.coordinates[0]
  const path = coords.map((coord) => new naver.maps.LatLng(coord[1], coord[0]))

  if (prevPolygon) prevPolygon.setMap(null)

  const newPolygon = new naver.maps.Polygon({
    map,
    paths: path,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.3
  })

  return newPolygon
}
