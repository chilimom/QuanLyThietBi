// // import axios from './axios'

// // export const apiCreateVT = (data) =>
// //   axios({
// //     url: '/VatTu/CreateVT',
// //     method: 'post',
// //     data,
// //     // PhanXuongId: phanXuongId
// //   })


// // export const apiGetVT = ({ begind, endd, keyword, PhanXuongId, page = 1, limit = 10 }) =>
// //   axios({
// //     url: '/VatTu/getVT',
// //     method: 'get',
// //     params: {
// //       begind,
// //       endd,
// //       keyword,
// //       PhanXuongId,
// //       page,
// //       limit,
// //     },
// //   });

// // export const apiDeleteVT = (id) =>
// //   axios({
// //     url: `/VatTu/delete/${id}`,
// //     method: 'delete',
// //   })

// // export const apiEditVT = (id, data) =>
// //   axios({
// //     url: `/VatTu/update/${id}`,
// //     method: 'put',
// //     data,
// //     PhanXuongId: phanXuongId
// //   })

// // export const apiExportExcelvattu = (begind, endd, PhanXuongId) =>
// //   axios({
// //     url: '/VatTu/exportExcel',
// //     method: 'get',
// //     params: {
// //       begind,
// //       endd,
// //       PhanXuongId,
// //     },
// //     responseType: 'blob',
// //   })
// // export const phanXuongAPI = {
// //   getAll: () => axios.get('/api/PhanXuong/getAll')
// // };
// // // export const apiGetPhanXuong = () =>
// // //   axios.get('/api/PhanXuong/getAll')
// import axios from './axios'

// // ================= VT =================
// export const apiCreateVT = (data) =>
//   axios({
//     url: '/VatTu/CreateVT',
//     method: 'post',
//     data,
//   })

// export const apiGetVT = ({ begind, endd, keyword, PhanXuongId, page = 1, limit = 10 }) =>
//   axios({
//     url: '/VatTu/getVT',
//     method: 'get',
//     params: {
//       begind,
//       endd,
//       keyword,
//       phanXuongId,
//       page,
//       limit,
//     },
//   })

// export const apiDeleteVT = (id) =>
//   axios({
//     url: `/VatTu/delete/${id}`,
//     method: 'delete',
//   })

// export const apiEditVT = (id, data) =>
//   axios({
//     url: `/VatTu/update/${id}`,
//     method: 'put',
//     data,
//   })

// export const apiExportExcelvattu = ({ begind, endd, PhanXuongId }) =>
//   axios({
//     url: '/VatTu/exportExcel',
//     method: 'get',
//     params: {
//       begind,
//       endd,
//       PhanXuongId,
//     },
//     responseType: 'blob',
//   })

// // ================= PHÂN XƯỞNG =================
// export const phanXuongAPI = {

// getAll: () => axios.get('/PhanXuong/getAll'),
// }
import axios from './axios'

// ================= VT =================
export const apiCreateVT = (data) =>
  axios({
    url: '/VatTu/CreateVT',
    method: 'post',
    data,
  })

export const apiGetVT = ({
  begind,
  endd,
  keyword,
  PhanXuongId,   // ✅ CHỈ DÙNG TÊN NÀY
  page = 1,
  limit = 10,
}) =>
  axios({
    url: '/VatTu/getVT',
    method: 'get',
    params: {
      begind,
      endd,
      keyword,
      PhanXuongId, // ✅ KHỚP BACKEND
      page,
      limit,
    },
  })

export const apiDeleteVT = (id) =>
  axios({
    url: `/VatTu/delete/${id}`,
    method: 'delete',
  })

export const apiEditVT = (id, data) =>
  axios({
    url: `/VatTu/update/${id}`,
    method: 'put',
    data,
  })

export const apiExportExcelvattu = ({ begind, endd, PhanXuongId }) =>
  axios({
    url: '/VatTu/exportExcel',
    method: 'get',
    params: {
      begind,
      endd,
      PhanXuongId,
    },
    responseType: 'blob',
  })

// ================= PHÂN XƯỞNG =================
export const phanXuongAPI = {
  getAll: () => axios.get('/PhanXuong/getAll'),
}
