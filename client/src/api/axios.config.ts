import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

// 使用相对路径，通过Vite代理转发到后端
const API_BASE_URL = '/api/v1';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 如果响应格式是 { success: true, data: ... }
    // 后端TransformInterceptor已经包装了响应
    if (response.data && response.data.success !== undefined) {
      // 直接返回 data 字段的内容，这样 API 调用可以直接使用
      const businessData = response.data.data;
      
      // 如果 businessData 存在，直接返回它
      if (businessData && typeof businessData === 'object' && !Array.isArray(businessData)) {
        return {
          ...businessData, // 提取实际的业务数据
          _originalResponse: response,
          _metadata: {
            success: response.data.success,
            code: response.data.code,
            message: response.data.message,
            timestamp: response.data.timestamp,
          },
        };
      }
      
      // 如果没有 data 字段，返回整个响应对象（向后兼容）
      return {
        ...response.data,
        _originalResponse: response,
      };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _errorShown?: boolean;
    };

    // 处理401错误（未授权）
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 尝试刷新token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          // 后端TransformInterceptor返回格式: { success: true, data: { accessToken, refreshToken, ... } }
          const responseData = response.data?.data || response.data;
          const { accessToken, refreshToken: newRefreshToken } = responseData;

          // 更新token
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // 更新请求头
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // 重试原始请求
          return axiosInstance(originalRequest);
        } else {
          // 没有刷新token，跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // 刷新token失败，跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 处理其他错误
    let errorMessage = '请求失败，请稍后重试';
    
    // 网络错误（后端服务未运行或无法连接）
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
      errorMessage = '无法连接到服务器，请检查后端服务是否运行在 http://localhost:3000';
      console.error('网络错误:', {
        code: error.code,
        message: error.message,
        url: originalRequest?.url,
        baseURL: API_BASE_URL,
      });
    } else if (error.response?.data) {
      const errorData = error.response.data as any;
      // 后端错误格式: { success: false, code, message, ... }
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // 显示错误消息（只显示一次，避免重复弹窗）
    if (error.response?.status !== 401 && !originalRequest?._errorShown) {
      originalRequest._errorShown = true;
      message.error(errorMessage);
    }

    // 包装错误对象，确保包含message字段
    const enhancedError = {
      ...error,
      message: errorMessage,
      response: error.response ? {
        ...error.response,
        data: error.response.data,
      } : undefined,
    };

    return Promise.reject(enhancedError);
  },
);

export default axiosInstance;
