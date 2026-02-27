import axios from 'axios'
// import { store } from '../store/redux'

const getPersistedToken = () => {
  try {
    const persisted = localStorage.getItem('persist:QLTB/user')
    const directToken = localStorage.getItem('token')

    if (!persisted) return directToken || null

    const parsed = JSON.parse(persisted)
    const rawToken = parsed?.token
    if (!rawToken) return directToken || null

    // redux-persist usually stores token as a JSON string (e.g. "\"ey...\"")
    try {
      const token = JSON.parse(rawToken)
      return token || directToken || null
    } catch {
      // fallback for legacy persisted formats
      return String(rawToken).replace(/^"+|"+$/g, '') || directToken || null
    }
  } catch {
    return localStorage.getItem('token')
  }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
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
