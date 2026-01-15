import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
// import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';

import configuration from './config/configuration';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local', '.env.development'],
    }),

    // 速率限制模块
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),

    // 定时任务模块
    // ScheduleModule.forRoot(),

    // 事件发射器模块
    // EventEmitterModule.forRoot(),

    // 业务模块
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
    BudgetsModule,
    ReportsModule,
    AiModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    // 全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // 全局过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // 全局管道
    ValidationPipe,
  ],
})
export class AppModule {}