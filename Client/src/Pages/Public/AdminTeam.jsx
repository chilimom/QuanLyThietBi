import AdminMasterData from './AdminMasterData'
import { apiCreateToLamViec, apiDeleteToLamViec, apiGetToLamViec, apiUpdateToLamViec } from '../../apis'

const AdminTeam = () => {
  return (
    <AdminMasterData
      title="Tổ làm việc"
      idField="idToLamViec"
      nameField="tenToLamViec"
      fetchAction={apiGetToLamViec}
      createAction={apiCreateToLamViec}
      updateAction={apiUpdateToLamViec}
      deleteAction={apiDeleteToLamViec}
    />
  )
}

export default AdminTeam

