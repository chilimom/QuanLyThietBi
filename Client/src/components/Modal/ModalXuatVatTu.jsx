
import { Form, Input, InputNumber, Button } from 'antd'
import { apiXuatVatTuBulk } from '../../apis/xuatVatTu'


const ModalXuatVatTu = ({ order }) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    try {
    const payload = {
      OrderNo: order.order,
      EQ: order.eq,
      VatTus: values.VatTus
    }

    await apiXuatVatTuBulk(payload)
    form.resetFields()
     } catch (err) {
         message.error(err?.message || 'Lỗi khi xuất vật tư')
  }
  }
  return (
    <div
         onClick={(e) => e.stopPropagation()}   // 🔥 CHẶN CLICK BUBBLE
      style={{
        width: 700,
        maxHeight: '80vh',
        overflowY: 'auto',
        background: '#fff',
        padding: 16,
        borderRadius: 6,
      }}
    >
      {/* HEADER */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        Xuất vật tư – Order {order?.order}
      </h2>

      <div style={{ marginBottom: 12 }}>
        <b>EQ:</b> {order?.eq}
      </div>

      {/* FORM */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ VatTus: [{}] }}
      >
        <Form.List name="VatTus">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div
                  key={key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 3fr 1fr 2fr 40px',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Form.Item
                    name={[name, 'MaVT']}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Mã VT" />
                  </Form.Item>

                  <Form.Item name={[name, 'TenVT']}>
                    <Input placeholder="Tên vật tư" />
                  </Form.Item>

                  <Form.Item
                    name={[name, 'SoLuong']}
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name={[name, 'GhiChu']}>
                    <Input placeholder="Ghi chú" />
                  </Form.Item>

                  <Button danger onClick={() => remove(name)}>
                    X
                  </Button>
                </div>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Thêm vật tư
              </Button>
            </>
          )}
        </Form.List>

        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Lưu xuất vật tư
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default ModalXuatVatTu
