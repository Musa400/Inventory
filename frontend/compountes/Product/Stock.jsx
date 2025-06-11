import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Input, Button, Space, message } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Adminlayout from '../layout/Sidebar';
import axios from 'axios';

function Stock() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:2020/api/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('د موجود مال د لیست ترلاسه نشد!');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'نوم',
      dataIndex: 'name',
      key: 'name',
      align: 'right',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingCartOutlined />
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: 'ډول',
      dataIndex: 'category',
      key: 'category',
      align: 'right',
    },
    {
      title: 'موجودی',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      render: (quantity) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag 
            color={quantity > 0 ? 'green' : 'red'}
            style={{ fontWeight: 'bold' }}
          >
            {quantity}
          </Tag>
          {quantity < 3 && quantity > 0 && (
            <Tag color="orange" style={{ fontWeight: 'bold' }}>
              په خلصیدو 
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'حالت',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <Tag 
          color={record.quantity > 0 ? 'green' : 'red'}
          style={{ fontWeight: 'bold' }}
        >
          {record.quantity > 0 ? 'موجود' : 'ختم شوی'}
        </Tag>
      ),
    },
  ];

  return (
    <Adminlayout>
      <div className="max-w-6xl mx-auto p-4" style={{ direction: 'rtl' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">د موجود مال کتنه</h1>

        <Space className="mb-4" direction="rtl">
          <Input.Search
            placeholder="د محصول نوم یا ډول ولټوئ"
            allowClear
            enterButton="پلټنه"
            size="large"
            onSearch={value => setSearchText(value)}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            loading={loading}
          />
          <Button 
            type="primary" 
            onClick={fetchProducts}
            loading={loading}
            icon={<ExclamationCircleOutlined />}
          >
            تازه کړئ
          </Button>
        </Space>

        <Card bordered className="shadow-lg">
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            bordered
            size="middle"
            locale={{ emptyText: 'د معلوماتو نشتوالی' }}
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </Card>
      </div>
    </Adminlayout>
  );
}

export default Stock;
