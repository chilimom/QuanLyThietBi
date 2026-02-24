import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import path from './ultils/path'
import { Layout } from './Pages/Layout'
import { Login, ManageThietBi, VatTuBaoTri } from './Pages/Public'
import { useSelector } from 'react-redux'
import { Modal } from './components'

function App() {
  const { isShowModal, modalChildren } = useSelector((state) => state.loading)
  return (
    <div className="relative h-screen ">
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        {/* Giao diện chính */}
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.LAYOUT} element={<Layout />}>
        <Route path={path.MANAGE_TB} element={<ManageThietBi />} />
        <Route path={path.MANAGE_VT} element={<VatTuBaoTri />} />
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
        // transition={Bounce}
      />
    </div>
  )
}

export default App
