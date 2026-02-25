import { memo, useCallback, useEffect, useState } from 'react'
import { FiEdit2, FiPackage, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { apiDeleteXuatVatTu, apiGetXuatVatTuByOrder } from '../../apis/xuatVatTu'
import ModalEditXuatVT from './ModalEditXuatVT'

const ModalViewVT = ({ data, onClose }) => {
  const [xuatVatTus, setXuatVatTus] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [editVT, setEditVT] = useState(null)
  const [loading, setLoading] = useState(false)

  const parseResponseList = (res) => {
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.data)) return res.data
    if (Array.isArray(res?.data?.data)) return res.data.data
    return []
  }

  const fetchXuatVatTu = useCallback(async () => {
    if (!data?.order) return

    setLoading(true)
    try {
      const res = await apiGetXuatVatTuByOrder(String(data.order))
      setXuatVatTus(parseResponseList(res))
    } catch (err) {
      console.error('Loi load xuat vat tu:', err)
      setXuatVatTus([])
    } finally {
      setLoading(false)
    }
  }, [data?.order])

  useEffect(() => {
    fetchXuatVatTu()
  }, [fetchXuatVatTu])

  const handleDeleteXuatVT = async (id) => {
    if (!id) return

    const confirmed = window.confirm('Bạn có chắc muốn xóa vật tư đã xuất này?')
    if (!confirmed) return

    try {
      await apiDeleteXuatVatTu(id)
      await fetchXuatVatTu()
    } catch (err) {
      console.error('Lỗi xóa xuất vật tư:', err)
      alert(err?.message || 'Xóa thất bại')
    }
  }

  if (!data) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[900px] max-h-[90vh] overflow-y-auto p-6 relative">
        <button className="absolute top-3 right-3 text-gray-600 hover:text-black" onClick={onClose}>
          <RxCross2 size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin chi tiết vật tư</h2>

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
              {data.tenVT
                ?.split(/\r?\n/)
                .filter((x) => x.trim() !== '')
                .map((line, index) => (
                  <div key={index} className="text-sm mb-1">
                    * {line}
                  </div>
                )) || 'Chưa có tên'}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">Nhà máy | NV BTBD:</p>
            <p>{data.donVi || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-gray-600 mb-1">Ngày tạo:</p>
            <p>{data.ngayTao ? new Date(data.ngayTao).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
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

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FiPackage className="text-blue-600" />
              Vật tư đã xuất
              <span className="text-sm font-normal text-gray-500">({xuatVatTus.length} items)</span>
            </h3>
            <button
              onClick={fetchXuatVatTu}
              className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm inline-flex items-center gap-1"
              disabled={loading}
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
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
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{vt.soLuong || '0'}</span>
                      </td>
                      <td className="border px-3 py-2">
                        <div className="max-w-[200px] truncate" title={vt.ghiChu}>
                          {vt.ghiChu || '-'}
                        </div>
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm inline-flex items-center gap-1"
                            onClick={() => {
                              setEditVT(vt)
                              setShowEdit(true)
                            }}
                          >
                            <FiEdit2 size={14} />
                            Sửa
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm inline-flex items-center gap-1"
                            onClick={() => handleDeleteXuatVT(vt.id)}
                          >
                            <FiTrash2 size={14} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Đóng
          </button>
        </div>
      </div>

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
            fetchXuatVatTu()
          }}
        />
      )}
    </div>
  )
}

export default memo(ModalViewVT)
