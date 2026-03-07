import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  apiCreateThietBiKhuVuc,
  apiDeleteThietBiKhuVuc,
  apiGetPhanXuong,
  apiGetThietBiKhuVuc,
  apiGetThietBiKhuVucStatistics,
  apiUpdateThietBiKhuVuc,
} from '../../apis'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'antd'
import { FaRegEdit } from 'react-icons/fa'
import { ImBin } from 'react-icons/im'
import { toast } from 'react-toastify'
import moment from 'moment'

const NHOM_OPTIONS = [
  { value: 'ThietBiMang', label: 'Thiết bị mạng' },
  { value: 'MayTinhVanHanh', label: 'Máy tính vận hành' },
  { value: 'ThietBiCCTV', label: 'Thiết bị CCTV' },
]

const NHOM_LABEL_MAP = NHOM_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

const STATUS_COLORS = {
  tot: 'green',
  hong: 'red',
  sua: 'orange',
}

const ManageThietBiKhuVuc = () => {
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [data, setData] = useState([])
  const [stats, setStats] = useState([])
  const [phanXuongList, setPhanXuongList] = useState([])

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(+import.meta.env.VITE_LIMIT || 20)
  const [totalItems, setTotalItems] = useState(0)

  const [keyword, setKeyword] = useState('')
  const [selectedPhanXuongId, setSelectedPhanXuongId] = useState(undefined)
  const [selectedNhom, setSelectedNhom] = useState(undefined)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const loadPhanXuong = useCallback(async () => {
    try {
      const response = await apiGetPhanXuong()
      const raw = Array.isArray(response) ? response : response?.data || []
      setPhanXuongList(raw)
    } catch {
      setPhanXuongList([])
      toast.error('Không tải được danh sách phân xưởng')
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiGetThietBiKhuVuc({
        phanXuongId: selectedPhanXuongId,
        nhomThietBi: selectedNhom,
        keyword,
        page,
        limit,
      })
      if (response?.status) {
        setData(response.data || [])
        setTotalItems(response.totalItems || 0)
      } else {
        setData([])
        setTotalItems(0)
      }
    } catch {
      setData([])
      setTotalItems(0)
      toast.error('Không tải được dữ liệu thiết bị khu vực')
    } finally {
      setLoading(false)
    }
  }, [keyword, limit, page, selectedNhom, selectedPhanXuongId])

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const response = await apiGetThietBiKhuVucStatistics(selectedPhanXuongId)
      if (response?.status) {
        setStats(response.data || [])
      } else {
        setStats([])
      }
    } catch {
      setStats([])
      toast.error('Không tải được thống kê theo khu vực')
    } finally {
      setStatsLoading(false)
    }
  }, [selectedPhanXuongId])

  useEffect(() => {
    loadPhanXuong()
  }, [loadPhanXuong])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const openCreateModal = () => {
    setEditingItem(null)
    form.resetFields()
    form.setFieldValue('soLuong', 1)
    setIsModalOpen(true)
  }

  const openEditModal = (record) => {
    setEditingItem(record)
    form.setFieldsValue({
      phanXuongId: record.phanXuongId,
      nhomThietBi: record.nhomThietBi,
      maVatTu: record.maVatTu,
      tenVatTu: record.tenVatTu,
      viTri: record.viTri,
      soLuong: record.soLuong,
      serialNumber: record.serialNumber,
      tinhTrang: record.tinhTrang,
      lichSuThayThe: record.lichSuThayThe,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const response = await apiDeleteThietBiKhuVuc(id)
      if (response?.status) {
        toast.success(response.message || 'Xóa thành công')
        await Promise.all([loadData(), loadStats()])
      } else {
        toast.error(response?.message || 'Xóa thất bại')
      }
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      const payload = {
        ...values,
        ngayCapNhat: new Date().toISOString(),
      }
      const response = editingItem
        ? await apiUpdateThietBiKhuVuc(editingItem.id, payload)
        : await apiCreateThietBiKhuVuc(payload)

      if (response?.status) {
        toast.success(response.message || 'Lưu thành công')
        setIsModalOpen(false)
        await Promise.all([loadData(), loadStats()])
      } else {
        toast.error(response?.message || 'Không thể lưu dữ liệu')
      }
    } catch {
      toast.error('Không thể lưu dữ liệu')
    } finally {
      setSubmitting(false)
    }
  }

  const totalSummary = useMemo(() => {
    return stats.reduce(
      (acc, item) => {
        acc.tongBanGhi += item.tongBanGhi || 0
        acc.tongSoLuong += item.tongSoLuong || 0
        acc.thietBiMang += item.thietBiMang || 0
        acc.mayTinhVanHanh += item.mayTinhVanHanh || 0
        acc.thietBiCctv += item.thietBiCCTV || 0
        return acc
      },
      {
        tongBanGhi: 0,
        tongSoLuong: 0,
        thietBiMang: 0,
        mayTinhVanHanh: 0,
        thietBiCctv: 0,
      }
    )
  }, [stats])

  const columns = [
    {
      title: 'STT',
      width: 70,
      align: 'center',
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Phân xưởng',
      dataIndex: 'tenPhanXuong',
      width: 170,
      render: (_, record) =>
        record.tenPhanXuong || `Phân xưởng ${record.phanXuongId}`,
    },
    {
      title: 'Nhóm thiết bị',
      dataIndex: 'nhomThietBi',
      width: 170,
      render: (value) => NHOM_LABEL_MAP[value] || value,
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'maVatTu',
      width: 120,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'tenVatTu',
      width: 220,
    },
    {
      title: 'Vị trí',
      dataIndex: 'viTri',
      width: 180,
      render: (value) => value || <span className="italic text-gray-400">Chưa cập nhật</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      width: 90,
      align: 'right',
    },
    {
      title: 'Serial',
      dataIndex: 'serialNumber',
      width: 160,
      render: (value) => value || <span className="italic text-gray-400">Không có</span>,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      width: 140,
      render: (value) => {
        if (!value) return <span className="italic text-gray-400">Chưa cập nhật</span>
        const lowered = value.toLowerCase()
        const color = lowered.includes('hỏng')
          ? STATUS_COLORS.hong
          : lowered.includes('sửa')
            ? STATUS_COLORS.sua
            : STATUS_COLORS.tot
        return <Tag color={color}>{value}</Tag>
      },
    },
    {
      title: 'Lịch sử thay thế',
      dataIndex: 'lichSuThayThe',
      width: 280,
      render: (value) => value || <span className="italic text-gray-400">Không có</span>,
    },
    {
      title: 'Cập nhật',
      dataIndex: 'ngayCapNhat',
      width: 130,
      render: (value) => (value ? moment(value).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Thao tác',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <FaRegEdit
            className="text-blue-600 cursor-pointer"
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xóa thiết bị này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <ImBin className="text-red-600 cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="w-full text-[13.5px] text-gray-800 font-medium">
      <Row gutter={[12, 12]} className="mb-3">
        <Col>
          <Button type="primary" onClick={openCreateModal}>
            Thêm thiết bị khu vực
          </Button>
        </Col>
        <Col flex="220px">
          <Select
            allowClear
            placeholder="Lọc theo phân xưởng"
            value={selectedPhanXuongId}
            onChange={(v) => {
              setSelectedPhanXuongId(v)
              setPage(1)
            }}
            options={phanXuongList.map((x) => ({
              value: x.phanXuongId,
              label: x.tenPhanXuong,
            }))}
            className="w-full"
          />
        </Col>
        <Col flex="220px">
          <Select
            allowClear
            placeholder="Lọc nhóm thiết bị"
            value={selectedNhom}
            onChange={(v) => {
              setSelectedNhom(v)
              setPage(1)
            }}
            options={NHOM_OPTIONS}
            className="w-full"
          />
        </Col>
        <Col flex="300px">
          <Input.Search
            allowClear
            placeholder="Tìm mã vật tư, tên vật tư, vị trí, serial, tình trạng..."
            onSearch={(value) => {
              setKeyword(value || '')
              setPage(1)
            }}
          />
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="mb-3">
        <Col xs={24} md={12} lg={6}>
          <Card size="small" loading={statsLoading} title="Tổng bản ghi">
            <span className="text-xl font-semibold">{totalSummary.tongBanGhi}</span>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size="small" loading={statsLoading} title="Tổng số lượng">
            <span className="text-xl font-semibold">{totalSummary.tongSoLuong}</span>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size="small" loading={statsLoading} title="Thiết bị mạng">
            <span className="text-xl font-semibold">{totalSummary.thietBiMang}</span>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size="small" loading={statsLoading} title="Máy tính vận hành / CCTV">
            <span className="text-xl font-semibold">
              {totalSummary.mayTinhVanHanh} / {totalSummary.thietBiCctv}
            </span>
          </Card>
        </Col>
      </Row>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        loading={loading}
        bordered
        size="middle"
        pagination={{
          current: page,
          pageSize: limit,
          total: totalItems,
          showSizeChanger: true,
          onChange: (nextPage, nextLimit) => {
            setPage(nextPage)
            setLimit(nextLimit)
          },
        }}
        scroll={{ y: 'calc(100vh - 420px)', x: 1700 }}
      />

      <Modal
        title={editingItem ? 'Cập nhật thiết bị khu vực' : 'Thêm thiết bị khu vực'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        confirmLoading={submitting}
        width={760}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="phanXuongId"
                label="Phân xưởng"
                rules={[{ required: true, message: 'Vui lòng chọn phân xưởng' }]}
              >
                <Select
                  placeholder="Chọn phân xưởng"
                  options={phanXuongList.map((x) => ({
                    value: x.phanXuongId,
                    label: x.tenPhanXuong,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nhomThietBi"
                label="Nhóm thiết bị"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm thiết bị' }]}
              >
                <Select placeholder="Chọn nhóm thiết bị" options={NHOM_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maVatTu" label="Mã vật tư">
                <Input placeholder="Nhập mã vật tư" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tenVatTu"
                label="Tên vật tư"
                rules={[{ required: true, message: 'Vui lòng nhập tên vật tư' }]}
              >
                <Input placeholder="Nhập tên vật tư" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="viTri"
                label="Vị trí trong phân xưởng"
                rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
              >
                <Input placeholder="Ví dụ: Dây chuyền 1 - Tủ điện A3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="soLuong"
                label="Số lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serialNumber" label="Serial (nếu có)">
                <Input placeholder="Nhập serial" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tinhTrang" label="Tình trạng">
                <Input placeholder="Ví dụ: Tốt, Đang sửa, Hỏng..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="lichSuThayThe" label="Lịch sử thay thế">
                <Input.TextArea
                  rows={4}
                  placeholder="Mô tả lịch sử thay thế linh kiện / thiết bị"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageThietBiKhuVuc
