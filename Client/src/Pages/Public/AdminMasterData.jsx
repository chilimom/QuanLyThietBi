import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd'
import { toast } from 'react-toastify'

const AdminMasterData = ({
  title,
  idField,
  nameField,
  fetchAction,
  createAction,
  updateAction,
  deleteAction,
}) => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formCreate] = Form.useForm()
  const [formEdit] = Form.useForm()

  const loadData = async () => {
    setLoading(true)
    try {
      const rs = await fetchAction()
      const data = Array.isArray(rs) ? rs : rs?.data || []
      setRows(data)
    } catch {
      toast.error('Không tải được dữ liệu danh mục')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async () => {
    try {
      const values = await formCreate.validateFields()
      setSubmitting(true)
      const rs = await createAction({ [nameField]: values.name.trim() })
      if (rs?.status === false) {
        toast.error(rs?.message || 'Thêm thất bại')
        return
      }
      toast.success(rs?.message || 'Thêm thành công')
      setOpenCreate(false)
      formCreate.resetFields()
      loadData()
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenEdit = (record) => {
    setEditing(record)
    formEdit.setFieldsValue({ name: record[nameField] })
  }

  const handleEdit = async () => {
    if (!editing) return
    try {
      const values = await formEdit.validateFields()
      setSubmitting(true)
      const rs = await updateAction(editing[idField], { [nameField]: values.name.trim() })
      if (rs?.status === false) {
        toast.error(rs?.message || 'Cập nhật thất bại')
        return
      }
      toast.success(rs?.message || 'Cập nhật thành công')
      setEditing(null)
      formEdit.resetFields()
      loadData()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const rs = await deleteAction(id)
    if (rs?.status === false) {
      toast.error(rs?.message || 'Xóa thất bại')
      return
    }
    toast.success(rs?.message || 'Xóa thành công')
    loadData()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Thêm mới
        </Button>
      </div>

      <Table
        rowKey={idField}
        loading={loading}
        dataSource={rows}
        columns={[
          {
            title: 'Tên',
            dataIndex: nameField,
          },
          {
            title: 'Thao tác',
            render: (_, record) => (
              <Space>
                <Button size="small" onClick={() => handleOpenEdit(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa mục này?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => handleDelete(record[idField])}
                >
                  <Button size="small" danger>
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={`Thêm ${title}`}
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false)
          formCreate.resetFields()
        }}
        onOk={handleCreate}
        confirmLoading={submitting}
      >
        <Form layout="vertical" form={formCreate}>
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Cập nhật ${title}`}
        open={!!editing}
        onCancel={() => {
          setEditing(null)
          formEdit.resetFields()
        }}
        onOk={handleEdit}
        confirmLoading={submitting}
      >
        <Form layout="vertical" form={formEdit}>
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminMasterData

