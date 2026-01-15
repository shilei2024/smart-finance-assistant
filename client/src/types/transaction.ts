export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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

export interface CreateTransactionDto {
  type: TransactionType;
  status?: TransactionStatus;
  amount: number;
  currency?: CurrencyCode;
  exchangeRate?: number;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  transactionDate?: Date;
  description?: string;
  payee?: string;
  location?: string;
  tags?: string[];
  attachmentUrls?: string[];
  isRecurring?: boolean;
  recurringRule?: Record<string, any>;
  nextOccurrence?: Date;
  transferFee?: number;
}

export interface UpdateTransactionDto {
  type?: TransactionType;
  status?: TransactionStatus;
  amount?: number;
  currency?: CurrencyCode;
  exchangeRate?: number;
  accountId?: string;
  toAccountId?: string;
  categoryId?: string;
  transactionDate?: Date;
  description?: string;
  payee?: string;
  location?: string;
  tags?: string[];
  attachmentUrls?: string[];
  isRecurring?: boolean;
  recurringRule?: Record<string, any>;
  nextOccurrence?: Date;
  transferFee?: number;
}

export interface TransactionQueryDto {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  accountId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  currency?: CurrencyCode;
  search?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

export interface TransactionResponseDto {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: CurrencyCode;
  exchangeRate?: number;
  convertedAmount?: number;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  transactionDate: Date;
  description?: string;
  payee?: string;
  location?: string;
  tags?: string[];
  attachmentUrls?: string[];
  isRecurring: boolean;
  recurringRule?: Record<string, any>;
  nextOccurrence?: Date;
  transferFee?: number;
  aiProcessed: boolean;
  aiConfidence?: number;
  aiSuggestions?: Record<string, any>;
  account?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
  toAccount?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
  category?: {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
    icon?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface TransactionStatistics {
  totalAmount: number;
  totalCount: number;
  byType: Array<{
    type: TransactionType;
    amount: number;
    count: number;
  }>;
}

export interface TransactionListResponse {
  data: TransactionResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
