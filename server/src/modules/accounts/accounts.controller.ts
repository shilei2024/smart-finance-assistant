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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountQueryDto } from './dto/account-query.dto';
import { AccountResponseDto } from './dto/account-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('账户')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建账户', description: '创建新的账户' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(
    @CurrentUser() user: any,
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.accountsService.create(user.id, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: '查询账户列表', description: '根据条件查询账户列表' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/AccountResponseDto' },
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
    @Query() query: AccountQueryDto,
  ) {
    return this.accountsService.findAll(user.id, query);
  }

  @Get('overview')
  @ApiOperation({ summary: '获取账户总览统计', description: '获取账户余额和数量的统计信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        totalBalance: { type: 'number', example: 100000 },
        accountCount: { type: 'number', example: 5 },
        byType: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'BANK' },
              balance: { type: 'number', example: 50000 },
              count: { type: 'number', example: 2 },
            },
          },
        },
      },
    },
  })
  async getOverviewStatistics(@CurrentUser() user: any) {
    return this.accountsService.getOverviewStatistics(user.id);
  }

  @Get('default')
  @ApiOperation({ summary: '获取默认账户', description: '获取当前用户的默认账户' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 404, description: '未设置默认账户' })
  async getDefaultAccount(@CurrentUser() user: any): Promise<AccountResponseDto | null> {
    return this.accountsService.getDefaultAccount(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个账户', description: '根据ID获取账户详情' })
  @ApiQuery({
    name: 'includeStatistics',
    required: false,
    description: '是否包含统计信息',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 404, description: '账户不存在' })
  @ApiResponse({ status: 403, description: '无权访问此账户' })
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Query('includeStatistics') includeStatistics?: boolean,
  ): Promise<AccountResponseDto> {
    return this.accountsService.findOne(user.id, id, includeStatistics === true);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新账户', description: '更新账户信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 404, description: '账户不存在' })
  @ApiResponse({ status: 403, description: '无权访问此账户' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.accountsService.update(user.id, id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除账户', description: '软删除账户' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '账户不存在' })
  @ApiResponse({ status: 403, description: '无权访问此账户' })
  @ApiResponse({ status: 400, description: '账户有待处理的交易，无法删除' })
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.accountsService.remove(user.id, id);
  }
}
