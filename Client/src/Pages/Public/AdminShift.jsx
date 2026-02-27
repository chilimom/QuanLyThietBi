import AdminMasterData from './AdminMasterData'
import {
  apiCreateKipLamViec,
  apiDeleteKipLamViec,
  apiGetKipLamViec,
  apiUpdateKipLamViec,
} from '../../apis'

const AdminShift = () => {
  return (
    <AdminMasterData
      title="Kíp làm việc"
      idField="idKipLamViec"
      nameField="tenKipLamViec"
      fetchAction={apiGetKipLamViec}
      createAction={apiCreateKipLamViec}
      updateAction={apiUpdateKipLamViec}
      deleteAction={apiDeleteKipLamViec}
    />
  )
}

export default AdminShift

