import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Button, Spin, message } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { reportsAPI } from '../../../api/reports';
import { transactionsAPI } from '../../../api/transactions';
import { budgetsAPI } from '../../../api/budgets';
import { ReportType, TimeRange } from '../../../types/report';
import type { TransactionResponseDto } from '../../../types/transaction';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionResponseDto[]>([]);
  const [budgetProgress, setBudgetProgress] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 加载总览报表
      const report = await reportsAPI.generateReport({
        type: ReportType.OVERVIEW,
        timeRange: TimeRange.MONTH,
      });

      setOverview(report.overview);
      setTrendData(report.trendData || []);
      setCategoryData(report.categoryAnalysis || []);

      // 加载最近交易
      const transactionsResponse = await transactionsAPI.findAll({
        page: 1,
        limit: 5,
        sortBy: 'transactionDate',
        sortOrder: 'desc',
      });
      setRecentTransactions(transactionsResponse.data || []);

      // 加载预算统计
      try {
        const budgetStats = await budgetsAPI.getStatistics();
        if (budgetStats && budgetStats.totalBudget > 0) {
          const progress = (budgetStats.totalSpent / budgetStats.totalBudget) * 100;
          setBudgetProgress(Math.min(progress, 100));
        }
      } catch (error) {
        // 预算统计失败不影响主页面
        console.error('加载预算统计失败:', error);
      }
    } catch (error) {
      message.error('加载数据失败');
      console.error('加载Dashboard数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = overview?.totalIncome || 0;
  const totalExpense = overview?.totalExpense || 0;
  const netIncome = totalIncome - totalExpense;
  const savingRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : '0';

  // 格式化趋势数据
  const monthlyData = trendData.map((item) => ({
    month: new Date(item.date).toLocaleDateString('zh-CN', { month: 'short' }),
    income: item.income || 0,
    expense: item.expense || 0,
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>财务概览</h1>
        <p>欢迎回来！这是您本月的财务情况</p>
      </div>

      <Spin spinning={loading}>
        {/* 关键指标 */}
        <Row gutter={[16, 16]} className="metrics-row">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总收入"
                value={totalIncome}
                precision={2}
                prefix={<ArrowUpOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix="¥"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总支出"
                value={totalExpense}
                precision={2}
                prefix={<ArrowDownOutlined />}
                valueStyle={{ color: '#f5222d' }}
                suffix="¥"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="净收入"
                value={netIncome}
                precision={2}
                valueStyle={{ color: netIncome >= 0 ? '#52c41a' : '#f5222d' }}
                suffix="¥"
              />
              <div className="metric-trend">储蓄率 {savingRate}%</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="预算执行率"
                value={budgetProgress}
                precision={1}
                suffix="%"
              />
              <Progress percent={budgetProgress} status={budgetProgress > 100 ? 'exception' : 'active'} />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} className="charts-row">
          <Col xs={24} lg={16}>
            <Card title="月度收支趋势" className="chart-card">
              {monthlyData.length > 0 ? (
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'axis',
                    },
                    legend: {
                      data: ['收入', '支出'],
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
                      data: monthlyData.map(item => item.month),
                    },
                    yAxis: {
                      type: 'value',
                    },
                    series: [
                      {
                        name: '收入',
                        type: 'line',
                        data: monthlyData.map(item => item.income),
                        itemStyle: { color: '#52c41a' },
                      },
                      {
                        name: '支出',
                        type: 'line',
                        data: monthlyData.map(item => item.expense),
                        itemStyle: { color: '#f5222d' },
                      },
                    ],
                  }}
                  style={{ height: '300px' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>暂无数据</div>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="消费分类" className="chart-card">
              {categoryData.length > 0 ? (
                <>
                  <div className="category-list">
                    {categoryData.slice(0, 5).map((item) => (
                      <div key={item.categoryId || item.name} className="category-item">
                        <div className="category-info">
                          <div className="category-color" style={{ backgroundColor: item.color || '#1890ff' }} />
                          <span className="category-name">{item.categoryName || item.name}</span>
                        </div>
                        <div className="category-amount">¥{item.totalAmount?.toFixed(2) || item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="category-total">
                    <span>总计</span>
                    <span>¥{categoryData.reduce((sum, item) => sum + (item.totalAmount || item.value || 0), 0).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>暂无数据</div>
              )}
            </Card>
          </Col>
        </Row>

        {/* 最近交易 */}
        <Card title="最近交易" className="recent-transactions">
          {recentTransactions.length > 0 ? (
            <>
              <div className="transactions-list">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-description">{transaction.description || '无描述'}</div>
                      <div className="transaction-category">{transaction.category?.name || '未分类'}</div>
                      <div className="transaction-date">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.type === 'INCOME' ? 'income' : 'expense'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="transactions-footer">
                <Button type="link" onClick={() => navigate('/transactions')}>查看所有交易</Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>暂无交易记录</div>
          )}
        </Card>

        {/* 快速操作 */}
        <Card title="快速操作" className="quick-actions">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Button 
                type="primary" 
                icon={<DollarOutlined />} 
                block
                onClick={() => navigate('/transactions')}
              >
                记一笔
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button 
                icon={<ShoppingOutlined />} 
                block
                onClick={() => navigate('/budgets')}
              >
                查看预算
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button 
                icon={<CarOutlined />} 
                block
                onClick={() => navigate('/reports')}
              >
                生成报表
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button 
                icon={<HomeOutlined />} 
                block
                onClick={() => navigate('/accounts')}
              >
                账户管理
              </Button>
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  );
};

export default Dashboard;
