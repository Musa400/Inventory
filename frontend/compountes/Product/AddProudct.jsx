import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Popconfirm, Grid } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import Adminlayout from '../layout/Sidebar';

const { useBreakpoint } = Grid;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();

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
      setIsModalVisible(false);
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
      title: 'نوم',
      dataIndex: 'name',
      key: 'name',
      align: 'right',
      responsive: ['md'],
    },
    {
      title: 'ډول',
      dataIndex: 'category',
      key: 'category',
      align: 'right',
      responsive: ['md'],
    },
    {
      title: 'عملې',
      key: 'actions',
      align: 'center',
      fixed: screens.md ? false : 'right',
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
              setIsModalVisible(true);
            }}
            className="p-0"
          />
          <Popconfirm
            title="ایا تاسو ډاډه یاست چې غواړئ دا محصول حذف کړئ؟"
            onConfirm={() => handleDelete(record._id)}
            okText="هو"
            cancelText="نه"
            placement={screens.md ? 'left' : 'topRight'}
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />} className="p-0" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Mobile view columns
  const mobileColumns = [
    {
      title: 'معلومات',
      key: 'info',
      align: 'right',
      render: (_, record) => (
        <div className="flex flex-col">
          <div className="font-medium">{record.name}</div>
          <div className="text-gray-500 text-sm">ډول: {record.category}</div>
        </div>
      ),
    },
    ...columns.filter(col => col.key === 'actions')
  ];

  return (
    <Adminlayout>
      <div className="p-2 sm:p-4" dir="rtl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">محصولات</h1>
          <Button
            type="primary"
            size={screens.xs ? 'small' : 'middle'}
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            className="w-full sm:w-auto"
          >
            {screens.xs ? 'نوی' : 'نوی محصول اضافه کړئ'}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={screens.md ? columns : mobileColumns}
            dataSource={products}
            rowKey="_id"
            loading={loading}
            locale={{ emptyText: 'هیڅ محصولات نشته' }}
            pagination={{
              position: ['bottomLeft'],
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total, range) => `${range[0]}-${range[1]} د ${total} څخه`,
              size: screens.xs ? 'small' : 'default',
              showLessItems: screens.xs,
              simple: screens.xs,
            }}
            size={screens.xs ? 'small' : 'middle'}
            scroll={screens.md ? undefined : { x: 'max-content' }}
            className="shadow-sm"
          />
        </div>

        <Modal
          title={editingProduct ? 'د محصول ترمیم' : 'نوی محصول اضافه کړئ'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose
          width={screens.xs ? '90%' : '600px'}
          className="rtl"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={editingProduct || {}}
            dir="rtl"
          >
            <Form.Item
              name="name"
              label="د محصول نوم"
              rules={[{ required: true, message: 'لطفاً د محصول نوم ولیکئ' }]}
            >
              <Input 
                placeholder="د محصول نوم ولیکئ" 
                dir="rtl" 
                size={screens.xs ? 'large' : 'middle'}
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="ډول"
              rules={[{ required: true, message: 'لطفاً د محصول ډول ولیکئ' }]}
            >
               <Select placeholder="ډول انتخاب کړئ" dir="rtl" size={screens.xs ? 'large' : 'middle'}>
              <Option value="پرزه">   پرزه</Option>
              <Option value="بطری">بطری</Option>
              <Option value="روغنیات">روغنیات</Option>
            </Select>

              
            </Form.Item>

            <Form.Item className="flex justify-start gap-2">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size={screens.xs ? 'large' : 'middle'}
                className="w-full sm:w-auto"
              >
                {editingProduct ? 'ثبت کړه' : 'اضافه کړه'}
              </Button>
              <Button 
                onClick={() => setIsModalVisible(false)}
                size={screens.xs ? 'large' : 'middle'}
                className="w-full sm:w-auto mt-2 sm:mt-0"
              >
                لغوه کړه
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Adminlayout>
  );
};

export default AddProduct;
