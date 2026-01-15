import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async check() {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const isHealthy = [database, redis].every((item) => item.status === 'ok');

    return {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database,
        redis,
      },
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      return {
        status: 'error',
        message: error?.message || 'database check failed',
      };
    }
  }

  private async checkRedis() {
    const redis = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
      db: this.configService.get<number>('redis.db'),
      lazyConnect: true,
    });

    try {
      await redis.connect();
      const key = `health:${Date.now()}`;
      await redis.set(key, 'ok', 'EX', 10);
      const value = await redis.get(key);
      await redis.del(key);

      const healthy = value === 'ok';
      return healthy
        ? { status: 'ok' }
        : { status: 'error', message: 'redis echo mismatch' };
    } catch (error) {
      return {
        status: 'error',
        message: error?.message || 'redis check failed',
      };
    } finally {
      try {
        await redis.quit();
      } catch {
        try {
          redis.disconnect();
        } catch {
          // ignore
        }
      }
    }
  }
}
