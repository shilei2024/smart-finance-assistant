# 智能记账助手 - 服务状态检查脚本
# 使用方法: .\check-services.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "智能记账助手 - 服务状态检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$services = @()

# 检查后端服务
Write-Host "🔍 检查后端服务 (端口 3000)..." -ForegroundColor Yellow
$backendPort = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($backendPort) {
    $backendProcess = Get-Process -Id $backendPort.OwningProcess -ErrorAction SilentlyContinue
    Write-Host "✅ 后端服务正在运行" -ForegroundColor Green
    Write-Host "   进程ID: $($backendPort.OwningProcess)" -ForegroundColor White
    Write-Host "   进程名: $($backendProcess.ProcessName)" -ForegroundColor White
    Write-Host "   访问地址: http://localhost:3000/api/v1" -ForegroundColor White
    
    # 测试API是否响应
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "   API状态: ✅ 正常响应" -ForegroundColor Green
        $services += @{Name="后端服务"; Status="运行中"; Port=3000; Health="正常"}
    } catch {
        Write-Host "   API状态: ⚠️  无响应（可能正在启动）" -ForegroundColor Yellow
        $services += @{Name="后端服务"; Status="启动中"; Port=3000; Health="检查中"}
    }
} else {
    Write-Host "❌ 后端服务未运行" -ForegroundColor Red
    Write-Host "   启动命令: cd server; pnpm start:dev" -ForegroundColor Yellow
    $services += @{Name="后端服务"; Status="未运行"; Port=3000; Health="未启动"}
}

Write-Host ""

# 检查前端服务
Write-Host "🔍 检查前端服务 (端口 5173)..." -ForegroundColor Yellow
$frontendPort = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontendPort) {
    $frontendProcess = Get-Process -Id $frontendPort.OwningProcess -ErrorAction SilentlyContinue
    Write-Host "✅ 前端服务正在运行" -ForegroundColor Green
    Write-Host "   进程ID: $($frontendPort.OwningProcess)" -ForegroundColor White
    Write-Host "   进程名: $($frontendProcess.ProcessName)" -ForegroundColor White
    Write-Host "   访问地址: http://localhost:5173" -ForegroundColor White
    
    # 测试前端是否响应
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "   前端状态: ✅ 正常响应" -ForegroundColor Green
        $services += @{Name="前端服务"; Status="运行中"; Port=5173; Health="正常"}
    } catch {
        Write-Host "   前端状态: ⚠️  无响应（可能正在启动）" -ForegroundColor Yellow
        $services += @{Name="前端服务"; Status="启动中"; Port=5173; Health="检查中"}
    }
} else {
    Write-Host "❌ 前端服务未运行" -ForegroundColor Red
    Write-Host "   启动命令: cd client; pnpm dev" -ForegroundColor Yellow
    $services += @{Name="前端服务"; Status="未运行"; Port=5173; Health="未启动"}
}

Write-Host ""

# 检查数据库服务
Write-Host "🔍 检查数据库服务..." -ForegroundColor Yellow

# 检查Docker PostgreSQL
try {
    $postgresContainer = docker ps --filter "name=smart-finance-postgres" --format "{{.Names}}" 2>$null
    if ($postgresContainer) {
        Write-Host "✅ PostgreSQL 容器正在运行" -ForegroundColor Green
        $services += @{Name="PostgreSQL"; Status="运行中"; Port=5432; Health="正常"}
    } else {
        Write-Host "❌ PostgreSQL 容器未运行" -ForegroundColor Red
        Write-Host "   启动命令: cd infrastructure; docker-compose up -d postgres" -ForegroundColor Yellow
        $services += @{Name="PostgreSQL"; Status="未运行"; Port=5432; Health="未启动"}
    }
} catch {
    Write-Host "⚠️  无法检查Docker容器（Docker可能未安装或未运行）" -ForegroundColor Yellow
    $services += @{Name="PostgreSQL"; Status="未知"; Port=5432; Health="无法检查"}
}

# 检查Redis
try {
    $redisContainer = docker ps --filter "name=smart-finance-redis" --format "{{.Names}}" 2>$null
    if ($redisContainer) {
        Write-Host "✅ Redis 容器正在运行" -ForegroundColor Green
        $services += @{Name="Redis"; Status="运行中"; Port=6379; Health="正常"}
    } else {
        Write-Host "❌ Redis 容器未运行" -ForegroundColor Red
        Write-Host "   启动命令: cd infrastructure; docker-compose up -d redis" -ForegroundColor Yellow
        $services += @{Name="Redis"; Status="未运行"; Port=6379; Health="未启动"}
    }
} catch {
    Write-Host "⚠️  无法检查Redis容器" -ForegroundColor Yellow
    $services += @{Name="Redis"; Status="未知"; Port=6379; Health="无法检查"}
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "服务状态总结" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($service in $services) {
    $statusColor = switch ($service.Status) {
        "运行中" { "Green" }
        "启动中" { "Yellow" }
        "未运行" { "Red" }
        default { "Gray" }
    }
    
    Write-Host "$($service.Name): " -NoNewline
    Write-Host "$($service.Status)" -ForegroundColor $statusColor -NoNewline
    Write-Host " (端口: $($service.Port), 健康: $($service.Health))"
}

Write-Host ""

# 显示未运行的服务
$notRunning = $services | Where-Object { $_.Status -eq "未运行" }
if ($notRunning.Count -gt 0) {
    Write-Host "⚠️  以下服务未运行，需要启动:" -ForegroundColor Yellow
    Write-Host ""
    foreach ($service in $notRunning) {
        Write-Host "   - $($service.Name)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "启动方法:" -ForegroundColor Cyan
    Write-Host "   1. 运行启动脚本: .\start-project.ps1" -ForegroundColor White
    Write-Host "   2. 或手动启动各个服务（见上方命令）" -ForegroundColor White
} else {
    Write-Host "✅ 所有服务都在运行！" -ForegroundColor Green
}

Write-Host ""

