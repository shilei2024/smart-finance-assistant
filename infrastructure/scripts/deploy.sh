#!/bin/bash

# 智能记账助手部署脚本
# 使用方法: ./deploy.sh [environment]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 显示帮助
show_help() {
    echo "智能记账助手部署脚本"
    echo ""
    echo "使用方法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示帮助信息"
    echo "  -e, --environment   部署环境 (development, staging, production)"
    echo "  -c, --clean         清理旧的Docker资源"
    echo "  -b, --build         重新构建镜像"
    echo "  -d, --database      运行数据库迁移"
    echo "  -s, --seed          运行数据种子"
    echo ""
    echo "示例:"
    echo "  $0 -e development -b -d  # 开发环境部署，包含构建和数据库迁移"
    echo "  $0 -e production -c      # 生产环境部署，清理旧资源"
}

# 默认参数
ENVIRONMENT="development"
CLEAN=false
BUILD=false
DATABASE=false
SEED=false

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -b|--build)
            BUILD=true
            shift
            ;;
        -d|--database)
            DATABASE=true
            shift
            ;;
        -s|--seed)
            SEED=true
            shift
            ;;
        *)
            log_error "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
done

# 验证环境
case $ENVIRONMENT in
    development|staging|production)
        log_info "部署环境: $ENVIRONMENT"
        ;;
    *)
        log_error "无效的环境: $ENVIRONMENT"
        log_error "可用环境: development, staging, production"
        exit 1
        ;;
esac

# 检查必要命令
check_command docker
check_command docker-compose

# 设置环境变量
export NODE_ENV=$ENVIRONMENT
export COMPOSE_PROJECT_NAME="smart-finance-$ENVIRONMENT"

# 根据环境选择配置文件
COMPOSE_FILE="docker-compose.yml"
if [[ "$ENVIRONMENT" == "production" ]]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

COMPOSE_PATH="./infrastructure/$COMPOSE_FILE"

if [[ ! -f "$COMPOSE_PATH" ]]; then
    log_error "Docker Compose文件不存在: $COMPOSE_PATH"
    exit 1
fi

# 清理旧资源
if [[ "$CLEAN" == true ]]; then
    log_info "清理旧的Docker资源..."
    docker-compose -f "$COMPOSE_PATH" down -v --remove-orphans
    log_success "清理完成"
fi

# 构建镜像
if [[ "$BUILD" == true ]]; then
    log_info "构建Docker镜像..."
    docker-compose -f "$COMPOSE_PATH" build
    log_success "构建完成"
fi

# 启动服务
log_info "启动服务..."
docker-compose -f "$COMPOSE_PATH" up -d

# 等待服务启动
log_info "等待服务启动..."
sleep 10

# 检查服务状态
log_info "检查服务状态..."
if docker-compose -f "$COMPOSE_PATH" ps | grep -q "Up"; then
    log_success "所有服务已启动"
else
    log_error "部分服务启动失败"
    docker-compose -f "$COMPOSE_PATH" ps
    exit 1
fi

# 数据库迁移
if [[ "$DATABASE" == true ]]; then
    log_info "运行数据库迁移..."
    
    # 等待数据库就绪
    log_info "等待数据库就绪..."
    for i in {1..30}; do
        if docker-compose -f "$COMPOSE_PATH" exec -T postgres pg_isready -U admin; then
            log_success "数据库已就绪"
            break
        fi
        if [[ $i -eq 30 ]]; then
            log_error "数据库启动超时"
            exit 1
        fi
        sleep 2
    done
    
    # 运行迁移
    docker-compose -f "$COMPOSE_PATH" exec -T backend npm run db:migrate
    log_success "数据库迁移完成"
fi

# 数据种子
if [[ "$SEED" == true ]]; then
    log_info "运行数据种子..."
    docker-compose -f "$COMPOSE_PATH" exec -T backend npm run db:seed
    log_success "数据种子完成"
fi

# 显示部署信息
log_info "部署完成！"
echo ""
echo "📊 部署信息:"
echo "   环境: $ENVIRONMENT"
echo "   项目: $COMPOSE_PROJECT_NAME"
echo ""
echo "🌐 服务地址:"
echo "   前端: http://localhost:5173"
echo "   后端API: http://localhost:3000"
echo "   API文档: http://localhost:3000/api/docs"
echo ""
echo "🛠️  管理工具:"
echo "   数据库管理: http://localhost:5050"
echo "   Redis管理: http://localhost:5540"
echo "   MinIO控制台: http://localhost:9001"
echo ""
echo "📋 常用命令:"
echo "   查看日志: docker-compose -f $COMPOSE_PATH logs -f"
echo "   停止服务: docker-compose -f $COMPOSE_PATH down"
echo "   重启服务: docker-compose -f $COMPOSE_PATH restart"
echo "   查看状态: docker-compose -f $COMPOSE_PATH ps"
echo ""
echo "🔍 健康检查:"
echo "   应用健康: curl http://localhost:3000/health"
echo "   前端健康: curl http://localhost:5173/health"
echo ""
log_success "部署脚本执行完成！"
