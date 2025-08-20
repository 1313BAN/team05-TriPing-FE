import axios from 'axios'
import router from '@/plugins/router'
import { jwtDecode } from 'jwt-decode'

function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    return exp < now
  } catch (e) {
    console.warn('JWT 디코딩 실패:', e)
    return true
  }
}


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// request 인터셉터
api.interceptors.request.use((config) => {
  const publicPaths = [
    '/auth/login', 
    '/auth/signup', 
    '/auth/forgot-password',
    '/attraction/entered',  // 지오펜싱 진입 확인
    '/attraction/markers',  // 뷰포트 마커 조회
    '/attraction/',         // attraction 정보 조회 (상세정보, sub-attractions 포함)
  ]
  const isPublic = publicPaths.some((path) => config.url?.includes(path))
  if (isPublic) {
    return config
  }
  
  const token = localStorage.getItem('accessToken')
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('accessToken')
    router.push('/login')
    return Promise.reject(new Error('Token expired'))
  }

  config.headers.Authorization = `Bearer ${token}`
  return config
})


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
