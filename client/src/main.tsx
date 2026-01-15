import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import App from './App';
import './styles/global.css';

// 设置dayjs本地化
dayjs.locale('zh-cn');

// 设置Ant Design中文
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
