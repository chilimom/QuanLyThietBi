import axios from '../axios'

export const apiGetPhanXuong = () =>
  axios({
    url: '/phanxuong/getAll',
    method: 'get',
  })

export const apiCreatePhanXuong = (data) =>
  axios({
    url: '/phanxuong/create',
    method: 'post',
    data,
  })

export const apiUpdatePhanXuong = (id, data) =>
  axios({
    url: `/phanxuong/update/${id}`,
    method: 'put',
    data,
  })

export const apiDeletePhanXuong = (id) =>
  axios({
    url: `/phanxuong/delete/${id}`,
    method: 'delete',
  })

