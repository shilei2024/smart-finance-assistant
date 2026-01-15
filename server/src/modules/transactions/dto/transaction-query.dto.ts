import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, TransactionStatus, CurrencyCode } from '../../../core/types';

export class TransactionQueryDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({
    description: '交易类型',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({
    description: '交易状态',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({
    description: '账户ID',
    example: 'account-id',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({
    description: '分类ID',
    example: 'category-id',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: '开始日期',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: '结束日期',
    example: '2024-01-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: '最小金额',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minAmount?: number;

  @ApiProperty({
    description: '最大金额',
    example: 10000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxAmount?: number;

  @ApiProperty({
    description: '货币代码',
    enum: CurrencyCode,
    example: CurrencyCode.CNY,
    required: false,
  })
  @IsOptional()
  @IsEnum(CurrencyCode)
  currency?: CurrencyCode;

  @ApiProperty({
    description: '搜索关键词',
    example: '办公用品',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: '标签',
    example: ['办公', '必需品'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: '排序字段',
    example: 'transactionDate',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'transactionDate';

  @ApiProperty({
    description: '排序方向',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    description: '是否包含已删除的记录',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean = false;
}

