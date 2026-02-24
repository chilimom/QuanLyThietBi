import { memo } from 'react'
import { apiCreateTB } from '../../apis'
import { Button, InputForm, TextAreaForm } from '../'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { showModal } from '../../store/loading/loadingSlice'
import { RxCross2 } from 'react-icons/rx'




const ModalCreateTB = ({ render }) => {
  const dispatch = useDispatch()

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm()

  const handleCreateThietBi = async (data) => {
    
    // console.log(data);
    const responseTB = await apiCreateTB(data)
    if (responseTB.status) {
      toast.success(responseTB.message)
      reset()
      render()
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
    } else {
      toast.error(responseTB.message)
    }
  }
  const onClose = () => {
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
  }
  return (
    <div
      className="relative w-full lg:w-[900px] h-[800px] bg-white border border-gray-200 rounded-xl shadow-lg 
                 flex flex-col items-center justify-center p-6 animate-slide-down text-[13px] text-gray-700 font-normal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute p-[2px] flex items-center right-4 top-4 bg-error border border-gray-300 shadow-sm hover:bg-red-600 rounded-md">
        <button onClick={onClose}>
          <RxCross2 size={26} color="white" />
        </button>
      </div>
      <div className="w-2/3 px-2 mx-auto mt-5 ">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(handleCreateThietBi)}>
          <InputForm
            label="Tên thiết bị"
            register={register}
            errors={errors}
            id="TenThietBi"
            validate={{
              required: 'vui lòng điền tên thiết bị',
            }}
            placeholder="@ tên thiết bị"
            fullWith
          />
          {/* <InputForm
            label="SerialNumber"
            register={register}
            errors={errors}
            id="SerialNumber"
            // validate={{
            //   required: 'Vui lòng điền SerialNumber!',
            // }}
            placeholder="@SerialNumber"
            fullWith
          /> */}
          
          <TextAreaForm
            label="SerialNumber"
             register={register}
            errors={errors}
            id="SerialNumber"
            // validate={{
            //   required: 'Vui lòng điền SerialNumber!',
            // }}
            placeholder="@Serial / Server Tag"
            fullWith
            rows={4} // 👈 số dòng hiển thị (tuỳ chỉnh)
          />
          {/* <InputForm
            label="ServiceTag"
            register={register}
            errors={errors}
            id="ServiceTag"
            // validate={{
            //   required: 'Vui lòng điền ServiceTag!',
            // }}
            placeholder="@ServiceTag"
            fullWith
          /> */}
          <InputForm
            label="Loại thiết bị"
            register={register}
            errors={errors}
            id="LoaiThietBi"
            validate={{
              required: 'Vui lòng điền loại thiết bị!',
            }}
            placeholder="@LoaiThietBi"
            fullWith
          />
          <InputForm
            label="Đơn vị sử dụng"
            register={register}
            errors={errors}
            id="DonViSuDung"
            validate={{
              required: 'Vui lòng điền Đơn vị sử dụng',
            }}
            placeholder="@DonViSuDung"
            fullWith
          />
          {/* <Select
            label="Phòng ban"
            options={phongbans?.map((el) => ({
              code: el?.idphongBan,
              value: el?.tenPhongBan,
            }))}
            register={register}
            id="idPhongBan"
            validate={{
              required: 'Vui lòng chọn Phòng ban',
              setValueAs: (v) => +v, // ép kiểu từ chuỗi thành số
            }}
            style="flex-auto "
            errors={errors}
          /> */}
          <InputForm
            label="Số Order"
            register={register}
            errors={errors}
            id="NguoiQuanLy"
            validate={{
              required: 'Vui lòng điền đơn vị quản lí',
            }}
            placeholder="@NguoiQuanLy"
            fullWith
          />

          <InputForm
            label="Ngày nhập"
            id="NgayNhap"
            type="date"
            register={register}
            errors={errors}
            validate={{
              required: 'Vui lòng chọn ngày!',
            }}
          />
          {/* <InputForm
            label="Trạng thái"
            register={register}
            errors={errors}
            id="TrangThai"
            validate={{
              required: 'Vui lòng điền trạng thái',
            }}
            placeholder="@TrangThai"
            fullWith
          /> */}
          <InputForm
               label="Ghi Chú (link PDF hoặc trang web)"
                register={register}
                errors={errors}
                id="TrangThai"
                type="url"
                 validate={{
                 required: 'Vui lòng điền Ghi Chú!',
                pattern: {
                 value: /^https?:\/\/.+/,
                message: 'Vui lòng nhập đường dẫn hợp lệ, bắt đầu bằng http hoặc https!',
               },
              }}
                placeholder="@Nhập link PDF: https://tenmien.com/01066-2025-BBSC.pdf"
              fullWith
            />

          <div className="mt-3">
            <Button type="submit">Thêm thiết bị</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(ModalCreateTB)
