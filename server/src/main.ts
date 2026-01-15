import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
// compression默认导出在某些环境下会丢失，这里使用require确保兼容
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compression = require('compression');
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  // 创建应用实例
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:4173',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
  });

  // 获取配置服务
  const configService = app.get(ConfigService);

  // 应用前缀
  const apiPrefix = configService.get<string>('apiPrefix', '/api/v1');
  app.setGlobalPrefix(apiPrefix);

  // 处理根路径，返回欢迎信息或重定向到 API 文档
  app.getHttpAdapter().get('/', (req, res) => {
    const appName = configService.get<string>('appName', '智能记账助手');
    res.json({
      success: true,
      code: 200,
      message: '欢迎使用智能记账助手 API 服务',
      data: {
        name: appName,
        version: configService.get<string>('appVersion', '1.0.0'),
        apiPrefix,
        endpoints: {
          health: `${apiPrefix}/health`,
          info: `${apiPrefix}/info`,
          docs: '/api/docs',
        },
      },
      timestamp: new Date().toISOString(),
    });
  });

  // 安全中间件
  app.use(helmet());
  app.use(compression());

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局拦截器
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );

  // Swagger文档配置（暂时禁用，因为有循环依赖问题）
  if (false && configService.get<string>('nodeEnv') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('智能记账助手 API')
      .setDescription('智能记账助手后端API文档')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '输入JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('应用', '应用基本信息')
      .addTag('认证', '用户认证相关接口')
      .addTag('用户', '用户管理相关接口')
      .addTag('账户', '账户管理相关接口')
      .addTag('交易', '交易记录相关接口')
      .addTag('分类', '分类管理相关接口')
      .addTag('预算', '预算管理相关接口')
      .addTag('报表', '报表分析相关接口')
      .addTag('AI', 'AI助手相关接口')
      .addTag('健康', '健康检查相关接口')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
      customSiteTitle: '智能记账助手 API 文档',
    });
  }

  // 启动应用
  const port = configService.get<number>('port', 3000);
  await app.listen(port);

  // 输出启动信息
  const appName = configService.get<string>('appName', '智能记账助手');
  const nodeEnv = configService.get<string>('nodeEnv', 'development');
  
  console.log(`
  🚀 ${appName} 服务已启动！
  
  📍 环境: ${nodeEnv}
  🌐 地址: http://localhost:${port}
  📚 文档: http://localhost:${port}/api/docs
  🔧 API前缀: ${apiPrefix}
  
  ⏰ 启动时间: ${new Date().toLocaleString()}
  `);
}

bootstrap().catch((error) => {
  console.error('应用启动失败:', error);
  process.exit(1);
});
