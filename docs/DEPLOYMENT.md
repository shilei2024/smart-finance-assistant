# 智能记账助手 - 部署文档

## 📋 目录

1. [端口映射说明](#端口映射说明)
2. [服务器环境准备](#服务器环境准备)
3. [项目部署流程](#项目部署流程)
4. [环境变量配置](#环境变量配置)
5. [数据库初始化](#数据库初始化)
6. [域名和SSL配置](#域名和ssl配置)
7. [后续开发流程](#后续开发流程)
8. [监控和维护](#监控和维护)
9. [故障排查](#故障排查)

> 💡 **提示**：详细的端口映射说明请查看 [端口映射文档](./PORT_MAPPING.md)

---

## 🔌 端口映射说明

为了避免与华为云服务器上其他应用冲突，本项目使用了非标准端口映射：

| 服务 | 容器内部端口 | 外部映射端口 | 说明 |
|------|------------|------------|------|
| 后端API | 3000 | **30080** | 后端服务端口 |
| 前端应用 | 80/5173 | **30081** | 前端服务端口 |
| PostgreSQL | 5432 | **15432** | 数据库端口 |
| Redis | 6379 | **16379** | 缓存端口 |
| MinIO API | 9000 | **19000** | 对象存储API |
| MinIO Console | 9001 | **19001** | 对象存储控制台 |
| PgAdmin | 80 | **15050** | 数据库管理工具 |
| RedisInsight | 5540 | **15540** | Redis管理工具 |
| Prometheus | 9090 | **19090** | 监控服务 |
| Grafana | 3000 | **13001** | 监控面板 |
| Traefik HTTP | 80 | **30082** | 反向代理（开发环境） |
| Traefik HTTPS | 443 | **30083** | 反向代理（开发环境） |
| Traefik Dashboard | 8080 | **30084** | 反向代理面板 |

**重要提示：**
- 容器内部端口保持不变（如后端仍使用3000）
- 外部访问使用映射端口（如后端访问使用30080）
- 容器间通信使用服务名和内部端口（如 `postgres:5432`）
- 从宿主机访问使用外部映射端口（如 `localhost:30080`）

---

## 🖥️ 服务器环境准备

### 1. 华为云服务器要求

**最低配置：**
- CPU: 2核
- 内存: 4GB
- 硬盘: 40GB SSD
- 操作系统: Ubuntu 22.04 LTS 或 CentOS 7+

**推荐配置：**
- CPU: 4核
- 内存: 8GB
- 硬盘: 100GB SSD
- 操作系统: Ubuntu 22.04 LTS

### 2. 服务器初始化

#### 2.1 连接服务器

```bash
# 使用SSH连接服务器
ssh root@your-server-ip
```

#### 2.2 更新系统

```bash
# Ubuntu
sudo apt update && sudo apt upgrade -y

# CentOS
sudo yum update -y
```

#### 2.3 安装必要软件

```bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 2.4 配置防火墙

```bash
# Ubuntu (UFW)
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 30080/tcp   # 后端API
sudo ufw allow 30081/tcp   # 前端应用
sudo ufw allow 15432/tcp   # PostgreSQL（如需要外部访问）
sudo ufw allow 16379/tcp   # Redis（如需要外部访问）
sudo ufw allow 19000/tcp   # MinIO API（如需要外部访问）
sudo ufw allow 19001/tcp   # MinIO Console（如需要外部访问）
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=30080/tcp
sudo firewall-cmd --permanent --add-port=30081/tcp
sudo firewall-cmd --permanent --add-port=15432/tcp
sudo firewall-cmd --permanent --add-port=16379/tcp
sudo firewall-cmd --permanent --add-port=19000/tcp
sudo firewall-cmd --permanent --add-port=19001/tcp
sudo firewall-cmd --reload
```

**端口说明：**
- `30080`: 后端API服务端口
- `30081`: 前端应用端口
- `15432`: PostgreSQL数据库端口（容器内部仍为5432）
- `16379`: Redis缓存端口（容器内部仍为6379）
- `19000`: MinIO API端口（容器内部仍为9000）
- `19001`: MinIO控制台端口（容器内部仍为9001）

#### 2.5 创建部署用户（可选，推荐）

```bash
# 创建非root用户
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy

# 切换到部署用户
su - deploy
```

---

## 🚀 项目部署流程

### 1. 克隆项目到服务器

```bash
# 创建项目目录
mkdir -p /opt/smart-finance
cd /opt/smart-finance

# 克隆项目（使用Git）
git clone https://github.com/your-org/smart-finance-assistant.git .

# 或者上传项目文件
# 使用scp或FTP工具上传项目文件
```

### 2. 配置环境变量

```bash
# 进入项目目录
cd /opt/smart-finance

# 创建生产环境变量文件
cp .env.example .env.production

# 编辑环境变量
nano .env.production
```

**必需的环境变量：**

```env
# 应用配置
NODE_ENV=production
APP_NAME=smart-finance-assistant
APP_PORT=3000
# 注意：容器内部端口为3000，外部映射为30080
APP_URL=https://your-domain.com

# 数据库配置
POSTGRES_USER=smart_finance_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=smart_finance
# 容器内部连接（Docker Compose环境）
DATABASE_URL=postgresql://smart_finance_user:your_secure_password_here@postgres:5432/smart_finance
# 外部连接（从宿主机连接）
# DATABASE_URL=postgresql://smart_finance_user:your_secure_password_here@localhost:15432/smart_finance

# Redis配置
REDIS_HOST=redis
# 容器内部端口为6379，外部映射为16379
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_here

# JWT配置
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_min_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# AI服务配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# MinIO配置（可选）
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET=smart-finance

# 邮件配置（可选）
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password

# 监控配置（可选）
SENTRY_DSN=your_sentry_dsn
```

### 3. 生成密钥

```bash
# 生成JWT密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 生成数据库密码
openssl rand -base64 32
```

### 4. 构建和启动服务

```bash
# 进入基础设施目录
cd infrastructure

# 使用生产环境配置启动
docker-compose -f docker-compose.prod.yml --env-file ../.env.production up -d --build

# 或者使用部署脚本
chmod +x scripts/deploy.sh
./scripts/deploy.sh -e production -b -d
```

### 5. 运行数据库迁移

```bash
# 等待数据库启动
sleep 10

# 运行数据库迁移
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate

# 运行数据种子（可选）
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed
```

### 6. 验证部署

```bash
# 检查服务状态
docker-compose -f docker-compose.prod.yml ps

# 检查后端健康
curl http://localhost:30080/health

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🔐 环境变量配置

### 生产环境变量文件位置

```
/opt/smart-finance/.env.production
```

### 安全建议

1. **不要将 `.env.production` 提交到Git**
2. **使用强密码**（至少32个字符）
3. **定期轮换密钥**
4. **限制文件权限**：`chmod 600 .env.production`

---

## 🗄️ 数据库初始化

### 1. 数据库迁移

```bash
# 进入后端容器
docker-compose -f docker-compose.prod.yml exec backend sh

# 运行迁移
npm run db:migrate

# 退出容器
exit
```

### 2. 初始化数据（可选）

```bash
# 运行种子数据
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed
```

### 3. 数据库备份

```bash
# 创建备份脚本
cat > /opt/smart-finance/scripts/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/smart-finance/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose -f /opt/smart-finance/infrastructure/docker-compose.prod.yml exec -T postgres pg_dump -U smart_finance_user smart_finance > $BACKUP_DIR/backup_$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/smart-finance/scripts/backup-db.sh

# 设置定时备份（每天凌晨2点）
crontab -e
# 添加以下行：
0 2 * * * /opt/smart-finance/scripts/backup-db.sh
```

---

## 🌐 域名和SSL配置

### 1. 配置Nginx反向代理

创建Nginx配置文件：

```bash
sudo nano /etc/nginx/sites-available/smart-finance
```

配置内容：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 前端（如果使用Docker，映射到30081端口）
    location / {
        proxy_pass http://localhost:30081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:30080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/smart-finance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. 安装SSL证书（Let's Encrypt）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 💻 后续开发流程

### 1. Git工作流

#### 分支策略

```
main/master     - 生产环境代码（稳定版本）
develop         - 开发环境代码（最新功能）
feature/*       - 功能分支
hotfix/*        - 紧急修复分支
release/*       - 发布分支
```

#### 开发流程

```bash
# 1. 从develop创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 开发功能
# ... 编写代码 ...

# 3. 提交代码
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature

# 4. 创建Pull Request到develop分支
# 在GitHub/GitLab上创建PR，代码审查后合并

# 5. 发布到生产环境
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
# 测试通过后合并到main
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
```

### 2. 本地开发环境

```bash
# 克隆项目
git clone https://github.com/your-org/smart-finance-assistant.git
cd smart-finance-assistant

# 安装依赖
pnpm install

# 配置本地环境变量
cp .env.example .env.local

# 启动开发环境
pnpm run dev
```

### 3. 部署新版本（不影响生产）

#### 方法1：蓝绿部署（推荐）

```bash
# 1. 在服务器上创建新版本目录
cd /opt
cp -r smart-finance smart-finance-new

# 2. 更新新版本代码
cd smart-finance-new
git pull origin main

# 3. 构建新版本
cd infrastructure
docker-compose -f docker-compose.prod.yml build

# 4. 测试新版本（使用不同端口）
# 修改docker-compose.prod.yml中的端口映射
docker-compose -f docker-compose.prod.yml up -d

# 5. 测试通过后，切换流量
# 停止旧版本
cd /opt/smart-finance/infrastructure
docker-compose -f docker-compose.prod.yml down

# 启动新版本（使用正常端口）
cd /opt/smart-finance-new/infrastructure
docker-compose -f docker-compose.prod.yml up -d

# 6. 验证新版本
curl http://localhost:30080/health

# 7. 如果一切正常，删除旧版本
rm -rf /opt/smart-finance
mv /opt/smart-finance-new /opt/smart-finance
```

#### 方法2：滚动更新

```bash
# 1. 更新代码
cd /opt/smart-finance
git pull origin main

# 2. 重新构建镜像
cd infrastructure
docker-compose -f docker-compose.prod.yml build

# 3. 滚动更新（零停机）
docker-compose -f docker-compose.prod.yml up -d --no-deps --build backend
docker-compose -f docker-compose.prod.yml up -d --no-deps --build frontend

# 4. 验证
docker-compose -f docker-compose.prod.yml ps
```

### 4. 自动化部署脚本

创建部署脚本：

```bash
cat > /opt/smart-finance/scripts/deploy-production.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 开始部署..."

# 1. 备份当前版本
BACKUP_DIR="/opt/smart-finance-backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r /opt/smart-finance $BACKUP_DIR

# 2. 拉取最新代码
cd /opt/smart-finance
git fetch origin
git checkout main
git pull origin main

# 3. 更新环境变量（如果需要）
# 手动检查 .env.production 是否需要更新

# 4. 构建新镜像
cd infrastructure
docker-compose -f docker-compose.prod.yml build

# 5. 运行数据库迁移
docker-compose -f docker-compose.prod.yml exec -T backend npm run db:migrate

# 6. 滚动更新服务
docker-compose -f docker-compose.prod.yml up -d --no-deps --build backend
sleep 5
docker-compose -f docker-compose.prod.yml up -d --no-deps --build frontend

# 7. 健康检查
sleep 10
if curl -f http://localhost:30080/health; then
    echo "✅ 部署成功！"
else
    echo "❌ 部署失败，回滚..."
    # 回滚逻辑
    exit 1
fi
EOF

chmod +x /opt/smart-finance/scripts/deploy-production.sh
```

---

## 📊 监控和维护

### 1. 日志管理

```bash
# 查看所有服务日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# 查看最近100行日志
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

### 2. 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h
docker system df
```

### 3. 定期维护任务

创建维护脚本：

```bash
cat > /opt/smart-finance/scripts/maintenance.sh << 'EOF'
#!/bin/bash
# 每周维护任务

# 1. 清理未使用的Docker资源
docker system prune -f

# 2. 清理旧日志
find /var/lib/docker/containers -name "*.log" -mtime +7 -delete

# 3. 数据库备份（已在crontab中配置）

# 4. 检查磁盘空间
df -h | awk '$5 > 80 {print "警告: 磁盘使用率超过80%"}'
EOF

chmod +x /opt/smart-finance/scripts/maintenance.sh

# 设置每周执行
crontab -e
# 添加：0 3 * * 0 /opt/smart-finance/scripts/maintenance.sh
```

---

## 🔧 故障排查

### 常见问题

#### 1. 服务无法启动

```bash
# 检查日志
docker-compose -f docker-compose.prod.yml logs backend

# 检查端口占用
netstat -tulpn | grep 30080
netstat -tulpn | grep 30081

# 检查容器状态
docker-compose -f docker-compose.prod.yml ps
```

#### 2. 数据库连接失败

```bash
# 检查数据库容器
docker-compose -f docker-compose.prod.yml ps postgres

# 测试数据库连接
docker-compose -f docker-compose.prod.yml exec postgres psql -U smart_finance_user -d smart_finance -c "SELECT 1;"
```

#### 3. 内存不足

```bash
# 查看内存使用
free -h

# 清理Docker缓存
docker system prune -a --volumes
```

---

## 📝 检查清单

部署前检查：

- [ ] 服务器配置满足要求
- [ ] Docker和Docker Compose已安装
- [ ] 防火墙规则已配置
- [ ] 环境变量已正确配置
- [ ] 数据库密码已设置
- [ ] JWT密钥已生成
- [ ] SSL证书已配置（如果使用HTTPS）
- [ ] 域名DNS已解析
- [ ] 备份脚本已配置

部署后检查：

- [ ] 所有服务正常运行
- [ ] 健康检查通过（http://localhost:30080/health）
- [ ] 数据库迁移成功
- [ ] 前端可以访问（http://localhost:30081）
- [ ] API可以访问（http://localhost:30080/api/v1/health）
- [ ] 日志正常输出
- [ ] 监控正常
- [ ] 防火墙端口已开放（30080, 30081等）

---

## 🆘 获取帮助

如遇到问题，请：

1. 查看日志文件
2. 检查环境变量配置
3. 查看本文档的故障排查部分
4. 联系技术支持

---

**最后更新：** 2024-01-15
