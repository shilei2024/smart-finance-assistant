import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus, CurrencyCode } from '../../../core/types';

export class TransactionResponseDto {
  @ApiProperty({
    description: '交易ID',
    example: 'transaction-id',
  })
  id: string;

  @ApiProperty({
    description: '用户ID',
    example: 'user-id',
  })
  userId: string;

  @ApiProperty({
    description: '交易类型',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  type: TransactionType;

  @ApiProperty({
    description: '交易状态',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: '交易金额',
    example: 100.5,
  })
  amount: number;

  @ApiProperty({
    description: '货币代码',
    enum: CurrencyCode,
    example: CurrencyCode.CNY,
  })
  currency: CurrencyCode;

  @ApiProperty({
    description: '汇率',
    example: 1.0,
    required: false,
  })
  exchangeRate?: number;

  @ApiProperty({
    description: '转换后金额',
    example: 100.5,
    required: false,
  })
  convertedAmount?: number;

  @ApiProperty({
    description: '账户ID',
    example: 'account-id',
  })
  accountId: string;

  @ApiProperty({
    description: '目标账户ID（转账时使用）',
    example: 'to-account-id',
    required: false,
  })
  toAccountId?: string;

  @ApiProperty({
    description: '分类ID',
    example: 'category-id',
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: '交易日期',
    example: '2024-01-13T10:30:00Z',
  })
  transactionDate: Date;

  @ApiProperty({
    description: '交易描述',
    example: '购买办公用品',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '收款方/付款方',
    example: '京东商城',
    required: false,
  })
  payee?: string;

  @ApiProperty({
    description: '交易地点',
    example: '北京市朝阳区',
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: '标签',
    example: ['办公', '必需品'],
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: '附件URL',
    example: ['https://example.com/receipt.jpg'],
    required: false,
  })
  attachmentUrls?: string[];

  @ApiProperty({
    description: '是否为重复交易',
    example: false,
  })

  @ApiProperty({
    description: '重复规则（JSON格式）',
    example: { frequency: 'MONTHLY', interval: 1 },
    required: false,
  })
  recurringRule?: Record<string, any>;

  @ApiProperty({
    description: '下次发生时间',
    example: '2024-02-13T10:30:00Z',
    required: false,
  })
  nextOccurrence?: Date;

  @ApiProperty({
    description: '转账手续费',
    example: 5.0,
    required: false,
  })
  transferFee?: number;

  @ApiProperty({
    description: 'AI处理状态',
    example: false,
  })

  @ApiProperty({
    description: 'AI置信度',
    example: 0.95,
    required: false,
  })
  aiConfidence?: number;

  @ApiProperty({
    description: 'AI建议',
    example: { category: '办公用品', tags: ['办公'] },
    required: false,
  })
  aiSuggestions?: Record<string, any>;

  @ApiProperty({
    description: '账户信息',
    required: false,
  })
  account?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };

  @ApiProperty({
    description: '目标账户信息',
    required: false,
  })
  toAccount?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };

  @ApiProperty({
    description: '分类信息',
    required: false,
  })
  category?: {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
    icon?: string;
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
