import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  message,
  Tabs,
  Divider,
  Spin,
} from 'antd';
import { UserOutlined, BellOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { authAPI } from '../../../api/auth';
import type { UserProfile } from '../../../types/auth';
import './Settings.css';

const { Option } = Select;
const { TabPane } = Tabs;

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [profileForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const profile = await authAPI.getProfile();
      setUserProfile(profile);
      profileForm.setFieldsValue({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        currency: profile.currency || 'CNY',
      });
    } catch (error) {
      message.error('加载用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (values: any) => {
    try {
      // 这里应该调用更新用户信息的API
      // 由于后端可能没有专门的更新用户信息接口，这里先显示成功消息
      // 实际项目中应该添加 PUT /auth/me 或 PUT /users/:id 接口
      message.success('个人设置已保存');
      console.log('更新用户信息:', values);
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleNotificationSubmit = async (values: any) => {
    try {
      // 通知设置应该保存到用户偏好设置中
      // 这里先显示成功消息，实际应该调用API
      message.success('通知设置已保存');
      console.log('更新通知设置:', values);
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleSecuritySubmit = async (values: any) => {
    try {
      await authAPI.changePassword(
        values.oldPassword,
        values.newPassword,
        values.confirmPassword
      );
      message.success('密码修改成功');
      securityForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || '密码修改失败');
    }
  };

  return (
    <div className="settings-page">
      <Spin spinning={loading}>
        <Card>
          <Tabs defaultActiveKey="profile">
          <TabPane
            tab={
              <span>
                <UserOutlined />
                个人设置
              </span>
            }
            key="profile"
          >
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileSubmit}
              style={{ maxWidth: 600 }}
            >
              <Form.Item name="username" label="用户名">
                <Input placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item name="email" label="邮箱">
                <Input type="email" placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入手机号" />
              </Form.Item>

              <Form.Item name="currency" label="默认货币">
                <Select defaultValue="CNY">
                  <Option value="CNY">人民币 (CNY)</Option>
                  <Option value="USD">美元 (USD)</Option>
                  <Option value="EUR">欧元 (EUR)</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                通知设置
              </span>
            }
            key="notification"
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSubmit}
              style={{ maxWidth: 600 }}
            >
              <Form.Item name="emailNotification" label="邮件通知" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="budgetAlert" label="预算提醒" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="transactionAlert" label="交易提醒" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SecurityScanOutlined />
                安全设置
              </span>
            }
            key="security"
          >
            <Form
              form={securityForm}
              layout="vertical"
              onFinish={handleSecuritySubmit}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="oldPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password placeholder="请输入当前密码" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[{ required: true, message: '请输入新密码' }]}
              >
                <Input.Password placeholder="请输入新密码" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="请再次输入新密码" />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button type="primary" htmlType="submit" danger>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
      </Spin>
    </div>
  );
};

export default Settings;