import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TransactionOutlined,
  AccountBookOutlined,
  TagsOutlined,
  PieChartOutlined,
  BarChartOutlined,
  RobotOutlined,
  HeartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { authAPI } from '../../api/auth';
import type { RootState } from '../../store';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: '交易记录',
    },
    {
      key: '/accounts',
      icon: <AccountBookOutlined />,
      label: '账户管理',
    },
    {
      key: '/categories',
      icon: <TagsOutlined />,
      label: '分类管理',
    },
    {
      key: '/budgets',
      icon: <PieChartOutlined />,
      label: '预算管理',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: '报表分析',
    },
    {
      key: '/health',
      icon: <HeartOutlined />,
      label: '健康检查',
    },
    {
      key: '/ai-assistant',
      icon: <RobotOutlined />,
      label: 'AI助手',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      try {
        if (token) {
          await authAPI.logout(token);
        }
      } catch (error) {
        console.error('登出失败:', error);
      } finally {
        dispatch(logout());
        navigate('/login');
      }
    } else if (key === 'profile') {
      navigate('/settings');
    }
  };

  const handleMenuSelect = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <div className="logo">
          {collapsed ? '💰' : '智能记账助手'}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          items={menuItems}
          onSelect={handleMenuSelect}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick,
              }}
              placement="bottomRight"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  style={{ backgroundColor: '#1890ff' }}
                />
                {!collapsed && (
                  <span style={{ fontWeight: 500 }}>
                    {user?.name || user?.email}
                  </span>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
