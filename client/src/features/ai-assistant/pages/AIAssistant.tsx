import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Avatar,
  Typography,
  Spin,
  Tabs,
  Form,
  InputNumber,
  Select,
  message,
  Tag,
  Row,
  Col,
  Statistic,
  Progress,
  Alert,
  Upload,
} from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ReloadOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { aiAPI } from '../../../api/ai';
import type {
  ChatResponseDto,
  ClassifyTransactionDto,
  ClassificationResponseDto,
  AiAnalysisDto,
  AnalysisResponseDto,
  OcrRequestDto,
  OcrResponseDto,
} from '../../../types/ai';
import './AIAssistant.css';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  // 分类表单
  const [classifyForm] = Form.useForm();
  const [classificationResult, setClassificationResult] = useState<ClassificationResponseDto | null>(null);

  // 分析表单
  const [analysisForm] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponseDto | null>(null);

  // OCR表单和结果
  const [ocrResult, setOcrResult] = useState<any>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await aiAPI.chat({
        message: inputValue,
        history: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      message.error('发送消息失败');
    } finally {
      setLoading(false);
    }
  };

  // 分类交易
  const handleClassify = async (values: ClassifyTransactionDto) => {
    setLoading(true);
    try {
      const result = await aiAPI.classifyTransaction(values);
      setClassificationResult(result);
      message.success('分类成功');
    } catch (error) {
      message.error('分类失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成分析
  const handleAnalyze = async (values: AiAnalysisDto) => {
    setLoading(true);
    try {
      const result = await aiAPI.generateAnalysis(values);
      setAnalysisResult(result);
      message.success('分析完成');
    } catch (error) {
      message.error('分析失败');
    } finally {
      setLoading(false);
    }
  };

  // OCR识别
  const handleOcr = async (values: OcrRequestDto) => {
    setLoading(true);
    try {
      const result = await aiAPI.processOcr(values);
      setOcrResult(result);
      message.success('识别完成');
    } catch (error) {
      message.error('识别失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取健康度颜色
  const getHealthColor = (level: string) => {
    const colorMap = {
      excellent: '#52c41a',
      good: '#1890ff',
      fair: '#faad14',
      poor: '#ff9800',
      critical: '#ff4d4f',
    };
    return colorMap[level as keyof typeof colorMap] || '#1890ff';
  };

  return (
    <div className="ai-assistant-page">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* AI对话 */}
        <TabPane tab="AI对话" key="chat">
          <Card>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <RobotOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <Title level={4}>我是您的智能记账助手</Title>
                    <Paragraph type="secondary">
                      我可以帮您：
                      <br />
                      • 分析财务状况
                      <br />
                      • 分类交易记录
                      <br />
                      • 提供理财建议
                      <br />
                      • 回答财务问题
                    </Paragraph>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
                    >
                      <Avatar
                        icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                        style={{
                          backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a',
                        }}
                      />
                      <div className="message-content">
                        <div className="message-text">{msg.content}</div>
                        <div className="message-time">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="message assistant-message">
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                    <div className="message-content">
                      <Spin size="small" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <Space.Compact style={{ width: '100%' }}>
                  <TextArea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入您的问题..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={loading}
                    disabled={!inputValue.trim()}
                  >
                    发送
                  </Button>
                </Space.Compact>
              </div>
            </div>
          </Card>
        </TabPane>

        {/* 智能分类 */}
        <TabPane tab="智能分类" key="classify">
          <Card>
            <Form
              form={classifyForm}
              layout="vertical"
              onFinish={handleClassify}
            >
              <Form.Item
                name="description"
                label="交易描述"
                rules={[{ required: true, message: '请输入交易描述' }]}
              >
                <Input.TextArea
                  placeholder="例如：在星巴克购买咖啡"
                  rows={3}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="amount" label="金额">
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入金额"
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="location" label="地点">
                    <Input placeholder="例如：北京市朝阳区" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  智能分类
                </Button>
              </Form.Item>
            </Form>

            {classificationResult && (
              <Card title="分类结果" style={{ marginTop: 16 }}>
                <div className="classification-result">
                  <div className="primary-category">
                    <Title level={5}>主要分类</Title>
                    <Space>
                      <Tag color="blue" style={{ fontSize: 16, padding: '4px 12px' }}>
                        {classificationResult.primaryCategory.name}
                      </Tag>
                      <span>
                        置信度: {(classificationResult.primaryCategory.confidence * 100).toFixed(1)}%
                      </span>
                    </Space>
                    <Paragraph style={{ marginTop: 8 }}>
                      {classificationResult.primaryCategory.reasoning}
                    </Paragraph>
                  </div>

                  {classificationResult.alternativeCategories.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>备选分类</Title>
                      <Space wrap>
                        {classificationResult.alternativeCategories.map((cat, index) => (
                          <Tag key={index}>
                            {cat.name} ({(cat.confidence * 100).toFixed(1)}%)
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}

                  {classificationResult.extractedTags.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>提取的标签</Title>
                      <Space wrap>
                        {classificationResult.extractedTags.map((tag, index) => (
                          <Tag key={index}>{tag}</Tag>
                        ))}
                      </Space>
                    </div>
                  )}

                  {Object.keys(classificationResult.extractedEntities).length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>提取的实体</Title>
                      <Space direction="vertical">
                        {classificationResult.extractedEntities.merchant && (
                          <span>商户: {classificationResult.extractedEntities.merchant}</span>
                        )}
                        {classificationResult.extractedEntities.location && (
                          <span>地点: {classificationResult.extractedEntities.location}</span>
                        )}
                        {classificationResult.extractedEntities.time && (
                          <span>时间: {classificationResult.extractedEntities.time}</span>
                        )}
                      </Space>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </Card>
        </TabPane>

        {/* 财务分析 */}
        <TabPane tab="财务分析" key="analyze">
          <Card>
            <Form
              form={analysisForm}
              layout="vertical"
              onFinish={handleAnalyze}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="analysisType" label="分析类型" initialValue="OVERVIEW">
                    <Select>
                      <Select.Option value="OVERVIEW">总览</Select.Option>
                      <Select.Option value="DETAILED">详细</Select.Option>
                      <Select.Option value="COMPARATIVE">对比</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="focusAreas" label="关注领域">
                    <Select mode="multiple" placeholder="选择关注领域">
                      <Select.Option value="支出">支出</Select.Option>
                      <Select.Option value="储蓄率">储蓄率</Select.Option>
                      <Select.Option value="预算">预算</Select.Option>
                      <Select.Option value="分类">分类</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  生成分析
                </Button>
              </Form.Item>
            </Form>

            {analysisResult && (
              <div style={{ marginTop: 24 }}>
                {/* 财务摘要 */}
                <Card title="财务摘要" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic
                        title="总收入"
                        value={analysisResult.summary.totalIncome}
                        precision={2}
                        prefix="¥"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="总支出"
                        value={analysisResult.summary.totalExpense}
                        precision={2}
                        prefix="¥"
                        valueStyle={{ color: '#ff4d4f' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="净储蓄"
                        value={analysisResult.summary.netSavings}
                        precision={2}
                        prefix="¥"
                        valueStyle={{
                          color: analysisResult.summary.netSavings >= 0 ? '#52c41a' : '#ff4d4f',
                        }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="储蓄率"
                        value={analysisResult.summary.savingRate}
                        precision={1}
                        suffix="%"
                      />
                    </Col>
                  </Row>
                </Card>

                {/* 财务健康度 */}
                <Card title="财务健康度" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <Progress
                          type="dashboard"
                          percent={analysisResult.financialHealth.score}
                          strokeColor={getHealthColor(analysisResult.financialHealth.level)}
                          format={(percent) => `${percent}`}
                        />
                        <Title level={4} style={{ marginTop: 16 }}>
                          {analysisResult.financialHealth.level === 'excellent' && '优秀'}
                          {analysisResult.financialHealth.level === 'good' && '良好'}
                          {analysisResult.financialHealth.level === 'fair' && '一般'}
                          {analysisResult.financialHealth.level === 'poor' && '较差'}
                          {analysisResult.financialHealth.level === 'critical' && '严重'}
                        </Title>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>评分明细</Title>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <span>消费习惯: </span>
                          <Progress
                            percent={analysisResult.financialHealth.breakdown.spendingHabits}
                            size="small"
                          />
                        </div>
                        <div>
                          <span>储蓄率: </span>
                          <Progress
                            percent={analysisResult.financialHealth.breakdown.savingRate}
                            size="small"
                          />
                        </div>
                        <div>
                          <span>预算执行: </span>
                          <Progress
                            percent={analysisResult.financialHealth.breakdown.budgetAdherence}
                            size="small"
                          />
                        </div>
                        <div>
                          <span>收入稳定性: </span>
                          <Progress
                            percent={analysisResult.financialHealth.breakdown.incomeStability}
                            size="small"
                          />
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </Card>

                {/* 关键洞察 */}
                {analysisResult.insights.length > 0 && (
                  <Card title="关键洞察" style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {analysisResult.insights.map((insight, index) => (
                        <Alert
                          key={index}
                          message={insight.title}
                          description={insight.description}
                          type={
                            insight.type === 'positive'
                              ? 'success'
                              : insight.type === 'warning'
                              ? 'warning'
                              : 'error'
                          }
                          showIcon
                        />
                      ))}
                    </Space>
                  </Card>
                )}

                {/* 建议 */}
                {analysisResult.financialHealth.recommendations.length > 0 && (
                  <Card title="改进建议">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {analysisResult.financialHealth.recommendations.map((rec, index) => (
                        <div key={index}>
                          <Tag color="blue">{index + 1}</Tag>
                          {rec}
                        </div>
                      ))}
                    </Space>
                  </Card>
                )}
              </div>
            )}
          </Card>
        </TabPane>

        {/* OCR识别 */}
        <TabPane tab="OCR识别" key="ocr">
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleOcr}
            >
              <Form.Item
                name="image"
                label="上传图片"
                rules={[{ required: true, message: '请上传图片' }]}
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={true}
                  beforeUpload={(file) => {
                    // 将文件转换为Base64
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      form.setFieldsValue({ image: reader.result });
                    };
                    return false; // 阻止自动上传
                  }}
                  accept="image/*"
                >
                  <div>
                    <FileImageOutlined style={{ fontSize: 24 }} />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                name="type"
                label="识别类型"
                initialValue="RECEIPT"
              >
                <Select>
                  <Select.Option value="RECEIPT">收据</Select.Option>
                  <Select.Option value="INVOICE">发票</Select.Option>
                  <Select.Option value="BILL">账单</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  开始识别
                </Button>
              </Form.Item>
            </Form>

            {ocrResult && (
              <Card title="识别结果" style={{ marginTop: 16 }}>
                <div className="ocr-result">
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>置信度: {(ocrResult.confidence * 100).toFixed(1)}%</Title>
                  </div>

                  {ocrResult.transaction && (
                    <div>
                      <Title level={5}>交易信息</Title>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {ocrResult.transaction.merchant && (
                          <div>
                            <strong>商家:</strong> {ocrResult.transaction.merchant}
                          </div>
                        )}
                        {ocrResult.transaction.amount > 0 && (
                          <div>
                            <strong>金额:</strong> {ocrResult.transaction.currency} {ocrResult.transaction.amount.toFixed(2)}
                          </div>
                        )}
                        {ocrResult.transaction.date && (
                          <div>
                            <strong>日期:</strong> {ocrResult.transaction.date}
                          </div>
                        )}
                        {ocrResult.transaction.description && (
                          <div>
                            <strong>描述:</strong> {ocrResult.transaction.description}
                          </div>
                        )}
                      </Space>
                    </div>
                  )}

                  {ocrResult.rawText && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>识别文本</Title>
                      <Paragraph style={{ 
                        background: '#f5f5f5', 
                        padding: '12px', 
                        borderRadius: '4px',
                        maxHeight: '200px',
                        overflow: 'auto'
                      }}>
                        {ocrResult.rawText}
                      </Paragraph>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AIAssistant;