import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Card, Row, Col, Statistic, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ShoppingCartOutlined, ShoppingOutlined, DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Adminlayout from '../layout/Sidebar';
import axios from 'axios';

const { Option } = Select;

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lowStockModalVisible, setLowStockModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:2020/api/add-product/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      message.error('د کټګوریو ترلاسه کولو کې ستونزه راغله!');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:2020/api/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('محصولات ترلاسه نشو!');
      setProducts([]); // Ensure products is always an array
    }
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!searchText) return products;
    const lowerSearch = searchText.toLowerCase();
    return products.filter(p =>
      p && 
      p.name && 
      p.category &&
      (p.name.toLowerCase().includes(lowerSearch) ||
      p.category.toLowerCase().includes(lowerSearch))
    );
  }, [searchText, products]);

  const totalProducts = filteredProducts.length;
  const totalQuantity = filteredProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const totalValue = filteredProducts.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.quantity) || 0)), 0);

  const columns = [
    { title: 'نوم', dataIndex: 'name', key: 'name', align: 'right', responsive: ['sm'] },
    { title: 'ډول', dataIndex: 'category', key: 'category', align: 'right', responsive: ['sm'] },
    { title: 'نرخ (افغانی)', dataIndex: 'price', key: 'price', align: 'right', responsive: ['md'] },
    { title: 'مقدار', dataIndex: 'quantity', key: 'quantity', align: 'right', responsive: ['md'] },
    {
      title: 'عملیات',
      key: 'actions',
      align: 'center',
      fixed: 'left',
      render: (_, record) => (
        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
          </Button>

          <Popconfirm
            title="ایا تاسو ډاډه یاست چې غواړئ دا محصول حذف کړئ؟"
            onConfirm={() => deleteProduct(record._id || record.id)}
            okText="هو"
            cancelText="نه"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const lowStockProducts = products.filter(p => p.quantity < 3);
  const lowStockColumns = [
    { title: 'نوم', dataIndex: 'name', key: 'name', align: 'right' },
    { title: 'ډول', dataIndex: 'category', key: 'category', align: 'right' },
    { title: 'نرخ (افغانی)', dataIndex: 'price', key: 'price', align: 'right' },
    { title: 'مقدار', dataIndex: 'quantity', key: 'quantity', align: 'right' },
  ];

  const showModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      name: record.name,
      category: record.category,
      price: record.price,
      quantity: record.quantity
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setLowStockModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      if (editingProduct && editingProduct._id) {
        // Update existing product
        await axios.put(`http://localhost:2020/api/products/${editingProduct._id}`, values);
        message.success('محصول په بریالیتوب سره تازه شو!');
      } else {
        // Create new product
        await axios.post('http://localhost:2020/api/products', values);
        message.success('نوی محصول په بریالیتوب سره ثبت شو!');
      }
      setIsModalOpen(false);
      fetchProducts();
      form.resetFields();
    } catch (err) {
      console.error('Error saving product:', err);
      message.error('د محصول د خوندي کولو پر مهال ستونزه رامنځ ته شوه!');
    }
  };

  const deleteProduct = async (id) => {
    if (!id) {
      message.error('د محصول ID پیدا نشو!');
      return;
    }
    
    try {
      await axios.delete(`http://localhost:2020/api/products/${id}`);
      message.success('محصول په بریالیتوب سره حذف شو!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      message.error('د محصول د حذف کولو پر مهال ستونزه رامنځ ته شوه!');
    }
  };

  return (
    <Adminlayout>
      <div className="max-w-6xl mx-auto p-4" style={{ direction: 'rtl' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">محصولات</h1>

        <Input.Search
          placeholder="د محصول نوم یا ډول ولټوئ"
          allowClear
          enterButton="پلټنه"
          size="large"
          onSearch={value => setSearchText(value)}
          onChange={e => setSearchText(e.target.value)}
          className="mb-4"
          style={{ maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card 
            className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">ټول محصولات</span>}
              value={totalProducts}
              prefix={<ShoppingOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
              className="text-right"
            />
            <div className="mt-2 text-sm text-gray-500">
              د محصولاتو شمیر
            </div>
          </Card>

          <Card 
            className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">ټول مقدار</span>}
              value={totalQuantity}
              precision={0}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ color: '#1890ff' }}
              className="text-right"
            />
            <div className="mt-2 text-sm text-gray-500">
              د موجودی ټول مقدار
            </div>
          </Card>

          <Card 
            className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span className="text-gray-600">ټول ارزښت</span>}
              value={totalValue}
              precision={2}
              prefix={<DollarOutlined className="text-purple-500" />}
              suffix="افغانی"
              valueStyle={{ color: '#722ed1' }}
              className="text-right"
            />
            <div className="mt-2 text-sm text-gray-500">
              د موجودی ټول ارزښت
            </div>
          </Card>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="mb-6">
            <Button
              type="primary"
              danger
              icon={<ExclamationCircleOutlined />}
              onClick={() => setLowStockModalVisible(true)}
              className="flex items-center"
            >
              د کم مقدار محصولات ({lowStockProducts.length})
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <Button type="primary" onClick={showModal} className="order-1 sm:order-2">
            نوی محصول اضافه کړئ
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: 'د معلوماتو نشتوالی' }}
          bordered
          size="middle"
        />

        <Modal
          title={editingProduct ? 'محصول سمول' : 'نوی محصول'}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
          centered
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="د محصول نوم"
              name="name"
              rules={[{ required: true, message: 'د محصول نوم ولیکئ' }]}
            >
              <Input placeholder="د محصول نوم ولیکئ" />
            </Form.Item>

            <Form.Item
              name="category"
              label="ډول"
              rules={[{ required: true, message: 'لطفاً د محصول ډول وټاکئ' }]}
            >
              <Select placeholder="د محصول ډول وټاکئ" showSearch>
                {categories.map((category, index) => (
                  <Option key={index} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="نرخ (افغانی)"
              name="price"
              rules={[{ required: true, message: 'نرخ ولیکئ' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="مقدار"
              name="quantity"
              rules={[{ required: true, message: 'مقدار ولیکئ' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                ثبتول
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="د کم مقدار محصولات"
          open={lowStockModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
          centered
        >
          <Table
            columns={lowStockColumns}
            dataSource={lowStockProducts}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: 'کم مقدار محصولات نشته' }}
            style={{ direction: 'rtl' }}
            size="small"
            bordered
          />
        </Modal>
      </div>
    </Adminlayout>
  );
}

export default Products;
