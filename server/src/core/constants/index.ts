// 应用常量
export const APP_CONSTANTS = {
  // 分页
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // 排序
  DEFAULT_SORT_FIELD: 'createdAt',
  DEFAULT_SORT_ORDER: 'DESC',
  
  // 缓存
  CACHE_TTL: {
    SHORT: 60, // 1分钟
    MEDIUM: 300, // 5分钟
    LONG: 3600, // 1小时
    DAY: 86400, // 1天
  },
  
  // 文件上传
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // 验证码
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_CODE_EXPIRE: 5 * 60, // 5分钟
  
  // 密码策略
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 32,
  
  // 用户名策略
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 32,
  
  // 邮箱验证
  EMAIL_VERIFICATION_EXPIRE: 24 * 60 * 60, // 24小时
};

// 错误代码
export enum ERROR_CODES {
  // 系统错误 (1000-1999)
  SYSTEM_ERROR = 1000,
  DATABASE_ERROR = 1001,
  NETWORK_ERROR = 1002,
  EXTERNAL_SERVICE_ERROR = 1003,
  
  // 业务错误 (2000-2999)
  VALIDATION_ERROR = 2000,
  NOT_FOUND = 2001,
  DUPLICATE_ENTRY = 2002,
  BUSINESS_RULE_VIOLATION = 2003,
  INSUFFICIENT_BALANCE = 2004,
  INVALID_OPERATION = 2005,
  
  // 认证授权错误 (3000-3999)
  UNAUTHORIZED = 3000,
  FORBIDDEN = 3001,
  TOKEN_EXPIRED = 3002,
  INVALID_CREDENTIALS = 3003,
  ACCOUNT_LOCKED = 3004,
  ACCOUNT_DISABLED = 3005,
  
  // 资源错误 (4000-4999)
  RATE_LIMIT_EXCEEDED = 4000,
  QUOTA_EXCEEDED = 4001,
  FILE_TOO_LARGE = 4002,
  INVALID_FILE_TYPE = 4003,
  
  // 第三方服务错误 (5000-5999)
  AI_SERVICE_ERROR = 5000,
  PAYMENT_GATEWAY_ERROR = 5001,
  SMS_SERVICE_ERROR = 5002,
  EMAIL_SERVICE_ERROR = 5003,
}

// 交易类型
export enum TRANSACTION_TYPES {
  INCOME = 'income', // 收入
  EXPENSE = 'expense', // 支出
  TRANSFER = 'transfer', // 转账
}

// 交易状态
export enum TRANSACTION_STATUS {
  PENDING = 'pending', // 待处理
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
  FAILED = 'failed', // 失败
}

// 账户类型
export enum ACCOUNT_TYPES {
  CASH = 'cash', // 现金账户
  BANK = 'bank', // 银行账户
  CREDIT_CARD = 'credit_card', // 信用卡
  DIGITAL_WALLET = 'digital_wallet', // 电子钱包
  INVESTMENT = 'investment', // 投资账户
  LOAN = 'loan', // 贷款账户
}

// 预算周期
export enum BUDGET_PERIODS {
  DAILY = 'daily', // 日预算
  WEEKLY = 'weekly', // 周预算
  MONTHLY = 'monthly', // 月预算
  YEARLY = 'yearly', // 年预算
  CUSTOM = 'custom', // 自定义
}

// 通知类型
export enum NOTIFICATION_TYPES {
  TRANSACTION_CREATED = 'transaction_created',
  BUDGET_EXCEEDED = 'budget_exceeded',
  BILL_REMINDER = 'bill_reminder',
  SECURITY_ALERT = 'security_alert',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

// 用户角色
export enum USER_ROLES {
  USER = 'user', // 普通用户
  PREMIUM_USER = 'premium_user', // 高级用户
  ADMIN = 'admin', // 管理员
  SUPER_ADMIN = 'super_admin', // 超级管理员
}

// 权限
export enum PERMISSIONS {
  // 用户管理
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // 账户管理
  ACCOUNT_READ = 'account:read',
  ACCOUNT_CREATE = 'account:create',
  ACCOUNT_UPDATE = 'account:update',
  ACCOUNT_DELETE = 'account:delete',
  
