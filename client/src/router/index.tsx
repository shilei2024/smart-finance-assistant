import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Layout from '../components/layout/Layout';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/dashboard/pages/Dashboard';
import Transactions from '../features/transactions/pages/Transactions';
import Accounts from '../features/accounts/pages/Accounts';
import Categories from '../features/categories/pages/Categories';
import Budgets from '../features/budgets/pages/Budgets';
import Reports from '../features/reports/pages/Reports';
import Settings from '../features/settings/pages/Settings';
import AIAssistant from '../features/ai-assistant/pages/AIAssistant';
import HealthCheck from '../features/health/pages/HealthCheck';

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 公共路由组件（已登录用户不能访问）
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const Router = () => {
  return (
    <Routes>
      {/* 公共路由 */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      
      {/* 受保护的路由 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="categories" element={<Categories />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="reports" element={<Reports />} />
        <Route path="health" element={<HealthCheck />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 404页面 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
