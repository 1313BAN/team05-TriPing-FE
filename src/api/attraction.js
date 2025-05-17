import api from './index'

export const getMarkersInViewport = ({ lat1, lat2, lng1, lng2, zoomLevel }) => {
  return api.get('/attraction/markers', {
    params: { lat1, lat2, lng1, lng2, zoomLevel }
  })
}
