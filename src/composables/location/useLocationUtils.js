export function getCurrentPositionFromStore(latRef, lngRef) {
  return {
    lat: latRef.value,
    lng: lngRef.value
  }
}