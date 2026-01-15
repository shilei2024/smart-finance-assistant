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
  Switch,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Descriptions,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  BankOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { accountsAPI } from '../../../api/accounts';
import type {
  AccountResponseDto,
  AccountType,
  AccountStatus,
  AccountQueryDto,
  AccountOverviewStatistics,
} from '../../../types/account';
import './Accounts.css';

const { Option } = Select;
const { TabPane } = Tabs;

const Accounts = () => {
  const [accounts, setAccounts] = useState<AccountResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<AccountOverviewStatistics | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountResponseDto | null>(null);
  const [form] = Form.useForm();
  const [query, setQuery] = useState<AccountQueryDto>({
    page: 1,
    limit: 10,
    sortBy: 'balance',
    sortOrder: 'desc',
  });

  // 加载账户数据
  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountsAPI.findAll(query);
      setAccounts(response.data);
    } catch (error) {
      message.error('加载账户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计信息
  const loadStatistics = async () => {
    try {
      const stats = await accountsAPI.getOverviewStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  useEffect(() => {
    loadAccounts();
    loadStatistics();
  }, [query]);

  // 获取账户类型图标
  const getAccountTypeIcon = (type: AccountType) => {
    switch (type) {
      case 'BANK':
        return <BankOutlined />;
      case 'CREDIT_CARD':
        return <CreditCardOutlined />;
      case 'CASH':
        return <WalletOutlined />;
      default:
        return <WalletOutlined />;
    }
  };

  // 获取账户类型颜色
  const getAccountTypeColor = (type: AccountType) => {
    const colorMap = {
      CASH: 'green',
      BANK: 'blue',
      CREDIT_CARD: 'red',
      INVESTMENT: 'orange',
      LOAN: 'purple',
      OTHER: 'gray',
    };
    return colorMap[type] || 'gray';
  };

  // 表格列定义
  const columns: ColumnsType<AccountResponseDto> = [
    {
      title: '账户名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          {getAccountTypeIcon(record.type)}
          <span>{name}</span>
          {record.isDefault && <Tag color="gold">默认</Tag>}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: AccountType) => {
        const typeMap = {
          CASH: '现金',
          BANK: '银行账户',
          CREDIT_CARD: '信用卡',
          INVESTMENT: '投资账户',
          LOAN: '贷款账户',
          OTHER: '其他',
        };
        return (
          <Tag color={getAccountTypeColor(type)}>
            {typeMap[type] || type}
          </Tag>
        );
      },
      filters: [
        { text: '现金', value: 'CASH' },
        { text: '银行账户', value: 'BANK' },
        { text: '信用卡', value: 'CREDIT_CARD' },
        { text: '投资账户', value: 'INVESTMENT' },
        { text: '贷款账户', value: 'LOAN' },
        { text: '其他', value: 'OTHER' },
      ],
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number, record) => (
        <span style={{ fontWeight: 'bold', color: balance >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {record.currency} {balance.toFixed(2)}
        </span>
      ),
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: AccountStatus) => {
        const statusMap = {
          ACTIVE: { text: '活跃', color: 'green' },
          INACTIVE: { text: '停用', color: 'orange' },
          CLOSED: { text: '已关闭', color: 'red' },
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '活跃', value: 'ACTIVE' },
        { text: '停用', value: 'INACTIVE' },
        { text: '已关闭', value: 'CLOSED' },
      ],
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
            title="确定要删除这个账户吗？"
            description="删除后账户将无法恢复"
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

  // 查看账户详情
  const handleView = (account: AccountResponseDto) => {
    setSelectedAccount(account);
    setViewModalVisible(true);
  };

  // 编辑账户
  const handleEdit = (account: AccountResponseDto) => {
    setSelectedAccount(account);
    form.setFieldsValue({
      ...account,
      initialBalance: account.balance,
    });
    setModalVisible(true);
  };

  // 删除账户
  const handleDelete = async (id: string) => {
    try {
      await accountsAPI.remove(id);
      message.success('删除成功');
      loadAccounts();
      loadStatistics();
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  // 创建新账户
  const handleCreate = () => {
    setSelectedAccount(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      // 确保initialBalance是数字类型
      if (values.initialBalance !== undefined) {
        values.initialBalance = Number(values.initialBalance);
      }
      
      // 确保isDefault是布尔类型
      if (values.isDefault === undefined) {
        values.isDefault = false;
      }

      if (selectedAccount) {
        // 更新
        await accountsAPI.update(selectedAccount.id, values);
        message.success('更新成功');
      } else {
        // 创建
        console.log('创建账户，提交数据:', values);
        await accountsAPI.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      loadAccounts();
      loadStatistics();
    } catch (error: any) {
      console.error('账户操作失败:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        (selectedAccount ? '更新失败' : '创建失败');
      message.error(errorMessage);
    }
  };

  // 表格变化处理
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newQuery: AccountQueryDto = {
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      type: filters.type?.[0],
      status: filters.status?.[0],
      sortBy: sorter.field || 'balance',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    };
    setQuery(newQuery);
  };

  return (
    <div className="accounts-page">
      <Row gutter={[16, 16]}>
        {/* 统计卡片 */}
        <Col span={24}>
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总资产"
                  value={statistics?.totalBalance || 0}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="账户数量"
                  value={statistics?.accountCount || 0}
                />
              </Col>
              <Col span={12}>
                <Tabs size="small">
                  {statistics?.byType?.map((item) => (
                    <TabPane
                      tab={
                        <span>
                          {item.type === 'CASH' && '现金'}
                          {item.type === 'BANK' && '银行'}
                          {item.type === 'CREDIT_CARD' && '信用卡'}
                          {item.type === 'INVESTMENT' && '投资'}
                          {item.type === 'LOAN' && '贷款'}
                          {item.type === 'OTHER' && '其他'}
                        </span>
                      }
                      key={item.type}
                    >
                      <Space>
                        <span>{item.count}个账户</span>
                        <span style={{ color: '#52c41a' }}>
                          ¥{item.balance.toFixed(2)}
                        </span>
                      </Space>
                    </TabPane>
                  ))}
                </Tabs>
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
                新增账户
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadAccounts();
                  loadStatistics();
                }}
              >
                刷新
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 账户表格 */}
        <Col span={24}>
          <Card>
            <Table
              columns={columns}
              dataSource={accounts}
              rowKey="id"
              loading={loading}
              onChange={handleTableChange}
              pagination={{
                current: query.page,
                pageSize: query.limit,
                total: accounts.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个账户`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 创建/编辑模态框 */}
      <Modal
        title={selectedAccount ? '编辑账户' : '新增账户'}
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
                name="name"
                label="账户名称"
                rules={[{ required: true, message: '请输入账户名称' }]}
              >
                <Input placeholder="请输入账户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="账户类型"
                rules={[{ required: true, message: '请选择账户类型' }]}
              >
                <Select placeholder="请选择账户类型">
                  <Option value="CASH">现金</Option>
                  <Option value="BANK">银行账户</Option>
                  <Option value="CREDIT_CARD">信用卡</Option>
                  <Option value="INVESTMENT">投资账户</Option>
                  <Option value="LOAN">贷款账户</Option>
                  <Option value="OTHER">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="initialBalance"
                label="初始余额"
                rules={[{ required: true, message: '请输入初始余额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入初始余额"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="货币"
                initialValue="CNY"
              >
                <Select placeholder="请选择货币">
                  <Option value="CNY">人民币 (CNY)</Option>
                  <Option value="USD">美元 (USD)</Option>
                  <Option value="EUR">欧元 (EUR)</Option>
                  <Option value="JPY">日元 (JPY)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea
              placeholder="请输入账户描述"
              rows={2}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="color"
                label="颜色"
                initialValue="#1890ff"
              >
                <Input type="color" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isDefault"
                label="设为默认账户"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情模态框 */}
      <Modal
        title="账户详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedAccount && (
          <div className="account-detail">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="账户名称" span={2}>
                <Space>
                  {getAccountTypeIcon(selectedAccount.type)}
                  <span>{selectedAccount.name}</span>
                  {selectedAccount.isDefault && <Tag color="gold">默认</Tag>}
                </Space>
              </Descriptions.Item>
              
              <Descriptions.Item label="账户类型">
                <Tag color={getAccountTypeColor(selectedAccount.type)}>
                  {selectedAccount.type === 'CASH' && '现金'}
                  {selectedAccount.type === 'BANK' && '银行账户'}
                  {selectedAccount.type === 'CREDIT_CARD' && '信用卡'}
                  {selectedAccount.type === 'INVESTMENT' && '投资账户'}
                  {selectedAccount.type === 'LOAN' && '贷款账户'}
                  {selectedAccount.type === 'OTHER' && '其他'}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="账户状态">
                <Tag color={
                  selectedAccount.status === 'ACTIVE' ? 'green' :
                  selectedAccount.status === 'INACTIVE' ? 'orange' : 'red'
                }>
                  {selectedAccount.status === 'ACTIVE' && '活跃'}
                  {selectedAccount.status === 'INACTIVE' && '停用'}
                  {selectedAccount.status === 'CLOSED' && '已关闭'}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="余额">
                <span style={{ 
                  fontWeight: 'bold', 
                  color: selectedAccount.balance >= 0 ? '#52c41a' : '#ff4d4f' 
                }}>
                  {selectedAccount.currency} {selectedAccount.balance.toFixed(2)}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="货币">
                {selectedAccount.currency}
              </Descriptions.Item>
              
              {selectedAccount.description && (
                <Descriptions.Item label="描述" span={2}>
                  {selectedAccount.description}
                </Descriptions.Item>
              )}
              
              {selectedAccount.bankName && (
                <Descriptions.Item label="银行名称">
                  {selectedAccount.bankName}
                </Descriptions.Item>
              )}
              
              {selectedAccount.accountNumber && (
                <Descriptions.Item label="账号">
                  {selectedAccount.accountNumber}
                </Descriptions.Item>
              )}
              
              {selectedAccount.creditLimit && (
                <Descriptions.Item label="信用额度">
                  {selectedAccount.currency} {selectedAccount.creditLimit.toFixed(2)}
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="创建时间">
                {new Date(selectedAccount.createdAt).toLocaleString()}
              </Descriptions.Item>
              
              <Descriptions.Item label="更新时间">
                {new Date(selectedAccount.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Accounts;