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
  Progress,
  Descriptions,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { budgetsAPI } from '../../../api/budgets';
import { categoriesAPI } from '../../../api/categories';
import type {
  BudgetResponseDto,
  BudgetPeriod,
  BudgetQueryDto,
  BudgetStatistics,
} from '../../../types/budget';
import type { Category } from '../../../types/category';
import './Budgets.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Budgets = () => {
  const [budgets, setBudgets] = useState<BudgetResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<BudgetStatistics | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetResponseDto | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form] = Form.useForm();
  const [query, setQuery] = useState<BudgetQueryDto>({
    page: 1,
    limit: 10,
    sortBy: 'startDate',
    sortOrder: 'desc',
  });

  // 加载预算数据
  const loadBudgets = async () => {
    setLoading(true);
    try {
      const response = await budgetsAPI.findAll(query);
      setBudgets(response.data);
    } catch (error) {
      message.error('加载预算列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计信息
  const loadStatistics = async () => {
    try {
      const stats = await budgetsAPI.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计信息失败:', error);
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
    loadBudgets();
    loadStatistics();
    loadCategories();
  }, [query]);

  // 获取预算周期文本
  const getPeriodText = (period: BudgetPeriod) => {
    const periodMap = {
      DAILY: '每日',
      WEEKLY: '每周',
      MONTHLY: '每月',
      YEARLY: '每年',
      CUSTOM: '自定义',
    };
    return periodMap[period] || period;
  };

  // 获取进度条颜色
  const getProgressColor = (percentage: number, isExceeded: boolean) => {
    if (isExceeded) return '#ff4d4f';
    if (percentage >= 90) return '#ff9800';
    if (percentage >= 80) return '#ffc107';
    return '#52c41a';
  };

  // 表格列定义
  const columns: ColumnsType<BudgetResponseDto> = [
    {
      title: '预算名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          <span>{name}</span>
          {record.isExceeded && (
            <Tag color="red" icon={<WarningOutlined />}>
              超支
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '周期',
      dataIndex: 'period',
      key: 'period',
      render: (period: BudgetPeriod) => (
        <Tag>{getPeriodText(period)}</Tag>
      ),
      filters: [
        { text: '每日', value: 'DAILY' },
        { text: '每周', value: 'WEEKLY' },
        { text: '每月', value: 'MONTHLY' },
        { text: '每年', value: 'YEARLY' },
        { text: '自定义', value: 'CUSTOM' },
      ],
    },
    {
      title: '预算金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record) => (
        <span style={{ fontWeight: 'bold' }}>
          {record.currency} {amount.toFixed(2)}
        </span>
      ),
      sorter: true,
    },
    {
      title: '已花费',
      dataIndex: 'spentAmount',
      key: 'spentAmount',
      render: (spentAmount: number, record) => (
        <span style={{ color: record.isExceeded ? '#ff4d4f' : '#52c41a' }}>
          {record.currency} {spentAmount.toFixed(2)}
        </span>
      ),
      sorter: true,
    },
    {
      title: '剩余',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      render: (remainingAmount: number, record) => (
        <span style={{ color: remainingAmount >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {record.currency} {remainingAmount.toFixed(2)}
        </span>
      ),
      sorter: true,
    },
    {
      title: '进度',
      key: 'progress',
      render: (_, record) => (
        <Progress
          percent={Math.min(record.spentPercentage, 100)}
          status={record.isExceeded ? 'exception' : 'active'}
          strokeColor={getProgressColor(record.spentPercentage, record.isExceeded)}
          format={(percent) => `${percent?.toFixed(1)}%`}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'gray'}>
          {isActive ? '激活' : '停用'}
        </Tag>
      ),
      filters: [
        { text: '激活', value: true },
        { text: '停用', value: false },
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
            title="确定要删除这个预算吗？"
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

  // 查看预算详情
  const handleView = (budget: BudgetResponseDto) => {
    setSelectedBudget(budget);
    setViewModalVisible(true);
  };

  // 编辑预算
  const handleEdit = (budget: BudgetResponseDto) => {
    setSelectedBudget(budget);
    form.setFieldsValue({
      ...budget,
      dateRange: budget.startDate && budget.endDate 
        ? [new Date(budget.startDate), new Date(budget.endDate)]
        : undefined,
    });
    setModalVisible(true);
  };

  // 删除预算
  const handleDelete = async (id: string) => {
    try {
      await budgetsAPI.remove(id);
      message.success('删除成功');
      loadBudgets();
      loadStatistics();
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  // 创建新预算
  const handleCreate = () => {
    setSelectedBudget(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      // 处理日期范围
      if (values.dateRange && Array.isArray(values.dateRange) && values.dateRange.length === 2) {
        values.startDate = values.dateRange[0];
        values.endDate = values.dateRange[1];
        delete values.dateRange;
      }

      if (selectedBudget) {
        // 更新
        await budgetsAPI.update(selectedBudget.id, values);
        message.success('更新成功');
      } else {
        // 创建
        await budgetsAPI.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadBudgets();
      loadStatistics();
    } catch (error: any) {
      message.error(error.response?.data?.message || (selectedBudget ? '更新失败' : '创建失败'));
    }
  };

  // 表格变化处理
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newQuery: BudgetQueryDto = {
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      period: filters.period?.[0],
      isActive: filters.isActive?.[0],
      sortBy: sorter.field || 'startDate',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    };
    setQuery(newQuery);
  };

  return (
    <div className="budgets-page">
      <Row gutter={[16, 16]}>
        {/* 统计卡片 */}
        <Col span={24}>
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总预算"
                  value={statistics?.totalBudget || 0}
                  precision={2}
                  prefix="¥"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已花费"
                  value={statistics?.totalSpent || 0}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="剩余"
                  value={statistics?.totalRemaining || 0}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="超支预算"
                  value={statistics?.exceededCount || 0}
                  suffix="个"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
            {statistics && (
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Progress
                    percent={statistics.averageSpentPercentage}
                    status={statistics.averageSpentPercentage > 100 ? 'exception' : 'active'}
                    strokeColor={getProgressColor(statistics.averageSpentPercentage, statistics.averageSpentPercentage > 100)}
                    format={(percent) => `平均花费率: ${percent?.toFixed(1)}%`}
                  />
                </Col>
              </Row>
            )}
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
                新增预算
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadBudgets();
                  loadStatistics();
                }}
              >
                刷新
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 预算表格 */}
        <Col span={24}>
          <Card>
            <Table
              columns={columns}
              dataSource={budgets}
              rowKey="id"
              loading={loading}
              onChange={handleTableChange}
              pagination={{
                current: query.page,
                pageSize: query.limit,
                total: budgets.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个预算`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 创建/编辑模态框 */}
      <Modal
        title={selectedBudget ? '编辑预算' : '新增预算'}
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
                label="预算名称"
                rules={[{ required: true, message: '请输入预算名称' }]}
              >
                <Input placeholder="请输入预算名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="period"
                label="预算周期"
                rules={[{ required: true, message: '请选择预算周期' }]}
              >
                <Select placeholder="请选择预算周期">
                  <Option value="DAILY">每日</Option>
                  <Option value="WEEKLY">每周</Option>
                  <Option value="MONTHLY">每月</Option>
                  <Option value="YEARLY">每年</Option>
                  <Option value="CUSTOM">自定义</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="预算金额"
                rules={[{ required: true, message: '请输入预算金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入预算金额"
                  min={0.01}
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
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="categoryId"
            label="分类"
          >
            <Select 
              placeholder="请选择分类（可选）"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="是否激活"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isAlertEnabled"
                label="启用提醒"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情模态框 */}
      <Modal
        title="预算详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedBudget && (
          <div className="budget-detail">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="预算名称" span={2}>
                {selectedBudget.name}
                {selectedBudget.isExceeded && (
                  <Tag color="red" icon={<WarningOutlined />} style={{ marginLeft: 8 }}>
                    超支
                  </Tag>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="预算周期">
                <Tag>{getPeriodText(selectedBudget.period)}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="状态">
                <Tag color={selectedBudget.isActive ? 'green' : 'gray'}>
                  {selectedBudget.isActive ? '激活' : '停用'}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="预算金额">
                <span style={{ fontWeight: 'bold' }}>
                  {selectedBudget.currency} {selectedBudget.amount.toFixed(2)}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="已花费">
                <span style={{ color: selectedBudget.isExceeded ? '#ff4d4f' : '#52c41a' }}>
                  {selectedBudget.currency} {selectedBudget.spentAmount.toFixed(2)}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="剩余金额">
                <span style={{ color: selectedBudget.remainingAmount >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  {selectedBudget.currency} {selectedBudget.remainingAmount.toFixed(2)}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="花费百分比" span={2}>
                <Progress
                  percent={Math.min(selectedBudget.spentPercentage, 100)}
                  status={selectedBudget.isExceeded ? 'exception' : 'active'}
                  strokeColor={getProgressColor(selectedBudget.spentPercentage, selectedBudget.isExceeded)}
                  format={(percent) => `${percent?.toFixed(1)}%`}
                />
              </Descriptions.Item>
              
              {selectedBudget.category && (
                <Descriptions.Item label="分类">
                  {selectedBudget.category.name}
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="开始日期">
                {new Date(selectedBudget.startDate).toLocaleDateString()}
              </Descriptions.Item>
              
              <Descriptions.Item label="结束日期">
                {new Date(selectedBudget.endDate).toLocaleDateString()}
              </Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                {new Date(selectedBudget.createdAt).toLocaleString()}
              </Descriptions.Item>
              
              <Descriptions.Item label="更新时间">
                {new Date(selectedBudget.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Budgets;