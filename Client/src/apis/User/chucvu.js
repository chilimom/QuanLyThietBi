import axios from '../axios'

export const apiGetChucVu = () =>
  axios({
    url: '/chucvu/getAll',
    method: 'get',
  })

export const apiCreateChucVu = (data) =>
  axios({
    url: '/chucvu/create',
    method: 'post',
    data,
  })

export const apiUpdateChucVu = (id, data) =>
  axios({
    url: `/chucvu/update/${id}`,
    method: 'put',
    data,
  })

export const apiDeleteChucVu = (id) =>
  axios({
    url: `/chucvu/delete/${id}`,
    method: 'delete',
  })

