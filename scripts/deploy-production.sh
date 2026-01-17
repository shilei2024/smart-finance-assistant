#!/bin/bash

# 智能记账助手 - 生产环境部署脚本
# 使用方法: 
#   ./deploy-production.sh              # 默认部署（会从GitHub拉取代码）
#   ./deploy-production.sh --no-pull    # 跳过Git拉取（直接使用本地代码）
#   ./deploy-production.sh --rollback   # 回滚到上一个版本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
PROJECT_DIR="/opt/smart-finance"
BACKUP_DIR="/opt/smart-finance-backups"
COMPOSE_FILE="$PROJECT_DIR/infrastructure/docker-compose.prod.yml"
ENV_FILE="$PROJECT_DIR/.env.production"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装"
        exit 1
    fi
}

# 检查文件
check_file() {
    if [ ! -f "$1" ]; then
        log_error "文件不存在: $1"
        exit 1
    fi
}

# 备份当前版本
backup_current() {
    log_info "备份当前版本..."
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    cp -r "$PROJECT_DIR" "$BACKUP_PATH"
    log_success "备份完成: $BACKUP_PATH"
    echo "$BACKUP_PATH" > "$BACKUP_DIR/latest_backup.txt"
}

# 回滚到上一个版本
rollback() {
    log_warning "开始回滚..."
    
    if [ ! -f "$BACKUP_DIR/latest_backup.txt" ]; then
        log_error "未找到备份文件"
        exit 1
    fi
    
    LATEST_BACKUP=$(cat "$BACKUP_DIR/latest_backup.txt")
    
    if [ ! -d "$LATEST_BACKUP" ]; then
        log_error "备份目录不存在: $LATEST_BACKUP"
        exit 1
    fi
    
    log_info "停止当前服务..."
    cd "$PROJECT_DIR/infrastructure"
    docker-compose -f docker-compose.prod.yml down
    
    log_info "恢复备份..."
    rm -rf "$PROJECT_DIR"
    cp -r "$LATEST_BACKUP" "$PROJECT_DIR"
    
    log_info "启动服务..."
    cd "$PROJECT_DIR/infrastructure"
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d
    
    log_success "回滚完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    max_attempts=60
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        # 检查nginx是否运行
        if docker ps --format '{{.Names}}' | grep -q "smart-finance-nginx-prod"; then
            # 检查健康端点
            if curl -f http://localhost:8080/api/v1/health &> /dev/null; then
                log_success "健康检查通过"
                return 0
            fi
        else
            log_info "等待nginx启动..."
        fi
        
        attempt=$((attempt + 1))
        log_info "等待服务启动... ($attempt/$max_attempts)"
        sleep 2
    done
    
    log_error "健康检查失败"
    log_info "当前容器状态:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps 2>/dev/null || true
    return 1
}

