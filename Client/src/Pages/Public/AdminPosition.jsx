import AdminMasterData from './AdminMasterData'
import { apiCreateChucVu, apiDeleteChucVu, apiGetChucVu, apiUpdateChucVu } from '../../apis'

const AdminPosition = () => {
  return (
    <AdminMasterData
      title={'Ch\u1ee9c v\u1ee5'}
      idField="idChucVu"
      nameField="tenChucVu"
      fetchAction={apiGetChucVu}
      createAction={apiCreateChucVu}
      updateAction={apiUpdateChucVu}
      deleteAction={apiDeleteChucVu}
    />
  )
}

export default AdminPosition
