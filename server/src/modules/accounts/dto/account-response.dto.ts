import { ApiProperty } from '@nestjs/swagger';
import { AccountType, AccountStatus, CurrencyCode } from '../../../core/types';

export class AccountResponseDto {
  @ApiProperty({
    description: '账户ID',
    example: 'account-id',
  })
  id: string;

  @ApiProperty({
    description: '用户ID',
    example: 'user-id',
  })
  userId: string;

  @ApiProperty({
    description: '账户名称',
    example: '中国银行储蓄卡',
  })
  name: string;

  @ApiProperty({
    description: '账户类型',
    enum: AccountType,
    example: AccountType.BANK,
  })
  type: AccountType;

  @ApiProperty({
    description: '账户余额',
    example: 10000,
  })
  balance: number;

  @ApiProperty({
    description: '货币代码',
    enum: CurrencyCode,
    example: CurrencyCode.CNY,
  })
  currency: CurrencyCode;

  @ApiProperty({
    description: '账户描述',
    example: '主要用于日常消费',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '账户颜色',
    example: '#1890ff',
  })
  color: string;

  @ApiProperty({
    description: '账户图标',
    example: 'bank',
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: '账户状态',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @ApiProperty({
    description: '是否默认账户',
    example: false,
  })
  isDefault: boolean;

  @ApiProperty({
    description: '是否共享账户',
    example: false,
  })
  isShared: boolean;

  // 银行账户特定字段
  @ApiProperty({
    description: '银行名称',
    example: '中国银行',
    required: false,
  })
  bankName?: string;

  @ApiProperty({
    description: '账号',
    example: '622848001234567890',
    required: false,
  })
  accountNumber?: string;

  @ApiProperty({
    description: '卡号',
    example: '6228480012345678',
    required: false,
  })
  cardNumber?: string;

  @ApiProperty({
    description: '持卡人姓名',
    example: '张三',
    required: false,
  })
  cardHolder?: string;

  @ApiProperty({
    description: '有效期',
    example: '12/25',
    required: false,
  })
  expiryDate?: string;

  @ApiProperty({
    description: 'CVV',
    example: '123',
    required: false,
  })
  cvv?: string;

  // 信用卡特定字段
  @ApiProperty({
    description: '信用额度',
    example: 50000,
    required: false,
  })
  creditLimit?: number;

  @ApiProperty({
    description: '账单日',
    example: 15,
    required: false,
  })
  billingDay?: number;

  @ApiProperty({
    description: '还款日',
    example: 25,
    required: false,
  })
  dueDay?: number;

  // 投资账户特定字段
  @ApiProperty({
    description: '投资类型',
    example: '股票',
    required: false,
  })
  investmentType?: string;

  @ApiProperty({
    description: '风险等级',
    example: '中等',
    required: false,
  })
  riskLevel?: string;

  // 贷款账户特定字段
  @ApiProperty({
    description: '贷款金额',
    example: 200000,
    required: false,
  })
  loanAmount?: number;

  @ApiProperty({
    description: '利率',
    example: 4.5,
    required: false,
  })
  interestRate?: number;

  @ApiProperty({
    description: '贷款期限（月）',
    example: 240,
    required: false,
  })
  loanTerm?: number;

  @ApiProperty({
    description: '开始日期',
    example: '2024-01-01',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    description: '结束日期',
    example: '2044-01-01',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    description: '交易统计',
    required: false,
  })
  statistics?: {
    totalIncome: number;
    totalExpense: number;
    transactionCount: number;
    lastTransactionDate?: Date;
  };

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-13T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-01-13T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '删除时间',
    example: '2024-01-13T10:30:00Z',
    required: false,
  })
  deletedAt?: Date;
}
