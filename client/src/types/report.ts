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

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum CurrencyCode {
  CNY = 'CNY',
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
  GBP = 'GBP',
  HKD = 'HKD',
  KRW = 'KRW',
  AUD = 'AUD',
  CAD = 'CAD',
  SGD = 'SGD',
}

export interface ReportQueryDto {
  type?: ReportType;
  timeRange?: TimeRange;
  startDate?: Date;
  endDate?: Date;
  accountIds?: string[] | string;
  categoryIds?: string[] | string;
  transactionType?: TransactionType;
  currency?: CurrencyCode;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export interface OverviewReportDto {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
  averageDailyExpense: number;
  averageDailyIncome: number;
  savingRate: number;
  currency: CurrencyCode;
}

export interface CategoryAnalysisDto {
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  averageAmount: number;
  color?: string;
  icon?: string;
}

export interface TrendDataDto {
  date: string;
  income: number;
  expense: number;
  netIncome: number;
  transactionCount: number;
}

export interface AccountSummaryDto {
  accountId: string;
  accountName: string;
  accountType: string;
  openingBalance: number;
  closingBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  currency: CurrencyCode;
}

export interface BudgetAnalysisDto {
  budgetId: string;
  budgetName: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  isExceeded: boolean;
  categoryName?: string;
}

export interface ReportResponseDto {
  type: string;
  timeRange: string;
  overview?: OverviewReportDto;
  categoryAnalysis?: CategoryAnalysisDto[];
  trendData?: TrendDataDto[];
  accountSummary?: AccountSummaryDto[];
  budgetAnalysis?: BudgetAnalysisDto[];
  generatedAt: Date;
}
