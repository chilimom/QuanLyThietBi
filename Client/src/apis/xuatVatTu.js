
// import axios from './axios'

// export const apiXuatVatTuBulk = (data) =>
// -  axios.post('/XuatVatTu/bulk', data)
// // +  axios.post('/XuatVatTu/bulk', data)

// // export const apiGetXuatVatTuByOrder = (order) =>
// // -  axios.get(`/XuatVatTu/order/${order}`)
// // +  axios.get(`/XuatVatTu/order/${order}`)
// export const apiGetXuatVatTuByOrder = (order) =>
// - + axios.get(`/XuatVatTu/order/${order}`)
// + axios.get(`/XuatVatTu/order/${order}`)
import axios from './axios'

// ✅ PHẢI RETURN axios
export const apiXuatVatTuBulk = (data) =>
  axios.post('/XuatVatTu/bulk', data)

// ✅ KHÔNG CÓ DẤU +
// ✅ KHÔNG COMMENT
export const apiGetXuatVatTuByOrder = (order) =>
  axios.get(`/XuatVatTu/order/${order}`)
export const apiUpdateXuatVatTu = (id, data) =>
  axios.put(`/XuatVatTu/${id}`, data)
