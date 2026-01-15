export enum AccountType {
  CASH = 'CASH',
  BANK = 'BANK',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  OTHER = 'OTHER',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
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

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  initialBalance?: number;
  currency?: CurrencyCode;
  description?: string;
  color?: string;
  icon?: string;
  status?: AccountStatus;
  isDefault?: boolean;
  isShared?: boolean;
  bankName?: string;
  accountNumber?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  creditLimit?: number;
  billingDay?: number;
  dueDay?: number;
  investmentType?: string;
  riskLevel?: string;
  loanAmount?: number;
  interestRate?: number;
  loanTerm?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateAccountDto {
  name?: string;
  type?: AccountType;
  description?: string;
  color?: string;
  icon?: string;
  status?: AccountStatus;
  isDefault?: boolean;
  isShared?: boolean;
  bankName?: string;
  accountNumber?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  creditLimit?: number;
  billingDay?: number;
  dueDay?: number;
  investmentType?: string;
  riskLevel?: string;
  loanAmount?: number;
  interestRate?: number;
  loanTerm?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface AccountQueryDto {
  page?: number;
  limit?: number;
  type?: AccountType;
  status?: AccountStatus;
  currency?: CurrencyCode;
  search?: string;
  isDefault?: boolean;
  isShared?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  includeStatistics?: boolean;
}

export interface AccountStatistics {
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  lastTransactionDate?: Date;
}

export interface AccountResponseDto {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: CurrencyCode;
  description?: string;
  color: string;
  icon?: string;
  status: AccountStatus;
  isDefault: boolean;
  isShared: boolean;
  bankName?: string;
  accountNumber?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  creditLimit?: number;
  billingDay?: number;
  dueDay?: number;
  investmentType?: string;
  riskLevel?: string;
  loanAmount?: number;
  interestRate?: number;
  loanTerm?: number;
  startDate?: Date;
  endDate?: Date;
  statistics?: AccountStatistics;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AccountOverviewStatistics {
  totalBalance: number;
  accountCount: number;
  byType: Array<{
    type: AccountType;
    balance: number;
    count: number;
  }>;
}

export interface AccountListResponse {
  data: AccountResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
