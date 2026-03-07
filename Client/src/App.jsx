import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import path from './ultils/path'
import { Layout } from './Pages/Layout'
import {
  AdminLoginRole,
  AdminPosition,
  AdminShift,
  AdminTeam,
  AdminWorkshop,
  Login,
  ManageThietBi,
  ManageThietBiKhuVuc,
  ManageUser,
  VatTuBaoTri,
} from './Pages/Public'
import { useSelector } from 'react-redux'
import { Modal } from './components'

function App() {
  const { isShowModal, modalChildren } = useSelector((state) => state.loading)
  return (
    <div className="relative h-screen ">
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route
          path="/admin"
          element={<Navigate to={`/${path.LAYOUT}/${path.MANAGE_USER}`} replace />}
        />
        <Route path={path.LAYOUT} element={<Layout />}>
          <Route path={path.MANAGE_TB} element={<ManageThietBi />} />
          <Route path={path.MANAGE_VT} element={<VatTuBaoTri />} />
          <Route path={path.MANAGE_TB_KHU_VUC} element={<ManageThietBiKhuVuc />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.ADMIN_LOGIN_ROLE} element={<AdminLoginRole />} />
          <Route path={path.ADMIN_POSITION} element={<AdminPosition />} />
          <Route path={path.ADMIN_WORKSHOP} element={<AdminWorkshop />} />
          <Route path={path.ADMIN_SHIFT} element={<AdminShift />} />
          <Route path={path.ADMIN_TEAM} element={<AdminTeam />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App
