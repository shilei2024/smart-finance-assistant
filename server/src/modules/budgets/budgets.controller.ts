import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetQueryDto } from './dto/budget-query.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('预算')
@Controller('budgets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建预算', description: '创建新的预算' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: BudgetResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '无权访问分类' })
  async create(
    @CurrentUser() user: any,
    @Body() createBudgetDto: CreateBudgetDto,
  ): Promise<BudgetResponseDto> {
    return this.budgetsService.create(user.id, createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: '查询预算列表', description: '根据条件查询预算列表' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/BudgetResponseDto' },
        },
        total: { type: 'number', example: 10 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 20 },
        totalPages: { type: 'number', example: 1 },
      },
    },
  })
  async findAll(
    @CurrentUser() user: any,
    @Query() query: BudgetQueryDto,
  ) {
    return this.budgetsService.findAll(user.id, query);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取预算统计', description: '获取预算金额和花费的统计信息' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: '开始日期',
    type: Date,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: '结束日期',
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        totalBudget: { type: 'number', example: 10000 },
        totalSpent: { type: 'number', example: 6000 },
        totalRemaining: { type: 'number', example: 4000 },
        budgetCount: { type: 'number', example: 5 },
        exceededCount: { type: 'number', example: 1 },
        averageSpentPercentage: { type: 'number', example: 60 },
        byPeriod: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              period: { type: 'string', example: 'MONTHLY' },
              totalBudget: { type: 'number', example: 5000 },
              totalSpent: { type: 'number', example: 3000 },
              count: { type: 'number', example: 2 },
            },
          },
        },
      },
    },
  })
  async getStatistics(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.budgetsService.getStatistics(user.id, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个预算', description: '根据ID获取预算详情' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: BudgetResponseDto,
  })
  @ApiResponse({ status: 404, description: '预算不存在' })
  @ApiResponse({ status: 403, description: '无权访问此预算' })
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<BudgetResponseDto> {
    return this.budgetsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新预算', description: '更新预算信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: BudgetResponseDto,
  })
  @ApiResponse({ status: 404, description: '预算不存在' })
  @ApiResponse({ status: 403, description: '无权访问此预算' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
    return this.budgetsService.update(user.id, id, updateBudgetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除预算', description: '软删除预算' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '预算不存在' })
  @ApiResponse({ status: 403, description: '无权访问此预算' })
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.budgetsService.remove(user.id, id);
  }
}
