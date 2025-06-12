import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Popconfirm, Row, Col, Card, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import Adminlayout from '../layout/Sidebar';
import TextArea from 'antd/es/input/TextArea';

const AddProduct = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:2020/api/add-product');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('د محصولاتو راوړلو کې ستونزه راغله');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editingProduct) {
        await axios.put(`http://localhost:2020/api/add-product/${editingProduct._id}`, values);
        message.success('محصول په بریالیتوب سره تازه شو');
      } else {
        await axios.post('http://localhost:2020/api/add-product', values);
        message.success('نوی محصول په بریالیتوب سره اضافه شو');
      }

      form.resetFields();
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      message.error(error.response?.data?.message || 'د محصول خوندي کولو کې ستونزه راغله');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:2020/api/add-product/${id}`);
      message.success('محصول په بریالیتوب سره ړنګ شو');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('د محصول د ړنګولو کې ستونزه راغله');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
   
    {
      title: 'ډول',
      dataIndex: 'category',
      key: 'category',
      align: 'right',
      responsive: ['md'],
    },
     {
      title: 'توضیحات',
      dataIndex: 'name',
      key: 'name',
      align: 'right',
      responsive: ['md'],
    },

    {
      title: 'عملې',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue(record);
            }}
            className="p-0"
          />
          <Popconfirm
            title="ایا تاسو ډاډه یاست چې غواړئ دا محصول حذف کړئ؟"
            onConfirm={() => handleDelete(record._id)}
            okText="هو"
            cancelText="نه"
            placement="top"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />} className="p-0" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Adminlayout>
      <div className="container mx-auto p-4" dir="rtl">
        <h1 className="text-2xl font-bold mb-6 text-center">محصولات</h1>

        <Row gutter={[16, 16]}>
          {/* Form Column */}
          <Col xs={24} sm={24} md={12}>
            <Card title="نوی محصول اضافه کړئ" className="shadow-md">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Form.Item
                  name="category"
                  label="ډول"
                  rules={[{ required: true, message: 'لطفاً ډول زیات کړئ' }]}
                >
                 <Input></Input>
                </Form.Item>

                <Form.Item
                  name="name"
                  label="توضیحات"
                  rules={[{ required: true, message: 'لطفاً توضیحات ولیکئ' }]}
                >
                  <TextArea placeholder="توضیحات" className="w-full" />
                </Form.Item>




                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    {loading ? 'در حال خوندي کول...' : editingProduct ? 'ثبت کړه' : 'ذخیره کړئ'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Table Column */}
          <Col xs={24} sm={24} md={12}>
            <Card title="ټول محصولات" className="shadow-md">
              <Table
                columns={columns}
                dataSource={products}
                rowKey="_id"
                loading={loading}
                locale={{ emptyText: 'هیڅ محصولات نشته' }}
                pagination={{
                  position: ['bottomLeft'],
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} د ${total} څخه`,
                }}
                size="middle"
                className="rtl"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Adminlayout>
  );
};

export default AddProduct;
