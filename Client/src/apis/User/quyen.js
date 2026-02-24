import axios from '../axios'

export const apiGetQuyen = () =>
  axios({
    url: '/quyen/getQuyen',
    method: 'get',
  })
