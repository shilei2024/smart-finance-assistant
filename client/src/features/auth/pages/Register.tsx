import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Checkbox } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setLoading, setError, setCredentials } from '../../../store/slices/authSlice';
import { authAPI } from '../../../api/auth';
import './Register.css';

interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    if (!values.agreeTerms) {
      message.error('请同意用户协议和隐私政策');
      return;
    }
    
    setIsSubmitting(true);
    dispatch(setLoading(true));
    
    try {
      console.log('提交注册数据:', {
        email: values.email,
        phone: values.phone,
        name: values.name,
      });
      
      const response = await authAPI.register({
        email: values.email,
        phone: values.phone,
        password: values.password,
        passwordConfirm: values.confirmPassword,
        name: values.name,
      });
      
      console.log('注册响应:', response);
      
      // 确保user对象包含所有必需字段
      const userData = {
        ...response.user,
        createdAt: response.user.createdAt || new Date().toISOString(),
      };
      
      // 注册成功后自动登录
      dispatch(setCredentials({
        user: userData,
        token: response.accessToken,
      }));
      
      // 保存token和刷新令牌
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      message.success('注册成功！');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('注册失败:', error);
      // axios拦截器已经处理了错误显示，这里只设置错误状态
      // 避免重复显示错误消息
      let errorMessage = '注册失败，请稍后重试';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <div className="register-header">
          <h1>创建账户</h1>
          <p>加入智能记账助手，开始您的财务管理之旅</p>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="register-form"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入您的姓名' },
              { min: 2, message: '姓名至少2个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入您的姓名"
              size="large"
            />
          </Form.Item>
          
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
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入手机号"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { pattern: /^(?=.*[A-Za-z])(?=.*\d)/, message: '密码必须包含字母和数字' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="agreeTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议和隐私政策')),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意
              <Link to="/terms" target="_blank" className="terms-link">
                《用户协议》
              </Link>
              和
              <Link to="/privacy" target="_blank" className="terms-link">
                《隐私政策》
              </Link>
            </Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              block
            >
              注册
            </Button>
          </Form.Item>
        </Form>
        
        <div className="register-footer">
          已有账户？ <Link to="/login">立即登录</Link>
        </div>
      </Card>
      
      <div className="register-benefits">
        <h2>注册即享专属权益</h2>
        <div className="benefits-list">
          <div className="benefit-item">
            <div className="benefit-icon">🎁</div>
            <div className="benefit-content">
              <h3>新用户礼包</h3>
              <p>注册即送30天高级会员体验</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">📈</div>
            <div className="benefit-content">
              <h3>专业财务分析</h3>
              <p>享受专业的财务健康评估和建议</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">🔔</div>
            <div className="benefit-content">
              <h3>智能提醒</h3>
              <p>账单到期、预算超支智能提醒</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">🤝</div>
            <div className="benefit-content">
              <h3>专属客服</h3>
              <p>7x24小时专属客服支持</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
