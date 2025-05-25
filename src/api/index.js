import axios from 'axios'
import * as jwt_decode from 'jwt-decode'
import router from '@/plugins/router' // 라우터 객체 import

function isTokenExpired(token) {
  try {
    const { exp } = jwt_decode(token)
    const now = Math.floor(Date.now() / 1000)
    return exp < now
  } catch (e) {
    return true // 디코딩 실패 시 만료 처리
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// request 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      if (isTokenExpired(token)) {
        // 만료된 경우
        localStorage.removeItem('accessToken')
        router.push('/login') // 로그인 페이지로 이동
        return Promise.reject(new Error('Token expired'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// response 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('accessToken')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api
