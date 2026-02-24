import axios from '../axios'

export const apiCreateNV = (data) =>
  axios({
    url: '/nhanvien/createNV',
    method: 'post',
    data,
  })

export const apiGetNV = ({ keyword, page = 1, limit = 10 }) =>
  axios({
    url: '/nhanvien/getNV',
    method: 'get',
    params: {
      keyword,
      page,
      limit,
    },
  })

export const apiDeleteNV = (id) =>
  axios({
    url: `/nhanvien/delete/${id}`,
    method: 'delete',
  })

export const apiEditNV = (id, data) =>
  axios({
    url: `/nhanvien/update/${id}`,
    method: 'put',
    data,
  })
