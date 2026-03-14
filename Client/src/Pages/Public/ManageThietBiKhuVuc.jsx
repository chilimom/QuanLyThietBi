import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  apiCreateNhomThietBiKhuVuc,
  apiCreateThietBiKhuVuc,
  apiDeleteNhomThietBiKhuVuc,
  apiDeleteThietBiKhuVuc,
  apiGetNhomThietBiKhuVuc,
  apiGetPhanXuong,
  apiGetThietBiKhuVuc,
  apiGetThietBiKhuVucStatistics,
  apiUpdateNhomThietBiKhuVuc,
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
import { useSelector } from 'react-redux'

const ADMIN_ROLE_ID = 4

const STATUS_COLORS = {
  tot: 'green',
  hong: 'red',
  sua: 'orange',
}

const compactCellStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  lineHeight: '1.35',
}

const renderCompactText = (value, fallback = 'Chua cap nhat') => {
  if (!value) return <span className="italic text-gray-400">{fallback}</span>
  return (
    <div title={value} style={compactCellStyle}>
      {value}
    </div>
  )
}

const STAT_CARD_STYLES = {
  tongBanGhi: {
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    borderColor: '#93c5fd',
    accent: '#1d4ed8',
  },
  tongSoLuong: {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    borderColor: '#86efac',
    accent: '#047857',
  },
  default: {
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    borderColor: '#fdba74',
    accent: '#c2410c',
  },
}

const renderStatsCard = (title, value, tone = STAT_CARD_STYLES.default) => (
  <Card
    size="small"
    title={<span className="font-semibold text-slate-700">{title}</span>}
    styles={{
      body: {
        background: tone.background,
        borderTop: `1px solid ${tone.borderColor}`,
        borderRadius: '0 0 12px 12px',
      },
      header: {
        background: '#ffffff',
        borderBottom: `1px solid ${tone.borderColor}`,
        borderRadius: '12px 12px 0 0',
      },
    }}
    style={{
      borderColor: tone.borderColor,
      borderRadius: 12,
      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    }}
  >
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold tracking-tight" style={{ color: tone.accent }}>
        {value}
      </span>
      {/* <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-slate-500">
        Tong quan
      </span> */}
    </div>
  </Card>
)

const toolbarControlStyle = {
  borderRadius: 10,
}

const toolbarButtonStyle = {
  height: 40,
  borderRadius: 10,
  fontWeight: 600,
}

