import api from './index'

export const getMyInfo = () => {
  return api.get('/user/me')
}

export const updateMyInfo = (userData) => {
  return api.put('/user/me', userData)
}

export const changePassword = ({ currentPassword, newPassword }) => {
  return api.put('/user/password', { currentPassword, newPassword })
}

export const deleteMyAccount = () => {
  return api.delete('/user/me')
}
