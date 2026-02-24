// import { memo, useEffect } from 'react'
// import { apiEditTB } from '../../apis'
// import { Button, InputForm, TextAreaForm  } from '../'
// import { useForm } from 'react-hook-form'
// import { toast } from 'react-toastify'
// import { useDispatch } from 'react-redux'
// import { showModal } from '../../store/loading/loadingSlice'
// import { RxCross2 } from 'react-icons/rx'
// const ModalEditTB = ({ render, editNhanVien }) => {
//   const dispatch = useDispatch()
//   // const [phongbans, setPhongBan] = useState(null);
//   //   console.log('dat', editNhanVien);
//   const {
//     register,
//     formState: { errors },
//     reset,
//     handleSubmit,
//   } = useForm()

//   useEffect(() => {
//     if (editNhanVien) {
//       const formattedDate = editNhanVien.ngayNhap ? editNhanVien.ngayNhap.split('T')[0] : ''

//       reset({
//         id: editNhanVien.id || '',
//         TenThietBi: editNhanVien.tenThietBi || '',
//         SerialNumber: editNhanVien.serialNumber || '',
//         ServiceTag: editNhanVien.serviceTag || '',
//         LoaiThietBi: editNhanVien.loaiThietBi || '',
//         DonViSuDung: editNhanVien.donViSuDung || '',
//         NguoiQuanLy: editNhanVien.nguoiQuanLy || '',
//         NgayNhap: formattedDate,
//         TrangThai: editNhanVien.trangThai || '',
//       })
//     }
//   }, [editNhanVien, reset])
//   const handleEditThietbi = async (data) => {
//     // console.log('edit', data, editNhanVien?.id);
//     const responseTB = await apiEditTB(editNhanVien?.id, data)
//     if (responseTB.status) {
//       toast.success(responseTB.message)
//       reset()
//       render()
//       dispatch(showModal({ isShowModal: false, modalChildren: null }))
//     } else {
//       toast.error(responseTB.message)
//     }
//   }
//   const onClose = () => {
//     // setEditNhanVien(null);
//     dispatch(showModal({ isShowModal: false, modalChildren: null }))
//   }
//   return (
//     <div
//       className="relative w-full lg:w-[900px] h-[900px] bg-white border border-gray-200 rounded-xl shadow-lg 
//                  flex flex-col items-center justify-center p-6 animate-slide-down text-[13px] text-gray-700 font-normal"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="absolute p-[2px] flex items-center right-4 top-4 bg-error border border-gray-300 shadow-sm hover:bg-red-600 rounded-md">
//         <button onClick={onClose}>
//           <RxCross2 size={22} color="white" />
//         </button>
//       </div>
//       <div className="w-2/3 px-2 mx-auto mt-5 ">
//         <form className="flex flex-col gap-2" onSubmit={handleSubmit(handleEditThietbi)}>
//           <InputForm
//             label="ID"
//             register={register}
//             errors={errors}
//             id="id"
//             validate={{
//               required: 'vui lòng điền tên thiết bị',
//             }}
//             placeholder="@ tên thiết bị"
//             fullWith
//             readOnly
//           />
//           <InputForm
//             label="Tên thiết bị"
//             register={register}
//             errors={errors}
//             id="TenThietBi"
//             validate={{
//               required: 'vui lòng điền tên thiết bị',
//             }}
//             placeholder="@ tên thiết bị"
//             fullWith
//           />
//           {/* <InputForm
//             label="SerialNumber"
//             register={register}
//             errors={errors}
//             id="SerialNumber"
//             // validate={{
//             //   required: 'Vui lòng điền SerialNumber!',
//             // }}
//             placeholder="@SerialNumber"
//             fullWith
//           /> */}
//                   <TextAreaForm
//   label="SerialNumber"
//   register={register}
//   errors={errors}
//   id="SerialNumber"
//   // validate={{
//   //   required: 'Vui lòng điền SerialNumber!',
//   // }}
//   placeholder="@Serial/Service Tag"
//   fullWith
//   rows={4} // 👈 số dòng hiển thị, có thể đổi tùy ý (vd: 3, 6, 10)
//  />
//           <InputForm
//             label="Mã Vật Tư"
//             register={register}
//             errors={errors}
//             id="ServiceTag"
//             // validate={{
//             //   required: 'Vui lòng điền ServiceTag!',
//             // }}
//             placeholder="@ServiceTag"
//             fullWith
//           />
//           <InputForm
//             label="Loại thiết bị"
//             register={register}
//             errors={errors}
//             id="LoaiThietBi"
//             validate={{
//               required: 'Vui lòng điền loại thiết bị!',
//             }}
//             placeholder="@LoaiThietBi"
//             fullWith
//           />
//           <InputForm
//             label="Đơn vị sử dụng"
//             register={register}
//             errors={errors}
//             id="DonViSuDung"
//             validate={{
//               required: 'Vui lòng điền Đơn vị sử dụng',
//             }}
//             placeholder="@DonViSuDung"
//             fullWith
//           />
//           <InputForm
//             label="Người quản lí"
//             register={register}
//             errors={errors}
//             id="NguoiQuanLy"
//             validate={{
//               required: 'Vui lòng điền đơn vị quản lí',
//             }}
//             placeholder="@NguoiQuanLy"
//             fullWith
//           />

//           <InputForm
//             label="Ngày nhập"
//             id="NgayNhap"
//             type="date"
//             register={register}
//             errors={errors}
//             validate={{
//               required: 'Vui lòng chọn ngày!',
//             }}
//           />
//           {/* <InputForm
//             label="Trạng thái"
//             register={register}
//             errors={errors}
//             id="TrangThai"
//             validate={{
//               required: 'Vui lòng điền trạng thái',
//             }}
//             placeholder="@TrangThai"
//             fullWith
//           /> */}
//           <InputForm
//                label="Ghi Chú (link PDF hoặc trang web)"
//                 register={register}
//                 errors={errors}
//                 id="TrangThai"
//                 type="url"
//                  validate={{
//                  required: 'Vui lòng điền Ghi Chú!',
//                 pattern: {
//                  value: /^https?:\/\/.+/,
//                 message: 'Vui lòng nhập đường dẫn hợp lệ, bắt đầu bằng http hoặc https!',
//                },
//               }}
//                 placeholder="@Nhập link PDF: https://tenmien.com/01066-2025-BBSC.pdf"
//               fullWith
//             />

//           <div className="mt-3">
//             <Button type="submit">Cập nhật thiết bị</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default memo(ModalEditTB)
import { memo, useEffect } from 'react'
import { apiEditTB } from '../../apis'
import { Button, InputForm, TextAreaForm } from '../'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { showModal } from '../../store/loading/loadingSlice'
import { RxCross2 } from 'react-icons/rx'

const ModalEditTB = ({ render, editNhanVien }) => {
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm()

  useEffect(() => {
    if (editNhanVien) {
      const formattedDate = editNhanVien.ngayNhap ? editNhanVien.ngayNhap.split('T')[0] : ''
      reset({
        id: editNhanVien.id || '',
        TenThietBi: editNhanVien.tenThietBi || '',
        SerialNumber: editNhanVien.serialNumber || '',
        ServiceTag: editNhanVien.serviceTag || '',
        LoaiThietBi: editNhanVien.loaiThietBi || '',
        DonViSuDung: editNhanVien.donViSuDung || '',
        NguoiQuanLy: editNhanVien.nguoiQuanLy || '',
        NgayNhap: formattedDate,
        TrangThai: editNhanVien.trangThai || '',
      })
    }
  }, [editNhanVien, reset])

  const handleEditThietbi = async (data) => {
    try {
      const responseTB = await apiEditTB(editNhanVien?.id, data)
      if (responseTB.status) {
        toast.success(responseTB.message)
        reset()
        render() // Cập nhật danh sách sau khi sửa
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
      } else {
        toast.error(responseTB.message)
      }
    } catch (err) {
      toast.error('Cập nhật thiết bị thất bại!')
    }
  }

  const onClose = () => {
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
  }

  return (
    <div
      className="relative w-full lg:w-[900px] h-[900px] bg-white border border-gray-200 rounded-xl shadow-lg 
                 flex flex-col items-center justify-center p-6 animate-slide-down text-[13px] text-gray-700 font-normal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute p-[2px] flex items-center right-4 top-4 bg-error border border-gray-300 shadow-sm hover:bg-red-600 rounded-md">
        <button onClick={onClose}>
          <RxCross2 size={22} color="white" />
        </button>
      </div>

      <div className="w-2/3 px-2 mx-auto mt-5 ">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(handleEditThietbi)}>
          {/* ID field */}
          <InputForm
            label="ID"
            register={register}
            errors={errors}
            id="id"
            validate={{
              required: 'vui lòng điền tên thiết bị',
            }}
            placeholder="@ tên thiết bị"
            fullWith
            readOnly
          />

          {/* Tên thiết bị */}
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

          {/* SerialNumber or ServiceTag */}
          <TextAreaForm
            label="SerialNumber"
            register={register}
            errors={errors}
            id="SerialNumber"
            placeholder="@Serial/Service Tag"
            fullWith
            rows={4}
          />

          {/* Mã Vật Tư */}
          <InputForm
            label="Mã Vật Tư"
            register={register}
            errors={errors}
            id="ServiceTag"
            placeholder="@ServiceTag"
            fullWith
          />

          {/* Loại thiết bị */}
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

          {/* Đơn vị sử dụng */}
          <InputForm
            label="Đơn vị sử dụng"
            register={register}
            errors={errors}
            id="DonViSuDung"
            validate={{
              required: 'Vui lòng điền Đơn vị sử dụng!',
            }}
            placeholder="@DonViSuDung"
            fullWith
          />

          {/* Người quản lí */}
          <InputForm
            label="Người quản lí"
            register={register}
            errors={errors}
            id="NguoiQuanLy"
            validate={{
              required: 'Vui lòng điền người quản lí!',
            }}
            placeholder="@NguoiQuanLy"
            fullWith
          />

          {/* Ngày nhập */}
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

          {/* Ghi chú (link PDF hoặc trang web) */}
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
            <Button type="submit">Cập nhật thiết bị</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(ModalEditTB)
