import api from './index'

export const fetchRecommendedAttractions = async (lat, lng) => {
  try {
    const res = await api.get('/recommendation/attractions', {
      params: { lat, lng }
    })

    if (res.status === 200) {
      console.log('✅ 추천 결과:', res.data)
      return res.data // 추천 장소 리스트 반환
    }
  } catch (err) {
    console.error('❌ 추천 API 호출 실패:', err.response?.data?.message || err.message)
    return []
  }
}
  