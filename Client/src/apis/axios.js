import axios from 'axios'
// import { store } from '../store/redux'

const getPersistedToken = () => {
  try {
    const directToken = localStorage.getItem('token')
    if (directToken) return directToken

    const persisted = localStorage.getItem('persist:QLTB/user')

    if (!persisted) return null

    const parsed = JSON.parse(persisted)
    const rawToken = parsed?.token
    if (!rawToken) return null

    // redux-persist usually stores token as a JSON string (e.g. "\"ey...\"")
    try {
      const token = JSON.parse(rawToken)
      return token || null
    } catch {
      // fallback for legacy persisted formats
      return String(rawToken).replace(/^"+|"+$/g, '') || null
    }
  } catch {
    return localStorage.getItem('token')
  }
}

const resolveBaseUrl = () => {
  const envBaseUrl = (import.meta.env.VITE_API_URI || '').trim()
  if (typeof window === 'undefined') return envBaseUrl || '/api'

  const isLocalClient =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const isLegacyRemoteApi = /^https?:\/\/10\.192\.72\.45:5173\/api\/?$/i.test(envBaseUrl)

  // Safety fallback: when running local UI, always use local proxy /api
  if (isLocalClient && isLegacyRemoteApi) return '/api'
  return envBaseUrl || '/api'
}

const instance = axios.create({
  baseURL: resolveBaseUrl(),
})

instance.interceptors.request.use(
  function (config) {
    const token = getPersistedToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    const contentType = response.headers?.['content-type']

    // Nếu là file blob (Excel, PDF...), giữ nguyên full response
    if (
      contentType?.includes('application/octet-stream') ||
      contentType?.includes('application/vnd.openxmlformats-officedocument')
    ) {
      return response
    }

    // Còn lại thì trả về response.data như cũ
    return response.data
  },
  function (error) {
    // Tránh lỗi không có response
    if (error.response?.data) {
      return Promise.reject(error.response.data)
    } else {
      return Promise.reject({
        status: false,
        message: 'Lỗi kết nối đến server!',
      })
    }
  }
)

export default instance
