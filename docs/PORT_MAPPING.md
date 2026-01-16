# 端口映射说明文档

## 📋 端口映射总览

为了避免与华为云服务器上其他应用冲突，本项目使用了非标准端口映射。

### 核心服务端口

| 服务 | 容器内部端口 | 外部映射端口 | 访问地址 | 说明 |
|------|------------|------------|---------|------|
| **后端API** | 3000 | **30080** | http://your-server-ip:30080 | NestJS后端服务 |
| **前端应用** | 80/5173 | **30081** | http://your-server-ip:30081 | React前端应用 |

### 数据库和缓存端口

| 服务 | 容器内部端口 | 外部映射端口 | 访问地址 | 说明 |
|------|------------|------------|---------|------|
| **PostgreSQL** | 5432 | **15432** | localhost:15432 | 主数据库 |
| **Redis** | 6379 | **16379** | localhost:16379 | 缓存服务 |

### 对象存储端口

| 服务 | 容器内部端口 | 外部映射端口 | 访问地址 | 说明 |
|------|------------|------------|---------|------|
| **MinIO API** | 9000 | **19000** | http://your-server-ip:19000 | 对象存储API |
| **MinIO Console** | 9001 | **19001** | http://your-server-ip:19001 | 对象存储控制台 |

### 管理工具端口

| 服务 | 容器内部端口 | 外部映射端口 | 访问地址 | 说明 |
|------|------------|------------|---------|------|
| **PgAdmin** | 80 | **15050** | http://your-server-ip:15050 | 数据库管理 |
| **RedisInsight** | 5540 | **15540** | http://your-server-ip:15540 | Redis管理 |
| **Prometheus** | 9090 | **19090** | http://your-server-ip:19090 | 监控服务 |
| **Grafana** | 3000 | **13001** | http://your-server-ip:13001 | 监控面板 |

### 开发环境端口（可选）

| 服务 | 容器内部端口 | 外部映射端口 | 访问地址 | 说明 |
|------|------------|------------|---------|------|
| **Traefik HTTP** | 80 | **30082** | http://your-server-ip:30082 | 反向代理 |
| **Traefik HTTPS** | 443 | **30083** | https://your-server-ip:30083 | 反向代理 |
| **Traefik Dashboard** | 8080 | **30084** | http://your-server-ip:30084 | 代理面板 |

---

## 🔧 端口使用说明

### 1. 容器内部通信

容器之间通信使用**服务名**和**内部端口**：

```yaml
# 后端连接数据库
DATABASE_URL=postgresql://user:pass@postgres:5432/db
# 注意：使用服务名 "postgres" 和内部端口 5432

# 后端连接Redis
REDIS_HOST=redis
REDIS_PORT=6379
# 注意：使用服务名 "redis" 和内部端口 6379
```

### 2. 宿主机访问

从宿主机（服务器）访问容器服务使用**外部映射端口**：

```bash
# 访问后端API
curl http://localhost:30080/health

# 访问前端
curl http://localhost:30081

# 连接数据库（从宿主机）
psql -h localhost -p 15432 -U user -d database

# 连接Redis（从宿主机）
redis-cli -h localhost -p 16379
```

### 3. 外部访问

从外部（浏览器、其他服务器）访问使用**服务器IP**和**外部映射端口**：

```
# 访问前端
http://your-server-ip:30081

# 访问后端API
http://your-server-ip:30080/api/v1/health

# 访问MinIO控制台
http://your-server-ip:19001
```

---

## 🔐 防火墙配置

### Ubuntu (UFW)

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 30080/tcp   # 后端API
sudo ufw allow 30081/tcp   # 前端应用
sudo ufw allow 15432/tcp   # PostgreSQL（如需要外部访问）
sudo ufw allow 16379/tcp   # Redis（如需要外部访问）
sudo ufw allow 19000/tcp   # MinIO API（如需要外部访问）
sudo ufw allow 19001/tcp   # MinIO Console（如需要外部访问）
sudo ufw enable
```

### CentOS (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=30080/tcp
sudo firewall-cmd --permanent --add-port=30081/tcp
sudo firewall-cmd --permanent --add-port=15432/tcp
sudo firewall-cmd --permanent --add-port=16379/tcp
sudo firewall-cmd --permanent --add-port=19000/tcp
sudo firewall-cmd --permanent --add-port=19001/tcp
sudo firewall-cmd --reload
```

### 华为云安全组配置

在华为云控制台配置安全组规则：

1. 登录华为云控制台
2. 进入"弹性云服务器" -> "安全组"
3. 添加入站规则：
   - 端口：30080，协议：TCP，源地址：0.0.0.0/0（或指定IP）
   - 端口：30081，协议：TCP，源地址：0.0.0.0/0（或指定IP）
   - 端口：15432，协议：TCP，源地址：内网IP（仅内网访问）
   - 端口：16379，协议：TCP，源地址：内网IP（仅内网访问）

---

## 🔄 修改端口映射

如果需要修改端口映射，请按以下步骤操作：

### 1. 修改 Docker Compose 配置

编辑 `infrastructure/docker-compose.prod.yml`：

```yaml
services:
  backend:
    ports:
      - "新端口:3000"  # 修改左侧的外部端口
```

### 2. 更新环境变量

如果端口变化影响连接字符串，更新 `.env.production`：

```env
# 如果从宿主机连接数据库
DATABASE_URL=postgresql://user:pass@localhost:新端口/db
```

### 3. 更新防火墙规则

```bash
# 删除旧端口
sudo ufw delete allow 30080/tcp

# 添加新端口
sudo ufw allow 新端口/tcp
```

### 4. 重启服务

```bash
docker-compose -f infrastructure/docker-compose.prod.yml down
docker-compose -f infrastructure/docker-compose.prod.yml up -d
```

---

## 📝 端口冲突排查

### 检查端口占用

```bash
# 检查端口是否被占用
netstat -tulpn | grep 30080
netstat -tulpn | grep 30081

# 或使用 ss 命令
ss -tulpn | grep 30080

# 查看占用端口的进程
lsof -i :30080
```

### 解决端口冲突

如果端口被占用，有两个选择：

1. **停止占用端口的服务**（如果不需要）
2. **修改映射端口**（推荐）

```bash
# 方法1: 停止占用端口的服务
sudo systemctl stop 服务名

# 方法2: 修改docker-compose.yml中的端口映射
# 将 30080:3000 改为 其他端口:3000
```

---

## 🔍 端口健康检查

### 检查服务是否正常监听

```bash
# 检查后端
curl http://localhost:30080/health

# 检查前端
curl http://localhost:30081/health

# 检查数据库
nc -zv localhost 15432

# 检查Redis
redis-cli -h localhost -p 16379 ping
```

---

## 📚 相关文档

- [部署文档](./DEPLOYMENT.md)
- [快速开始](./QUICK_START.md)
- [开发工作流程](./DEVELOPMENT_WORKFLOW.md)

---

**最后更新：** 2024-01-15
