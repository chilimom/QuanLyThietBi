import { memo, useState, useEffect } from 'react'
import { apiCreateVT, phanXuongAPI } from '../../apis/vattu'
import { InputForm, TextAreaForm } from '../'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../../store/loading/loadingSlice'
import { RxCross2 } from 'react-icons/rx'


const DEFAULT_PHAN_XUONG_LIST = [
  { PhanXuongId: 1, TenPhanXuong: 'Nha may Luyen Gang 1' },
  { PhanXuongId: 2, TenPhanXuong: 'Nha may Luyen Gang 2' },
  { PhanXuongId: 3, TenPhanXuong: 'Nha may Nhiet dien 1' },
  { PhanXuongId: 4, TenPhanXuong: 'Nha may Nhiet dien 2' },
  { PhanXuongId: 5, TenPhanXuong: 'Xu Ly Nuoc' },
  { PhanXuongId: 6, TenPhanXuong: 'Xuong Nang Luong' },
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

const ModalCreateVT = ({ render }) => {
  const dispatch = useDispatch()
  const { current } = useSelector((state) => state.user)
  const isAdmin = current?.idQuyen === 4
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phanXuongList, setPhanXuongList] = useState([])

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm({
    defaultValues: {
      Order: '',
      Eq: '',
      TenVT: '',
      DonVi: '',
      SoLuong: 1,
      NgayTao: new Date().toISOString().split('T')[0],
      PrMua: '',
      GhiChu: '',
      PhanXuongId: 1,
    }
  })

  // Load danh sach phan xuong
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
        console.error('Loi load phan xuong:', error)
        setPhanXuongList(normalizePhanXuongList(DEFAULT_PHAN_XUONG_LIST))
      }
    }
    loadPhanXuong()
  }, [])

  const handleCreateVatTu = async (data) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const payload = {
        Order: isAdmin ? data.Order?.trim() || '' : '',
        Eq: data.Eq?.trim() || '',
        TenVT: data.TenVT?.trim() || '',
        SoLuong: String(data.SoLuong || 1).trim(),
        soLuong: String(data.SoLuong || 1).trim(),
        DonVi: data.DonVi?.trim() || '',
        NgayTao: data.NgayTao || new Date().toISOString().split('T')[0],
        PrMua: data.PrMua?.trim() || '',
        GhiChu: data.GhiChu?.trim() || '',
        PhanXuongId: Number(data.PhanXuongId) || 1,
      }

      console.log('📤 Sending payload:', payload)
      
      const responseTB = await apiCreateVT(payload)
      console.log('📥 API Response:', responseTB)
      
      if (responseTB?.status === true || responseTB?.success === true) {
        const successMessage = isAdmin
          ? responseTB?.message || 'Tạo vật tư thành công!'
          : 'Đã tạo yêu cầu bảo trì và chuyển admin cấp số order.'
        toast.success(`✅ ${successMessage}`)
        
        // Reset form
        reset()
        
        // Gọi render để refresh danh sách
        if (render && typeof render === 'function') {
          console.log('🔄 Gọi render function...')
          render()
        }
        
        // Dispatch refresh event
        window.dispatchEvent(new CustomEvent('refresh-vattu-list'))
        
        // Đóng modal
        setTimeout(() => {
          dispatch(showModal({ isShowModal: false, modalChildren: null }))
        }, 1500)
        
      } else {
        const errorMessage = responseTB?.message || 'Tạo vật tư thất bại'
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

  const handleQuickFill = () => {
    const sampleData = {
      Order: isAdmin ? `TEST-${Date.now().toString().slice(-4)}` : '',
      SoLuong: 2,
      Eq: `EQ-TEST-${Math.floor(Math.random() * 100)}`,
      TenVT: `Vật tư bảo trì test ${new Date().toLocaleDateString('vi-VN')}`,
      DonVi: 'Phòng Kỹ thuật',
      NgayTao: new Date().toISOString().split('T')[0],
      PrMua: 'Nguyễn Văn A',
      GhiChu: 'Thay thế theo kế hoạch bảo trì định kỳ',
      PhanXuongId: 1
    }
    
    reset(sampleData)
    toast.info('✅ Đã điền dữ liệu mẫu')
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
        <h2 className="text-2xl font-bold text-center mb-6">➕ Tạo lệnh bảo trì mới</h2>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreateVatTu)}>
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
            <div className="space-y-4">
              {isAdmin ? (
                <InputForm
                  label="So Order *"
                  register={register}
                  errors={errors}
                  id="Order"
                  validate={{
                    required: 'Vui long dien so Order',
                    minLength: { value: 3, message: 'Order phai co it nhat 3 ky tu' }
                  }}
                  placeholder="VD: 1034702"
                  fullWith
                />
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Yeu cau nay se duoc tao o trang thai chua co order. Admin se tiep nhan va cap so order sau.
                </div>
              )}

              <InputForm
                label="So EQ"
                register={register}
                errors={errors}
                id="Eq"
                validate={{
                  validate: (value) => !!(value?.trim() || getValues('DonVi')?.trim()) || 'Can nhap so EQ hoac khu vuc',
                }}
                placeholder="VD: 1-T03-XNH-07-19-4"
                fullWith
              />
            </div>

            <div className="space-y-4">
              <InputForm
                label="Khu vuc / Don vi su dung"
                register={register}
                errors={errors}
                id="DonVi"
                validate={{
                  validate: (value) => !!(value?.trim() || getValues('Eq')?.trim()) || 'Can nhap khu vuc hoac so EQ',
                }}
                placeholder="VD: Tram Quang Trac, Khu vuc Lo 3..."
                fullWith
              />

              <InputForm
                label="So luong *"
                register={register}
                errors={errors}
                id="SoLuong"
                type="number"
                validate={{
                  required: 'Vui long nhap so luong',
                  min: { value: 1, message: 'So luong phai lon hon 0' },
                  valueAsNumber: true,
                }}
                placeholder="VD: 2"
                fullWith
              />

              <InputForm
                label="Ngay tao *"
                id="NgayTao"
                type="date"
                register={register}
                errors={errors}
                validate={{ required: 'Vui long chon ngay' }}
                fullWith
              />
            </div>
          </div>

          <InputForm
            label="Nhân viên bảo trì"
            register={register}
            errors={errors}
            id="PrMua"
            placeholder="VD: Lộc, Hiếu, Vinh..."
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
            placeholder="VD: Cổng Ironwolf Pro 4TB 3.5 5900RPM 256MB Cache"
            fullWith
            rows={3}
          />
         
          <TextAreaForm
            label="Ghi Chú *"
            register={register}
            errors={errors}
            id="GhiChu"
            validate={{ required: 'Vui lòng điền ghi chú' }}
            placeholder="VD: Mô tả chi tiết, link tài liệu, hướng dẫn sử dụng..."
            fullWith
            rows={2}
          />

          {/* Test button */}
          {process.env.NODE_ENV === 'development' && (
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
            >
              🧪 Điền dữ liệu mẫu
            </button>
          )}

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
                '📝 Tạo Lệnh Bảo Trì'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(ModalCreateVT)
