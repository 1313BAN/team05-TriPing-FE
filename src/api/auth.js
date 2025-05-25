import api from './index'

export const signUp = (userData) => {
  return api.post('/auth/signup', userData), {skipAuth: true }
}

export const login = (email, password) => {
  return api.post(
    '/auth/login',
    { email, password },
    {
      skipAuth: true
    }
  )
}