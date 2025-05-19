import api from './index' // 기존에 만든 axios 인스턴스 사용

export const getMyInfo = () => {
  const token = localStorage.getItem('accessToken')
  return api.get('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const updateMyInfo = (userData) => {
  const token = localStorage.getItem('accessToken')

  return api.put('/user/me', userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const changePassword = ({ currentPassword, newPassword }) => {
  const token = localStorage.getItem('accessToken')

  return api.put('/user/password', { currentPassword, newPassword }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deleteMyAccount = () => {
  const token = localStorage.getItem('accessToken')

  return api.delete('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}