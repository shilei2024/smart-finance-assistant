import axiosInstance from './axios.config';
import type {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionQueryDto,
  TransactionResponseDto,
  TransactionStatistics,
  TransactionListResponse,
} from '../types/transaction';

export const transactionsAPI = {
  /**
   * 创建交易
   */
  async create(data: CreateTransactionDto): Promise<TransactionResponseDto> {
    const response: any = await axiosInstance.post('/transactions', data);
    // 响应拦截器返回 { success, code, message, data, ... }
    return response.data || response;
  },

  /**
   * 查询交易列表
   */
  async findAll(query: TransactionQueryDto): Promise<TransactionListResponse> {
    const response: any = await axiosInstance.get('/transactions', { params: query });
    return response.data || response;
  },

  /**
   * 获取交易统计
   */
  async getStatistics(startDate?: Date, endDate?: Date): Promise<TransactionStatistics> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    const response: any = await axiosInstance.get('/transactions/statistics', { params });
    return response.data || response;
  },

  /**
   * 获取单个交易
   */
  async findOne(id: string): Promise<TransactionResponseDto> {
    const response: any = await axiosInstance.get(`/transactions/${id}`);
    return response.data || response;
  },

  /**
   * 更新交易
   */
  async update(id: string, data: UpdateTransactionDto): Promise<TransactionResponseDto> {
    const response: any = await axiosInstance.patch(`/transactions/${id}`, data);
    return response.data || response;
  },

  /**
   * 删除交易
   */
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/transactions/${id}`);
  },
};
