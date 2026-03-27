
import { useCallback, useEffect, useState } from 'react'
import { ImBin, ImFileExcel } from 'react-icons/im'
import { FaRegEdit, FaEye } from 'react-icons/fa'
import {
  Table,
  Tooltip,
  Row,
  Col,
  Space,
  Button as AntButton,
  Input,
  DatePicker,
} from 'antd'
import { apiDeleteTB, apiExportExcel, apiGetTB } from '../../apis'
import moment from 'moment'
import Swal from 'sweetalert2'
import {
  ModalCreateTB,
  ModalEditTB,
  ModalViewTB,
  Pagination,
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

const { RangePicker } = DatePicker
const ADMIN_ROLE_ID = 4

const ManageThietBi = () => {
  const { register, watch } = useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { current } = useSelector((state) => state.user)
  const isAdmin = current?.idQuyen === ADMIN_ROLE_ID

  const [thietbis, setThietbis] = useState([])
  const [counts, setCounts] = useState(0)
  const [begind, setBegind] = useState(null)
  const [endd, setEndd] = useState(null)
  const [update, setUpdate] = useState(false)
  const [selectedTB, setSelectedTB] = useState(null)

  const dispatch = useDispatch()
  const render = useCallback(() => setUpdate(!update), [update])
  const queriesDebounce = UseDebouce(watch('q'), 800)
  const page = +params.get('page') || 1
  const limit = +import.meta.env.VITE_LIMIT || 20

  // Sync URL
  useEffect(() => {
    const queryObj = {}
    if (queriesDebounce) queryObj.q = queriesDebounce
    if (page) queryObj.page = page

    navigate({
      pathname: location.pathname,
      search: createSearchParams(queryObj).toString(),
    })
  }, [location.pathname, navigate, page, queriesDebounce])

  // Fetch data
  const fetchAllThietBi = useCallback(async () => {
    try {
      const res = await apiGetTB({
        begind,
        endd,
        page,
        limit,
        keyword: queriesDebounce,
      })
      if (res?.status && Array.isArray(res.data)) {
        setThietbis(res.data)
        setCounts(res.totalItems)
      } else {
        setThietbis([])
        setCounts(0)
      }
    } catch {
      setThietbis([])
      setCounts(0)
    }
  }, [begind, endd, page, limit, queriesDebounce])

  useEffect(() => {
    fetchAllThietBi()
  }, [fetchAllThietBi, update])

  // Actions
  const handleCreateTB = () => {
    dispatch(
      showModal({
        isShowModal: true,
        modalChildren: <ModalCreateTB render={render} />,
      })
    )
  }

  const handleEditTB = (el) => {
    dispatch(
      showModal({
        isShowModal: true,
        modalChildren: <ModalEditTB render={render} editNhanVien={el} />,
      })
    )
  }

  const handleDeleteTB = (id) => {
    Swal.fire({
      text: 'Bạn có muốn xóa Thiết bị này không?',
      icon: 'warning',
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const responseDelete = await apiDeleteTB(id)
        responseDelete.status
          ? toast.success(responseDelete.message)
          : toast.error(responseDelete.message)
        render()
      }
    })
  }

  const handleExportExcel = async () => {
    try {
      const response = await apiExportExcel(begind, endd)
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ThietBi.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('Không xuất được file!')
    }
  }

  const handleTG = (_, dateStrings) => {
    setBegind(dateStrings[0])
    setEndd(dateStrings[1])
  }

  // Columns
  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 70,
      render: (_, __, index) => (
        <span className="font-medium text-gray-700">
          {(page - 1) * limit + index + 1}
        </span>
      ),
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      width: 200,
      ellipsis: true,
      render: (v) => (
        <span className="font-semibold text-gray-900">{v}</span>
      ),
    },
    {
      title: 'Serial / Service Tag',
      dataIndex: 'serialNumber',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'loaiThietBi',
      width: 180,
      ellipsis: true,
      render: (v) => (
        <Tooltip title={v}>
          <span>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Đơn vị sử dụng',
      dataIndex: 'donViSuDung',
      width: 200,
    },
    {
      title: 'Số Order',
      dataIndex: 'nguoiQuanLy',
      width: 160,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'ngayNhap',
      width: 140,
      render: (v) => (v ? moment(v).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Biên bản',
      dataIndex: 'trangThai',
      width: 220,
      render: (v) =>
        v ? (
          /^https?:\/\//i.test(v) ? (
            <a
              href={v}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium"
            >
              {new URL(v).hostname.replace('www.', '')}
            </a>
          ) : (
            v
          )
        ) : (
          <span className="italic text-gray-400">Không có</span>
        ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      render: (_, r) => (
        <Space size="middle">
          <FaEye
            className="text-green-600 cursor-pointer hover:scale-110 transition"
            onClick={() => setSelectedTB(r)}
          />
          {isAdmin && (
            <>
              <FaRegEdit
                className="text-blue-600 cursor-pointer hover:scale-110 transition"
                onClick={() => handleEditTB(r)}
              />
              <ImBin
                className="text-red-600 cursor-pointer hover:scale-110 transition"
                onClick={() => handleDeleteTB(r.id)}
              />
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="w-full text-[13.5px] text-gray-800 font-medium">
      {/* Actions */}
      <Row justify="space-between" align="middle" gutter={[16, 16]} className="mb-3">
        {isAdmin && <Col>
          <AntButton type="primary" onClick={handleCreateTB}>
            Thêm thiết bị
          </AntButton>
        </Col>}
        <Col>
          <RangePicker format="DD/MM/YYYY" onChange={handleTG} />
        </Col>
        <Col>
          <AntButton
            icon={<ImFileExcel />}
            onClick={() => isAdmin && handleExportExcel()}
            className={isAdmin ? '' : 'hidden'}
            style={{ background: '#047857', borderColor: '#047857' }}
          >
            Xuất Excel
          </AntButton>
        </Col>
      </Row>

      {/* Search */}
      <Row justify="end" className="mb-3">
        <Col span={10}>
          <Input
            placeholder="Tìm kiếm thiết bị..."
            className="font-medium"
            value={watch('q')}
            onChange={(e) => {
              register('q').onChange({
                target: { name: 'q', value: e.target.value },
              })
            }}
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        dataSource={thietbis}
        columns={columns}
        rowKey="id"
        bordered
        size="middle"
        pagination={false}
        scroll={{ y: 'calc(100vh - 380px)', x: 1200 }}
        className="bg-white rounded-lg shadow-sm"
        rowClassName={(_, index) =>
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        }
      />

      {selectedTB && (
        <ModalViewTB data={selectedTB} onClose={() => setSelectedTB(null)} />
      )}

      <div className="mt-3">
        <Pagination totalCount={counts} />
      </div>
    </div>
  )
}

export default ManageThietBi
