import axiosInstance from './axios.config';
import type {
  CreateAccountDto,
  UpdateAccountDto,
  AccountQueryDto,
  AccountResponseDto,
  AccountOverviewStatistics,
  AccountListResponse,
} from '../types/account';

export const accountsAPI = {
  /**
   * 创建账户
   */
  async create(data: CreateAccountDto): Promise<AccountResponseDto> {
    const response = await axiosInstance.post('/accounts', data);
    // 响应拦截器返回的是 { success, data, message, ... }
    // 所以这里直接访问data属性
    return response.data;
  },

  /**
   * 查询账户列表
   */
  async findAll(query: AccountQueryDto): Promise<AccountListResponse> {
    const response = await axiosInstance.get('/accounts', { params: query });
    // 响应拦截器返回的是 { success, data, message, ... }
    return response.data;
  },

  /**
   * 获取账户总览统计
   */
  async getOverviewStatistics(): Promise<AccountOverviewStatistics> {
    const response = await axiosInstance.get('/accounts/overview');
    // 响应拦截器返回的是 { success, data, message, ... }
    return response.data;
  },

  /**
   * 获取默认账户
   */
  async getDefaultAccount(): Promise<AccountResponseDto | null> {
    const response = await axiosInstance.get('/accounts/default');
    // 响应拦截器返回的是 { success, data, message, ... }
    return response.data;
  },

  /**
   * 获取单个账户
   */
  async findOne(id: string, includeStatistics?: boolean): Promise<AccountResponseDto> {
    const params = includeStatistics ? { includeStatistics: true } : {};
    const response = await axiosInstance.get(`/accounts/${id}`, { params });
    // 响应拦截器返回的是 { success, data, message, ... }
    return response.data;
  },

  /**
   * 更新账户
   */
  async update(id: string, data: UpdateAccountDto): Promise<AccountResponseDto> {
    const response = await axiosInstance.patch(`/accounts/${id}`, data);
    // 响应拦截器返回的是 { success, data, message, ... }
    return response.data;
  },

  /**
   * 删除账户
   */
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/accounts/${id}`);
  },
};
