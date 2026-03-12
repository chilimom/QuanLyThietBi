import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { apiUpdatePersonal } from '../../apis'
import { getCurent } from '../../store/user/asyncActions'

const Personal = () => {
  const dispatch = useDispatch()
  const { current } = useSelector((state) => state.user)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      tenDangNhap: current?.tenDangNhap || '',
      hoTen: current?.hoTen || '',
      email: current?.email || '',
      soDienThoai: current?.soDienThoai || '',
      diaChi: current?.diaChi || '',
      matKhauHienTai: '',
      matKhauMoi: '',
      xacNhanMatKhauMoi: '',
    })
  }, [current, form])

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      const payload = {
        hoTen: values.hoTen?.trim() || null,
        email: values.email?.trim() || null,
        soDienThoai: values.soDienThoai?.trim() || null,
        diaChi: values.diaChi?.trim() || null,
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
                        return Promise.reject(new Error('Nhập mật khẩu hiện tại'))
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
