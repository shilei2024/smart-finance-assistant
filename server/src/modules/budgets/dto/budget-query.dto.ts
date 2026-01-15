import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetPeriod, CurrencyCode } from '../../../core/types';

export class BudgetQueryDto {
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
    description: '预算周期',
    enum: BudgetPeriod,
    example: BudgetPeriod.MONTHLY,
    required: false,
  })
  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;

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
    description: '是否只显示激活的预算',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({
    description: '搜索关键词',
    example: '餐饮',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: '排序字段',
    example: 'startDate',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'startDate';

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
  @Type(() => Boolean)
  includeDeleted?: boolean = false;
}
