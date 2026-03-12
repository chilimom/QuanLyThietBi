import axios from './axios'

export const apiGetNhomThietBiKhuVuc = () =>
  axios({
    url: '/thietbikhuvuc/groups',
    method: 'get',
  })

export const apiCreateNhomThietBiKhuVuc = (data) =>
  axios({
    url: '/thietbikhuvuc/groups',
    method: 'post',
    data,
  })

export const apiUpdateNhomThietBiKhuVuc = (id, data) =>
  axios({
    url: `/thietbikhuvuc/groups/${id}`,
    method: 'put',
    data,
  })

export const apiDeleteNhomThietBiKhuVuc = (id) =>
  axios({
    url: `/thietbikhuvuc/groups/${id}`,
    method: 'delete',
  })

export const apiGetThietBiKhuVuc = ({
  phanXuongId,
  nhomThietBi,
  keyword,
  page = 1,
  limit = 10,
}) =>
  axios({
    url: '/thietbikhuvuc/get',
    method: 'get',
    params: {
      phanXuongId,
      nhomThietBi,
      keyword,
      page,
      limit,
    },
  })

export const apiCreateThietBiKhuVuc = (data) =>
  axios({
    url: '/thietbikhuvuc/create',
    method: 'post',
    data,
  })

export const apiUpdateThietBiKhuVuc = (id, data) =>
  axios({
    url: `/thietbikhuvuc/update/${id}`,
    method: 'put',
    data,
  })

export const apiDeleteThietBiKhuVuc = (id) =>
  axios({
    url: `/thietbikhuvuc/delete/${id}`,
    method: 'delete',
  })

export const apiGetThietBiKhuVucStatistics = (phanXuongId) =>
  axios({
    url: '/thietbikhuvuc/statistics',
    method: 'get',
    params: {
      phanXuongId,
    },
  })
