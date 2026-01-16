# Docker构建问题修复说明

## 🔧 问题描述

在构建Docker镜像时遇到以下错误：

1. **前端构建失败**：找不到 `pnpm-lock.yaml` 文件
2. **后端构建失败**：找不到 `.env.example` 文件

## ✅ 解决方案

### 1. 修改Dockerfile构建上下文

由于项目使用pnpm workspace monorepo结构，`pnpm-lock.yaml` 位于项目根目录，而Dockerfile在子目录中。解决方案：

**修改docker-compose.yml中的build context：**

```yaml
# 修改前
backend:
  build:
    context: ../server
    dockerfile: Dockerfile.prod

# 修改后
backend:
  build:
    context: ..  # 改为根目录
    dockerfile: server/Dockerfile.prod
```

### 2. 更新Dockerfile文件路径

由于build context改为根目录，Dockerfile中的COPY路径需要调整：

```dockerfile
# 修改前
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 修改后
COPY server/package*.json ./
COPY server/ .
```

### 3. 移除.env.example依赖

`.env.example` 文件不是必需的，已从Dockerfile中移除。

### 4. 使用npm代替pnpm（简化方案）

为了简化构建过程，Dockerfile现在使用npm而不是pnpm：

```dockerfile
# 使用npm安装依赖
RUN npm install

# 使用npm构建
RUN npm run build
```

## 📝 已更新的文件

1. ✅ `infrastructure/docker-compose.yml` - 更新build context
2. ✅ `infrastructure/docker-compose.prod.yml` - 更新build context
3. ✅ `server/Dockerfile.prod` - 更新文件路径，移除.env.example
4. ✅ `server/Dockerfile.dev` - 更新文件路径
5. ✅ `client/Dockerfile.prod` - 更新文件路径
6. ✅ `client/Dockerfile.dev` - 更新文件路径

## 🚀 重新构建

修复后，重新构建镜像：

```bash
cd /opt/smart-finance/infrastructure
docker-compose -f docker-compose.prod.yml --env-file ../.env.production build --no-cache
docker-compose -f docker-compose.prod.yml --env-file ../.env.production up -d
```

## ⚠️ 注意事项

1. **构建上下文**：现在build context是项目根目录，不是server/client子目录
2. **文件路径**：Dockerfile中的COPY路径需要相对于根目录
3. **依赖安装**：使用npm而不是pnpm，因为每个子项目有独立的package.json

## 🔍 验证构建

构建成功后，检查镜像：

```bash
docker images | grep smart-finance
docker-compose -f docker-compose.prod.yml ps
```

---

**最后更新：** 2024-01-15
