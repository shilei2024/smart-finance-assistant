import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('报表')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: '生成报表', description: '根据条件生成各种类型的报表' })
  @ApiResponse({
    status: 200,
    description: '生成成功',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async generateReport(
    @CurrentUser() user: any,
    @Query() query: ReportQueryDto,
  ): Promise<ReportResponseDto> {
    return this.reportsService.generateReport(user.id, query);
  }
}
