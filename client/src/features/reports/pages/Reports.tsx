import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Space,
  Statistic,
  Table,
  Tag,
  Progress,
  message,
  Tabs,
  Spin,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { reportsAPI } from '../../../api/reports';
import type {
  ReportQueryDto,
  ReportResponseDto,
  ReportType,
  TimeRange,
  CategoryAnalysisDto,
  TrendDataDto,
} from '../../../types/report';
import './Reports.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportResponseDto | null>(null);
  const [query, setQuery] = useState<ReportQueryDto>({
    type: ReportType.OVERVIEW,
    timeRange: TimeRange.MONTH,
  });

  // 加载报表数据
  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await reportsAPI.generateReport(query);
      setReport(data);
    } catch (error) {
      message.error('加载报表数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [query]);

  // 总览统计卡片
  const renderOverviewCards = () => {
    if (!report?.overview) return null;

    const { overview } = report;

    return (
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={overview.totalIncome}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总支出"
              value={overview.totalExpense}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="净收入"
              value={overview.netIncome}
              precision={2}
              prefix="¥"
              valueStyle={{ color: overview.netIncome >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="储蓄率"
              value={overview.savingRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="交易总数"
              value={overview.transactionCount}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均每日支出"
              value={overview.averageDailyExpense}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均每日收入"
              value={overview.averageDailyIncome}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="收入/支出比"
              value={overview.totalExpense > 0 ? (overview.totalIncome / overview.totalExpense).toFixed(2) : 0}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 分类分析图表
  const renderCategoryChart = () => {
    if (!report?.categoryAnalysis || report.categoryAnalysis.length === 0) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>暂无数据</div>;
    }

    const data = report.categoryAnalysis.slice(0, 10); // 只显示前10个

    const option = {
      title: {
        text: '支出分类分析',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ¥{c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '支出分类',
          type: 'pie',
          radius: '50%',
          data: data.map((item) => ({
            value: item.totalAmount,
            name: item.categoryName,
            itemStyle: {
              color: item.color || '#1890ff',
            },
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    return <ReactECharts option={option} style={{ height: '400px' }} />;
  };

  // 趋势分析图表
  const renderTrendChart = () => {
    if (!report?.trendData || report.trendData.length === 0) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>暂无数据</div>;
    }

    const dates = report.trendData.map((item) => item.date);
    const income = report.trendData.map((item) => item.income);
    const expense = report.trendData.map((item) => item.expense);
    const netIncome = report.trendData.map((item) => item.netIncome);

    const option = {
      title: {
        text: '收支趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['收入', '支出', '净收入'],
        top: '10%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}',
        },
      },
      series: [
        {
          name: '收入',
          type: 'line',
          data: income,
          itemStyle: { color: '#52c41a' },
          areaStyle: { color: 'rgba(82, 196, 26, 0.2)' },
        },
        {
          name: '支出',
          type: 'line',
          data: expense,
          itemStyle: { color: '#ff4d4f' },
          areaStyle: { color: 'rgba(255, 77, 79, 0.2)' },
        },
        {
          name: '净收入',
          type: 'line',
          data: netIncome,
          itemStyle: { color: '#1890ff' },
        },
      ],
    };

    return <ReactECharts option={option} style={{ height: '400px' }} />;
  };

  // 分类分析表格
  const renderCategoryTable = () => {
    if (!report?.categoryAnalysis || report.categoryAnalysis.length === 0) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>暂无数据</div>;
    }

    const columns = [
      {
        title: '分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        render: (name: string, record: CategoryAnalysisDto) => (
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
        render: (type: string) => (
          <Tag color={type === 'INCOME' ? 'green' : 'red'}>
            {type === 'INCOME' ? '收入' : '支出'}
          </Tag>
        ),
      },
      {
        title: '总金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (amount: number) => `¥${amount.toFixed(2)}`,
        sorter: (a: CategoryAnalysisDto, b: CategoryAnalysisDto) =>
          a.totalAmount - b.totalAmount,
      },
      {
        title: '交易数',
        dataIndex: 'transactionCount',
        key: 'transactionCount',
        sorter: (a: CategoryAnalysisDto, b: CategoryAnalysisDto) =>
          a.transactionCount - b.transactionCount,
      },
      {
        title: '平均金额',
        dataIndex: 'averageAmount',
        key: 'averageAmount',
        render: (amount: number) => `¥${amount.toFixed(2)}`,
      },
      {
        title: '占比',
        dataIndex: 'percentage',
        key: 'percentage',
        render: (percentage: number) => (
          <Progress
            percent={percentage}
            size="small"
            format={(percent) => `${percent?.toFixed(1)}%`}
          />
        ),
        sorter: (a: CategoryAnalysisDto, b: CategoryAnalysisDto) =>
          a.percentage - b.percentage,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={report.categoryAnalysis}
        rowKey="categoryId"
        pagination={false}
      />
    );
  };

  // 处理查询变化
  const handleQueryChange = (key: string, value: any) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 处理时间范围变化
  const handleTimeRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setQuery((prev) => ({
        ...prev,
        timeRange: TimeRange.CUSTOM,
        startDate: dates[0].toDate(),
        endDate: dates[1].toDate(),
      }));
    } else {
      setQuery((prev) => {
        const newQuery = { ...prev };
        delete newQuery.startDate;
        delete newQuery.endDate;
        return newQuery;
      });
    }
  };

  // 导出报表
  const handleExport = async () => {
    if (!report) {
      message.warning('请先加载报表数据');
      return;
    }

    try {
      // 生成CSV格式的报表数据
      let csvContent = '';

      // 添加总览数据
      if (report.overview) {
        csvContent += '财务总览\n';
        csvContent += `总收入,${report.overview.totalIncome}\n`;
        csvContent += `总支出,${report.overview.totalExpense}\n`;
        csvContent += `净收入,${report.overview.netIncome}\n`;
        csvContent += `储蓄率,${report.overview.savingRate}%\n`;
        csvContent += `交易总数,${report.overview.transactionCount}\n\n`;
      }

      // 添加分类分析
      if (report.categoryAnalysis && report.categoryAnalysis.length > 0) {
        csvContent += '分类分析\n';
        csvContent += '分类名称,类型,总金额,交易数,平均金额,占比%\n';
        report.categoryAnalysis.forEach((item) => {
          csvContent += `${item.categoryName},${item.type},${item.totalAmount},${item.transactionCount},${item.averageAmount},${item.percentage.toFixed(2)}\n`;
        });
        csvContent += '\n';
      }

      // 添加趋势数据
      if (report.trendData && report.trendData.length > 0) {
        csvContent += '收支趋势\n';
        csvContent += '日期,收入,支出,净收入,交易数\n';
        report.trendData.forEach((item) => {
          csvContent += `${item.date},${item.income},${item.expense},${item.netIncome},${item.transactionCount}\n`;
        });
      }

      // 创建Blob并下载
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `财务报表_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('报表导出成功');
    } catch (error) {
      message.error('导出失败');
      console.error('导出报表失败:', error);
    }
  };

  return (
    <div className="reports-page">
      {/* 查询条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>报表类型：</span>
          <Select
            value={query.type}
            onChange={(value) => handleQueryChange('type', value)}
            style={{ width: 200 }}
          >
            <Option value={ReportType.OVERVIEW}>总览</Option>
            <Option value={ReportType.INCOME_EXPENSE}>收支分析</Option>
            <Option value={ReportType.CATEGORY_ANALYSIS}>分类分析</Option>
            <Option value={ReportType.TREND_ANALYSIS}>趋势分析</Option>
            <Option value={ReportType.ACCOUNT_SUMMARY}>账户汇总</Option>
            <Option value={ReportType.BUDGET_ANALYSIS}>预算分析</Option>
          </Select>

          <span>时间范围：</span>
          <Select
            value={query.timeRange}
            onChange={(value) => handleQueryChange('timeRange', value)}
            style={{ width: 150 }}
          >
            <Option value={TimeRange.TODAY}>今天</Option>
            <Option value={TimeRange.WEEK}>最近7天</Option>
            <Option value={TimeRange.MONTH}>本月</Option>
            <Option value={TimeRange.QUARTER}>本季度</Option>
            <Option value={TimeRange.YEAR}>本年</Option>
            <Option value={TimeRange.CUSTOM}>自定义</Option>
          </Select>

          {query.timeRange === TimeRange.CUSTOM && (
            <RangePicker
              onChange={handleTimeRangeChange}
              format="YYYY-MM-DD"
            />
          )}

          <Button
            icon={<ReloadOutlined />}
            onClick={loadReport}
            loading={loading}
          >
            刷新
          </Button>

          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={loading}
          >
            导出
          </Button>
        </Space>
      </Card>

      <Spin spinning={loading}>
        {/* 总览报表 */}
        {query.type === ReportType.OVERVIEW && (
          <>
            {renderOverviewCards()}
            <Card title="收支趋势" style={{ marginTop: 16 }}>
              {report?.trendData ? renderTrendChart() : <div>暂无数据</div>}
            </Card>
            <Card title="支出分类" style={{ marginTop: 16 }}>
              {report?.categoryAnalysis ? renderCategoryChart() : <div>暂无数据</div>}
            </Card>
          </>
        )}

        {/* 收支分析 */}
        {query.type === ReportType.INCOME_EXPENSE && (
          <>
            {renderOverviewCards()}
            <Card title="收支趋势图" style={{ marginTop: 16 }}>
              {renderTrendChart()}
            </Card>
          </>
        )}

        {/* 分类分析 */}
        {query.type === ReportType.CATEGORY_ANALYSIS && (
          <>
            <Card title="分类分析图表">
              {renderCategoryChart()}
            </Card>
            <Card title="分类分析明细" style={{ marginTop: 16 }}>
              {renderCategoryTable()}
            </Card>
          </>
        )}

        {/* 趋势分析 */}
        {query.type === ReportType.TREND_ANALYSIS && (
          <Card title="收支趋势分析">
            {renderTrendChart()}
          </Card>
        )}

        {/* 账户汇总 */}
        {query.type === ReportType.ACCOUNT_SUMMARY && report?.accountSummary && (
          <Card title="账户汇总">
            <Table
              columns={[
                {
                  title: '账户名称',
                  dataIndex: 'accountName',
                  key: 'accountName',
                },
                {
                  title: '账户类型',
                  dataIndex: 'accountType',
                  key: 'accountType',
                },
                {
                  title: '期初余额',
                  dataIndex: 'openingBalance',
                  key: 'openingBalance',
                  render: (balance: number, record) => `${record.currency} ${balance.toFixed(2)}`,
                },
                {
                  title: '期末余额',
                  dataIndex: 'closingBalance',
                  key: 'closingBalance',
                  render: (balance: number, record) => `${record.currency} ${balance.toFixed(2)}`,
                },
                {
                  title: '总收入',
                  dataIndex: 'totalIncome',
                  key: 'totalIncome',
                  render: (income: number, record) => (
                    <span style={{ color: '#52c41a' }}>
                      {record.currency} {income.toFixed(2)}
                    </span>
                  ),
                },
                {
                  title: '总支出',
                  dataIndex: 'totalExpense',
                  key: 'totalExpense',
                  render: (expense: number, record) => (
                    <span style={{ color: '#ff4d4f' }}>
                      {record.currency} {expense.toFixed(2)}
                    </span>
                  ),
                },
                {
                  title: '交易数',
                  dataIndex: 'transactionCount',
                  key: 'transactionCount',
                },
              ]}
              dataSource={report.accountSummary}
              rowKey="accountId"
            />
          </Card>
        )}

        {/* 预算分析 */}
        {query.type === ReportType.BUDGET_ANALYSIS && report?.budgetAnalysis && (
          <Card title="预算分析">
            <Table
              columns={[
                {
                  title: '预算名称',
                  dataIndex: 'budgetName',
                  key: 'budgetName',
                },
                {
                  title: '分类',
                  dataIndex: 'categoryName',
                  key: 'categoryName',
                },
                {
                  title: '预算金额',
                  dataIndex: 'budgetAmount',
                  key: 'budgetAmount',
                  render: (amount: number) => `¥${amount.toFixed(2)}`,
                },
                {
                  title: '已花费',
                  dataIndex: 'spentAmount',
                  key: 'spentAmount',
                  render: (amount: number, record) => (
                    <span style={{ color: record.isExceeded ? '#ff4d4f' : '#52c41a' }}>
                      ¥{amount.toFixed(2)}
                    </span>
                  ),
                },
                {
                  title: '剩余',
                  dataIndex: 'remainingAmount',
                  key: 'remainingAmount',
                  render: (amount: number) => (
                    <span style={{ color: amount >= 0 ? '#52c41a' : '#ff4d4f' }}>
                      ¥{amount.toFixed(2)}
                    </span>
                  ),
                },
                {
                  title: '进度',
                  dataIndex: 'spentPercentage',
                  key: 'spentPercentage',
                  render: (percentage: number, record) => (
                    <Progress
                      percent={Math.min(percentage, 100)}
                      status={record.isExceeded ? 'exception' : 'active'}
                      format={(percent) => `${percent?.toFixed(1)}%`}
                    />
                  ),
                },
                {
                  title: '状态',
                  dataIndex: 'isExceeded',
                  key: 'isExceeded',
                  render: (isExceeded: boolean) => (
                    <Tag color={isExceeded ? 'red' : 'green'}>
                      {isExceeded ? '超支' : '正常'}
                    </Tag>
                  ),
                },
              ]}
              dataSource={report.budgetAnalysis}
              rowKey="budgetId"
            />
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default Reports;