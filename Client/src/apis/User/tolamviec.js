import axios from '../axios'

export const apiGetToLamViec = () =>
  axios({
    url: '/tolamviec/getAll',
    method: 'get',
  })

export const apiCreateToLamViec = (data) =>
  axios({
    url: '/tolamviec/create',
    method: 'post',
    data,
  })

export const apiUpdateToLamViec = (id, data) =>
  axios({
    url: `/tolamviec/update/${id}`,
    method: 'put',
    data,
  })

export const apiDeleteToLamViec = (id) =>
  axios({
    url: `/tolamviec/delete/${id}`,
    method: 'delete',
  })

