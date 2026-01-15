import axiosInstance from './axios.config';

export interface HealthServiceStatus {
  status: 'ok' | 'error';
  message?: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  services: {
    database: HealthServiceStatus;
    redis: HealthServiceStatus;
  };
}

export const healthAPI = {
  async getHealth(): Promise<HealthResponse> {
    const response = await axiosInstance.get('/health');
    return response.data as HealthResponse;
  },
};
