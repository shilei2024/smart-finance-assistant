import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    
    // 监听查询事件（仅开发环境）
    // 注意：Prisma的事件监听器类型定义可能不完整，这里使用类型断言
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - Prisma事件类型定义问题
      this.$on('query', (event: any) => {
        console.log('Query: ', event.query);
        console.log('Params: ', event.params);
        console.log('Duration: ', event.duration, 'ms');
      });
    }

    // 监听错误事件
    // @ts-ignore - Prisma事件类型定义问题
    this.$on('error', (event: any) => {
      console.error('Prisma Error: ', event);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * 软删除扩展
   */
  get softDelete() {
    return {
      user: this.user.update({
        where: { id: '' },
        data: { status: 'INACTIVE' }, // 使用status字段代替deletedAt
      }),
    };
  }

  /**
   * 排除软删除的记录
   */
  excludeDeleted<T extends { deletedAt: Date | null }>(
    model: T[],
  ): T[] {
    return model.filter((item) => !item.deletedAt);
  }

  /**
   * 分页查询
   */
  async paginate<T>(
    model: any,
    params: {
      page?: number;
      limit?: number;
      where?: any;
      orderBy?: any;
      include?: any;
      select?: any;
    },
  ): Promise<{
    data: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      model.findMany({
        skip,
        take: limit,
        where: params.where,
        orderBy: params.orderBy,
        include: params.include,
        select: params.select,
      }),
      model.count({
        where: params.where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 事务包装器
   */
  async executeTransaction<T>(
    callback: (prisma: Omit<PrismaService, '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'>) => Promise<T>,
    options?: { maxWait?: number; timeout?: number },
  ): Promise<T> {
    // @ts-ignore - Prisma事务类型定义问题
    return this.$transaction(callback, options);
  }

  /**
   * 批量操作
   */
  async batchOperation<T>(
    data: T[],
    batchSize: number,
    operation: (batch: T[]) => Promise<any>,
  ): Promise<void> {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await operation(batch);
    }
  }

  /**
   * 清理过期数据
   */
  async cleanupExpiredData(): Promise<{
    sessions: number;
    verificationCodes: number;
    notifications: number;
  }> {
    const now = new Date();

    const [sessions, verificationCodes, notifications] = await Promise.all([
      // 清理过期会话
      this.session.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      }),

      // 清理过期验证码
      this.verificationCode.deleteMany({
        where: {
          OR: [
            {
              expiresAt: {
                lt: now,
              },
            },
            {
              used: true,
            },
          ],
        },
      }),

      // 清理已读且超过30天的通知
      this.notification.deleteMany({
        where: {
          status: 'READ',
          createdAt: {
            lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      sessions: sessions.count,
      verificationCodes: verificationCodes.count,
      notifications: notifications.count,
    };
  }
}
