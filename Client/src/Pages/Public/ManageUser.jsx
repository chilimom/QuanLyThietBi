import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  apiDeleteND,
  apiEditND,
  apiGetAllNguoiDung,
  apiGetPhanXuong,
  apiGetQuyen,
  apiRegister,
} from '../../apis'

const pageSize = +import.meta.env.VITE_LIMIT || 20
const ADMIN_ROLE_ID = 4

const ManageUser = () => {
  const { current } = useSelector((state) => state.user)

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [phanXuongs, setPhanXuongs] = useState([])
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
      toast.error('Khong tai duoc danh sach tai khoan')
    } finally {
      setLoading(false)
    }
  }, [keyword, page])

  const loadRoles = useCallback(async () => {
    try {
      const rsRole = await apiGetQuyen()
      setRoles(rsRole?.data || [])
    } catch {
      toast.error('Khong tai duoc danh sach quyen')
    }
  }, [])

  const loadPhanXuongs = useCallback(async () => {
    try {
      const rs = await apiGetPhanXuong()
      const data = Array.isArray(rs) ? rs : rs?.data || []
      setPhanXuongs(data)
    } catch {
      setPhanXuongs([])
      toast.error('Khong tai duoc danh sach phan xuong')
    }
  }, [])

  useEffect(() => {
    loadRoles()
    loadPhanXuongs()
  }, [loadRoles, loadPhanXuongs])

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
        phanXuongIds: values.phanXuongIds || [],
        phanXuongId: values.phanXuongIds?.[0] ?? null,
      })

      if (rs?.status) {
        toast.success(rs.message || 'Tao tai khoan thanh cong')
        setOpenCreate(false)
        formCreate.resetFields()
        loadUsers()
      } else {
        toast.error(rs?.message || 'Tao tai khoan that bai')
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
      phanXuongIds: record.phanXuongIds?.length ? record.phanXuongIds : record.phanXuongId ? [record.phanXuongId] : [],
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
        phanXuongIds: values.phanXuongIds || [],
        phanXuongId: values.phanXuongIds?.[0] ?? null,
      })

      if (rs?.status) {
        toast.success(rs.message || 'Cap nhat tai khoan thanh cong')
        setEditingUser(null)
        formEdit.resetFields()
        loadUsers()
      } else {
        toast.error(rs?.message || 'Cap nhat tai khoan that bai')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const rs = await apiDeleteND(id)
    if (rs?.status) {
      toast.success(rs.message || 'Xoa tai khoan thanh cong')
      loadUsers()
    } else {
      toast.error(rs?.message || 'Xoa tai khoan that bai')
    }
  }

  const roleOptions = useMemo(
    () => roles.map((role) => ({ label: role.tenQuyen, value: role.idquyen })),
    [roles]
  )

  const phanXuongOptions = useMemo(
    () =>
      phanXuongs.map((item) => ({
        label: `${item.tenPhanXuong || item.TenPhanXuong}`,
        value: item.phanXuongId ?? item.PhanXuongId,
      })),
    [phanXuongs]
  )

  const columns = [
    { title: 'Ten dang nhap', dataIndex: 'tenDangNhap', key: 'tenDangNhap' },
    {
      title: 'Quyen',
      dataIndex: 'tenQuyen',
      key: 'tenQuyen',
      render: (value, record) => <Tag color={record.idQuyen === ADMIN_ROLE_ID ? 'red' : 'blue'}>{value}</Tag>,
    },
    {
      title: 'Phan xuong',
      dataIndex: 'tenPhanXuong',
      key: 'tenPhanXuong',
      render: (_, record) => {
        if (record.tenPhanXuongs?.length) return record.tenPhanXuongs.join(', ')
        if (record.phanXuongId) return `Phan xuong ${record.phanXuongId}`
        return <Tag>Toan bo</Tag>
      },
    },
    {
      title: 'Trang thai',
      dataIndex: 'isLock',
      key: 'isLock',
      render: (value) => (value === 1 ? <Tag color="warning">Da khoa</Tag> : <Tag color="success">Hoat dong</Tag>),
    },
    {
      title: 'Thao tac',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleOpenEdit(record)}>
            Sua
          </Button>
          <Popconfirm title="Xoa tai khoan nay?" okText="Xoa" cancelText="Huy" onConfirm={() => handleDelete(record.idNguoiDung)}>
            <Button danger size="small">
              Xoa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (current?.idQuyen !== ADMIN_ROLE_ID) {
    return <div className="p-4 text-red-600 font-medium">Ban khong co quyen truy cap trang quan tri.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input.Search
          placeholder="Tim tai khoan..."
          allowClear
          onSearch={(value) => {
            setPage(1)
            setKeyword(value.trim())
          }}
          className="max-w-[320px]"
        />
        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Tao tai khoan
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
        title="Tao tai khoan"
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false)
          formCreate.resetFields()
        }}
        onOk={handleCreate}
        confirmLoading={submitting}
      >
        <Form layout="vertical" form={formCreate} initialValues={{ isLock: 0 }}>
          <Form.Item name="tenDangNhap" label="Ten dang nhap" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mat khau" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="idquyen" label="Quyen dang nhap" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item shouldUpdate={(prev, cur) => prev.idquyen !== cur.idquyen} noStyle>
            {({ getFieldValue }) => {
              const selectedRole = getFieldValue('idquyen')
              const isAdminRole = selectedRole === ADMIN_ROLE_ID

              return (
                <Form.Item
                  name="phanXuongIds"
                  label="Phan xuong"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (isAdminRole || (Array.isArray(value) && value.length > 0)) return Promise.resolve()
                        return Promise.reject(new Error('Vui long chon it nhat 1 phan xuong cho user nay'))
                      },
                    },
                  ]}
                >
                  <Select
                    allowClear={isAdminRole}
                    mode="multiple"
                    placeholder={isAdminRole ? 'De trong neu la admin toan bo' : 'Chon 1 hoac nhieu phan xuong'}
                    options={phanXuongOptions}
                  />
                </Form.Item>
              )
            }}
          </Form.Item>
          <Form.Item name="isLock" label="Trang thai">
            <Select options={[{ label: 'Hoat dong', value: 0 }, { label: 'Khoa', value: 1 }]} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cap nhat tai khoan"
        open={!!editingUser}
        onCancel={() => {
          setEditingUser(null)
          formEdit.resetFields()
        }}
        onOk={handleEdit}
        confirmLoading={submitting}
      >
        <Form layout="vertical" form={formEdit}>
          <Form.Item name="tenDangNhap" label="Ten dang nhap" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mat khau moi (de trong neu khong doi)">
            <Input.Password />
          </Form.Item>
          <Form.Item name="idquyen" label="Quyen" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item shouldUpdate={(prev, cur) => prev.idquyen !== cur.idquyen} noStyle>
            {({ getFieldValue }) => {
              const selectedRole = getFieldValue('idquyen')
              const isAdminRole = selectedRole === ADMIN_ROLE_ID

              return (
                <Form.Item
                  name="phanXuongIds"
                  label="Phan xuong"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (isAdminRole || (Array.isArray(value) && value.length > 0)) return Promise.resolve()
                        return Promise.reject(new Error('Vui long chon it nhat 1 phan xuong cho user nay'))
                      },
                    },
                  ]}
                >
                  <Select
                    allowClear={isAdminRole}
                    mode="multiple"
                    placeholder={isAdminRole ? 'De trong neu la admin toan bo' : 'Chon 1 hoac nhieu phan xuong'}
                    options={phanXuongOptions}
                  />
                </Form.Item>
              )
            }}
          </Form.Item>
          <Form.Item name="isLock" label="Trang thai">
            <Select options={[{ label: 'Hoat dong', value: 0 }, { label: 'Khoa', value: 1 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageUser
