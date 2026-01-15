import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType, AccountStatus, CurrencyCode } from '../../../core/types';

export class AccountQueryDto {
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
    description: '账户类型',
    enum: AccountType,
    example: AccountType.BANK,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @ApiProperty({
    description: '账户状态',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

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
    example: '中国银行',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: '是否只显示默认账户',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDefault?: boolean;

  @ApiProperty({
    description: '是否只显示共享账户',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isShared?: boolean;

  @ApiProperty({
    description: '排序字段',
    example: 'balance',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

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

  @ApiProperty({
    description: '是否包含统计信息',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeStatistics?: boolean = false;
}
