import api from './index'

export const createVisitLog = async ({ attractionNo, enteredAt, exitedAt }) => {
  try {
    const res = await api.post('/visit-log', {
      attractionNo,
      enteredAt,
      exitedAt
    })

    if (res.status === 201) {
      console.log('✅ 방문 기록 생성 성공')
    }

    return true // 성공 여부만 반환
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

    return false // 실패 여부 반환, throw 하지 않음
  }
}

export const editPreference = ({ visitLogId, preference }) => {
  return api.patch(`/visit-log/${visitLogId}/preference`, {
    preference
  })
}

export const getMyVisitLog = (page = 1, size = 10) => {
  return api.get('visit-log/me', {
    params: { page, size }
  })
}
