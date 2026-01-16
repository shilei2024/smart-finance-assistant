# 端口变更说明

## 📝 变更概述

为了避免与华为云服务器上其他应用冲突，项目已将所有外部端口映射调整为非标准端口。

## 🔄 端口变更对照表

### 变更前 → 变更后

| 服务 | 原端口 | 新端口 | 变更说明 |
|------|--------|--------|---------|
| 后端API | 3000 | **30080** | 避免与常见Node.js应用冲突 |
| 前端应用 | 5173/80 | **30081** | 避免与Vite默认端口冲突 |
| PostgreSQL | 5432 | **15432** | 避免与标准PostgreSQL端口冲突 |
| Redis | 6379 | **16379** | 避免与标准Redis端口冲突 |
| MinIO API | 9000 | **19000** | 避免与常见服务端口冲突 |
| MinIO Console | 9001 | **19001** | 避免与常见服务端口冲突 |
| PgAdmin | 5050 | **15050** | 避免端口冲突 |
| RedisInsight | 5540 | **15540** | 避免端口冲突 |
| Prometheus | 9090 | **19090** | 避免端口冲突 |
| Grafana | 3001 | **13001** | 避免端口冲突 |

## 📋 已更新的文件

### 1. Docker配置文件
- ✅ `infrastructure/docker-compose.yml` - 开发环境配置
- ✅ `infrastructure/docker-compose.prod.yml` - 生产环境配置

### 2. 环境变量文件
- ✅ `env.example` - 环境变量示例文件

### 3. 部署脚本
- ✅ `infrastructure/scripts/deploy.sh` - 部署脚本
- ✅ `scripts/deploy-production.sh` - 生产环境部署脚本

### 4. 文档
- ✅ `docs/DEPLOYMENT.md` - 部署文档
- ✅ `docs/QUICK_START.md` - 快速开始指南
- ✅ `docs/PORT_MAPPING.md` - 端口映射详细说明（新建）

## ⚠️ 重要提示

### 1. 容器内部端口不变

**重要**：容器内部的端口保持不变！

- 后端容器内部仍使用 `3000` 端口
- 数据库容器内部仍使用 `5432` 端口
- Redis容器内部仍使用 `6379` 端口

只有**外部映射端口**发生了变化。

### 2. 容器间通信

容器之间通信使用**服务名**和**内部端口**，不受影响：

```yaml
# 后端连接数据库（容器内部）
DATABASE_URL=postgresql://user:pass@postgres:5432/db
# ✅ 正确：使用服务名 "postgres" 和内部端口 5432
```

### 3. 宿主机访问

从宿主机访问需要使用**新的外部端口**：

```bash
# ❌ 错误（旧端口）
curl http://localhost:3000/health

# ✅ 正确（新端口）
curl http://localhost:30080/health
```

### 4. 环境变量配置

如果从宿主机连接数据库或Redis，需要更新连接字符串：

```env
# 从宿主机连接数据库（使用外部端口）
DATABASE_URL=postgresql://user:pass@localhost:15432/db

# 从容器内连接数据库（使用内部端口和服务名）
DATABASE_URL=postgresql://user:pass@postgres:5432/db
```

## 🔧 迁移步骤

如果您已有运行中的服务，需要按以下步骤迁移：

### 1. 停止旧服务

```bash
cd /opt/smart-finance/infrastructure
docker-compose -f docker-compose.prod.yml down
```

### 2. 更新配置文件

```bash
# 拉取最新代码（包含新的端口配置）
cd /opt/smart-finance
git pull origin main
```

### 3. 更新环境变量

```bash
# 检查 .env.production 文件
# 如果从宿主机连接数据库，需要更新端口
nano .env.production
```

### 4. 更新防火墙规则

```bash
# 删除旧端口规则
sudo ufw delete allow 3000/tcp
sudo ufw delete allow 5173/tcp
sudo ufw delete allow 5432/tcp
sudo ufw delete allow 6379/tcp

# 添加新端口规则
sudo ufw allow 30080/tcp
sudo ufw allow 30081/tcp
sudo ufw allow 15432/tcp
sudo ufw allow 16379/tcp
sudo ufw allow 19000/tcp
sudo ufw allow 19001/tcp
sudo ufw reload
```

### 5. 启动新服务

```bash
cd /opt/smart-finance/infrastructure
docker-compose -f docker-compose.prod.yml up -d
```

### 6. 验证服务

```bash
# 检查后端
curl http://localhost:30080/health

# 检查前端
curl http://localhost:30081/health

# 检查服务状态
docker-compose -f docker-compose.prod.yml ps
```

## 🔍 验证清单

迁移后请验证以下内容：

- [ ] 后端API可访问：`http://localhost:30080/health`
- [ ] 前端应用可访问：`http://localhost:30081`
- [ ] 数据库连接正常（容器内部）
- [ ] Redis连接正常（容器内部）
- [ ] 防火墙规则已更新
- [ ] 华为云安全组规则已更新（如使用）
- [ ] 所有服务日志正常

## 📞 遇到问题？

如果迁移后遇到问题：

1. 检查端口是否被占用：`netstat -tulpn | grep 端口号`
2. 检查防火墙规则：`sudo ufw status`
3. 查看服务日志：`docker-compose logs -f 服务名`
4. 参考 [端口映射文档](./PORT_MAPPING.md) 获取详细说明

---

**最后更新：** 2024-01-15
