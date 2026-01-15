# 启动后端服务脚本
cd d:\Cursor-Project\jizhang\server

Write-Host "检查后端服务..." -ForegroundColor Cyan

# 检查是否已运行
$port = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "后端服务已在运行 (端口 3000)" -ForegroundColor Green
    exit 0
}

# 检查构建文件
if (-not (Test-Path dist\main.js)) {
    Write-Host "构建文件不存在，正在构建..." -ForegroundColor Yellow
    pnpm build
    if (-not (Test-Path dist\main.js)) {
        Write-Host "构建失败！" -ForegroundColor Red
        exit 1
    }
}

# 检查环境变量
if (-not (Test-Path .env)) {
    Write-Host "环境变量文件不存在，创建默认配置..." -ForegroundColor Yellow
    @"
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://admin:password@localhost:5432/smart_finance
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redispass
JWT_SECRET=production-jwt-secret-key-change-in-production-min-32-chars-12345
JWT_REFRESH_SECRET=production-refresh-secret-key-change-in-production-min-32-chars-12345
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
"@ | Out-File -FilePath .env -Encoding utf8
}

Write-Host "启动后端服务..." -ForegroundColor Green
$env:NODE_ENV = "production"
node dist/main.js

