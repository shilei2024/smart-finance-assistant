import * as Joi from 'joi';

export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appName: process.env.APP_NAME || '智能记账助手',
  appVersion: process.env.APP_VERSION || '1.0.0',
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    ssl: process.env.DATABASE_SSL === 'true',
  },

  // Redis配置
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttl: parseInt(process.env.REDIS_TTL || '60', 10),
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // 文件上传配置
  upload: {
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE || '10485760', 10),
    allowedExtensions: (process.env.UPLOAD_ALLOWED_EXTENSIONS || 'jpg,jpeg,png,pdf').split(','),
  },

  // MinIO配置
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucket: process.env.MINIO_BUCKET || 'smart-finance',
    useSSL: process.env.MINIO_USE_SSL === 'true',
  },

  // AI服务配置
  ai: {
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    timeout: parseInt(process.env.AI_SERVICE_TIMEOUT || '30000', 10),
  },

  // 邮件服务配置
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'noreply@smartfinance.com',
  },

  // 第三方登录配置
  wechat: {
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET,
  },
  alipay: {
    appId: process.env.ALIPAY_APP_ID,
    privateKey: process.env.ALIPAY_PRIVATE_KEY,
    publicKey: process.env.ALIPAY_PUBLIC_KEY,
  },

  // 安全配置
  security: {
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    rateLimit: {
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
  },

  // 监控配置
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    logLevel: process.env.LOG_LEVEL || 'info',
    logFormat: process.env.LOG_FORMAT || 'json',
  },

  // 功能开关
  features: {
    aiEnabled: process.env.FEATURE_AI_ENABLED === 'true',
    emailVerification: process.env.FEATURE_EMAIL_VERIFICATION === 'true',
    smsVerification: process.env.FEATURE_SMS_VERIFICATION === 'true',
  },
});

// 环境变量验证模式
export const validationSchema = Joi.object({
  // 基础配置
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('智能记账助手'),
  
  // 数据库配置
  DATABASE_URL: Joi.string().required(),
  DATABASE_SSL: Joi.boolean().default(false),
  
  // Redis配置
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().default(0),
  
  // JWT配置
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  
  // MinIO配置
  MINIO_ENDPOINT: Joi.string().default('localhost'),
  MINIO_PORT: Joi.number().default(9000),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET: Joi.string().default('smart-finance'),
  MINIO_USE_SSL: Joi.boolean().default(false),
  
  // AI服务配置
  DEEPSEEK_API_KEY: Joi.string().optional(),
  OPENAI_API_KEY: Joi.string().optional(),
  AI_SERVICE_TIMEOUT: Joi.number().default(30000),
  
  // 安全配置
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),
  
  // 监控配置
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug', 'verbose').default('info'),
  LOG_FORMAT: Joi.string().valid('json', 'simple').default('json'),
});
