import api from './index'

// 로그인 상태 확인 함수
const isLoggedIn = () => {
  const token = localStorage.getItem('accessToken')
  return !!token
}

export const createVisitLog = async ({ attractionNo, enteredAt, exitedAt }) => {
  // 로그인되지 않은 경우 API 호출하지 않고 특별한 응답 반환
  if (!isLoggedIn()) {
    console.log('🔐 비로그인 사용자 - 방문 기록을 생성하지 않습니다.')
    return { isNotLoggedIn: true } // 비로그인 상태임을 알리는 특별한 응답
  }

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