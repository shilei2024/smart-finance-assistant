import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { HealthService } from './health.service';

@ApiTags('健康')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '健康检查' })
  async check() {
    return this.healthService.check();
  }
}
