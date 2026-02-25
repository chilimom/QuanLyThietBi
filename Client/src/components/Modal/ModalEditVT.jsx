
import { memo, useEffect, useState } from 'react'
import { apiEditVT, phanXuongAPI } from '../../apis'
import { InputForm, TextAreaForm } from '../'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { showModal } from '../../store/loading/loadingSlice'
import { RxCross2 } from 'react-icons/rx'

const DEFAULT_PHAN_XUONG_LIST = [
  { PhanXuongId: 1, TenPhanXuong: 'Nhà máy Luyện Gang 1' },
  { PhanXuongId: 2, TenPhanXuong: 'Nhà máy Luyện Gang 2' },
  { PhanXuongId: 3, TenPhanXuong: 'Nhà máy Nhiệt điện 1' },
  { PhanXuongId: 4, TenPhanXuong: 'Nhà máy Nhiệt điện 2' },
  { PhanXuongId: 5, TenPhanXuong: 'Xử lý nước' },
]
const normalizePhanXuongList = (list) => {
  if (!Array.isArray(list)) return []

  return list
    .map((item) => ({
      PhanXuongId: Number(item?.PhanXuongId ?? item?.phanXuongId ?? 0),
      TenPhanXuong: item?.TenPhanXuong ?? item?.tenPhanXuong ?? '',
    }))
    .filter((item) => item.PhanXuongId > 0)
}
const ModalEditVT = ({ render, editNhanVien }) => {
  const dispatch = useDispatch()
  const [phanXuongList, setPhanXuongList] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm()

  // Load danh sách phân xưởng
  useEffect(() => {
    const loadPhanXuong = async () => {
      try {
        const response = await phanXuongAPI.getAll()
        const rawData = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []
        const normalizedData = normalizePhanXuongList(rawData)
        if (normalizedData.length > 0) {
          setPhanXuongList(normalizedData)
          return
        }
        setPhanXuongList(normalizePhanXuongList(DEFAULT_PHAN_XUONG_LIST))
      } catch (error) {
        console.error('Lỗi load phân xưởng:', error)
        setPhanXuongList(normalizePhanXuongList(DEFAULT_PHAN_XUONG_LIST))
      }
    }
    
    loadPhanXuong()
  }, [])

  useEffect(() => {
    if (editNhanVien) {
      const formattedDate = editNhanVien.ngayTao ? editNhanVien.ngayTao.split('T')[0] : ''
      console.log('📝 Dữ liệu editNhanVien để edit:', editNhanVien)
      
      reset({
        id: editNhanVien.id || '',
        Order: editNhanVien.order || '',
        Eq: editNhanVien.eq || editNhanVien.Eq || '', // Sửa: Eq thay vì eq
        TenVT: editNhanVien.tenVT || editNhanVien.TenVT || '',
        DonVi: editNhanVien.donVi || editNhanVien.DonVi || '',
        NgayTao: formattedDate,
        PrMua: editNhanVien.prMua || editNhanVien.PrMua || '',
        GhiChu: editNhanVien.ghiChu || editNhanVien.GhiChu || '',
        PhanXuongId: editNhanVien.phanXuongId || editNhanVien.PhanXuongId || 1, // Thêm PhanXuongId
      })
    }
  }, [editNhanVien, reset])

  const handleEditVatTu = async (data) => {
    if (isSubmitting || !editNhanVien?.id) return
    setIsSubmitting(true)

    try {
      console.log('📤 Data từ form:', data)
      
      // Tạo payload đúng với API
      const payload = {
        id: editNhanVien.id,
        Order: data.Order?.trim() || '',
        Eq: data.Eq?.trim() || '', // Sửa: Eq thay vì eq
        TenVT: data.TenVT?.trim() || '',
        DonVi: data.DonVi?.trim() || '',
        NgayTao: data.NgayTao || new Date().toISOString().split('T')[0],
        PrMua: data.PrMua?.trim() || '',
        GhiChu: data.GhiChu?.trim() || '',
        PhanXuongId: Number(data.PhanXuongId) || 1, // Thêm PhanXuongId
      }

      console.log('📤 Payload gửi API:', payload)
      
      const responseTB = await apiEditVT(editNhanVien.id, payload)
      console.log('📥 API Response:', responseTB)
      
      if (responseTB?.status === true || responseTB?.success === true) {
        const successMessage = responseTB?.message || 'Cập nhật vật tư thành công!'
        toast.success(`✅ ${successMessage}`)
        
        reset()
        
        // Gọi render để refresh danh sách
        if (render && typeof render === 'function') {
          console.log('🔄 Gọi render function từ ModalEditVT...')
          render()
        }
        
        // Dispatch refresh event
        window.dispatchEvent(new CustomEvent('refresh-vattu-list'))
        
        // Đóng modal
        setTimeout(() => {
          dispatch(showModal({ isShowModal: false, modalChildren: null }))
        }, 1000)
        
      } else {
        const errorMessage = responseTB?.message || 'Cập nhật thất bại'
        toast.error(`❌ ${errorMessage}`)
      }
    } catch (error) {
      console.error('❌ Lỗi API:', error)
      toast.error('❌ Lỗi kết nối server')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onClose = () => {
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
  }

  return (
    <div
      className="relative w-full lg:w-[900px] h-auto max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg 
                 flex flex-col items-center justify-center p-6 animate-slide-down text-[13px] text-gray-700 font-normal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute p-[2px] flex items-center right-4 top-4 bg-red-500 border border-gray-300 shadow-sm hover:bg-red-600 rounded-md">
        <button onClick={onClose}>
          <RxCross2 size={26} color="white" />
        </button>
      </div>
      
      <div className="w-full md:w-2/3 px-2 mx-auto mt-5">
        <h2 className="text-2xl font-bold text-center mb-6">✏️ Sửa vật tư #{editNhanVien?.id}</h2>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleEditVatTu)}>
          {/* ID (readonly) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ID
            </label>
            <input
              {...register('id')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
              readOnly
              disabled
            />
          </div>

          {/* Phân xưởng */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phân xưởng *
            </label>
            <select
              {...register('PhanXuongId', { 
                required: 'Vui lòng chọn phân xưởng',
                valueAsNumber: true 
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {phanXuongList.map(px => (
                <option key={px.PhanXuongId} value={px.PhanXuongId}>
                  {px.PhanXuongId}. {px.TenPhanXuong}
                </option>
              ))}
            </select>
            {errors.PhanXuongId && (
              <p className="text-red-500 text-xs mt-1">{errors.PhanXuongId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột 1 */}
            <div className="space-y-4">
              <InputForm
                label="Số Order *"
                register={register}
                errors={errors}
                id="Order"
                validate={{
                  required: 'Vui lòng điền số Order',
                  minLength: { value: 3, message: 'Order phải có ít nhất 3 ký tự' }
                }}
                placeholder="VD: 1034702"
                fullWith
              />

              <InputForm
                label="Mã EQ *"
                register={register}
                errors={errors}
                id="Eq" // Sửa: Eq thay vì eq
                validate={{
                  required: 'Vui lòng điền mã EQ',
                  minLength: { value: 2, message: 'EQ phải có ít nhất 2 ký tự' }
                }}
                placeholder="VD: 1-T03-XNH-07-19-4"
                fullWith
              />
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              <InputForm
                label="Đơn vị sử dụng *"
                register={register}
                errors={errors}
                id="DonVi"
                validate={{ required: 'Vui lòng điền Đơn vị' }}
                placeholder="VD: NM.NĐ - Trạm Quang trắc"
                fullWith
              />

              <InputForm
                label="Ngày Tạo *"
                id="NgayTao"
                type="date"
                register={register}
                errors={errors}
                validate={{ required: 'Vui lòng chọn ngày' }}
                fullWith
              />
            </div>
          </div>

          <InputForm
            label="PR Mua Thay Thế"
            register={register}
            errors={errors}
            id="PrMua"
            placeholder="1290003597..."
            fullWith
          />

          <TextAreaForm
            label="Tên Vật Tư *"
            register={register}
            errors={errors}
            id="TenVT"
            validate={{
              required: 'Vui lòng điền tên vật tư',
              minLength: { value: 5, message: 'Tên vật tư phải có ít nhất 5 ký tự' }
            }}
            placeholder="VD: 106010101723 Cổng Ironwolf Pro 4TB 3.5 5900RPM 256MB Cache"
            fullWith
            rows={3}
          />
         
          <TextAreaForm
            label="Ghi Chú (link PDF hoặc trang web) *"
            register={register}
            errors={errors}
            id="GhiChu"
            validate={{
              required: 'Vui lòng điền ghi chú',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Vui lòng nhập đường dẫn hợp lệ (http:// hoặc https://)'
              }
            }}
            placeholder="VD: https://bom.so/bJe3iC hoặc link SharePoint"
            fullWith
            rows={2}
          />

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Đang xử lý...
                </>
              ) : (
                '💾 Cập Nhật Lệnh Bảo Trì'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(ModalEditVT)



