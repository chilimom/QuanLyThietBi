// import { memo, useEffect, useState } from 'react'
// import { RxCross2 } from 'react-icons/rx'
// import { apiGetXuatVatTuByOrder } from '../../apis/xuatVatTu'
// import ModalEditXuatVT from './ModalEditXuatVT'// Modal chỉnh sửa xuất vật tư

// const ModalViewVT = ({ data, onClose }) => {
 
//   // =========================
//   // 🔹 VẬT TƯ ĐÃ XUẤT
//   // =========================
//   const [xuatVatTus, setXuatVatTus] = useState([])
//   const [showEdit, setShowEdit] = useState(false)// Hiện modal chỉnh sửa xuất vật tư
// const [editVT, setEditVT] = useState(null)// Vật tư đang chỉnh sửa
//   useEffect(() => {
//   if (!data?.order) return
//    const fetchXuatVatTu = async () => {
//     try {
//       // const res = await apiGetXuatVatTuByOrder(String(data.order))
//       // // setXuatVatTus(res || [])
//       // // ✅ axios trả về object → lấy res.data
//       // setXuatVatTus(Array.isArray(res.data) ? res.data : [])
//       const res = await apiGetXuatVatTuByOrder(String(data.order))
//       console.log('XUAT VT API RESULT:', res)

//       // ✅ res đã là array
//       setXuatVatTus(Array.isArray(res) ? res : [])
//     } catch (err) {
//       console.error('Lỗi load xuất vật tư:', err)
//       setXuatVatTus([])
//     }
//   }
//   fetchXuatVatTu()
// }, [data])
// if (!data) return null
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto p-6 relative">
//         <button
//           className="absolute top-3 right-3 text-gray-600 hover:text-black"
//           onClick={onClose}
//         >
//           <RxCross2 size={22} />
//         </button>

//         <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
//           Thông tin chi tiết thiết bị
//         </h2>

//         <div className="grid grid-cols-2 gap-4 text-[14px]">
//           <div>
//             <p className="font-semibold text-gray-600">Order:</p>
//             <p>{data.order}</p>
//           </div>
//           <div>
//             <p className="font-semibold text-gray-400">EQ:</p>
//             <p>{data.eq}</p>
//           </div>
//           <div className="ten-vt col-span-2">
//             <p className="font-semibold text-gray-600">Tên VT:</p>
//             {data.tenVT
//               ?.split(/\r?\n/)
//               .filter(x => x.trim() !== '')
//               .map((line, index) => (
//               <div key={index}>• {line}</div>
//        ))}
//            </div>
//           <div>
//             <p className="font-semibold text-gray-600">Đơn vị sử dụng:</p>
//             <p>{data.donVi}</p>
//           </div>
//           {/* <div>
//             <p className="font-semibold text-gray-600">Số Lượng:</p>
//             <p>{data.soLuong}</p>
//           </div> */}
//           <div>
//             <p className="font-semibold text-gray-600">Ngày Tạo:</p>
//             <p>
//               {data.ngayTao
//                 ? new Date(data.ngayTao).toLocaleDateString('vi-VN')
//                 : ''}
//             </p>
//           </div>
//           <div className="col-span-2">
//             <p className="font-semibold text-gray-600">Biên bản đính kèm:</p>
//             {data.ghiChu ? (
//               /^https?:\/\//i.test(data.ghiChu) ? (
//                 <a
//                   href={data.ghiChu}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   {data.ghiChu}
//                 </a>
//               ) : (
//                 <p>{data.ghiChu}</p>
//               )
//             ) : (
//               <p className="italic text-gray-400">Không có liên kết</p>
//             )}
//           </div>
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
//           Thông tin Xuất vật tư
//         </h3>  
//         { xuatVatTus.length === 0 ? (
//   <p className="italic text-gray-400">
//     Chưa có vật tư được xuất
//   </p>
// ) : (
  
//   <table className="w-full text-[14px] border border-gray-300 rounded">
//     <thead className="bg-gray-100">
//       <tr>
//         <th className="border px-2 py-1 text-left">Mã VT</th>
//         <th className="border px-2 py-1 text-left">Tên vật tư</th>
//         <th className="border px-2 py-1 text-center w-[100px]">Số lượng</th>
//         <th className="border px-2 py-1 text-center w-[100px]">Ghi chú</th>
//         <th className="border px-2 py-1 text-center w-[80px]">Thao tác</th>

//       </tr>
//     </thead>
//     <tbody>
//       {xuatVatTus.map((vt, idx) => (
//         <tr key={idx} className="hover:bg-gray-50">
//           <td className="border px-2 py-1">{vt.maVT}</td>
//           <td className="border px-2 py-1">{vt.tenVT}</td>
//           <td className="border px-2 py-1 text-center">{vt.soLuong}</td>
//           <td className="border px-2 py-1">{vt.ghiChu || ''}</td>
//           <td className="border px-2 py-1 text-center"></td>
//           <button
//           className="text-blue-600 hover:underline"
//           onClick={() => {
//             setEditVT(vt)
//             setShowEdit(true)
//           }}
//         >
//           ✏️ Sửa
//         </button>
//         </tr>
//       ))}
//     </tbody>
//   </table>
  
// )}
    
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//           >
//             Đóng
//           </button>
//         </div>
//       </div>
//               {/* ===== MODAL CHỈNH SỬA XUẤT VẬT TƯ ===== */}
//         {showEdit && editVT && (
//           <ModalEditXuatVT
//             data={editVT}
//             onClose={() => {
//               setShowEdit(false)
//               setEditVT(null)
//             }}
//             onSaved={() => {
//               setShowEdit(false)
//               setEditVT(null)

