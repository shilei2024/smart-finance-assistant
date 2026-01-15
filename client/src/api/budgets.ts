import axiosInstance from './axios.config';
import type {
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetQueryDto,
  BudgetResponseDto,
  BudgetStatistics,
  BudgetListResponse,
} from '../types/budget';

export const budgetsAPI = {
  /**
   * 创建预算
   */
  async create(data: CreateBudgetDto): Promise<BudgetResponseDto> {
    const response: any = await axiosInstance.post('/budgets', data);
    return response.data || response;
  },

  /**
   * 查询预算列表
   */
  async findAll(query: BudgetQueryDto): Promise<BudgetListResponse> {
    const response: any = await axiosInstance.get('/budgets', { params: query });
    return response.data || response;
  },

  /**
   * 获取预算统计
   */
  async getStatistics(startDate?: Date, endDate?: Date): Promise<BudgetStatistics> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    const response: any = await axiosInstance.get('/budgets/statistics', { params });
    return response.data || response;
  },

  /**
   * 获取单个预算
   */
  async findOne(id: string): Promise<BudgetResponseDto> {
    const response: any = await axiosInstance.get(`/budgets/${id}`);
    return response.data || response;
  },

  /**
   * 更新预算
   */
  async update(id: string, data: UpdateBudgetDto): Promise<BudgetResponseDto> {
    const response: any = await axiosInstance.patch(`/budgets/${id}`, data);
    return response.data || response;
  },

  /**
   * 删除预算
   */
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/budgets/${id}`);
  },
};
