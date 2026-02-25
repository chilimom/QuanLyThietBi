import { memo, useEffect, useState } from 'react'
import { FiEdit2, FiFileText, FiHash, FiPackage, FiSave } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { apiUpdateXuatVatTu } from '../../apis/xuatVatTu'

const ModalEditXuatVT = ({ data, onClose, onSaved }) => {
  const [maVT, setMaVT] = useState('')
  const [tenVT, setTenVT] = useState('')
  const [soLuong, setSoLuong] = useState(1)
  const [ghiChu, setGhiChu] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!data) return
    setMaVT(data.maVT || '')
    setTenVT(data.tenVT || '')
    setSoLuong(Number(data.soLuong) || 1)
    setGhiChu(data.ghiChu || '')
  }, [data])

  const handleSave = async () => {
    if (!data?.id) return

    if (!maVT.trim()) {
      alert('Vui lòng nhập mã vật tư')
      return
    }

    if (!tenVT.trim()) {
      alert('Vui lòng nhập tên vật tư')
      return
    }

    if (soLuong <= 0) {
      alert('Số lượng phải > 0')
      return
    }

    try {
      setLoading(true)

      await apiUpdateXuatVatTu(data.id, {
        maVT: maVT.trim(),
        tenVT: tenVT.trim(),
        soLuong,
        ghiChu,
      })

      onSaved?.()
      onClose?.()
    } catch (err) {
      console.error('Lỗi cập nhật xuất vật tư:', err)
      alert('Cập nhật thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!data) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[460px] rounded shadow-lg p-5 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4 inline-flex items-center gap-2">
          <FiEdit2 className="text-blue-600" />
          Sửa vật tư đã xuất
        </h3>

        <div className="mb-3">
          <label className="text-sm font-medium inline-flex items-center gap-1 mb-1">
            <FiHash size={14} />
            Mã VT
          </label>
          <input
            type="text"
            value={maVT}
            onChange={(e) => setMaVT(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium inline-flex items-center gap-1 mb-1">
            <FiPackage size={14} />
            Tên vật tư
          </label>
          <input
            type="text"
            value={tenVT}
            onChange={(e) => setTenVT(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium inline-flex items-center gap-1 mb-1">
            <FiHash size={14} />
            Số lượng
          </label>
          <input
            type="number"
            min={1}
            value={soLuong}
            onChange={(e) => setSoLuong(Number(e.target.value) || 0)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium inline-flex items-center gap-1 mb-1">
            <FiFileText size={14} />
            Ghi chú
          </label>
          <textarea
            rows={3}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Hủy
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-1"
          >
            <FiSave size={14} />
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(ModalEditXuatVT)
