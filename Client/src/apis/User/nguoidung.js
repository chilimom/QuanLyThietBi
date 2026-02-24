import axios from '../axios'

export const apiRegister = (data) =>
  axios({
    url: '/nguoidung/createND',
    method: 'post',
    data,
  })

export const apiGetAllNguoiDung = ({ keyword, page = 1, limit = 10 }) =>
  axios({
    url: '/nguoidung/getAllND',
    method: 'get',
    params: {
      keyword,
      page,
      limit,
    },
  })

export const apiDeleteND = (id) =>
  axios({
    url: `/nguoidung/delete/${id}`,
    method: 'delete',
  })

export const apiEditND = (id, data) =>
  axios({
    url: `/nguoidung/update/${id}`,
    method: 'put',
    data,
  })

export const apiEditPass = (id, data) =>
  axios({
    url: `/nguoidung/updatePass/${id}`,
    method: 'put',
    data,
  })

export const apiGetMaNV = () =>
  axios({
    url: '/nguoidung/getMaNV',
    method: 'get',
  })
