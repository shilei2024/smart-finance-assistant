import axiosInstance from './axios.config';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';

export const categoriesAPI = {
  /**
   * 获取所有分类
   */
  async findAll(): Promise<Category[]> {
    const response: any = await axiosInstance.get('/categories');
    return response.data || response;
  },

  /**
   * 获取分类详情
   */
  async findOne(id: string): Promise<Category> {
    const response: any = await axiosInstance.get(`/categories/${id}`);
    return response.data || response;
  },

  /**
   * 创建分类
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    const response: any = await axiosInstance.post('/categories', data);
    return response.data || response;
  },

  /**
   * 更新分类
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response: any = await axiosInstance.patch(`/categories/${id}`, data);
    return response.data || response;
  },

  /**
   * 删除分类
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
