import axios from 'axios'
// import { store } from '../store/redux'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
})

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
