import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { categoriesAPI } from '../../../api/categories';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../../../types/category';
import { TransactionType } from '../../../types/transaction';
import './Categories.css';

const { Option } = Select;

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesAPI.findAll();
      setCategories(data);
    } catch (error) {
      message.error('加载分类失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesAPI.delete(id);
      message.success('删除成功');
      loadCategories();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: CreateCategoryDto | UpdateCategoryDto) => {
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, values);
        message.success('更新成功');
      } else {
        await categoriesAPI.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadCategories();
    } catch (error) {
      message.error(editingCategory ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Category) => (
        <Space>
          {record.color && (
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: record.color,
              }}
            />
          )}
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: TransactionType) => (
        <Tag color={type === TransactionType.INCOME ? 'green' : 'red'}>
          {type === TransactionType.INCOME ? '收入' : '支出'}
        </Tag>
      ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon?: string) => icon || '-',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="categories-page">
      <Card
        title="分类管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建分类
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '新建分类'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="例如：餐饮" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Select placeholder="选择类型">
                  <Option value={TransactionType.INCOME}>收入</Option>
                  <Option value={TransactionType.EXPENSE}>支出</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="icon" label="图标">
                <Input placeholder="例如：food" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="color" label="颜色">
            <Input type="color" style={{ width: '100%', height: 40 }} />
          </Form.Item>

          <Form.Item name="isActive" label="状态" initialValue={true}>
            <Select>
              <Option value={true}>启用</Option>
              <Option value={false}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;