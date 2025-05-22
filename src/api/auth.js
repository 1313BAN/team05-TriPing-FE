import api from './index'

export const signUp = (userData) => {
  return api.post('/auth/signup', userData)
}
