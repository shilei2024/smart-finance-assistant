// 基础类型
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  isDeleted: boolean;
}

// 分页类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: ApiError[];
  timestamp: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationResult<T>['pagination'];
}

// 查询过滤器
export interface QueryFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'notIn' | 'isNull' | 'isNotNull';
  value: any;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  relations?: string[];
  select?: string[];
  withDeleted?: boolean;
}

// 用户相关类型
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// 文件相关类型
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFile {
  url: string;
  key: string;
  size: number;
  mimetype: string;
  originalName: string;
}

// 事件相关类型
export interface DomainEvent {
  type: string;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// 配置相关类型
export interface AppConfig {
  nodeEnv: string;
  port: number;
  appName: string;
  appVersion: string;
  apiPrefix: string;
}

export interface DatabaseConfig {
  url: string;
  synchronize: boolean;
  logging: boolean;
  ssl: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  ttl: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

// 枚举类型
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

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

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

export enum BudgetPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

export enum NotificationType {
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  BILL_REMINDER = 'BILL_REMINDER',
  SECURITY_ALERT = 'SECURITY_ALERT',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

// 业务相关类型
export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  averageAmount: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface BudgetProgress {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  isExceeded: boolean;
}

export interface FinancialHealth {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  breakdown: {
    spendingHabits: number;
    savingRate: number;
    budgetAdherence: number;
    incomeStability: number;
  };
  recommendations: string[];
}

// AI相关类型
export interface AiClassificationRequest {
  description: string;
  amount?: number;
  context?: {
    location?: string;
    time?: string;
    historicalCategories?: string[];
  };
}

export interface AiClassificationResponse {
  primaryCategory: {
    id: string;
    name: string;
    confidence: number;
    reasoning: string;
  };
  alternativeCategories: Array<{
    id: string;
    name: string;
    confidence: number;
  }>;
  extractedTags: string[];
  extractedEntities: {
    merchant?: string;
    location?: string;
    time?: string;
  };
}

export interface AiAnalysisRequest {
  userId: string;
  timeRange: {
    start: string;
    end: string;
  };
  analysisType: 'overview' | 'detailed' | 'comparative';
  focusAreas?: string[];
}

export interface AiAnalysisResponse {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingRate: number;
    averageDailySpending: number;
  };
  financialHealth: FinancialHealth;
  insights: Array<{
    type: 'positive' | 'warning' | 'critical';
    title: string;
    description: string;
    data: any;
    recommendation?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  trends: {
    spendingByCategory: Record<string, number>;
    monthlyComparison: Array<{
      month: string;
      income: number;
      expense: number;
      difference: number;
    }>;
    topSpendingDays: Array<{
      date: string;
      amount: number;
      category: string;
    }>;
  };
  recommendations: Array<{
    category: string;
    currentSpending: number;
    suggestedSpending: number;
    potentialSavings: number;
    actionSteps: string[];
    expectedImpact: string;
  }>;
}

// 工具类型
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
