import { memo } from 'react'
import { RxCross2 } from 'react-icons/rx'

const ModalViewTB = ({ data, onClose }) => {
  if (!data) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Thông tin chi tiết thiết bị
        </h2>

        <div className="grid grid-cols-2 gap-4 text-[14px]">
          <div>
            <p className="font-semibold text-gray-600">Tên thiết bị:</p>
            <p>{data.tenThietBi}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">SerialNumber:</p>
            <p>{data.serialNumber}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">ServiceTag:</p>
            <p>{data.serviceTag}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Loại thiết bị:</p>
            <p>{data.loaiThietBi}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Đơn vị sử dụng:</p>
            <p>{data.donViSuDung}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Người quản lý:</p>
            <p>{data.nguoiQuanLy}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Ngày nhập:</p>
            <p>
              {data.ngayNhap
                ? new Date(data.ngayNhap).toLocaleDateString('vi-VN')
                : ''}
            </p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold text-gray-600">Biên bản đính kèm:</p>
            {data.trangThai ? (
              /^https?:\/\//i.test(data.trangThai) ? (
                <a
                  href={data.trangThai}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {data.trangThai}
                </a>
              ) : (
                <p>{data.trangThai}</p>
              )
            ) : (
              <p className="italic text-gray-400">Không có liên kết</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(ModalViewTB)
