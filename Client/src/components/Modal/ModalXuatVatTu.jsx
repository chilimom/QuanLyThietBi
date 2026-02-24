// import { Modal, Form, Input, InputNumber, Button, Space, message } from 'antd'
// import { apiXuatVatTuBulk } from "../../apis/xuatVatTu";


// const ModalXuatVatTu = ({ open, onCancel, order }) => {
//   const [form] = Form.useForm()

//   const handleSubmit = async (values) => {
//     const payload = {
//       orderNo: order.Order,
//       eq: order.EQ,
//       vatTus: values.vatTus
//     }

//     await apiXuatVatTuBulk(payload)
//     message.success('Xuất vật tư thành công')

//     form.resetFields()
//     onCancel()
//   }

//   return (
//     <Modal
//       open={open}
//       title={`Xuất vật tư - Order ${order?.Order}`}
//       onCancel={onCancel}
//       footer={null}
//       width={700}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         initialValues={{ vatTus: [{}] }}
//       >
//         <Form.List name="vatTus">
//           {(fields, { add, remove }) => (
//             <>
//               {fields.map(({ key, name }) => (
//                 <Space key={key} align="baseline">
//                   <Form.Item
//                     name={[name, 'maVT']}
//                     rules={[{ required: true, message: 'Nhập mã VT' }]}
//                   >
//                     <Input placeholder="Mã VT" />
//                   </Form.Item>

//                   <Form.Item name={[name, 'tenVT']}>
//                     <Input placeholder="Tên VT" />
//                   </Form.Item>

//                   <Form.Item
//                     name={[name, 'soLuong']}
//                     rules={[{ required: true }]}
//                   >
//                     <InputNumber min={1} placeholder="SL" />
//                   </Form.Item>

//                   <Form.Item name={[name, 'ghiChu']}>
//                     <Input placeholder="Ghi chú" />
//                   </Form.Item>

//                   <Button danger onClick={() => remove(name)}>X</Button>
//                 </Space>
//               ))}

//               <Button type="dashed" onClick={() => add()} block>
//                 + Thêm vật tư
//               </Button>
//             </>
//           )}
//         </Form.List>

//         <div style={{ textAlign: 'right', marginTop: 16 }}>
//           <Button onClick={onCancel}>Hủy</Button>
//           <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
//             Lưu xuất VT
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   )
// }

// export default ModalXuatVatTu
// const ModalXuatVatTu = ({ order }) => {
//   return (
//     <div className="p-4 text-[15px]">
//       <h2 className="text-lg font-bold mb-3">
//         Xuất vật tư – Order {order?.order}
//       </h2>

//       <p><b>Order:</b> {order?.order}</p>
//       <p><b>EQ:</b> {order?.eq}</p>

//       <div className="mt-4 italic text-gray-500">
//         (Form xuất vật tư sẽ đặt ở đây)
//       </div>
//     </div>
//   )
// }

// export default ModalXuatVatTu
// import { Form, Input, InputNumber, Button, Space, message } from 'antd'
// import { apiXuatVatTuBulk } from '../../apis/xuatVatTu'

// const ModalXuatVatTu = ({ order }) => {
//   const [form] = Form.useForm()

//   const handleSubmit = async (values) => {
//     const payload = {
//       orderNo: order.order,
//       eq: order.eq,
//       vatTus: values.vatTus
//     }

//     try {
//       await apiXuatVatTuBulk(payload)
//       message.success('Xuất vật tư thành công')
//       form.resetFields()
//     } catch (err) {
//       message.error('Xuất vật tư thất bại')
//     }
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-bold mb-3">
//         Xuất vật tư – Order {order?.order}
//       </h2>

//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         initialValues={{ vatTus: [{}] }}
//       >
//         <Form.List name="vatTus">
//           {(fields, { add, remove }) => (
//             <>
//               {fields.map(({ key, name }) => (
//                 <Space key={key} align="baseline" style={{ display: 'flex' }}>
//                   <Form.Item
//                     name={[name, 'maVT']}
//                     label="Mã VT"
//                     rules={[{ required: true, message: 'Nhập mã VT' }]}
//                   >
//                     <Input />
//                   </Form.Item>

//                   <Form.Item
//                     name={[name, 'tenVT']}
//                     label="Tên VT"
//                   >
//                     <Input />
//                   </Form.Item>

//                   <Form.Item
//                     name={[name, 'soLuong']}
//                     label="Số lượng"
//                     rules={[{ required: true }]}
//                   >
//                     <InputNumber min={1} />
//                   </Form.Item>

//                   <Form.Item name={[name, 'ghiChu']} label="Ghi chú">
//                     <Input />
//                   </Form.Item>

//                   <Button danger onClick={() => remove(name)}>
//                     X
//                   </Button>
//                 </Space>
//               ))}

//               <Button type="dashed" onClick={() => add()} block>
//                 + Thêm vật tư
//               </Button>
//             </>
//           )}
//         </Form.List>

//         <div style={{ textAlign: 'right', marginTop: 16 }}>
//           <Button htmlType="submit" type="primary">
//             Lưu xuất vật tư
//           </Button>
//         </div>
//       </Form>
//     </div>
//   )
// }

// export default ModalXuatVatTu
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
