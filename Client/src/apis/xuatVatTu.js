
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
export const apiDeleteXuatVatTu = async (id) => {
  try {
    return await axios.delete(`/XuatVatTu/delete/${id}`)
  } catch (err) {
    // Tuong thich backend cu chi co route DELETE /XuatVatTu/{id}
    if (err?.status === 404 || err?.response?.status === 404) {
      return axios.delete(`/XuatVatTu/${id}`)
    }
    throw err
  }
}