//               // reload lại danh sách vật tư đã xuất
//               apiGetXuatVatTuByOrder(String(data.order)).then(res => {
//                 setXuatVatTus(Array.isArray(res) ? res : [])
//               })
//             }}
//           />
//         )}

//     </div>
//   )
// }

// export default memo(ModalViewVT)
import { memo, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiGetXuatVatTuByOrder } from '../../apis/xuatVatTu'
import ModalEditXuatVT from './ModalEditXuatVT'

const ModalViewVT = ({ data, onClose }) => {
  const [xuatVatTus, setXuatVatTus] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [editVT, setEditVT] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load danh sách xuất vật tư
  useEffect(() => {
    if (!data?.order) return
    
    const fetchXuatVatTu = async () => {
      setLoading(true)
      try {
        const res = await apiGetXuatVatTuByOrder(String(data.order))
        console.log('📦 XUAT VT API RESULT:', res)
        
        // Xử lý response theo nhiều định dạng
        let dataToSet = []
        if (Array.isArray(res)) {
          dataToSet = res
        } else if (res?.data && Array.isArray(res.data)) {
          dataToSet = res.data
        } else if (res?.data?.data && Array.isArray(res.data.data)) {
          dataToSet = res.data.data
        }
        
        setXuatVatTus(dataToSet)
        console.log(`✅ Loaded ${dataToSet.length} xuất vật tư`)
      } catch (err) {
        console.error('❌ Lỗi load xuất vật tư:', err)
        setXuatVatTus([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchXuatVatTu()
  }, [data])

  const handleReloadXuatVT = async () => {
    if (!data?.order) return
    try {
      const res = await apiGetXuatVatTuByOrder(String(data.order))
      let dataToSet = []
      if (Array.isArray(res)) {
        dataToSet = res
      } else if (res?.data && Array.isArray(res.data)) {
        dataToSet = res.data
      }
      setXuatVatTus(dataToSet)
    } catch (err) {
      console.error('Lỗi reload xuất vật tư:', err)
    }
  }

  if (!data) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[900px] max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          📋 Thông tin chi tiết vật tư
        </h2>

        {/* Thông tin chính */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">Order:</p>
            <p className="font-mono text-blue-600">{data.order || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">EQ:</p>
            <p className="font-mono">{data.eq || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded col-span-2">
            <p className="font-semibold text-gray-600 mb-1">Tên VT:</p>
            <div className="max-h-[100px] overflow-y-auto">
              {data.tenVT?.split(/\r?\n/)
                .filter(x => x.trim() !== '')
                .map((line, index) => (
                  <div key={index} className="text-sm mb-1">• {line}</div>
                )) || 'Chưa có tên'}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">Nhà máy | NV BTBD:</p>
            <p>{data.donVi || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">Ngày tạo:</p>
            <p>
              {data.ngayTao
                ? new Date(data.ngayTao).toLocaleDateString('vi-VN')
                : 'Chưa có'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">PR Mua Vật Tư</p>
            <p>{data.prMua || 'Chưa có'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded col-span-2">
            <p className="font-semibold text-gray-600 mb-1">Ghi chú:</p>
            {data.ghiChu ? (
              /^https?:\/\//i.test(data.ghiChu) ? (
                <a
                  href={data.ghiChu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {data.ghiChu}
                </a>
              ) : (
                <p className="whitespace-pre-wrap">{data.ghiChu}</p>
              )
            ) : (
              <p className="italic text-gray-400">Không có ghi chú</p>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">Phân xưởng:</p>
            <p>{data.tenPhanXuong || `PX ${data.phanXuongId}` || '-'}</p>
          </div>
        </div>

        {/* Danh sách xuất vật tư */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              📦 Vật tư đã xuất
              <span className="text-sm font-normal text-gray-500">
                ({xuatVatTus.length} items)
              </span>
            </h3>
            <button
              onClick={handleReloadXuatVT}
              className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm"
              disabled={loading}
            >
              {loading ? '🔄 Đang tải...' : '🔄 Làm mới'}
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-2">Đang tải danh sách xuất vật tư...</p>
            </div>
          ) : xuatVatTus.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded">
              <p className="italic text-gray-400">Chưa có vật tư được xuất</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">STT</th>
                    <th className="border px-3 py-2 text-left">Mã VT</th>
                    <th className="border px-3 py-2 text-left">Tên vật tư</th>
                    <th className="border px-3 py-2 text-center">Số lượng</th>
                    <th className="border px-3 py-2 text-left">Ghi chú</th>
                    <th className="border px-3 py-2 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {xuatVatTus.map((vt, idx) => (
                    <tr key={vt.id || idx} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2 font-mono">{vt.maVT || '-'}</td>
                      <td className="border px-3 py-2">{vt.tenVT || 'Chưa có tên'}</td>
                      <td className="border px-3 py-2 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {vt.soLuong || '0'}
                        </span>
                      </td>
                      <td className="border px-3 py-2">
                        <div className="max-w-[200px] truncate" title={vt.ghiChu}>
                          {vt.ghiChu || '-'}
                        </div>
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
                          onClick={() => {
                            setEditVT(vt)
                            setShowEdit(true)
                          }}
                        >
                          ✏️ Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Modal chỉnh sửa xuất vật tư */}
      {showEdit && editVT && (
        <ModalEditXuatVT
          data={editVT}
          onClose={() => {
            setShowEdit(false)
            setEditVT(null)
          }}
          onSaved={() => {
            setShowEdit(false)
            setEditVT(null)
            // Reload danh sách
            handleReloadXuatVT()
          }}
        />
      )}
    </div>
  )
}

export default memo(ModalViewVT)