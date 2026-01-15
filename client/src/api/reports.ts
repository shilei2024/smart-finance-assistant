import axiosInstance from './axios.config';
import type {
  ReportQueryDto,
  ReportResponseDto,
} from '../types/report';

export const reportsAPI = {
  /**
   * 生成报表
   */
  async generateReport(query: ReportQueryDto): Promise<ReportResponseDto> {
    const params: any = {
      ...query,
    };

    // 处理日期
    if (query.startDate) {
      params.startDate = query.startDate.toISOString();
    }
    if (query.endDate) {
      params.endDate = query.endDate.toISOString();
    }

    // 处理数组参数（转换为逗号分隔的字符串）
    if (query.accountIds) {
      if (Array.isArray(query.accountIds)) {
        params.accountIds = query.accountIds.join(',');
      } else {
        params.accountIds = query.accountIds;
      }
    }
    if (query.categoryIds) {
      if (Array.isArray(query.categoryIds)) {
        params.categoryIds = query.categoryIds.join(',');
      } else {
        params.categoryIds = query.categoryIds;
      }
    }

    const response: any = await axiosInstance.get('/reports', { params });
    return response.data || response;
  },
};