const ManageThietBiKhuVuc = () => {
  const { current } = useSelector((state) => state.user)
  const isAdmin = current?.idQuyen === ADMIN_ROLE_ID

  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [groupLoading, setGroupLoading] = useState(false)
  const [data, setData] = useState([])
  const [stats, setStats] = useState([])
  const [phanXuongList, setPhanXuongList] = useState([])
  const [nhomList, setNhomList] = useState([])

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

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [groupSubmitting, setGroupSubmitting] = useState(false)
  const [groupForm] = Form.useForm()

  const nhomOptions = useMemo(
    () =>
      nhomList.map((item) => ({
        value: item.maNhom,
        label: item.tenNhom,
      })),
    [nhomList]
  )

  const nhomLabelMap = useMemo(
    () =>
      nhomList.reduce((acc, item) => {
        acc[item.maNhom] = item.tenNhom
        return acc
      }, {}),
    [nhomList]
  )

  const loadPhanXuong = useCallback(async () => {
    try {
      const response = await apiGetPhanXuong()
      const raw = Array.isArray(response) ? response : response?.data || []
      setPhanXuongList(raw)
    } catch {
      setPhanXuongList([])
      toast.error('Khong tai duoc danh sach phan xuong')
    }
  }, [])

  const loadNhomThietBi = useCallback(async () => {
    setGroupLoading(true)
    try {
      const response = await apiGetNhomThietBiKhuVuc()
      if (response?.status) {
        setNhomList(response.data || [])
      } else {
        setNhomList([])
      }
    } catch {
      setNhomList([])
      toast.error('Khong tai duoc danh sach nhom thiet bi')
    } finally {
      setGroupLoading(false)
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
      toast.error('Khong tai duoc du lieu thiet bi khu vuc')
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
      toast.error('Khong tai duoc thong ke theo khu vuc')
    } finally {
      setStatsLoading(false)
    }
  }, [selectedPhanXuongId])

  useEffect(() => {
    loadPhanXuong()
    loadNhomThietBi()
  }, [loadPhanXuong, loadNhomThietBi])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const refreshAll = useCallback(async () => {
    await Promise.all([loadData(), loadStats(), loadNhomThietBi()])
  }, [loadData, loadStats, loadNhomThietBi])

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
        toast.success(response.message || 'Xoa thanh cong')
        await Promise.all([loadData(), loadStats()])
      } else {
        toast.error(response?.message || 'Xoa that bai')
      }
    } catch {
      toast.error('Xoa that bai')
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
        toast.success(response.message || 'Luu thanh cong')
        setIsModalOpen(false)
        form.resetFields()
        await Promise.all([loadData(), loadStats()])
      } else {
        toast.error(response?.message || 'Khong the luu du lieu')
      }
    } catch {
      toast.error('Khong the luu du lieu')
    } finally {
      setSubmitting(false)
    }
  }

  const openCreateGroup = () => {
    setEditingGroup(null)
    groupForm.resetFields()
  }

  const openEditGroup = (record) => {
    setEditingGroup(record)
    groupForm.setFieldsValue({
      tenNhom: record.tenNhom,
      maNhom: record.maNhom,
    })
  }

  const submitGroup = async (values) => {
    setGroupSubmitting(true)
    try {
      const payload = { tenNhom: values.tenNhom?.trim() }
      const response = editingGroup
        ? await apiUpdateNhomThietBiKhuVuc(editingGroup.id, payload)
        : await apiCreateNhomThietBiKhuVuc(payload)

      if (response?.status) {
        toast.success(response.message || 'Luu nhom thiet bi thanh cong')
        groupForm.resetFields()
        setEditingGroup(null)
        await refreshAll()
      } else {
        toast.error(response?.message || 'Khong the luu nhom thiet bi')
      }
    } catch {
      toast.error('Khong the luu nhom thiet bi')
    } finally {
      setGroupSubmitting(false)
    }
  }

  const handleDeleteGroup = async (id) => {
    try {
      const response = await apiDeleteNhomThietBiKhuVuc(id)
      if (response?.status) {
        toast.success(response.message || 'Xoa nhom thiet bi thanh cong')
        if (editingGroup?.id === id) {
          setEditingGroup(null)
          groupForm.resetFields()
        }
        await refreshAll()
      } else {
        toast.error(response?.message || 'Khong the xoa nhom thiet bi')
      }
    } catch {
      toast.error('Khong the xoa nhom thiet bi')
    }
  }

  const totalSummary = useMemo(() => {
    return stats.reduce(
      (acc, item) => {
        acc.tongBanGhi += item.tongBanGhi || 0
        acc.tongSoLuong += item.tongSoLuong || 0

        ;(item.tongTheoNhom || []).forEach((group) => {
          const currentGroup = acc.tongTheoNhom[group.maNhom] || {
            maNhom: group.maNhom,
            tenNhom: group.tenNhom,
            tongBanGhi: 0,
            tongSoLuong: 0,
          }

          currentGroup.tongBanGhi += group.tongBanGhi || 0
          currentGroup.tongSoLuong += group.tongSoLuong || 0
          acc.tongTheoNhom[group.maNhom] = currentGroup
        })

        return acc
      },
      {
        tongBanGhi: 0,
        tongSoLuong: 0,
        tongTheoNhom: {},
      }
    )
  }, [stats])

  const groupSummaryCards = useMemo(() => {
    return nhomList.map((item) => ({
      maNhom: item.maNhom,
      tenNhom: item.tenNhom,
      tongSoLuong: totalSummary.tongTheoNhom[item.maNhom]?.tongSoLuong || 0,
    }))
  }, [nhomList, totalSummary])

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
      render: (_, record) => record.tenPhanXuong || `Phan xuong ${record.phanXuongId}`,
    },
    {
      title: 'Nhóm thiết bị',
      dataIndex: 'nhomThietBi',
      width: 170,
      render: (value) => nhomLabelMap[value] || value,
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'maVatTu',
      width: 110,
      render: (value) => renderCompactText(value, 'Khong co'),
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'tenVatTu',
      width: 170,
      render: (value) => renderCompactText(value),
    },
    {
      title: 'Vị trí',
      dataIndex: 'viTri',
      width: 180,
      render: (value) => renderCompactText(value),
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
      width: 150,
      render: (value) => renderCompactText(value, 'Khong co'),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      width: 140,
      render: (value) => {
        if (!value) return <span className="italic text-gray-400">Chua cap nhat</span>
        const lowered = value.toLowerCase()
        const color = lowered.includes('hong')
          ? STATUS_COLORS.hong
          : lowered.includes('sua')
            ? STATUS_COLORS.sua
            : STATUS_COLORS.tot
        return <Tag color={color}>{value}</Tag>
      },
    },
    {
      title: 'Lịch sử thay thế',
      dataIndex: 'lichSuThayThe',
      width: 250,
      render: (value) =>
        value ? (
          <div className="whitespace-pre-line" style={compactCellStyle} title={value}>
            {value}
          </div>
        ) : (
          <span className="italic text-gray-400">Khong co</span>
        ),
    },
    {
      title: 'Cập Nhật',
      dataIndex: 'ngayCapNhat',
      width: 130,
      render: (value) => (value ? moment(value).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Thao Tác',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <FaRegEdit className="text-blue-600 cursor-pointer" onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Xóa thiết bị này?"
            okText="Xoa"
            cancelText="Huy"
            onConfirm={() => handleDelete(record.id)}
          >
            <ImBin className="text-red-600 cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const groupColumns = [
    {
      title: 'Tên nhóm',
      dataIndex: 'tenNhom',
      key: 'tenNhom',
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'maNhom',
      key: 'maNhom',
      width: 180,
      render: (value) => <Tag>{value}</Tag>,
    },
    {
      title: 'Số thiết bị',
      dataIndex: 'soThietBi',
      key: 'soThietBi',
      width: 120,
      align: 'right',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditGroup(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhóm thiết bị này?"
            okText="Xoa"
            cancelText="Huy"
            onConfirm={() => handleDeleteGroup(record.id)}
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="w-full text-[13.5px] text-gray-800 font-medium">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Row gutter={[12, 12]} className="mb-0">
          <Col>
            <Button
              type="primary"
              onClick={openCreateModal}
              style={{
                ...toolbarButtonStyle,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 10px 18px rgba(37, 99, 235, 0.2)',
              }}
            >
              Thêm thiết bị khu vực
            </Button>
          </Col>
          {isAdmin && (
            <Col>
              <Button
                onClick={() => setIsGroupModalOpen(true)}
                style={{
                  ...toolbarButtonStyle,
                  borderColor: '#cbd5e1',
                  color: '#334155',
                  background: '#f8fafc',
                }}
              >
                Quản lý nhóm thiết bị
              </Button>
            </Col>
          )}
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
              style={toolbarControlStyle}
              size="large"
            />
          </Col>
          <Col flex="220px">
            <Select
              allowClear
              placeholder="Lọc theo nhóm thiết bị"
              value={selectedNhom}
              onChange={(v) => {
                setSelectedNhom(v)
                setPage(1)
              }}
              options={nhomOptions}
              className="w-full"
              loading={groupLoading}
              style={toolbarControlStyle}
              size="large"
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
              size="large"
              style={toolbarControlStyle}
            />
          </Col>
        </Row>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-3 shadow-sm">
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} lg={6}>
            {statsLoading ? (
              <Card size="small" loading />
            ) : (
              renderStatsCard('Tổng bản ghi', totalSummary.tongBanGhi, STAT_CARD_STYLES.tongBanGhi)
            )}
          </Col>
          <Col xs={24} md={12} lg={6}>
            {statsLoading ? (
              <Card size="small" loading />
            ) : (
              renderStatsCard('Tổng số lượng', totalSummary.tongSoLuong, STAT_CARD_STYLES.tongSoLuong)
            )}
          </Col>
          {groupSummaryCards.map((group) => (
            <Col xs={24} md={12} lg={6} key={group.maNhom}>
              {statsLoading ? (
                <Card size="small" loading />
              ) : (
                renderStatsCard(group.tenNhom, group.tongSoLuong)
              )}
            </Col>
          ))}
        </Row>
      </div>

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
        scroll={{ y: 'calc(100vh - 420px)', x: 1450 }}
      />

      <Modal
        title={editingItem ? 'Cap nhat thiet bi khu vuc' : 'Thêm mới thiết bị khu vực'}
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
                <Select
                  placeholder="Chọn nhóm thiết bị"
                  options={nhomOptions}
                  loading={groupLoading}
                />
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
              <Form.Item name="serialNumber" label="Serial (nêu có)">
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
                  rows={5}
                  placeholder={`Nhap moi lan thay the tren 1 dong, vi du:\n- Thay o cung ngay 30/06/2025\n- Nang cap RAM 8GB ngay 30/08/2025`}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Quản lý nhóm thiết bị khu vực"
        open={isGroupModalOpen}
        onCancel={() => {
          setIsGroupModalOpen(false)
          setEditingGroup(null)
          groupForm.resetFields()
        }}
        footer={null}
        width={820}
      >
        <Form form={groupForm} layout="vertical" onFinish={submitGroup}>
          <Row gutter={12} align="bottom">
            <Col span={editingGroup ? 10 : 14}>
              <Form.Item
                name="tenNhom"
                label="Tên nhóm"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhóm thiết bị' }]}
              >
                <Input placeholder="Nhập tên nhóm thiết bị" />
              </Form.Item>
            </Col>
            {editingGroup && (
              <Col span={8}>
                <Form.Item name="maNhom" label="Mã nhóm">
                  <Input disabled />
                </Form.Item>
              </Col>
            )}
            <Col span={editingGroup ? 6 : 10}>
              <Space>
                <Button type="primary" htmlType="submit" loading={groupSubmitting}>
                  {editingGroup ? 'Cập nhật nhóm' : 'Thêm nhóm'}
                </Button>
                <Button onClick={openCreateGroup}>Mới</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey="id"
          className="mt-4"
          loading={groupLoading}
          dataSource={nhomList}
          columns={groupColumns}
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  )
}

export default ManageThietBiKhuVuc
