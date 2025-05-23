import api from './index'

// 뷰포트에 포함되는 Attraction 마커 정보 조회
export const getMarkersInViewport = ({ lat1, lat2, lng1, lng2, zoomLevel }) => {
  return api.get('/attraction/markers', {
    params: { lat1, lat2, lng1, lng2, zoomLevel }
  })
}

// 위치 기반 진입 여부 확인
export const checkIfEntered = ({ lat, lng }) => {
  return api.get('/attraction/entered', {
    params: { lat, lng }
  })
}

// Attraction 상세 정보 조회
export const getAttractionByNo = (no) => {
  return api.get(`/attraction/${no}`)
}

// 상위 attraction no를 기반으로 subAttraction 정보와 폴리곤 리스트 조회
export const getSubAttractions = (attractionNo) => {
  return api.get(`/attraction/${attractionNo}/subs`)
}
