import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  IsArray,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetPeriod, CurrencyCode } from '../../../core/types';

export class UpdateBudgetDto {
  @ApiProperty({
    description: '预算名称',
    example: '2024年1月餐饮预算',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '预算名称不能超过100个字符' })
  name?: string;

  @ApiProperty({
    description: '预算周期',
    enum: BudgetPeriod,
    example: BudgetPeriod.MONTHLY,
    required: false,
  })
  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;

  @ApiProperty({
    description: '预算金额',
    example: 5000,
    minimum: 0.01,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: '预算金额必须大于0' })
  amount?: number;

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
    description: '是否激活',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: '提醒阈值（百分比）',
    example: [50, 80, 90, 100],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(100, { each: true })
  alertThresholds?: number[];

  @ApiProperty({
    description: '是否启用提醒',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAlertEnabled?: boolean;
}
