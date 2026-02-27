import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  apiCreateNV,
  apiDeleteND,
  apiEditNV,
  apiEditND,
  apiGetAllNguoiDung,
  apiGetChucVu,
  apiGetKipLamViec,
  apiGetMaNV,
  apiGetQuyen,
  apiGetToLamViec,
  apiRegister,
} from '../../apis'

const pageSize = +import.meta.env.VITE_LIMIT || 20

const ManageUser = () => {
  const { current } = useSelector((state) => state.user)

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [chucVus, setChucVus] = useState([])
  const [kipLamViecs, setKipLamViecs] = useState([])
  const [toLamViecs, setToLamViecs] = useState([])
  const [nhanViens, setNhanViens] = useState([])

  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [employeeMode, setEmployeeMode] = useState('existing')

  const [formCreate] = Form.useForm()
  const [formEdit] = Form.useForm()

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const rs = await apiGetAllNguoiDung({ keyword, page, limit: pageSize })
      if (rs?.status) {
        setUsers(rs?.data || [])
        setTotal(rs?.totalItems || 0)
      } else {
        setUsers([])
        setTotal(0)
      }
    } catch {
      setUsers([])
      setTotal(0)
      toast.error('Không tải được danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }, [keyword, page])

  const loadResources = useCallback(async () => {
    try {
      const [rsRole, rsChucVu, rsKip, rsTo, rsMaNv] = await Promise.all([
        apiGetQuyen(),
        apiGetChucVu(),
        apiGetKipLamViec(),
        apiGetToLamViec(),
        apiGetMaNV(),
      ])
      setRoles(rsRole?.data || [])
      setChucVus(rsChucVu?.data || [])
      setKipLamViecs(rsKip?.data || [])
      setToLamViecs(rsTo?.data || [])
      setNhanViens(rsMaNv?.data || [])
    } catch {
      toast.error('Không tải được danh mục quản trị')
    }
  }, [])

  useEffect(() => {
    loadResources()
  }, [loadResources])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const updateNhanVienMeta = async (nhanVienId, values) => {
    const nv = nhanViens.find((item) => item.id === nhanVienId)
    if (!nv) return

    await apiEditNV(nhanVienId, {
      id: nv.id,
      maNv: nv.maNv,
      hoTen: nv.hoTen,
      hoTenKhongDau: nv.hoTenKhongDau,
      diaChi: nv.diaChi,
      ngayVaoLam: nv.ngayVaoLam,
      idPhongBan: nv.idPhongBan,
      idChucVu: values.idChucVu ?? nv.idChucVu ?? null,
      idKipLamViec: values.idKipLamViec ?? nv.idKipLamViec ?? null,
      idToLamViec: values.idToLamViec ?? nv.idToLamViec ?? null,
    })
  }

  const handleCreate = async () => {
    try {
      const values = await formCreate.validateFields()
      setSubmitting(true)

      let nhanVienId = values.nhanVienId

      if (employeeMode === 'new') {
        const nextId =
          (nhanViens.length ? Math.max(...nhanViens.map((item) => Number(item.id) || 0)) : 0) + 1

        const rsCreateNV = await apiCreateNV({
          id: nextId,
          maNv: values.nhanVienMoiMaNv?.trim() || values.tenDangNhap?.trim(),
          hoTen: values.nhanVienMoiHoTen?.trim(),
          hoTenKhongDau: values.nhanVienMoiHoTen?.trim(),
          diaChi: '',
          idPhongBan: null,
          idChucVu: values.idChucVu ?? null,
          idKipLamViec: values.idKipLamViec ?? null,
          idToLamViec: values.idToLamViec ?? null,
          ngayVaoLam: null,
        })

        if (!rsCreateNV?.status) {
          toast.error(rsCreateNV?.message || 'Không tạo được nhân viên mới')
          return
        }

        nhanVienId = rsCreateNV?.data?.id
        await loadResources()
      }

      if (!nhanVienId) {
        toast.error('Không xác định được nhân viên cho tài khoản')
        return
      }

      if (employeeMode === 'existing') {
        await updateNhanVienMeta(nhanVienId, values)
      }

      const rs = await apiRegister({
        tenDangNhap: values.tenDangNhap,
        matKhau: values.matKhau,
        nhanVienId,
        idquyen: values.idquyen,
        isLock: values.isLock ?? 0,
      })

      if (rs?.status) {
        toast.success(rs.message || 'Tạo tài khoản thành công')
        setOpenCreate(false)
        formCreate.resetFields()
        setEmployeeMode('existing')
        loadUsers()
      } else {
        toast.error(rs?.message || 'Tạo tài khoản thất bại')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenEdit = (record) => {
    const nv = nhanViens.find((item) => item.id === record.nhanVienID)
    setEditingUser(record)
    formEdit.setFieldsValue({
      tenDangNhap: record.tenDangNhap,
      matKhau: '',
      nhanVienId: record.nhanVienID,
      idquyen: record.idQuyen,
      idChucVu: nv?.idChucVu,
      idKipLamViec: nv?.idKipLamViec,
      idToLamViec: nv?.idToLamViec,
      isLock: record.isLock ?? 0,
    })
  }

  const handleEdit = async () => {
    if (!editingUser) return
    try {
      const values = await formEdit.validateFields()
      setSubmitting(true)

      const rs = await apiEditND(editingUser.idNguoiDung, {
        tenDangNhap: values.tenDangNhap,
        matKhau: values.matKhau?.trim() ? values.matKhau : null,
        nhanVienId: values.nhanVienId,
        idquyen: values.idquyen,
        isLock: values.isLock ?? 0,
      })

      if (rs?.status) {
        await updateNhanVienMeta(values.nhanVienId, values)
        toast.success(rs.message || 'Cập nhật tài khoản thành công')
        setEditingUser(null)
        formEdit.resetFields()
        loadResources()
        loadUsers()
      } else {
        toast.error(rs?.message || 'Cập nhật tài khoản thất bại')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const rs = await apiDeleteND(id)
    if (rs?.status) {
      toast.success(rs.message || 'Xóa tài khoản thành công')
      loadUsers()
    } else {
      toast.error(rs?.message || 'Xóa tài khoản thất bại')
    }
  }

  const roleOptions = useMemo(
    () => roles.map((role) => ({ label: role.tenQuyen, value: role.idquyen })),
    [roles]
  )

  const nhanVienOptions = useMemo(
    () => nhanViens.map((nv) => ({ label: `${nv.maNv} - ${nv.hoTen}`, value: nv.id })),
    [nhanViens]
  )

  const chucVuOptions = useMemo(
    () => chucVus.map((item) => ({ label: item.tenChucVu, value: item.idChucVu })),
    [chucVus]
  )

  const kipOptions = useMemo(
    () => kipLamViecs.map((item) => ({ label: item.tenKipLamViec, value: item.idKipLamViec })),
    [kipLamViecs]
  )

  const toOptions = useMemo(
    () => toLamViecs.map((item) => ({ label: item.tenToLamViec, value: item.idToLamViec })),
    [toLamViecs]
  )

  const columns = [
    { title: 'Tài khoản', dataIndex: 'tenDangNhap', key: 'tenDangNhap' },
    {
      title: 'Nhân viên',
      key: 'nhanVien',
      render: (_, record) => `${record.maNV || ''} - ${record.hoTen || ''}`,
    },
    { title: 'Chức vụ', dataIndex: 'tenChucVu', key: 'tenChucVu' },
    { title: 'Kíp', dataIndex: 'tenKipLamViec', key: 'tenKipLamViec' },
    { title: 'Tổ', dataIndex: 'tenToLamViec', key: 'tenToLamViec' },
    {
      title: 'Quyền',
      dataIndex: 'tenQuyen',
      key: 'tenQuyen',
      render: (value, record) => <Tag color={record.idQuyen === 4 ? 'red' : 'blue'}>{value}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isLock',
      key: 'isLock',
      render: (value) => (value === 1 ? <Tag color="warning">Đã khóa</Tag> : <Tag color="success">Hoạt động</Tag>),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleOpenEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa tài khoản này?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record.idNguoiDung)}>
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (current?.idQuyen !== 4) {
    return <div className="p-4 text-red-600 font-medium">Bạn không có quyền truy cập trang quản trị.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input.Search
          placeholder="Tìm tài khoản..."
          allowClear
          onSearch={(value) => {
            setPage(1)
            setKeyword(value.trim())
          }}
          className="max-w-[320px]"
        />
        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Tạo tài khoản
        </Button>
      </div>

      <Table
        rowKey="idNguoiDung"
        loading={loading}
        dataSource={users}
        columns={columns}
        pagination={{ current: page, pageSize, total, onChange: (nextPage) => setPage(nextPage) }}
      />

      <Modal
        title="Tạo tài khoản"
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false)
          formCreate.resetFields()
        }}
        onOk={handleCreate}
        confirmLoading={submitting}
      >
        <Form
          layout="vertical"
          form={formCreate}
          initialValues={{
            isLock: 0,
            nhanVienMoiMaNv: '',
            nhanVienMoiHoTen: '',
            idChucVu: undefined,
            idKipLamViec: undefined,
            idToLamViec: undefined,
          }}
        >
          <Form.Item name="tenDangNhap" label="Tên đăng nhập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Nhân viên">
            <Select
              value={employeeMode}
              onChange={(value) => {
                setEmployeeMode(value)
                if (value === 'existing') {
                  formCreate.setFieldsValue({ nhanVienMoiMaNv: '', nhanVienMoiHoTen: '' })
                } else {
                  formCreate.setFieldsValue({
                    nhanVienId: undefined,
                    nhanVienMoiMaNv: formCreate.getFieldValue('tenDangNhap') || '',
                  })
                }
              }}
              options={[
                { label: 'Chọn nhân viên có sẵn', value: 'existing' },
                { label: 'Nhập nhân viên mới', value: 'new' },
              ]}
            />
          </Form.Item>

          {employeeMode === 'existing' ? (
            <Form.Item name="nhanVienId" label="Nhân viên" rules={[{ required: true }]}>
              <Select options={nhanVienOptions} showSearch optionFilterProp="label" />
            </Form.Item>
          ) : (
            <>
              <Form.Item name="nhanVienMoiMaNv" label="Mã nhân viên mới" rules={[{ required: true, message: 'Nhập mã nhân viên' }]}>
                <Input placeholder="Ví dụ: HPDQ99999" />
              </Form.Item>
              <Form.Item name="nhanVienMoiHoTen" label="Tên nhân viên mới" rules={[{ required: true, message: 'Nhập tên nhân viên' }]}>
                <Input placeholder="Ví dụ: Nguyễn Văn A" />
              </Form.Item>
            </>
          )}

          <Form.Item name="idquyen" label="Quyền đăng nhập" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item name="idChucVu" label="Chức vụ">
            <Select options={chucVuOptions} allowClear />
          </Form.Item>
          <Form.Item name="idKipLamViec" label="Kíp làm việc">
            <Select options={kipOptions} allowClear />
          </Form.Item>
          <Form.Item name="idToLamViec" label="Tổ làm việc">
            <Select options={toOptions} allowClear />
          </Form.Item>
          <Form.Item name="isLock" label="Trạng thái">
            <Select options={[{ label: 'Hoạt động', value: 0 }, { label: 'Khóa', value: 1 }]} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cập nhật tài khoản"
        open={!!editingUser}
        onCancel={() => {
          setEditingUser(null)
          formEdit.resetFields()
        }}
        onOk={handleEdit}
        confirmLoading={submitting}
      >
        <Form layout="vertical" form={formEdit}>
          <Form.Item name="tenDangNhap" label="Tên đăng nhập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu mới (để trống nếu không đổi)">
            <Input.Password />
          </Form.Item>
          <Form.Item name="nhanVienId" label="Nhân viên" rules={[{ required: true }]}>
            <Select options={nhanVienOptions} showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="idquyen" label="Quyền" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item name="idChucVu" label="Chức vụ">
            <Select options={chucVuOptions} allowClear />
          </Form.Item>
          <Form.Item name="idKipLamViec" label="Kíp làm việc">
            <Select options={kipOptions} allowClear />
          </Form.Item>
          <Form.Item name="idToLamViec" label="Tổ làm việc">
            <Select options={toOptions} allowClear />
          </Form.Item>
          <Form.Item name="isLock" label="Trạng thái">
            <Select options={[{ label: 'Hoạt động', value: 0 }, { label: 'Khóa', value: 1 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageUser
