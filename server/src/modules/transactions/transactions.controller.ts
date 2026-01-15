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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('交易')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建交易', description: '创建新的交易记录' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '无权访问账户或分类' })
  async create(
    @CurrentUser() user: any,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.create(user.id, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: '查询交易列表', description: '根据条件查询交易记录' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/TransactionResponseDto' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 20 },
        totalPages: { type: 'number', example: 5 },
      },
    },
  })
  async findAll(
    @CurrentUser() user: any,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionsService.findAll(user.id, query);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取交易统计', description: '获取交易金额和数量的统计信息' })
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
        totalAmount: { type: 'number', example: 10000 },
        totalCount: { type: 'number', example: 50 },
        byType: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'EXPENSE' },
              amount: { type: 'number', example: 5000 },
              count: { type: 'number', example: 25 },
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
    return this.transactionsService.getStatistics(user.id, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个交易', description: '根据ID获取交易详情' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: '交易不存在' })
  @ApiResponse({ status: 403, description: '无权访问此交易' })
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新交易', description: '更新交易记录' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: '交易不存在' })
  @ApiResponse({ status: 403, description: '无权访问此交易' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.update(user.id, id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除交易', description: '软删除交易记录' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '交易不存在' })
  @ApiResponse({ status: 403, description: '无权访问此交易' })
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.transactionsService.remove(user.id, id);
  }
}
