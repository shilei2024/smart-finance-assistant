import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, CurrencyCode } from '../../../core/types';

export class OverviewReportDto {
  @ApiProperty({
    description: '总收入',
    example: 10000,
  })
  totalIncome: number;

  @ApiProperty({
    description: '总支出',
    example: 5000,
  })
  totalExpense: number;

  @ApiProperty({
    description: '净收入',
    example: 5000,
  })
  netIncome: number;

  @ApiProperty({
    description: '交易总数',
    example: 50,
  })
  transactionCount: number;

  @ApiProperty({
    description: '收入交易数',
    example: 10,
  })
  incomeCount: number;

  @ApiProperty({
    description: '支出交易数',
    example: 40,
  })
  expenseCount: number;

  @ApiProperty({
    description: '平均每日支出',
    example: 161.29,
  })
  averageDailyExpense: number;

  @ApiProperty({
    description: '平均每日收入',
    example: 322.58,
  })
  averageDailyIncome: number;

  @ApiProperty({
    description: '储蓄率',
    example: 50,
  })
  savingRate: number;

  @ApiProperty({
    description: '货币代码',
    enum: CurrencyCode,
    example: CurrencyCode.CNY,
  })
  currency: CurrencyCode;
}

export class CategoryAnalysisDto {
  @ApiProperty({
    description: '分类ID',
    example: 'category-id',
  })
  categoryId: string;

  @ApiProperty({
    description: '分类名称',
    example: '餐饮',
  })
  categoryName: string;

  @ApiProperty({
    description: '交易类型',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  type: TransactionType;

  @ApiProperty({
    description: '总金额',
    example: 2000,
  })
  totalAmount: number;

  @ApiProperty({
    description: '交易数量',
    example: 20,
  })
  transactionCount: number;

  @ApiProperty({
    description: '占比（百分比）',
    example: 40,
  })
  percentage: number;

  @ApiProperty({
    description: '平均金额',
    example: 100,
  })
  averageAmount: number;

  @ApiProperty({
    description: '分类颜色',
    example: '#ff4d4f',
  })
  color?: string;

  @ApiProperty({
    description: '分类图标',
    example: 'food',
  })
  icon?: string;
}

export class TrendDataDto {
  @ApiProperty({
    description: '日期',
    example: '2024-01-01',
  })
  date: string;

  @ApiProperty({
    description: '收入',
    example: 1000,
  })
  income: number;

  @ApiProperty({
    description: '支出',
    example: 500,
  })
  expense: number;

  @ApiProperty({
    description: '净收入',
    example: 500,
  })
  netIncome: number;

  @ApiProperty({
    description: '交易数量',
    example: 5,
  })
  transactionCount: number;
}

export class AccountSummaryDto {
  @ApiProperty({
    description: '账户ID',
    example: 'account-id',
  })
  accountId: string;

  @ApiProperty({
    description: '账户名称',
    example: '现金账户',
  })
  accountName: string;

  @ApiProperty({
    description: '账户类型',
    example: 'CASH',
  })
  accountType: string;

  @ApiProperty({
    description: '期初余额',
    example: 10000,
  })
  openingBalance: number;

  @ApiProperty({
    description: '期末余额',
    example: 12000,
  })
  closingBalance: number;

  @ApiProperty({
    description: '总收入',
    example: 5000,
  })
  totalIncome: number;

  @ApiProperty({
    description: '总支出',
    example: 3000,
  })
  totalExpense: number;

  @ApiProperty({
    description: '交易数量',
    example: 25,
  })
  transactionCount: number;

  @ApiProperty({
    description: '货币代码',
    enum: CurrencyCode,
    example: CurrencyCode.CNY,
  })
  currency: CurrencyCode;
}

export class BudgetAnalysisDto {
  @ApiProperty({
    description: '预算ID',
    example: 'budget-id',
  })
  budgetId: string;

  @ApiProperty({
    description: '预算名称',
    example: '2024年1月餐饮预算',
  })
  budgetName: string;

  @ApiProperty({
    description: '预算金额',
    example: 5000,
  })
  budgetAmount: number;

  @ApiProperty({
    description: '已花费',
    example: 3000,
  })
  spentAmount: number;

  @ApiProperty({
    description: '剩余金额',
    example: 2000,
  })
  remainingAmount: number;

  @ApiProperty({
    description: '花费百分比',
    example: 60,
  })
  spentPercentage: number;

  @ApiProperty({
    description: '是否超支',
    example: false,
  })
  isExceeded: boolean;

  @ApiProperty({
    description: '分类名称',
    example: '餐饮',
    required: false,
  })
  categoryName?: string;
}

export class ReportResponseDto {
  @ApiProperty({
    description: '报表类型',
    example: 'OVERVIEW',
  })
  type: string;

  @ApiProperty({
    description: '时间范围',
    example: '2024-01-01 to 2024-01-31',
  })
  timeRange: string;

  @ApiProperty({
    description: '总览数据',
    type: OverviewReportDto,
    required: false,
  })
  overview?: OverviewReportDto;

  @ApiProperty({
    description: '分类分析数据',
    type: [CategoryAnalysisDto],
    required: false,
  })
  categoryAnalysis?: CategoryAnalysisDto[];

  @ApiProperty({
    description: '趋势数据',
    type: [TrendDataDto],
    required: false,
  })
  trendData?: TrendDataDto[];

  @ApiProperty({
    description: '账户汇总数据',
    type: [AccountSummaryDto],
    required: false,
  })
  accountSummary?: AccountSummaryDto[];

  @ApiProperty({
    description: '预算分析数据',
    type: [BudgetAnalysisDto],
    required: false,
  })
  budgetAnalysis?: BudgetAnalysisDto[];

  @ApiProperty({
    description: '生成时间',
    example: '2024-01-13T10:30:00Z',
  })
  generatedAt: Date;
}
