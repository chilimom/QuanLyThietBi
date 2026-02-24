import { useEffect, useState, memo } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiUpdateXuatVatTu } from '../../apis/xuatVatTu'

const ModalEditXuatVT = ({ data, onClose, onSaved }) => {
  if (!data) return null

  // =========================
  // STATE FORM
  // =========================
  const [soLuong, setSoLuong] = useState(0)
  const [ghiChu, setGhiChu] = useState('')
  const [loading, setLoading] = useState(false)

  // =========================
  // INIT DATA
  // =========================
  useEffect(() => {
    setSoLuong(data.soLuong)
    setGhiChu(data.ghiChu || '')
  }, [data])

  // =========================
  // HANDLE SAVE
  // =========================
//   const handleSave = async () => {
//     if (soLuong <= 0) {
//       alert('Số lượng phải > 0')
//       return
//     }

//     try {
//       setLoading(true)
//       await apiUpdateXuatVatTu(data.id, {
//         soLuong,
//         ghiChu,
//       })

//       onSaved?.()   // reload danh sách
//       onClose()
//     } catch (err) {
//       console.error('Lỗi cập nhật xuất vật tư:', err)
//       alert('Cập nhật thất bại')
//     } finally {
//       setLoading(false)
//     }
//   }
    const handleSave = async () => {
  if (soLuong <= 0) {
    alert('Số lượng phải > 0')
    return
  }

  try {
    setLoading(true)

    await apiUpdateXuatVatTu(data.id, {
      soLuong,
      ghiChu,
    })

    // 🔴 QUAN TRỌNG
    onSaved?.()
    onClose()

  } catch (err) {
    console.error('Lỗi cập nhật xuất vật tư:', err)
    alert('Cập nhật thất bại')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded shadow-lg p-5 relative">

        {/* CLOSE */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          Sửa vật tư đã xuất
        </h3>

        {/* INFO */}
        <div className="text-sm mb-3">
          <div><b>Mã VT:</b> {data.maVT}</div>
          <div><b>Tên VT:</b> {data.tenVT}</div>
        </div>

        {/* FORM */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Số lượng</label>
          <input
            type="number"
            min={1}
            value={soLuong}
            onChange={e => setSoLuong(+e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Ghi chú</label>
          <textarea
            rows={3}
            value={ghiChu}
            onChange={e => setGhiChu(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Hủy
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(ModalEditXuatVT)
