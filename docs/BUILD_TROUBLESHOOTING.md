# Docker构建问题排查指南

## ❌ 常见构建错误

### 1. 找不到 pnpm-lock.yaml

**错误信息：**
```
ERROR [frontend builder 4/8] COPY pnpm-lock.yaml ./
failed to solve: "/pnpm-lock.yaml": not found
```

**原因：**
- 项目使用pnpm workspace monorepo结构
- `pnpm-lock.yaml` 位于项目根目录
- Dockerfile的build context是子目录，无法访问根目录文件

**解决方案：**
- ✅ 已更新：将build context改为项目根目录
- ✅ 已更新：Dockerfile中使用 `COPY server/package*.json ./` 或 `COPY client/package*.json ./`
- ✅ 已更新：使用npm代替pnpm（简化方案）

### 2. 找不到 .env.example

**错误信息：**
```
ERROR [backend production 11/11] COPY --chown=nestjs:nodejs .env.example .env.example
"/.env.example": not found
```

**原因：**
- `.env.example` 文件不存在或不在正确位置
- Dockerfile尝试复制不存在的文件

**解决方案：**
- ✅ 已修复：从Dockerfile中移除了 `.env.example` 的复制
- 该文件不是运行时必需的

### 3. 构建上下文路径错误

**错误信息：**
```
failed to calculate checksum: file not found
```

**原因：**
- Dockerfile中的COPY路径与build context不匹配

**解决方案：**
- ✅ 已更新：build context改为根目录 `..`
- ✅ 已更新：Dockerfile路径改为 `server/Dockerfile.prod` 或 `client/Dockerfile.prod`
- ✅ 已更新：COPY路径改为 `COPY server/package*.json ./`

## 🔧 修复后的配置

### docker-compose.prod.yml

```yaml
backend:
  build:
    context: ..  # 根目录
    dockerfile: server/Dockerfile.prod  # 相对于根目录
```

### Dockerfile.prod

```dockerfile
# 复制server子目录的文件
COPY server/package*.json ./
COPY server/ .
```

## ✅ 验证修复

重新构建前，请确认：

1. **build context正确**
   ```bash
   # 在infrastructure目录执行
   docker-compose -f docker-compose.prod.yml config | grep context
   # 应该显示: context: ..
   ```

2. **文件存在**
   ```bash
   # 确认文件存在
   ls -la ../server/package.json
   ls -la ../client/package.json
   ```

3. **重新构建**
   ```bash
   # 清理旧镜像（可选）
   docker-compose -f docker-compose.prod.yml down
   docker system prune -f
   
   # 重新构建
   docker-compose -f docker-compose.prod.yml --env-file ../.env.production build --no-cache
   ```

## 🚀 完整构建命令

```bash
cd /opt/smart-finance/infrastructure

# 1. 清理旧容器和镜像（可选）
docker-compose -f docker-compose.prod.yml down
docker system prune -f

# 2. 构建镜像
docker-compose -f docker-compose.prod.yml --env-file ../.env.production build

# 3. 启动服务
docker-compose -f docker-compose.prod.yml --env-file ../.env.production up -d

# 4. 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

## 📝 如果仍有问题

### 检查Dockerfile语法

```bash
# 检查Dockerfile语法
docker build -f server/Dockerfile.prod -t test-build .. --no-cache
```

### 查看详细构建日志

```bash
# 启用详细输出
docker-compose -f docker-compose.prod.yml build --progress=plain --no-cache
```

### 手动测试构建

```bash
# 测试后端构建
cd /opt/smart-finance
docker build -f server/Dockerfile.prod -t smart-finance-backend-test . --no-cache

# 测试前端构建
docker build -f client/Dockerfile.prod -t smart-finance-frontend-test . --no-cache
```

---

**最后更新：** 2024-01-15
