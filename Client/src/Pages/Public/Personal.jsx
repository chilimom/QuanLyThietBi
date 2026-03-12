import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { apiUpdatePersonal } from '../../apis'
import { getCurent } from '../../store/user/asyncActions'
import avatarFallback from '../../assets/image/account.png'

const Personal = () => {
  const dispatch = useDispatch()
  const { current } = useSelector((state) => state.user)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')

  useEffect(() => {
    form.setFieldsValue({
      tenDangNhap: current?.tenDangNhap || '',
      hoTen: current?.hoTen || '',
      email: current?.email || '',
      soDienThoai: current?.soDienThoai || '',
      diaChi: current?.diaChi || '',
      anhDaiDien: current?.anhDaiDien || '',
      matKhauHienTai: '',
      matKhauMoi: '',
      xacNhanMatKhauMoi: '',
    })
    setAvatarPreview(current?.anhDaiDien || '')
  }, [current, form])

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Chi duoc chon file anh')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Anh dai dien phai nho hon 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setAvatarPreview(result)
      form.setFieldValue('anhDaiDien', result)
    }
    reader.readAsDataURL(file)
  }

  const clearAvatar = () => {
    setAvatarPreview('')
    form.setFieldValue('anhDaiDien', '')
  }

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      const payload = {
        hoTen: values.hoTen?.trim() || null,
        email: values.email?.trim() || null,
        soDienThoai: values.soDienThoai?.trim() || null,
        diaChi: values.diaChi?.trim() || null,
        anhDaiDien: values.anhDaiDien || null,
        matKhauHienTai: values.matKhauHienTai?.trim() || null,
        matKhauMoi: values.matKhauMoi?.trim() || null,
      }

      const response = await apiUpdatePersonal(payload)
      if (response?.status) {
        toast.success(response.message || 'Cập nhật thông tin cá nhân thành công')
        form.setFieldsValue({
          matKhauHienTai: '',
          matKhauMoi: '',
          xacNhanMatKhauMoi: '',
        })
        dispatch(getCurent())
      } else {
        toast.error(response?.message || 'Không thể cập nhật thông tin cá nhân')
      }
    } catch {
      toast.error('Không thể cập nhật thông tin cá nhân')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card title="Thông tin cá nhân">
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src={avatarPreview || avatarFallback}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
            />
            <div className="flex gap-3">
              <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700">
                Chon anh
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <Button onClick={clearAvatar}>Xóa ảnh</Button>
            </div>
          </div>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tên đăng nhập" name="tenDangNhap">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Họ và tên" name="hoTen">
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Số điện thoại" name="soDienThoai">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Địa chỉ" name="diaChi">
                <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="anhDaiDien" hidden>
            <Input />
          </Form.Item>

          <Card size="small" title="Đổi mật khẩu" className="mb-4">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Mật khẩu hiện tại" name="matKhauHienTai">
                  <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Mật khẩu mới"
                  name="matKhauMoi"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('matKhauHienTai')) return Promise.resolve()
                        return Promise.reject(new Error('Nhâp mật khẩu hiện tại'))
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="xacNhanMatKhauMoi"
                  dependencies={['matKhauMoi']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const matKhauMoi = getFieldValue('matKhauMoi')
                        if (!matKhauMoi && !value) return Promise.resolve()
                        if (value === matKhauMoi) return Promise.resolve()
                        return Promise.reject(new Error('Xác nhận mật khẩu mới không khớp'))
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={submitting}>
              Lưu thông tin
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Personal
