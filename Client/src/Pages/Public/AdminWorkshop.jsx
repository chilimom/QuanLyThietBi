import AdminMasterData from './AdminMasterData'
import { apiCreatePhanXuong, apiDeletePhanXuong, apiGetPhanXuong, apiUpdatePhanXuong } from '../../apis'

const AdminWorkshop = () => {
  return (
    <AdminMasterData
      title="Phân xưởng"
      idField="phanXuongId"
      nameField="tenPhanXuong"
      fetchAction={apiGetPhanXuong}
      createAction={apiCreatePhanXuong}
      updateAction={apiUpdatePhanXuong}
      deleteAction={apiDeletePhanXuong}
    />
  )
}

export default AdminWorkshop

