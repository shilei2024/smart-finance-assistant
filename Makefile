# ============================================
# 智能记账助手 - Makefile
# ============================================

.PHONY: help install dev build test lint clean docker-up docker-down db-migrate db-seed

# 显示帮助信息
help:
	@echo "智能记账助手 - 开发命令"
	@echo ""
	@echo "可用命令:"
	@echo "  make install     安装所有依赖"
	@echo "  make dev         启动开发环境"
	@echo "  make build       构建所有项目"
	@echo "  make test        运行所有测试"
	@echo "  make lint        运行代码检查"
	@echo "  make clean       清理构建文件"
	@echo "  make docker-up   启动Docker服务"
	@echo "  make docker-down 停止Docker服务"
	@echo "  make db-migrate  运行数据库迁移"
	@echo "  make db-seed     运行数据种子"
	@echo ""

# 安装依赖
install:
	@echo "📦 安装依赖..."
	pnpm install
	@echo "✅ 依赖安装完成"

# 启动开发环境
dev:
	@echo "🚀 启动开发环境..."
	pnpm run dev

# 构建所有项目
build:
	@echo "🔨 构建所有项目..."
	pnpm run build
	@echo "✅ 构建完成"

# 运行测试
test:
	@echo "🧪 运行测试..."
	pnpm run test
	@echo "✅ 测试完成"

# 运行代码检查
lint:
	@echo "🔍 运行代码检查..."
	pnpm run lint
	@echo "✅ 代码检查完成"

# 清理构建文件
clean:
	@echo "🧹 清理构建文件..."
	rm -rf client/dist
	rm -rf server/dist
	rm -rf mobile/build
	rm -rf coverage
	@echo "✅ 清理完成"

# 启动Docker服务
docker-up:
	@echo "🐳 启动Docker服务..."
	pnpm run docker:up
	@echo "✅ Docker服务已启动"

# 停止Docker服务
docker-down:
	@echo "🐳 停止Docker服务..."
	pnpm run docker:down
	@echo "✅ Docker服务已停止"

# 运行数据库迁移
db-migrate:
	@echo "🗄️  运行数据库迁移..."
	pnpm run db:migrate
	@echo "✅ 数据库迁移完成"

# 运行数据种子
db-seed:
	@echo "🌱 运行数据种子..."
	pnpm run db:seed
	@echo "✅ 数据种子完成"

# 重置数据库
db-reset:
	@echo "🔄 重置数据库..."
	pnpm run db:reset
	@echo "✅ 数据库重置完成"

# 格式化代码
format:
	@echo "🎨 格式化代码..."
	pnpm exec prettier --write "**/*.{ts,tsx,js,jsx,json,md,yml,yaml,css,scss,less}"
	@echo "✅ 代码格式化完成"

# 类型检查
type-check:
	@echo "🔍 运行类型检查..."
	pnpm run type-check
	@echo "✅ 类型检查完成"

# 安全审计
audit:
	@echo "🔒 运行安全审计..."
	pnpm audit
	@echo "✅ 安全审计完成"
