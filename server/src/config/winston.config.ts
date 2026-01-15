import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

// 创建日志目录
const logDir = path.join(process.cwd(), 'logs');

export const winstonOptions = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'smart-finance-api' },
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, service, ...meta }) => {
            const metaString = Object.keys(meta).length
              ? ` ${JSON.stringify(meta)}`
              : '';
            return `[${timestamp}] ${service} ${level}: ${message}${metaString}`;
          },
        ),
      ),
    }),

    // 文件输出 - 错误日志
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: path.join(logDir, 'error'),
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // 文件输出 - 所有日志
    new winston.transports.DailyRotateFile({
      dirname: path.join(logDir, 'combined'),
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
    }),
  ],
};

// 创建logger实例
export const logger = winston.createLogger(winstonOptions);

// 日志级别
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

// 日志上下文接口
export interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  [key: string]: any;
}

// 日志工具函数
export class Logger {
  static error(message: string, context?: LogContext, trace?: string) {
    logger.error(message, { ...context, trace });
  }

  static warn(message: string, context?: LogContext) {
    logger.warn(message, context);
  }

  static info(message: string, context?: LogContext) {
    logger.info(message, context);
  }

  static debug(message: string, context?: LogContext) {
    logger.debug(message, context);
  }

  static verbose(message: string, context?: LogContext) {
    logger.verbose(message, context);
  }

  static log(level: LogLevel, message: string, context?: LogContext) {
    logger.log(level, message, context);
  }

  // HTTP请求日志
  static httpRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    context?: LogContext,
  ) {
    logger.info('HTTP请求', {
      method,
      url,
      statusCode,
      responseTime,
      ...context,
    });
  }

  // 数据库查询日志
  static dbQuery(
    query: string,
    parameters: any[],
    executionTime: number,
    context?: LogContext,
  ) {
    logger.debug('数据库查询', {
      query,
      parameters,
      executionTime,
      ...context,
    });
  }

  // 业务操作日志
  static business(
    action: string,
    entity: string,
    entityId: string,
    userId: string,
    details?: any,
  ) {
    logger.info('业务操作', {
      action,
      entity,
      entityId,
      userId,
      details,
    });
  }
}
