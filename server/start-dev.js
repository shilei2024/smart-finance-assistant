// 简单的开发启动脚本
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 启动智能记账助手后端服务...');

// 设置环境变量
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

// 导入并启动NestJS应用
require('ts-node/register');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./src/app.module');

async function bootstrap() {
  try {
    console.log('📦 正在启动应用...');
    const app = await NestFactory.create(AppModule);
    
    // 启用CORS
    app.enableCors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    });
    
    // 设置全局前缀
    app.setGlobalPrefix('api/v1');
    
    await app.listen(3000);
    console.log('✅ 服务已成功启动！');
    console.log('🌐 访问地址: http://localhost:3000');
    console.log('📚 API文档: http://localhost:3000/api/docs');
    console.log('🏥 健康检查: http://localhost:3000/api/v1/health');
  } catch (error) {
    console.error('❌ 启动失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

bootstrap();