  // 交易管理
  TRANSACTION_READ = 'transaction:read',
  TRANSACTION_CREATE = 'transaction:create',
  TRANSACTION_UPDATE = 'transaction:update',
  TRANSACTION_DELETE = 'transaction:delete',
  
  // 分类管理
  CATEGORY_READ = 'category:read',
  CATEGORY_CREATE = 'category:create',
  CATEGORY_UPDATE = 'category:update',
  CATEGORY_DELETE = 'category:delete',
  
  // 预算管理
  BUDGET_READ = 'budget:read',
  BUDGET_CREATE = 'budget:create',
  BUDGET_UPDATE = 'budget:update',
  BUDGET_DELETE = 'budget:delete',
  
  // 报表管理
  REPORT_READ = 'report:read',
  REPORT_CREATE = 'report:create',
  REPORT_EXPORT = 'report:export',
  
  // AI功能
  AI_CLASSIFICATION = 'ai:classification',
  AI_ANALYSIS = 'ai:analysis',
  AI_CHAT = 'ai:chat',
  
  // 系统管理
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_MONITORING = 'system:monitoring',
  SYSTEM_BACKUP = 'system:backup',
}

// 基础用户权限
const USER_BASE_PERMISSIONS: PERMISSIONS[] = [
  PERMISSIONS.USER_READ,
  PERMISSIONS.USER_UPDATE,
  PERMISSIONS.ACCOUNT_READ,
  PERMISSIONS.ACCOUNT_CREATE,
  PERMISSIONS.ACCOUNT_UPDATE,
  PERMISSIONS.ACCOUNT_DELETE,
  PERMISSIONS.TRANSACTION_READ,
  PERMISSIONS.TRANSACTION_CREATE,
  PERMISSIONS.TRANSACTION_UPDATE,
  PERMISSIONS.TRANSACTION_DELETE,
  PERMISSIONS.CATEGORY_READ,
  PERMISSIONS.CATEGORY_CREATE,
  PERMISSIONS.CATEGORY_UPDATE,
  PERMISSIONS.CATEGORY_DELETE,
  PERMISSIONS.BUDGET_READ,
  PERMISSIONS.BUDGET_CREATE,
  PERMISSIONS.BUDGET_UPDATE,
  PERMISSIONS.BUDGET_DELETE,
  PERMISSIONS.REPORT_READ,
  PERMISSIONS.REPORT_EXPORT,
  PERMISSIONS.AI_CLASSIFICATION,
  PERMISSIONS.AI_ANALYSIS,
  PERMISSIONS.AI_CHAT,
];

// 角色权限映射
export const ROLE_PERMISSIONS: Record<USER_ROLES, PERMISSIONS[]> = {
  [USER_ROLES.USER]: USER_BASE_PERMISSIONS,
  
  [USER_ROLES.PREMIUM_USER]: [
    ...USER_BASE_PERMISSIONS,
    PERMISSIONS.REPORT_CREATE,
  ],
  
  [USER_ROLES.ADMIN]: [
    ...USER_BASE_PERMISSIONS,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.SYSTEM_MONITORING,
  ],
  
  [USER_ROLES.SUPER_ADMIN]: [
    ...USER_BASE_PERMISSIONS,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.SYSTEM_MONITORING,
    PERMISSIONS.SYSTEM_BACKUP,
  ],
};

// 货币代码
export const CURRENCY_CODES = {
  CNY: '人民币',
  USD: '美元',
  EUR: '欧元',
  JPY: '日元',
  GBP: '英镑',
  HKD: '港币',
  KRW: '韩元',
  AUD: '澳元',
  CAD: '加元',
  SGD: '新加坡元',
} as const;

// 时间格式
export const TIME_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  TIMESTAMP: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;

// 响应消息
export const RESPONSE_MESSAGES = {
  SUCCESS: '操作成功',
  CREATED: '创建成功',
  UPDATED: '更新成功',
  DELETED: '删除成功',
  NOT_FOUND: '资源不存在',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '权限不足',
  VALIDATION_ERROR: '数据验证失败',
  INTERNAL_ERROR: '服务器内部错误',
  RATE_LIMIT: '请求过于频繁，请稍后重试',
} as const;
