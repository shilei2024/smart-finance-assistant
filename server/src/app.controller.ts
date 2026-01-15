import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { AppService } from './app.service';

@ApiTags('应用')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '欢迎信息', description: '获取应用欢迎信息' })
  @ApiResponse({ status: 200, description: '返回欢迎信息' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: '健康检查', description: '检查应用健康状态' })
  @ApiResponse({ status: 200, description: '应用运行正常' })
  @ApiResponse({ status: 503, description: '应用运行异常' })
  getHealth(): { status: string; timestamp: string; version: string } {
    return this.appService.getHealth();
  }

  @Public()
  @Get('info')
  @ApiOperation({ summary: '应用信息', description: '获取应用基本信息' })
  @ApiResponse({ status: 200, description: '返回应用信息' })
  getAppInfo(): {
    name: string;
    version: string;
    environment: string;
    uptime: number;
  } {
    return this.appService.getAppInfo();
  }
}
