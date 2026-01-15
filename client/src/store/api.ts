import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    // 从store获取token
    const token = (getState() as RootState).auth.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // 处理401错误（未授权）
    if (result.error?.status === 401) {
      // 这里可以触发登出逻辑
      console.warn('未授权访问，可能需要重新登录');
    }
    
    return result;
  },
  tagTypes: [
    'User',
    'Account',
    'Transaction',
    'Category',
    'Budget',
    'Report',
  ],
  endpoints: () => ({}),
});