# 主部署流程
deploy() {
    log_info "开始部署..."
    
    # 检查必要命令
    check_command docker
    check_command docker-compose
    check_command git
    check_command curl
    
    # 检查文件
    check_file "$COMPOSE_FILE"
    check_file "$ENV_FILE"
    
    # 检查必需的环境变量
    log_info "检查环境变量配置..."
    source "$ENV_FILE" 2>/dev/null || true
    
    # 检查JWT_SECRET
    if [ -z "$JWT_SECRET" ]; then
        log_error "JWT_SECRET 未配置，请修改 .env.production 文件"
        exit 1
    fi
    
    # 检查JWT_REFRESH_SECRET
    if [ -z "$JWT_REFRESH_SECRET" ]; then
        log_error "JWT_REFRESH_SECRET 未配置，请修改 .env.production 文件"
        exit 1
    fi
    
    # 检查其他关键环境变量，但允许使用默认值
    if [ -z "$DEEPSEEK_API_KEY" ] || [ "$DEEPSEEK_API_KEY" == "your_deepseek_api_key_here" ]; then
        log_warning "DEEPSEEK_API_KEY 未配置或使用默认值，AI功能将不可用"
    fi
    
    if [ -z "$SENTRY_DSN" ] || [ "$SENTRY_DSN" == "your_sentry_dsn_here" ]; then
        log_warning "SENTRY_DSN 未配置或使用默认值，错误监控将不可用"
    fi
    
    log_success "环境变量检查通过"
    
    # 备份当前版本
    backup_current
    
    # 进入项目目录
    cd "$PROJECT_DIR"
    
    # 根据参数决定是否拉取代码
    if [ "$1" != "--no-pull" ]; then
        # 拉取最新代码
        log_info "拉取最新代码..."
        git fetch origin
        CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
        git checkout main
        
        # 检查是否有本地修改
        if ! git diff-index --quiet HEAD --; then
            log_warning "检测到本地修改，将暂存这些修改..."
            git stash save "Deployment local changes $(date +%Y%m%d_%H%M%S)"
        fi
        
        # 拉取最新代码
        git pull origin main || {
            log_error "拉取代码失败"
            exit 1
        }
    else
        log_info "跳过Git拉取，使用本地代码进行部署..."
    fi
    
    # 进入基础设施目录
    cd "$PROJECT_DIR/infrastructure"
    
    # 构建新镜像
    log_info "构建Docker镜像..."
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" build
    
    # 启动数据库服务
    log_info "启动数据库服务..."
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d postgres redis
    sleep 15
    
    # 运行数据库迁移（使用临时容器或已存在的backend容器）
    log_info "运行数据库迁移..."
    
    # 尝试使用已存在的backend容器执行迁移
    if docker ps -a --format '{{.Names}}' | grep -q "smart-finance-backend-prod"; then
        # 如果backend容器存在，先启动它
        docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d backend
        sleep 10
        
        # 等待backend健康检查通过
        max_attempts=30
        attempt=0
        while [ $attempt -lt $max_attempts ]; do
            if docker exec smart-finance-backend-prod wget --spider -q http://localhost:3000/api/v1/health 2>/dev/null; then
                log_success "Backend服务已就绪"
                break
            fi
            attempt=$((attempt + 1))
            sleep 2
        done
    else
        # 如果backend容器不存在，先创建并启动它（仅用于迁移）
        docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --build backend
        sleep 20
        
        # 等待backend健康检查通过
        max_attempts=40
        attempt=0
        while [ $attempt -lt $max_attempts ]; do
            if docker exec smart-finance-backend-prod wget --spider -q http://localhost:3000/api/v1/health 2>/dev/null; then
                log_success "Backend服务已就绪"
                break
            fi
            attempt=$((attempt + 1))
            log_info "等待Backend服务启动... ($attempt/$max_attempts)"
            sleep 2
        done
    fi
    
    # 执行数据库迁移
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" exec -T backend npm run db:migrate || {
        log_warning "数据库迁移失败，尝试使用npx prisma migrate deploy..."
        docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" exec -T backend npx prisma migrate deploy || {
            log_error "数据库迁移失败"
            rollback
            exit 1
        }
    }
    log_success "数据库迁移完成"
    
    # 滚动更新服务
    log_info "更新服务..."
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --no-deps --build backend
    sleep 10
    
    # 等待backend健康
    log_info "等待backend服务就绪..."
    backend_healthy=false
    for i in {1..30}; do
        if docker ps --format '{{.Names}} {{.Status}}' | grep "smart-finance-backend-prod" | grep -q "healthy"; then
            log_success "Backend服务已就绪"
            backend_healthy=true
            break
        fi
        sleep 2
    done
    
    if [ "$backend_healthy" != "true" ]; then
        log_warning "Backend服务健康检查超时，继续部署..."
    fi
    
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --no-deps --build frontend
    sleep 10
    
    # 启动nginx和其他服务
    log_info "启动完整服务栈..."
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d
    
    # 健康检查
    if health_check; then
        log_success "部署成功！"
        
        # 显示服务状态
        echo ""
        log_info "服务状态:"
        docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" ps
        
        # 清理旧备份（保留最近5个）
        log_info "清理旧备份..."
        ls -t "$BACKUP_DIR" | tail -n +6 | xargs -I {} rm -rf "$BACKUP_DIR/{}"
        
    else
        log_error "部署失败，开始回滚..."
        rollback
        exit 1
    fi
}

# 主函数
main() {
    case "$1" in
        --rollback)
            rollback
            ;;
        --no-pull)
            deploy "--no-pull"
            ;;
        *)
            deploy
            ;;
    esac
}

# 执行
main "$@"
