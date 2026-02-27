import axios from '../axios'

export const apiGetKipLamViec = () =>
  axios({
    url: '/kiplamviec/getAll',
    method: 'get',
  })

export const apiCreateKipLamViec = (data) =>
  axios({
    url: '/kiplamviec/create',
    method: 'post',
    data,
  })

export const apiUpdateKipLamViec = (id, data) =>
  axios({
    url: `/kiplamviec/update/${id}`,
    method: 'put',
    data,
  })

export const apiDeleteKipLamViec = (id) =>
  axios({
    url: `/kiplamviec/delete/${id}`,
    method: 'delete',
  })

