import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Divider, Space } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  WechatOutlined,
  AlipayOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading, setError } from '../../../store/slices/authSlice';
import { authAPI } from '../../../api/auth';
import './Login.css';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    dispatch(setLoading(true));
    
    try {
      const response = await authAPI.login({
        email: values.email,
        password: values.password,
        rememberMe: false,
      });
      
      // 确保user对象包含所有必需字段
      const userData = {
        ...response.user,
        createdAt: response.user.createdAt || new Date().toISOString(),
      };
      
      dispatch(setCredentials({
        user: userData,
        token: response.accessToken,
      }));
      dispatch(setError(null));
      
      // 保存token和刷新令牌
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      message.success('登录成功！');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '登录失败，请检查邮箱和密码';
      dispatch(setError(errorMessage));
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const handleWechatLogin = () => {
    message.info('微信登录功能开发中');
  };

  const handleAlipayLogin = () => {
    message.info('支付宝登录功能开发中');
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h1>欢迎回来</h1>
          <p>登录您的账户继续使用智能记账助手</p>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="login-form"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱地址"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>
          
          <div className="form-actions">
            <Link to="/forgot-password" className="forgot-password">
              忘记密码？
            </Link>
          </div>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <Divider plain>或使用第三方登录</Divider>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            icon={<WechatOutlined />}
            size="large"
            block
            onClick={handleWechatLogin}
            className="social-login-btn wechat"
          >
            微信登录
          </Button>
          
          <Button
            icon={<AlipayOutlined />}
            size="large"
            block
            onClick={handleAlipayLogin}
            className="social-login-btn alipay"
          >
            支付宝登录
          </Button>
        </Space>
        
        <div className="login-footer">
          还没有账户？ <Link to="/register">立即注册</Link>
        </div>
      </Card>
      
      <div className="login-features">
        <h2>智能记账助手的优势</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <h3>AI智能分类</h3>
            <p>自动识别消费类型，智能推荐分类</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>深度分析</h3>
            <p>多维度财务分析，可视化报表</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <h3>预算管理</h3>
            <p>智能预算规划，消费提醒</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h3>数据安全</h3>
            <p>银行级加密，隐私保护</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
