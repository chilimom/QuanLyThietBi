import axios from '../axios'

export const apiGetQuyen = () =>
  axios({
    url: '/quyen/getQuyen',
    method: 'get',
  })

export const apiCreateQuyen = (data) =>
  axios({
    url: '/quyen/create',
    method: 'post',
    data,
  })

export const apiUpdateQuyen = (id, data) =>
  axios({
    url: `/quyen/update/${id}`,
    method: 'put',
    data,
  })

export const apiDeleteQuyen = (id) =>
  axios({
    url: `/quyen/delete/${id}`,
    method: 'delete',
  })
