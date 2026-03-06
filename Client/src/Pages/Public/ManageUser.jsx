import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { apiDeleteND, apiEditND, apiGetAllNguoiDung, apiGetQuyen, apiRegister } from '../../apis'

const pageSize = +import.meta.env.VITE_LIMIT || 20

const ManageUser = () => {
  const { current } = useSelector((state) => state.user)

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  const loadRoles = useCallback(async () => {
    try {
      const rsRole = await apiGetQuyen()
      setRoles(rsRole?.data || [])
    } catch {
      toast.error('Không tải được danh sách quyền')
    }
  }, [])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleCreate = async () => {
    try {
      const values = await formCreate.validateFields()
      setSubmitting(true)

      const rs = await apiRegister({
        tenDangNhap: values.tenDangNhap?.trim(),
        matKhau: values.matKhau,
        idquyen: values.idquyen,
        isLock: values.isLock ?? 0,
      })

      if (rs?.status) {
        toast.success(rs.message || 'Tạo tài khoản thành công')
        setOpenCreate(false)
        formCreate.resetFields()
        loadUsers()
      } else {
        toast.error(rs?.message || 'Tạo tài khoản thất bại')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenEdit = (record) => {
    setEditingUser(record)
    formEdit.setFieldsValue({
      tenDangNhap: record.tenDangNhap,
      matKhau: '',
      idquyen: record.idQuyen,
      isLock: record.isLock ?? 0,
    })
  }

  const handleEdit = async () => {
    if (!editingUser) return
    try {
      const values = await formEdit.validateFields()
      setSubmitting(true)

      const rs = await apiEditND(editingUser.idNguoiDung, {
        tenDangNhap: values.tenDangNhap?.trim(),
        matKhau: values.matKhau?.trim() ? values.matKhau : null,
        idquyen: values.idquyen,
        isLock: values.isLock ?? 0,
      })

      if (rs?.status) {
        toast.success(rs.message || 'Cập nhật tài khoản thành công')
        setEditingUser(null)
        formEdit.resetFields()
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

  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'tenDangNhap', key: 'tenDangNhap' },
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
        <Form layout="vertical" form={formCreate} initialValues={{ isLock: 0 }}>
          <Form.Item name="tenDangNhap" label="Tên đăng nhập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="idquyen" label="Quyền đăng nhập" rules={[{ required: true }]}>
            <Select options={roleOptions} />
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
          <Form.Item name="idquyen" label="Quyền" rules={[{ required: true }]}>
            <Select options={roleOptions} />
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
