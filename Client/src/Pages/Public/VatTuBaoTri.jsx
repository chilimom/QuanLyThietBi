
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ImBin, ImFileExcel } from 'react-icons/im'
import { FaRegEdit, FaEye, FaSyncAlt } from 'react-icons/fa'
import { Table, Tooltip, Space, Button as AntdButton, Spin, Alert, Modal } from 'antd'
import { apiDeleteVT, apiExportExcelvattu, apiGetVT, phanXuongAPI } from '../../apis'
import moment from 'moment'
import Swal from 'sweetalert2'
import {
  Button,
  FilterTime,
  InputForm,
  ModalCreateVT,
  ModalEditVT,
  Pagination,
  ModalViewVT,
} from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../../store/loading/loadingSlice'
import { toast } from 'react-toastify'
import UseDebouce from '../../hooks/useDebouce'
import { useForm } from 'react-hook-form'
import {
  useSearchParams,
  useNavigate,
  useLocation,
  createSearchParams,
} from 'react-router-dom'
import ModalXuatVatTu from '../../components/Modal/ModalXuatVatTu'

const ADMIN_ROLE_ID = 4

const VatTuBaoTri = () => {
  const { register, formState: { errors }, watch, reset } = useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const dispatch = useDispatch()
  const { current } = useSelector((state) => state.user)
  const isAdmin = current?.idQuyen === ADMIN_ROLE_ID

  const [vattus, setVattus] = useState([])
  const [counts, setCounts] = useState(0)
  const [begind, setBegind] = useState(null)
  const [endd, setEndd] = useState(null)
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [phanXuongList, setPhanXuongList] = useState([])
  const [selectedPhanXuongId, setSelectedPhanXuongId] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedVT, setSelectedVT] = useState(null)
  const [apiError, setApiError] = useState('')

  const queriesDebounce = UseDebouce(watch('q'), 800)
  const page = +params.get('page') || 1
  const limit = +import.meta.env.VITE_LIMIT || 20

  const normalizePhanXuongList = (list) => {
    if (!Array.isArray(list)) return []
    return list
      .map((item) => ({
        phanXuongId: Number(item?.phanXuongId ?? item?.PhanXuongId ?? 0),
        tenPhanXuong: item?.tenPhanXuong ?? item?.TenPhanXuong ?? '',
      }))
      .filter((item) => item.phanXuongId > 0)
  }

  const loadPhanXuong = useCallback(async () => {
    try {
      const response = await phanXuongAPI.getAll()
      const rawData = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []
      setPhanXuongList(normalizePhanXuongList(rawData))
    } catch (error) {
      console.error('? L?i load ph�n xu?ng:', error)
      setPhanXuongList([])
    }
  }, [])


  // ================= REFRESH LISTENER =================
  useEffect(() => {
    const handleRefreshList = () => {
      console.log('🔄 Nhận được refresh event từ ModalCreateVT')
      setUpdate(prev => !prev)
      setLastRefresh(new Date())
      loadPhanXuong()
    }
    
    window.addEventListener('refresh-vattu-list', handleRefreshList)
    
    return () => {
      window.removeEventListener('refresh-vattu-list', handleRefreshList)
    }
  }, [loadPhanXuong])

  useEffect(() => {
    loadPhanXuong()
  }, [loadPhanXuong])

  // ================= LOAD VẬT TƯ =================
  const fetchVatTu = useCallback(async () => {
    console.log('=== 🚀 BẮT ĐẦU fetchVatTu ===')
    setLoading(true)
    setApiError('')
    
    try {
      const paramsObj = {
        page,
        limit,
      }
      
      if (queriesDebounce) {
        paramsObj.keyword = queriesDebounce
      }
      if (selectedPhanXuongId) {
        paramsObj.PhanXuongId = Number(selectedPhanXuongId)
      }
      
      if (begind) {
        paramsObj.begind = moment(begind).format('YYYY-MM-DD')
      }
      if (endd) {
        paramsObj.endd = moment(endd).format('YYYY-MM-DD')
      }
      
      console.log('📤 Gọi apiGetVT với params:', paramsObj)
      
      const res = await apiGetVT(paramsObj)
      console.log('📥 API Response FULL:', res)
      
      let dataToSet = []
      let countToSet = 0
      
      // DỰA VÀO RESPONSE STRUCTURE TỪ DEBUG
      // Response có dạng: { status: true, data: [...], totalItems: ... }
      if (res && res.status === true) {
        console.log('✅ Response có status = true')
        
        if (Array.isArray(res.data)) {
          console.log('✅ res.data là array')
          dataToSet = res.data
          countToSet = res.totalItems || res.data.length
        } 
        // Fallback: nếu data không phải array
        else if (res.data && typeof res.data === 'object') {
          console.log('🔍 Tìm array trong res.data...')
          for (const key in res.data) {
            if (Array.isArray(res.data[key])) {
              console.log(`✅ Tìm thấy array tại res.data.${key}`)
              dataToSet = res.data[key]
              countToSet = res.totalItems || res.data[key].length
              break
            }
          }
        }
      } 
      // Fallback nếu response không có status
      else if (Array.isArray(res)) {
        console.log('✅ Response là array trực tiếp')
        dataToSet = res
        countToSet = res.length
      } 
      // Fallback nếu response có data là array
      else if (res && Array.isArray(res.data)) {
        console.log('✅ Response.data là array')
        dataToSet = res.data
        countToSet = res.totalItems || res.data.length
      }
      
      console.log(`📊 Parse được ${dataToSet.length} items, total: ${countToSet}`)
      
      // Format dữ liệu cho table
      const formattedData = dataToSet.map((item, index) => {
        // Tạo key unique
        const uniqueKey = `${item.id}_${item.order}_${Date.now()}_${index}`
        
        return {
          id: item.id,
          order: item.order || '',
          eq: item.eq || '-',
          tenVT: item.tenVT || 'Chưa có tên',
          donVi: item.donVi || '-',
          ngayTao: item.ngayTao,
          prMua: item.prMua || '',
          ghiChu: item.ghiChu || '',
          phanXuongId: item.phanXuongId,
          tenPhanXuong: item.tenPhanXuong || `Phân xưởng ${item.phanXuongId}`,
          maVT: item.maVT,
          soLuong: item.soLuong ?? item.SoLuong ?? 1,
          orderStatus: item.order?.trim() ? 'ready' : 'pending',
          key: uniqueKey
        }
      })
      
      console.log(`✅ Đã format ${formattedData.length} items`)
      console.log('📋 Mẫu item đã format:', formattedData[0])
      
      setVattus(formattedData)
      setCounts(countToSet)
      
      console.log('=== ✅ KẾT THÚC fetchVatTu ===')
      
    } catch (error) {
      console.error('❌ Lỗi fetchVatTu:', error)
      setApiError(error.message || 'Không thể load dữ liệu')
      toast.error('Không thể load dữ liệu vật tư')
      setVattus([])
      setCounts(0)
    } finally {
      setLoading(false)
    }
  }, [queriesDebounce, page, limit, begind, endd, update, selectedPhanXuongId])

  // Gọi API khi có thay đổi
  useEffect(() => {
    fetchVatTu()
  }, [fetchVatTu])

  // ================= HANDLERS =================
  const handleCreateVT = () => {
    dispatch(showModal({
      isShowModal: true,
      modalChildren: <ModalCreateVT 
        render={() => {
          console.log('🔄 Render được gọi từ ModalCreateVT')
          // Trigger immediate refresh
          setUpdate(prev => !prev)
          // Also refresh after a short delay
          setTimeout(() => {
            fetchVatTu()
          }, 1000)
        }} 
      />,
    }))
  }

  const handleEditVT = (el) => {
    dispatch(showModal({
      isShowModal: true,
      modalChildren: <ModalEditVT 
        render={() => {
          console.log('🔄 Render được gọi từ ModalEditVT')
          setUpdate(prev => !prev)
        }} 
        editNhanVien={el} 
      />,
    }))
  }

  const handleDeleteVT = (id) => {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa vật tư này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        try {
          const responseDelete = await apiDeleteVT(id)
          if (responseDelete?.status === true || responseDelete?.success === true) {
            toast.success(responseDelete.message || 'Xóa thành công')
            setUpdate(prev => !prev)
          } else {
            toast.error(responseDelete?.message || 'Xóa thất bại')
          }
        } catch {
          toast.error('Lỗi khi xóa vật tư')
        }
      }
    })
  }

  // ================= FIXED: HÀM XUẤT EXCEL =================
  const handleExportExcel = async () => {
    console.log('🟢 Nút Xuất Excel được click')
    
    try {
      setExportLoading(true)
      
      const exportParams = {}
      
      if (begind) {
        exportParams.begind = moment(begind).format('YYYY-MM-DD')
        console.log('📅 Begind:', exportParams.begind)
      }
      if (endd) {
        exportParams.endd = moment(endd).format('YYYY-MM-DD')
        console.log('📅 Endd:', exportParams.endd)
      }
      if (queriesDebounce) {
        exportParams.keyword = queriesDebounce
        console.log('🔍 Keyword:', exportParams.keyword)
      }
      if (selectedPhanXuongId) {
        exportParams.PhanXuongId = Number(selectedPhanXuongId)
        console.log('🏭 PhanXuongId:', exportParams.PhanXuongId)
      }
      
      console.log('📤 Gọi apiExportExcelvattu với params:', exportParams)
      
      // Hiển thị modal loading
      const loadingModal = Modal.info({
        title: 'Đang xuất file Excel',
        content: (
          <div className="text-center py-4">
            <Spin size="large" />
            <p className="mt-4">Vui lòng chờ trong giây lát...</p>
          </div>
        ),
        icon: null,
        okButtonProps: { style: { display: 'none' } },
        maskClosable: false,
        keyboard: false
      })
      
      // Gọi API xuất Excel
      const response = await apiExportExcelvattu(exportParams)
      console.log('📥 API Response type:', typeof response)
      console.log('📥 Response:', response)
      
      // Đóng modal loading
      loadingModal.destroy()
      
      // Xử lý response từ API
      if (response instanceof Blob) {
        console.log('✅ Response là Blob, size:', response.size)
        
        // Kiểm tra nếu blob có dữ liệu
        if (response.size === 0) {
          toast.error('File Excel rỗng, không có dữ liệu')
          throw new Error('File rỗng')
        }
        
        // Kiểm tra content type
        const contentType = response.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        console.log('📄 Content-Type:', contentType)
        
        // Tạo URL cho blob
        const url = window.URL.createObjectURL(response)
        
        // Tạo link tải xuống
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `VatTu_BaoTri_${moment().format('DD-MM-YYYY_HH-mm')}.xlsx`)
        link.style.display = 'none'
        
        // Thêm vào DOM và click
        document.body.appendChild(link)
        link.click()
        
        // Dọn dẹp
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        console.log('✅ File Excel đã được tải xuống')
        toast.success('✅ Xuất file Excel thành công!')
        
      } else if (response && response.data instanceof Blob) {
        // Trường hợp response.data là Blob
        console.log('✅ Response.data là Blob')
        
        const blob = response.data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `VatTu_BaoTri_${moment().format('DD-MM-YYYY_HH-mm')}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toast.success('✅ Xuất file Excel thành công!')
        
      } else if (response && response.url) {
        // Trường hợp API trả về URL
        console.log('✅ API trả về URL:', response.url)
        window.open(response.url, '_blank')
        toast.success('✅ Đang mở file Excel...')
        
      } else if (response && response.success === false) {
        // Trường hợp API trả về lỗi
        console.error('❌ API trả về lỗi:', response.message)
        toast.error(response.message || 'Lỗi khi xuất Excel')
        
      } else {
        // Trường hợp response không xác định
        console.error('❌ Response không hợp lệ:', response)
        toast.error('Không thể xử lý file Excel từ server')
      }
      
    } catch (error) {
      console.error('❌ Lỗi khi xuất Excel:', error)
      
      // Hiển thị lỗi chi tiết
      let errorMessage = 'Không xuất được file Excel'
      
      if (error.response) {
        // Lỗi từ server
        errorMessage = `Lỗi server: ${error.response.status} - ${error.response.statusText}`
        console.error('❌ Server error:', error.response)
      } else if (error.request) {
        // Lỗi kết nối
        errorMessage = 'Không thể kết nối đến server'
        console.error('❌ Network error:', error.request)
      } else {
        // Lỗi khác
        errorMessage = error.message || 'Lỗi không xác định'
      }
      
      toast.error(`❌ ${errorMessage}`)
      
    } finally {
      setExportLoading(false)
    }
  }

    const handleTG = (b, e) => {
    setBegind(b)
    setEndd(e)
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: '1' }).toString()
    })
  }

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered')
    setUpdate(prev => !prev)
    setLastRefresh(new Date())
      loadPhanXuong()
    toast.info('Đang làm mới dữ liệu...')
  }

  const handleClearFilters = () => {
    setBegind(null)
    setEndd(null)
    setSelectedPhanXuongId('')
    setStatusFilter('all')
    reset({ q: '' })
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: '1' }).toString()
    })
    toast.info('Đã xóa bộ lọc')
  }

  const pendingCount = vattus.filter((item) => item.orderStatus === 'pending').length
  const pendingRequests = useMemo(
    () =>
      vattus
        .filter((item) => item.orderStatus === 'pending')
        .sort((a, b) => new Date(b.ngayTao || 0) - new Date(a.ngayTao || 0))
        .slice(0, 5),
    [vattus]
  )
  const filteredVattus = vattus.filter((item) => {
    if (statusFilter === 'pending') return item.orderStatus === 'pending'
    if (statusFilter === 'ready') return item.orderStatus === 'ready'
    return true
  })

  // ================= COLUMNS =================
  const columns = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center',
      width: 70,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    { 
      title: 'Order', 
      dataIndex: 'order', 
      key: 'order', 
      width: 150,
      render: (text, record) =>
        record.orderStatus === 'pending' ? (
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Chờ cấp order
          </span>
        ) : (
          <span className="font-mono font-semibold text-blue-600">{text?.trim() || '-'}</span>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 140,
      align: 'center',
      render: (value) =>
        value === 'pending' ? (
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            Chờ admin
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Đã có order
          </span>
        ),
    },
    { 
      title: 'EQ', 
      dataIndex: 'eq', 
      key: 'eq', 
      width: 180,
      render: (text) => <span className="font-mono text-gray-700">{text || '-'}</span>
    },
    {
      title: 'Tên VT',
      dataIndex: 'tenVT',
      key: 'tenVT',
      width: 300,
      render: (v) => (
        <Tooltip title={v}>
          <div className="truncate max-w-[280px] hover:text-clip hover:whitespace-normal text-sm">
            {v || 'Chưa có tên'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'So luong',
      dataIndex: 'soLuong',
      key: 'soLuong',
      width: 110,
      align: 'center',
      render: (value) => <span className="font-semibold text-slate-700">{value || 1}</span>,
    },
    { 
      title: 'Khu vuc | Don vi', 
      dataIndex: 'donVi', 
      key: 'donVi', 
      width: 150,
      render: (v) => (
        <Tooltip title={v}>
          <div className="px-2 py-1 bg-gray-100 rounded text-gray-700 text-sm truncate max-w-[140px]">
            {v || '-'}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 120,
      align: 'center',
      render: v => v ? moment(v).format('DD/MM/YYYY') : '-',
      sorter: (a, b) => new Date(a.ngayTao) - new Date(b.ngayTao),
    },
    {
      title: 'PR Mua Vật Tư',
      dataIndex: 'prMua',
      key: 'prMua',
      width: 120,
      align: 'center',
      render: v => v?.trim() || '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 220,
      fixed: 'right',
      render: (_, r) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <button 
              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              onClick={() => setSelectedVT(r)}
            >
              <FaEye className="text-green-600 hover:text-green-800 text-lg" />
            </button>
          </Tooltip>
          <Tooltip title="Sửa">
            <button 
              className={`${isAdmin ? 'p-2 hover:bg-blue-50 rounded-lg transition-colors' : 'hidden'}`}
              onClick={() => isAdmin && handleEditVT(r)}
            >
              <FaRegEdit className="text-blue-600 hover:text-blue-800 text-lg" />
            </button>
          </Tooltip>
          <Tooltip title="Xóa">
            <button 
              className={`${isAdmin ? 'p-2 hover:bg-red-50 rounded-lg transition-colors' : 'hidden'}`}
              onClick={() => isAdmin && handleDeleteVT(r.id)}
            >
              <ImBin className="text-red-600 hover:text-red-800 text-lg" />
            </button>
          </Tooltip>
          <AntdButton
            type="primary"
            size="small"
            className={`${isAdmin ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' : 'hidden'} `}
            onClick={() =>
              isAdmin &&
              dispatch(showModal({
                isShowModal: true,
                modalChildren: <ModalXuatVatTu order={r} />,
              }))
            }
          >
            Xuất VT
          </AntdButton>
        </Space>
      ),
    },
  ]

  return (
    <div className="flex flex-col w-full p-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-wrap items-center gap-4">
          {isAdmin && <Button 
            handleOnclick={handleCreateVT}
            style="min-width: 180px"
          >
            ➕ Tạo Lệnh Bảo Trì
          </Button>}
          
          {/* Refresh button */}
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
            disabled={loading}
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} />
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <FilterTime callBackHandle={handleTG} />
          </div>
          
          {/* Nút Xuất Excel đã fix */}
          {isAdmin && <button
            onClick={handleExportExcel}
            className="px-4 py-2 flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            disabled={exportLoading || loading}
          >
            {exportLoading ? (
              <>
                <FaSyncAlt className="animate-spin" /> 
                Đang xuất...
              </>
            ) : (
              <>
                <ImFileExcel className="text-xl" /> 
                Xuất Excel
              </>
            )}
          </button>}
        </div>
      </div>

      {isAdmin && (
        <section className="mb-6 rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,_#fffaf0,_#ffffff)] p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-600">
                  🔔
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-800">Thông tin chờ cấp Order</div>
                  <div className="text-sm text-slate-500">
                    
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  {pendingCount} Yêu cầu đang chờ
                </span>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
                >
                  Danh sách
                </button>
                <button
                  onClick={handleManualRefresh}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Làm mới
                </button>
              </div>
            </div>

            <div className="w-full max-w-[540px] rounded-2xl border border-white bg-white/90 p-4">
              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSelectedVT(item)
                        setStatusFilter('pending')
                      }}
                      className="flex w-full items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-800">{item.tenVT || 'Yeu cau moi'}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          EQ: {item.eq || 'Chua co'} | Khu vuc: {item.donVi || 'Chua co'}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          So luong: {item.soLuong || 1} | Ngay tao: {item.ngayTao ? moment(item.ngayTao).format('DD/MM/YYYY') : '-'}
                        </div>
                      </div>
                      <span className="ml-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Mo
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                  <div className="text-sm font-semibold text-slate-700">Chưa có yêu cầu mới</div>
                  <div className="mt-1 text-sm text-slate-500">
                    Thông tin tạo order User yêu cầu.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-[400px]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWith
            placeholder="🔍 Tìm kiếm vật tư theo tên, order, EQ..."
            className="shadow-sm"
          />
        </div>

        <div className="w-full md:w-[260px]">
          <select
            value={selectedPhanXuongId}
            onChange={(e) => {
              setSelectedPhanXuongId(e.target.value)
              navigate({
                pathname: location.pathname,
                search: createSearchParams({ page: '1' }).toString(),
              })
            }}
            className="w-full h-[42px] px-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">🏭 Tất cả phân xưởng</option>
            {phanXuongList.map((px) => (
              <option key={px.phanXuongId} value={px.phanXuongId}>
                {px.phanXuongId}. {px.tenPhanXuong || `Phân xưởng ${px.phanXuongId}`}
              </option>
            ))}
          </select>
        </div>
        

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            Chờ cấp Order
          </button>
          <button
            onClick={() => setStatusFilter('ready')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'ready'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            Đã có Order
          </button>
        </div>
        
        {(begind || endd || queriesDebounce || selectedPhanXuongId || statusFilter !== 'all') && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Xoa bo loc
          </button>
        )}
      </div>

      {/* INFO CARD */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-blue-800 text-xl flex items-center gap-2">
              <span className="text-2xl">📊</span> DANH SÁCH LỆNH BẢO TRÌ
            </h3>
            <div className="text-blue-600 mt-2 flex items-center gap-4">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spin size="small" />
                  <span>Đang tải dữ liệu...</span>
                </div>
              ) : (
                <>
                  <span className="bg-white px-3 py-1 rounded-lg border">
                    <span className="font-bold text-blue-800 text-lg">{filteredVattus.length}</span> Lệnh bảo trì
                  </span>
                  {counts > filteredVattus.length && (
                    <span className="text-gray-600">
                      (Tổng: <span className="font-bold">{counts}</span> bản ghi)
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    Trang {page} / {Math.ceil(counts / limit) || 1}
                  </span>
                  {isAdmin && pendingCount > 0 && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                      {pendingCount} Yêu cầu chờ cấp Order
                    </span>
                  )}
                </>
              )}
            </div>
            
            {lastRefresh && (
              <div className="text-xs text-gray-500 mt-2">
                Cập nhật lần cuối: {moment(lastRefresh).format('HH:mm:ss')}
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-700 bg-white p-4 rounded-lg border min-w-[200px]">
            <div className="grid grid-cols-2 gap-3">
              <div className="font-medium">Hiển thị:</div>
              <div className="font-semibold text-blue-600">{limit} Bản ghi/Trang</div>
              
              <div className="font-medium">Tổng số:</div>
              <div className="font-semibold">{counts} Bản ghi</div>
              
              <div className="font-medium">Chờ order:</div>
              <div className="font-semibold text-amber-700">{pendingCount}</div>
              
              <div className="font-medium">Trạng thái:</div>
              <div className="font-semibold">
                {loading ? 'Đang tải' : statusFilter === 'all' ? 'Tất cả' : statusFilter === 'pending' ? 'Chờ cấp Order' : 'Đã có Order'}
              </div>
            </div>
          </div>
        </div>

        {apiError && (
          <Alert
            message="Thông báo"
            description={apiError}
            type="warning"
            showIcon
            className="mt-4"
          />
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredVattus}
          rowKey="key"
          pagination={false}
          scroll={{ 
            y: 'calc(100vh - 450px)', 
            x: 1500 
          }}
          bordered
          size="middle"
          loading={{
            spinning: loading,
            indicator: <Spin size="large" />
          }}
          locale={{
            emptyText: (
              <div className="py-16 text-center">
                <div className="text-6xl mb-4">📭</div>
                <div className="text-gray-500 text-xl mb-2 font-medium">
                  {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy dữ liệu vật tư'}
                </div>
                <div className="text-gray-400 mb-6 max-w-md mx-auto">
                  {queriesDebounce ? 
                    'Không tìm thấy vật tư phù hợp với từ khóa tìm kiếm' :
                    'Hãy thử thay đổi bộ lọc thời gian hoặc tạo vật tư mới'}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {isAdmin && <Button 
                    handleOnclick={handleCreateVT}
                    style="min-width: 200px"
                  >
                    ➕ Tạo vật tư đầu tiên
                  </Button>}
                  <button
                    onClick={handleManualRefresh}
                    className="px-6 py-3 border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    🔄 Thử tải lại
                  </button>
                </div>
              </div>
            )
          }}
        />
      </div>

      {/* PAGINATION */}
      {counts > 0 && counts > limit && (
        <div className="mt-6 flex justify-center">
          <div className="bg-white p-4 rounded-xl shadow border">
            <Pagination totalCount={counts} />
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      {selectedVT && (
        <ModalViewVT
          data={selectedVT}
          onClose={() => setSelectedVT(null)}
        />
      )}
    </div>
  )
}

export default VatTuBaoTri


