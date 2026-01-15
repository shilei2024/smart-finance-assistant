import { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // 这里可以上报错误到监控服务
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: '20px',
        }}>
          <Result
            status="error"
            title="应用出现错误"
            subTitle="抱歉，应用遇到了问题，请尝试刷新页面或返回首页"
            extra={[
              <Button
                key="home"
                type="primary"
                icon={<HomeOutlined />}
                onClick={this.handleGoHome}
              >
                返回首页
              </Button>,
              <Button
                key="refresh"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
              >
                重试
              </Button>,
            ]}
          />
          
          {/* 开发环境下显示错误详情 */}
          {import.meta.env.DEV && this.state.error && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              width: '100%',
            }}>
              <h3 style={{ color: '#f5222d', marginBottom: '10px' }}>
                错误详情（仅开发环境显示）
              </h3>
              <pre style={{
                backgroundColor: '#f6f8fa',
                padding: '15px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                lineHeight: '1.5',
              }}>
                <strong>错误信息:</strong> {this.state.error.toString()}
                {'\n\n'}
                <strong>错误堆栈:</strong>
                {'\n'}
                {this.state.error.stack}
                {'\n\n'}
                {this.state.errorInfo && (
                  <>
                    <strong>组件堆栈:</strong>
                    {'\n'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
