# 智能记账助手 - 项目启动脚本
# 使用方法: .\start-project.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "智能记账助手 - 项目启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查环境变量文件
Write-Host "📋 检查环境变量配置..." -ForegroundColor Yellow

if (-not (Test-Path "server\.env")) {
    Write-Host "⚠️  server/.env 文件不存在！" -ForegroundColor Red
    Write-Host "   请创建 server/.env 文件，参考 server/.env.example" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   必需的环境变量:" -ForegroundColor Yellow
    Write-Host "   - DATABASE_URL" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET (至少32个字符)" -ForegroundColor Yellow
    Write-Host "   - JWT_REFRESH_SECRET (至少32个字符)" -ForegroundColor Yellow
    Write-Host ""
    $create = Read-Host "是否创建默认的 .env 文件? (y/n)"
    if ($create -eq "y") {
        @"
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://admin:password@localhost:5432/smart_finance
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redispass
JWT_SECRET=development-jwt-secret-key-change-in-production-min-32-chars-12345
JWT_REFRESH_SECRET=development-refresh-secret-key-change-in-production-min-32-chars-12345
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
"@ | Out-File -FilePath "server\.env" -Encoding utf8
        Write-Host "✅ 已创建 server/.env 文件" -ForegroundColor Green
    } else {
        Write-Host "❌ 无法继续，请先创建环境变量文件" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path "client\.env")) {
    Write-Host "⚠️  client/.env 文件不存在，创建默认配置..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=智能记账助手
VITE_ENABLE_AI=true
"@ | Out-File -FilePath "client\.env" -Encoding utf8
    Write-Host "✅ 已创建 client/.env 文件" -ForegroundColor Green
}

Write-Host ""

# 检查依赖
Write-Host "📦 检查项目依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  依赖未安装，正在安装..." -ForegroundColor Yellow
    pnpm install
} else {
    Write-Host "✅ 依赖已安装" -ForegroundColor Green
}

Write-Host ""

# 检查数据库服务
Write-Host "🗄️  检查数据库服务..." -ForegroundColor Yellow

# 检查Docker是否可用
$dockerAvailable = $false
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        $dockerAvailable = $true
        Write-Host "✅ Docker 可用" -ForegroundColor Green
        
        # 检查PostgreSQL容器
        $postgresRunning = docker ps --filter "name=smart-finance-postgres" --format "{{.Names}}" 2>$null
        if ($postgresRunning) {
            Write-Host "✅ PostgreSQL 容器正在运行" -ForegroundColor Green
        } else {
            Write-Host "⚠️  PostgreSQL 容器未运行" -ForegroundColor Yellow
            Write-Host "   正在启动数据库服务..." -ForegroundColor Yellow
            Set-Location infrastructure
            docker-compose up -d postgres redis
            Set-Location ..
            Start-Sleep -Seconds 5
            Write-Host "✅ 数据库服务已启动" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "⚠️  Docker 不可用，将使用本地PostgreSQL（如果已安装）" -ForegroundColor Yellow
}

Write-Host ""

# 检查端口占用
Write-Host "🔍 检查端口占用情况..." -ForegroundColor Yellow

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "⚠️  端口 3000 已被占用" -ForegroundColor Yellow
    Write-Host "   占用进程: $($port3000.OwningProcess)" -ForegroundColor Yellow
} else {
    Write-Host "✅ 端口 3000 可用" -ForegroundColor Green
}

$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host "⚠️  端口 5173 已被占用" -ForegroundColor Yellow
    Write-Host "   占用进程: $($port5173.OwningProcess)" -ForegroundColor Yellow
} else {
    Write-Host "✅ 端口 5173 可用" -ForegroundColor Green
}

Write-Host ""

# 运行数据库迁移
Write-Host "🔄 运行数据库迁移..." -ForegroundColor Yellow
Set-Location server
try {
    pnpm db:migrate
    Write-Host "✅ 数据库迁移完成" -ForegroundColor Green
} catch {
    Write-Host "⚠️  数据库迁移失败，请检查数据库连接" -ForegroundColor Red
    Write-Host "   错误: $_" -ForegroundColor Red
}
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "准备启动服务..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "将启动以下服务:" -ForegroundColor Yellow
Write-Host "1. 后端服务 (http://localhost:3000)" -ForegroundColor Cyan
Write-Host "2. 前端服务 (http://localhost:5173)" -ForegroundColor Cyan
Write-Host ""
Write-Host "提示: 服务将在新窗口中启动" -ForegroundColor Yellow
Write-Host "      请保持这些窗口打开以保持服务运行" -ForegroundColor Yellow
Write-Host ""

$start = Read-Host "是否现在启动服务? (y/n)"
if ($start -eq "y") {
    # 启动后端服务
    Write-Host "🚀 启动后端服务..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; pnpm start:dev"
    Start-Sleep -Seconds 3
    
    # 启动前端服务
    Write-Host "🚀 启动前端服务..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; pnpm dev"
    
    Write-Host ""
    Write-Host "✅ 服务启动中..." -ForegroundColor Green
    Write-Host ""
    Write-Host "访问地址:" -ForegroundColor Cyan
    Write-Host "  前端: http://localhost:5173" -ForegroundColor White
    Write-Host "  后端API: http://localhost:3000/api/v1" -ForegroundColor White
    Write-Host "  API文档: http://localhost:3000/api/docs" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "已取消启动" -ForegroundColor Yellow
}

