import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  IsNotEmpty,
  MaxLength,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType, AccountStatus, CurrencyCode } from '../../../core/types';

export class CreateAccountDto {
  @ApiProperty({
    description: '账户名称',
    example: '中国银行储蓄卡',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '账户名称不能为空' })
  @MaxLength(100, { message: '账户名称不能超过100个字符' })
  name: string;

  @ApiProperty({
    description: '账户类型',
    enum: AccountType,
    example: AccountType.BANK,
  })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({
    description: '初始余额',
    example: 10000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: '初始余额不能为负数' })
  initialBalance?: number = 0;

  @ApiProperty({
    description: '货币代码',
    enum: CurrencyCode,
    example: CurrencyCode.CNY,
    required: false,
  })
  @IsOptional()
  @IsEnum(CurrencyCode)
  currency?: CurrencyCode = CurrencyCode.CNY;

  @ApiProperty({
    description: '账户描述',
    example: '主要用于日常消费',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '描述不能超过500个字符' })
  description?: string;

  @ApiProperty({
    description: '账户颜色',
    example: '#1890ff',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string = '#1890ff';

  @ApiProperty({
    description: '账户图标',
    example: 'bank',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: '账户状态',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus = AccountStatus.ACTIVE;

  @ApiProperty({
    description: '是否设为默认账户',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @ApiProperty({
    description: '是否共享账户',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isShared?: boolean = false;

  // 银行账户特定字段
  @ApiProperty({
    description: '银行名称',
    example: '中国银行',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '银行名称不能超过100个字符' })
  bankName?: string;

  @ApiProperty({
    description: '账号',
    example: '622848001234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '账号不能超过50个字符' })
  accountNumber?: string;

  @ApiProperty({
    description: '卡号',
    example: '6228480012345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: '卡号不能超过20个字符' })
  cardNumber?: string;

  @ApiProperty({
    description: '持卡人姓名',
    example: '张三',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '持卡人姓名不能超过50个字符' })
  cardHolder?: string;

  @ApiProperty({
    description: '有效期',
    example: '12/25',
    required: false,
  })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiProperty({
    description: 'CVV',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4, { message: 'CVV不能超过4个字符' })
  cvv?: string;

  // 信用卡特定字段
  @ApiProperty({
    description: '信用额度',
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @ApiProperty({
    description: '账单日',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  billingDay?: number;

  @ApiProperty({
    description: '还款日',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay?: number;

  // 投资账户特定字段
  @ApiProperty({
    description: '投资类型',
    example: '股票',
    required: false,
  })
  @IsOptional()
  @IsString()
  investmentType?: string;

  @ApiProperty({
    description: '风险等级',
    example: '中等',
    required: false,
  })
  @IsOptional()
  @IsString()
  riskLevel?: string;

  // 贷款账户特定字段
  @ApiProperty({
    description: '贷款金额',
    example: 200000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  loanAmount?: number;

  @ApiProperty({
    description: '利率',
    example: 4.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @ApiProperty({
    description: '贷款期限（月）',
    example: 240,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  loanTerm?: number;

  @ApiProperty({
    description: '开始日期',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: '结束日期',
    example: '2044-01-01',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
