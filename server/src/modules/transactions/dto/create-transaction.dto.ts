import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  IsArray,
  Min,
  Max,
  IsNotEmpty,
  ValidateIf,
  IsBoolean,
  MaxLength,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, TransactionStatus, CurrencyCode } from '../../../core/types';

export class CreateTransactionDto {
  @ApiProperty({
    description: '交易类型',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

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
    description: '交易金额',
    example: 100.5,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01, { message: '金额必须大于0' })
  amount: number;

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
    description: '汇率',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  exchangeRate?: number;

  @ApiProperty({
    description: '账户ID',
    example: 'account-id',
  })
  @IsString()
  @IsNotEmpty({ message: '账户ID不能为空' })
  accountId: string;

  @ApiProperty({
    description: '目标账户ID（转账时使用）',
    example: 'to-account-id',
    required: false,
  })
  @ValidateIf((o) => o.type === TransactionType.TRANSFER)
  @IsString()
  @IsNotEmpty({ message: '转账时必须指定目标账户' })
  toAccountId?: string;

  @ApiProperty({
    description: '分类ID',
    example: 'category-id',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: '交易日期',
    example: '2024-01-13T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  transactionDate?: Date;

  @ApiProperty({
    description: '交易描述',
    example: '购买办公用品',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '描述不能超过500个字符' })
  description?: string;

  @ApiProperty({
    description: '收款方/付款方',
    example: '京东商城',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '收款方不能超过100个字符' })
  payee?: string;

  @ApiProperty({
    description: '交易地点',
    example: '北京市朝阳区',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '地点不能超过200个字符' })
  location?: string;

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
    description: '附件URL',
    example: ['https://example.com/receipt.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachmentUrls?: string[];

  @ApiProperty({
    description: '是否为重复交易',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty({
    description: '重复规则（JSON格式）',
    example: { frequency: 'MONTHLY', interval: 1 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  recurringRule?: Record<string, any>;

  @ApiProperty({
    description: '下次发生时间',
    example: '2024-02-13T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextOccurrence?: Date;

  @ApiProperty({
    description: '转账手续费',
    example: 5.0,
    required: false,
  })
  @ValidateIf((o) => o.type === TransactionType.TRANSFER)
  @IsOptional()
  @IsNumber()
  @Min(0)
  transferFee?: number;
}

