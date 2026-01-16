#!/bin/bash

# 智能记账助手 - 生产环境部署脚本
# 使用方法: ./deploy-production.sh [--rollback]

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
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost:30080/health &> /dev/null; then
            log_success "健康检查通过"
            return 0
        fi
        
        attempt=$((attempt + 1))
        log_info "等待服务启动... ($attempt/$max_attempts)"
        sleep 2
    done
    
    log_error "健康检查失败"
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
    
    # 备份当前版本
    backup_current
    
    # 进入项目目录
    cd "$PROJECT_DIR"
    
    # 拉取最新代码
    log_info "拉取最新代码..."
    git fetch origin
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    git checkout main
    git pull origin main
    
    # 进入基础设施目录
    cd "$PROJECT_DIR/infrastructure"
    
    # 构建新镜像
    log_info "构建Docker镜像..."
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" build
    
    # 运行数据库迁移
    log_info "运行数据库迁移..."
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d postgres redis
    sleep 10
    
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" exec -T backend npm run db:migrate || {
        log_error "数据库迁移失败"
        rollback
        exit 1
    }
    
    # 滚动更新服务
    log_info "更新服务..."
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --no-deps --build backend
    sleep 5
    docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --no-deps --build frontend
    
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
    if [ "$1" == "--rollback" ]; then
        rollback
    else
        deploy
    fi
}

# 执行
main "$@"
