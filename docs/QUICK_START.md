# 快速部署指南

## 🚀 华为云服务器部署 - 5分钟快速开始

### 第一步：服务器初始化（首次部署）

```bash
# 1. 连接服务器
ssh root@your-server-ip

# 2. 运行初始化脚本
wget https://raw.githubusercontent.com/your-org/smart-finance-assistant/main/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh

# 3. 重新登录（使Docker组权限生效）
exit
ssh root@your-server-ip
```

### 第二步：上传项目

```bash
# 方法1: 使用Git（推荐）
cd /opt/smart-finance
git clone https://github.com/your-org/smart-finance-assistant.git .

# 方法2: 使用scp上传
# 在本地执行：
scp -r ./jizhang root@your-server-ip:/opt/smart-finance
```

### 第三步：配置环境变量

```bash
cd /opt/smart-finance

# 复制示例文件
cp .env.production.example .env.production

# 编辑配置
nano .env.production

# 必须修改的配置：
# - POSTGRES_PASSWORD: 数据库密码
# - REDIS_PASSWORD: Redis密码
# - JWT_SECRET: JWT密钥（使用 openssl rand -base64 32 生成）
# - JWT_REFRESH_SECRET: JWT刷新密钥
# - DEEPSEEK_API_KEY: DeepSeek API密钥
```

### 第四步：部署

```bash
cd /opt/smart-finance

# 给脚本添加执行权限
chmod +x scripts/*.sh

# 运行部署脚本
./scripts/deploy-production.sh
```

### 第五步：验证

```bash
# 检查服务状态
docker-compose -f infrastructure/docker-compose.prod.yml ps

# 检查健康状态
curl http://localhost:30080/health

# 查看日志
docker-compose -f infrastructure/docker-compose.prod.yml logs -f
```

---

## 🔄 更新部署（不影响生产）

### 方法1：使用部署脚本（推荐）

```bash
cd /opt/smart-finance

# 自动备份、更新、部署
./scripts/deploy-production.sh
```

### 方法2：手动更新

```bash
cd /opt/smart-finance

# 1. 备份当前版本
cp -r . ../smart-finance-backup-$(date +%Y%m%d)

# 2. 拉取最新代码
git pull origin main

# 3. 重新构建和部署
cd infrastructure
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d --no-deps --build

# 4. 运行数据库迁移
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate
```

---

## 🛠️ 常用命令

```bash
# 查看服务状态
docker-compose -f infrastructure/docker-compose.prod.yml ps

# 查看日志
docker-compose -f infrastructure/docker-compose.prod.yml logs -f backend
docker-compose -f infrastructure/docker-compose.prod.yml logs -f frontend

# 重启服务
docker-compose -f infrastructure/docker-compose.prod.yml restart backend

# 停止服务
docker-compose -f infrastructure/docker-compose.prod.yml down

# 启动服务
docker-compose -f infrastructure/docker-compose.prod.yml up -d

# 查看资源使用
docker stats

# 数据库备份
docker-compose -f infrastructure/docker-compose.prod.yml exec postgres pg_dump -U smart_finance_user smart_finance > backup.sql
```

---

## 🔙 回滚

如果部署出现问题，可以快速回滚：

```bash
cd /opt/smart-finance

# 使用部署脚本回滚
./scripts/deploy-production.sh --rollback
```

---

## 📞 需要帮助？

查看详细文档：
- [完整部署文档](./DEPLOYMENT.md)
- [开发工作流程](./DEVELOPMENT_WORKFLOW.md)
