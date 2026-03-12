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
            title="Xoa thiet bi nay?"
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
      title: 'Ten nhom',
      dataIndex: 'tenNhom',
      key: 'tenNhom',
    },
    {
      title: 'Ma nhom',
      dataIndex: 'maNhom',
      key: 'maNhom',
      width: 180,
      render: (value) => <Tag>{value}</Tag>,
    },
    {
      title: 'So thiet bi',
      dataIndex: 'soThietBi',
      key: 'soThietBi',
      width: 120,
      align: 'right',
    },
    {
      title: 'Thao tac',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditGroup(record)}>
            Sua
          </Button>
          <Popconfirm
            title="Xoa nhom thiet bi nay?"
            okText="Xoa"
            cancelText="Huy"
            onConfirm={() => handleDeleteGroup(record.id)}
          >
            <Button danger size="small">
              Xoa
            </Button>
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
            Them thiet bi khu vuc
          </Button>
        </Col>
        {isAdmin && (
          <Col>
            <Button onClick={() => setIsGroupModalOpen(true)}>Quan ly nhom thiet bi</Button>
          </Col>
        )}
        <Col flex="220px">
          <Select
            allowClear
            placeholder="Loc theo phan xuong"
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
            placeholder="Loc nhom thiet bi"
            value={selectedNhom}
            onChange={(v) => {
              setSelectedNhom(v)
              setPage(1)
            }}
            options={nhomOptions}
            className="w-full"
            loading={groupLoading}
          />
        </Col>
        <Col flex="300px">
          <Input.Search
            allowClear
            placeholder="Tim ma vat tu, ten vat tu, vi tri, serial, tinh trang..."
            onSearch={(value) => {
              setKeyword(value || '')
              setPage(1)
            }}
          />
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="mb-3">
        <Col xs={24} md={12} lg={6}>
          <Card size="small" loading={statsLoading} title="Tong ban ghi">
            <span className="text-xl font-semibold">{totalSummary.tongBanGhi}</span>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size="small" loading={statsLoading} title="Tong so luong">
            <span className="text-xl font-semibold">{totalSummary.tongSoLuong}</span>
          </Card>
        </Col>
        {groupSummaryCards.map((group) => (
          <Col xs={24} md={12} lg={6} key={group.maNhom}>
            <Card size="small" loading={statsLoading} title={group.tenNhom}>
              <span className="text-xl font-semibold">{group.tongSoLuong}</span>
            </Card>
          </Col>
        ))}
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
        scroll={{ y: 'calc(100vh - 420px)', x: 1450 }}
      />

      <Modal
        title={editingItem ? 'Cap nhat thiet bi khu vuc' : 'Them thiet bi khu vuc'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingItem ? 'Cap nhat' : 'Them moi'}
        cancelText="Huy"
        confirmLoading={submitting}
        width={760}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="phanXuongId"
                label="Phan xuong"
                rules={[{ required: true, message: 'Vui long chon phan xuong' }]}
              >
                <Select
                  placeholder="Chon phan xuong"
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
                label="Nhom thiet bi"
                rules={[{ required: true, message: 'Vui long chon nhom thiet bi' }]}
              >
                <Select
                  placeholder="Chon nhom thiet bi"
                  options={nhomOptions}
                  loading={groupLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maVatTu" label="Ma vat tu">
                <Input placeholder="Nhap ma vat tu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tenVatTu"
                label="Ten vat tu"
                rules={[{ required: true, message: 'Vui long nhap ten vat tu' }]}
              >
                <Input placeholder="Nhap ten vat tu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="viTri"
                label="Vi tri trong phan xuong"
                rules={[{ required: true, message: 'Vui long nhap vi tri' }]}
              >
                <Input placeholder="Vi du: Day chuyen 1 - Tu dien A3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="soLuong"
                label="So luong"
                rules={[{ required: true, message: 'Vui long nhap so luong' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serialNumber" label="Serial (neu co)">
                <Input placeholder="Nhap serial" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tinhTrang" label="Tinh trang">
                <Input placeholder="Vi du: Tot, Dang sua, Hong..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="lichSuThayThe" label="Lich su thay the">
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
        title="Quan ly nhom thiet bi"
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
                label="Ten nhom"
                rules={[{ required: true, message: 'Vui long nhap ten nhom thiet bi' }]}
              >
                <Input placeholder="Nhap ten nhom thiet bi" />
              </Form.Item>
            </Col>
            {editingGroup && (
              <Col span={8}>
                <Form.Item name="maNhom" label="Ma nhom">
                  <Input disabled />
                </Form.Item>
              </Col>
            )}
            <Col span={editingGroup ? 6 : 10}>
              <Space>
                <Button type="primary" htmlType="submit" loading={groupSubmitting}>
                  {editingGroup ? 'Cap nhat nhom' : 'Them nhom'}
                </Button>
                <Button onClick={openCreateGroup}>Moi</Button>
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
