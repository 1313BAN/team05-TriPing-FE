import api from './index'

export const createVisitLog = async ({ attractionNo, enteredAt, exitedAt }) => {
  try {
    const res = await api.post('/visit-log', {
      attractionNo,
      enteredAt,
      exitedAt
    })

    if (res.status === 201) {
      console.log('✅ 방문 기록 생성 성공:', res.data)
    }

    return res.data // ✅ 실제로 생성된 visitLogId를 반환
  } catch (err) {
    if (err.response?.status === 409) {
      console.log('❌ 방문 기록 실패:', err.response.data.message)
    } else {
      console.log(
        '❌ 방문 기록 실패:',
        err.response?.status,
        err.response?.data.message || err.message
      )
    }

    return null // 실패 시 null 반환
  }
}

export const editPreference = ({ visitLogId, preference }) => {
  return api.patch(`/visit-log/${visitLogId}/preference?preference=${preference}`)
}

export const getMyVisitLog = (page = 1, size = 10) => {
  return api.get('visit-log/me', {
    params: { page, size }
  })
}

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
