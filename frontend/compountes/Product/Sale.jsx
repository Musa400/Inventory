import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Adminlayout from '../layout/Sidebar';

const initialSales = [
  {
    id: 1,
    productName: 'کالي',
    salePrice: 1500,
    quantity: 2,
    totalPrice: 3000,
    date: dayjs().format('YYYY-MM-DD'),
    customerName: 'احمد',
  },
];

const Sales = () => {
  const [sales, setSales] = useState(initialSales);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingSale, setEditingSale] = useState(null);

  const showModal = () => {
    form.resetFields();
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    const totalPrice = values.salePrice * values.quantity;
    if (editingSale) {
      const updatedSale = { ...editingSale, ...values, totalPrice };
      setSales(sales.map(s => (s.id === editingSale.id ? updatedSale : s)));
      message.success('خرڅلاو اپډیټ شو!');
    } else {
      const newSale = {
        id: sales.length + 1,
        ...values,
        totalPrice,
        date: values.date.format('YYYY-MM-DD'),
      };
      setSales([...sales, newSale]);
      message.success('خرڅ ثبت شو!');
    }
    setIsModalOpen(false);
  };

  const deleteSale = (id) => {
    setSales(sales.filter(s => s.id !== id));
    message.success('خرڅ حذف شو!');
  };

  const columns = [
    { title: 'توکی', dataIndex: 'productName', key: 'productName', align: 'right' },
    { title: 'خرڅ نرخ', dataIndex: 'salePrice', key: 'salePrice', align: 'right' },
    { title: 'مقدار', dataIndex: 'quantity', key: 'quantity', align: 'right' },
    { title: 'مجموعه قیمت', dataIndex: 'totalPrice', key: 'totalPrice', align: 'right' },
    { title: 'نیټه', dataIndex: 'date', key: 'date', align: 'right' },
    { title: 'مشتري نوم', dataIndex: 'customerName', key: 'customerName', align: 'right' },
    {
      title: 'عملیات',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSale(record);
              form.setFieldsValue({
                ...record,
                date: dayjs(record.date),
              });
              setIsModalOpen(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteSale(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Adminlayout>
    <div className="p-4 max-w-5xl mx-auto" style={{ direction: 'rtl' }}>
      <h1 className="text-2xl font-bold text-center mb-6">خرڅ ثبتول او کتنه</h1>

      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={showModal}>
          نوی خرڅ ثبت کړئ
        </Button>
      </div>

      <Card bordered>
        <Table
          columns={columns}
          dataSource={sales}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
          size="middle"
          locale={{ emptyText: 'هیڅ خرڅ نشته' }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingSale ? 'خرڅ سمول' : 'نوی خرڅ ثبت کړئ'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="توکی"
            name="productName"
            rules={[{ required: true, message: 'توکی ولیکئ' }]}
          >
            <Input placeholder="توکی ولیکئ" />
          </Form.Item>

          <Form.Item
            label="خرڅ نرخ"
            name="salePrice"
            rules={[{ required: true, message: 'خرڅ نرخ داخل کړئ' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="مقدار"
            name="quantity"
            rules={[{ required: true, message: 'مقدار ولیکئ' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="نیټه"
            name="date"
            rules={[{ required: true, message: 'نیټه وټاکئ' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="مشتري نوم (اختیاري)"
            name="customerName"
          >
            <Input placeholder="مشتري نوم" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              ثبتول
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </Adminlayout>
  );
};

export default Sales;
