import AdminMasterData from './AdminMasterData'
import { apiCreateQuyen, apiDeleteQuyen, apiGetQuyen, apiUpdateQuyen } from '../../apis'

const AdminLoginRole = () => {
  return (
    <AdminMasterData
      title="Quyền đăng nhập"
      idField="idquyen"
      nameField="tenQuyen"
      fetchAction={apiGetQuyen}
      createAction={apiCreateQuyen}
      updateAction={apiUpdateQuyen}
      deleteAction={apiDeleteQuyen}
    />
  )
}

export default AdminLoginRole

