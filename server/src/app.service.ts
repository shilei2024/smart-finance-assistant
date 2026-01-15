import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const appName = this.configService.get<string>('appName');
    return `欢迎使用 ${appName} API 服务！`;
  }

  getHealth(): { status: string; timestamp: string; version: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: this.configService.get<string>('appVersion', '1.0.0'),
    };
  }

  getAppInfo(): {
    name: string;
    version: string;
    environment: string;
    uptime: number;
  } {
    return {
      name: this.configService.get<string>('appName', '智能记账助手'),
      version: this.configService.get<string>('appVersion', '1.0.0'),
      environment: this.configService.get<string>('nodeEnv', 'development'),
      uptime: process.uptime(),
    };
  }
}
