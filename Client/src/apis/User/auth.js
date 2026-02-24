import axios from '../axios'

export const apiLogin = (data) =>
  axios({
    url: '/auth/login',
    method: 'post',
    data,
  })

export const apiLogout = (refreshToken) =>
  axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { refreshToken },
  })

export const apigetDetailUser = () =>
  axios({
    url: '/auth/detail',
    method: 'get',
  })
