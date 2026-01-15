export enum BudgetPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
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

export interface CreateBudgetDto {
  name: string;
  period: BudgetPeriod;
  amount: number;
  currency?: CurrencyCode;
  categoryId?: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  alertThresholds?: number[];
  isAlertEnabled?: boolean;
}

export interface UpdateBudgetDto {
  name?: string;
  period?: BudgetPeriod;
  amount?: number;
  currency?: CurrencyCode;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  alertThresholds?: number[];
  isAlertEnabled?: boolean;
}

export interface BudgetQueryDto {
  page?: number;
  limit?: number;
  period?: BudgetPeriod;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

export interface BudgetResponseDto {
  id: string;
  userId: string;
  categoryId?: string;
  name: string;
  period: BudgetPeriod;
  amount: number;
  currency: CurrencyCode;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  alertThresholds: number[];
  isAlertEnabled: boolean;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  isExceeded: boolean;
  category?: {
    id: string;
    name: string;
    type: string;
    color: string;
    icon?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface BudgetStatistics {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  budgetCount: number;
  exceededCount: number;
  averageSpentPercentage: number;
  byPeriod: Array<{
    period: BudgetPeriod;
    totalBudget: number;
    totalSpent: number;
    count: number;
  }>;
}

export interface BudgetListResponse {
  data: BudgetResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
