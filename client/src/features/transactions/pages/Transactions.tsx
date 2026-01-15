import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { transactionsAPI } from '../../../api/transactions';
import { accountsAPI } from '../../../api/accounts';
import { categoriesAPI } from '../../../api/categories';
import type {
  TransactionResponseDto,
  TransactionType,
  TransactionStatus,
  TransactionQueryDto,
  TransactionStatistics,
} from '../../../types/transaction';
import type { AccountResponseDto } from '../../../types/account';
import type { Category } from '../../../types/category';
import './Transactions.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<TransactionStatistics | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponseDto | null>(null);
  const [accounts, setAccounts] = useState<AccountResponseDto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form] = Form.useForm();
  const [query, setQuery] = useState<TransactionQueryDto>({
    page: 1,
    limit: 10,
    sortBy: 'transactionDate',
    sortOrder: 'desc',
  });

  // 加载交易数据
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsAPI.findAll(query);
      setTransactions(response.data);
    } catch (error) {
      message.error('加载交易记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计信息
  const loadStatistics = async () => {
    try {
      const stats = await transactionsAPI.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  // 加载账户列表
  const loadAccounts = async () => {
    try {
      const response = await accountsAPI.findAll({ page: 1, limit: 100 });
      setAccounts(response.data || []);
    } catch (error) {
      console.error('加载账户列表失败:', error);
    }
  };

  // 加载分类列表
  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.findAll();
      setCategories(data || []);
    } catch (error) {
      console.error('加载分类列表失败:', error);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadStatistics();
    loadAccounts();
    loadCategories();
  }, [query]);

  // 表格列定义
  const columns: ColumnsType<TransactionResponseDto> = [
    {
      title: '日期',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: TransactionType) => {
        const typeMap = {
          INCOME: { text: '收入', color: 'green' },
          EXPENSE: { text: '支出', color: 'red' },
          TRANSFER: { text: '转账', color: 'blue' },
        };
        const config = typeMap[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '收入', value: 'INCOME' },
        { text: '支出', value: 'EXPENSE' },
        { text: '转账', value: 'TRANSFER' },
      ],
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record) => (
        <span style={{ color: record.type === 'EXPENSE' ? '#ff4d4f' : '#52c41a' }}>
          {record.currency} {amount.toFixed(2)}
        </span>
      ),
      sorter: true,
    },
    {
      title: '账户',
      dataIndex: 'account',
      key: 'account',
      render: (account) => account?.name || '-',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category?.name || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: TransactionStatus) => {
        const statusMap = {
          PENDING: { text: '待处理', color: 'orange' },
          COMPLETED: { text: '已完成', color: 'green' },
          CANCELLED: { text: '已取消', color: 'red' },
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="确定要删除这条交易记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 查看交易详情
  const handleView = (transaction: TransactionResponseDto) => {
    setSelectedTransaction(transaction);
    setViewModalVisible(true);
  };

  // 编辑交易
  const handleEdit = (transaction: TransactionResponseDto) => {
    setSelectedTransaction(transaction);
    form.setFieldsValue({
      ...transaction,
      transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate) : undefined,
    });
    setModalVisible(true);
  };

  // 删除交易
  const handleDelete = async (id: string) => {
    try {
      await transactionsAPI.remove(id);
      message.success('删除成功');
      loadTransactions();
      loadStatistics();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 创建新交易
  const handleCreate = () => {
    setSelectedTransaction(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (selectedTransaction) {
        // 更新
        await transactionsAPI.update(selectedTransaction.id, values);
        message.success('更新成功');
      } else {
        // 创建
        await transactionsAPI.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadTransactions();
      loadStatistics();
    } catch (error) {
      message.error(selectedTransaction ? '更新失败' : '创建失败');
    }
  };

  // 表格变化处理
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newQuery: TransactionQueryDto = {
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      type: filters.type?.[0],
      status: filters.status?.[0],
      sortBy: sorter.field || 'transactionDate',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    };
    setQuery(newQuery);
  };

  return (
    <div className="transactions-page">
      <Row gutter={[16, 16]}>
        {/* 统计卡片 */}
        <Col span={24}>
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总交易额"
                  value={statistics?.totalAmount || 0}
                  precision={2}
                  prefix="¥"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="交易笔数"
                  value={statistics?.totalCount || 0}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="总收入"
                  value={statistics?.byType?.find(t => t.type === 'INCOME')?.amount || 0}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="总支出"
                  value={statistics?.byType?.find(t => t.type === 'EXPENSE')?.amount || 0}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 操作栏 */}
        <Col span={24}>
          <Card>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新增交易
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadTransactions();
                  loadStatistics();
                }}
              >
                刷新
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 交易表格 */}
        <Col span={24}>
          <Card>
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="id"
              loading={loading}
              onChange={handleTableChange}
              pagination={{
                current: query.page,
                pageSize: query.limit,
                total: transactions.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 创建/编辑模态框 */}
      <Modal
        title={selectedTransaction ? '编辑交易' : '新增交易'}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="交易类型"
                rules={[{ required: true, message: '请选择交易类型' }]}
              >
                <Select 
                  placeholder="请选择交易类型"
                  onChange={() => {
                    // 切换类型时清空分类，因为分类类型必须匹配
                    form.setFieldsValue({ categoryId: undefined });
                  }}
                >
                  <Option value="INCOME">收入</Option>
                  <Option value="EXPENSE">支出</Option>
                  <Option value="TRANSFER">转账</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="金额"
                rules={[{ required: true, message: '请输入金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入金额"
                  min={0.01}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountId"
                label="账户"
                rules={[{ required: true, message: '请选择账户' }]}
              >
                <Select placeholder="请选择账户">
                  {accounts.map((account) => (
                    <Option key={account.id} value={account.id}>
                      {account.name} ({account.currency} {account.balance.toFixed(2)})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="分类"
              >
                <Select 
                  placeholder="请选择分类"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {categories
                    .filter((cat) => {
                      const transactionType = form.getFieldValue('type') || selectedTransaction?.type;
                      return !transactionType || cat.type === transactionType;
                    })
                    .map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {form.getFieldValue('type') === 'TRANSFER' && (
            <Form.Item
              name="toAccountId"
              label="目标账户"
              rules={[{ required: true, message: '转账必须选择目标账户' }]}
            >
              <Select placeholder="请选择目标账户">
                {accounts
                  .filter((account) => account.id !== form.getFieldValue('accountId'))
                  .map((account) => (
                    <Option key={account.id} value={account.id}>
                      {account.name} ({account.currency} {account.balance.toFixed(2)})
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="transactionDate"
                label="交易日期"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择交易日期"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
              >
                <Select placeholder="请选择状态">
                  <Option value="PENDING">待处理</Option>
                  <Option value="COMPLETED">已完成</Option>
                  <Option value="CANCELLED">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea
              placeholder="请输入交易描述"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情模态框 */}
      <Modal
        title="交易详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTransaction && (
          <div className="transaction-detail">
            <Row gutter={16}>
              <Col span={12}>
                <div className="detail-item">
                  <label>交易类型：</label>
                  <span>
                    {selectedTransaction.type === 'INCOME' && '收入'}
                    {selectedTransaction.type === 'EXPENSE' && '支出'}
                    {selectedTransaction.type === 'TRANSFER' && '转账'}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <label>金额：</label>
                  <span>
                    {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                  </span>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div className="detail-item">
                  <label>账户：</label>
                  <span>{selectedTransaction.account?.name || '-'}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <label>分类：</label>
                  <span>{selectedTransaction.category?.name || '-'}</span>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div className="detail-item">
                  <label>交易日期：</label>
                  <span>
                    {new Date(selectedTransaction.transactionDate).toLocaleString()}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <label>状态：</label>
                  <span>
                    {selectedTransaction.status === 'PENDING' && '待处理'}
                    {selectedTransaction.status === 'COMPLETED' && '已完成'}
                    {selectedTransaction.status === 'CANCELLED' && '已取消'}
                  </span>
                </div>
              </Col>
            </Row>

            {selectedTransaction.description && (
              <div className="detail-item">
                <label>描述：</label>
                <span>{selectedTransaction.description}</span>
              </div>
            )}

            {selectedTransaction.payee && (
              <div className="detail-item">
                <label>收款方：</label>
                <span>{selectedTransaction.payee}</span>
              </div>
            )}

            {selectedTransaction.tags && selectedTransaction.tags.length > 0 && (
              <div className="detail-item">
                <label>标签：</label>
                <span>
                  {selectedTransaction.tags.map((tag) => (
                    <Tag key={tag} style={{ marginRight: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </span>
              </div>
            )}

            <div className="detail-item">
              <label>创建时间：</label>
              <span>{new Date(selectedTransaction.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transactions;