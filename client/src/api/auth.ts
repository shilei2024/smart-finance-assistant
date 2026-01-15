import axiosInstance from './axios.config';
import type {
  RegisterDto,
  LoginDto,
  AuthResponse,
  UserProfile,
} from '../types/auth';

export const authAPI = {
  /**
   * 用户注册
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response: any = await axiosInstance.post('/auth/register', data);
      console.log('[authAPI.register] 原始响应:', response);
      
      // 响应拦截器应该已经提取了 data 字段
      // 但如果仍然有 data 字段，说明是双重包装，需要再次提取
      let authData: any = response;
      
      if (response.data && typeof response.data === 'object') {
        // 如果 response.data 包含 accessToken，说明是实际的业务数据
        if (response.data.accessToken) {
          authData = response.data;
        }
        // 如果 response.data.data 包含 accessToken，说明是双重包装
        else if (response.data.data && response.data.data.accessToken) {
          authData = response.data.data;
        }
      }
      
      // 过滤掉内部字段
      const { _originalResponse, _metadata, ...result } = authData;
      console.log('[authAPI.register] 返回数据:', result);
      return result as AuthResponse;
    } catch (error: any) {
      console.error('[authAPI.register] 注册错误:', error);
      console.error('[authAPI.register] 错误响应:', error.response?.data);
      throw error;
    }
  },

  /**
   * 用户登录
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response: any = await axiosInstance.post('/auth/login', data);
      console.log('[authAPI.login] 原始响应:', response);
      
      // 响应拦截器应该已经提取了 data 字段
      // 但如果仍然有 data 字段，说明是双重包装，需要再次提取
      let authData: any = response;
      
      if (response.data && typeof response.data === 'object') {
        // 如果 response.data 包含 accessToken，说明是实际的业务数据
        if (response.data.accessToken) {
          authData = response.data;
        }
        // 如果 response.data.data 包含 accessToken，说明是双重包装
        else if (response.data.data && response.data.data.accessToken) {
          authData = response.data.data;
        }
      }
      
      // 过滤掉内部字段
      const { _originalResponse, _metadata, ...result } = authData;
      console.log('[authAPI.login] 返回数据:', result);
      return result as AuthResponse;
    } catch (error: any) {
      console.error('[authAPI.login] 登录错误:', error);
      console.error('[authAPI.login] 错误响应:', error.response?.data);
      throw error;
    }
  },

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response: any = await axiosInstance.post('/auth/refresh', {
      refreshToken,
    });
    // 响应拦截器已经提取了 data 字段，response 就是实际的 AuthResponseDto 对象
    const { _originalResponse, _metadata, ...authData } = response;
    return authData as AuthResponse;
  },

  /**
   * 忘记密码
   */
  async forgotPassword(email: string): Promise<void> {
    await axiosInstance.post('/auth/forgot-password', { email });
  },

  /**
   * 重置密码
   */
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword,
    });
  },

  /**
   * 修改密码
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    await axiosInstance.post(
      '/auth/change-password',
      {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    );
  },

  /**
   * 登出
   */
  async logout(token: string): Promise<void> {
    await axiosInstance.post('/auth/logout', { token });
  },

  /**
   * 登出所有设备
   */
  async logoutAll(): Promise<void> {
    await axiosInstance.post('/auth/logout-all');
  },

  /**
   * 获取当前用户信息
   */
  async getProfile(): Promise<UserProfile> {
    const response: any = await axiosInstance.get('/auth/me');
    // 响应拦截器已经提取了 data 字段，response 就是实际的 UserProfile 对象
    const { _originalResponse, _metadata, ...userData } = response;
    return userData as UserProfile;
  },
};
