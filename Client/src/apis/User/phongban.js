import axios from '../axios'

export const apiGetPB = () =>
  axios({
    url: '/phongban/getPB',
    method: 'get',
  })
