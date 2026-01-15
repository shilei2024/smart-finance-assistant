import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsDate,
  IsEnum,
  IsString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, CurrencyCode } from '../../../core/types';

export enum ReportType {
  OVERVIEW = 'OVERVIEW',
  INCOME_EXPENSE = 'INCOME_EXPENSE',
  CATEGORY_ANALYSIS = 'CATEGORY_ANALYSIS',
  TREND_ANALYSIS = 'TREND_ANALYSIS',
  ACCOUNT_SUMMARY = 'ACCOUNT_SUMMARY',
  BUDGET_ANALYSIS = 'BUDGET_ANALYSIS',
}

export enum TimeRange {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM',
}

export class ReportQueryDto {
  @ApiProperty({
    description: '报表类型',
    enum: ReportType,
    example: ReportType.OVERVIEW,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType = ReportType.OVERVIEW;

  @ApiProperty({
    description: '时间范围',
    enum: TimeRange,
    example: TimeRange.MONTH,
    required: false,
  })
  @IsOptional()
  @IsEnum(TimeRange)
  timeRange?: TimeRange = TimeRange.MONTH;

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
    description: '账户ID列表（逗号分隔）',
    example: 'account-id-1,account-id-2',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountIds?: string;

  @ApiProperty({
    description: '分类ID列表（逗号分隔）',
    example: 'category-id-1,category-id-2',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryIds?: string;

  @ApiProperty({
    description: '交易类型',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

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
    description: '分组方式',
    example: 'day',
    enum: ['day', 'week', 'month', 'year'],
    required: false,
  })
  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'week' | 'month' | 'year' = 'day';
}
