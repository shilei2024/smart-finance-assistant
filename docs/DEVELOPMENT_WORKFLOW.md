# 开发工作流程文档

## 📋 目录

1. [开发环境设置](#开发环境设置)
2. [Git工作流](#git工作流)
3. [代码开发流程](#代码开发流程)
4. [测试流程](#测试流程)
5. [部署流程](#部署流程)
6. [版本管理](#版本管理)

---

## 💻 开发环境设置

### 1. 本地开发环境

```bash
# 克隆项目
git clone https://github.com/your-org/smart-finance-assistant.git
cd smart-finance-assistant

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local

# 启动开发环境
pnpm run dev
```

### 2. 开发分支

```bash
# 创建开发分支
git checkout -b develop
git push -u origin develop
```

---

## 🌿 Git工作流

### 分支策略

```
main/master     - 生产环境代码（稳定版本，只接受release合并）
├── develop     - 开发环境代码（最新功能，所有feature合并到这里）
├── feature/*   - 功能分支（从develop创建，完成后合并回develop）
├── hotfix/*    - 紧急修复分支（从main创建，完成后合并到main和develop）
└── release/*   - 发布分支（从develop创建，测试通过后合并到main）
```

### 分支命名规范

- **feature**: `feature/user-authentication`
- **hotfix**: `hotfix/fix-login-bug`
- **release**: `release/v1.0.0`

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）:**
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例:**
```
feat(auth): 添加用户登录功能

- 实现JWT认证
- 添加登录页面
- 添加错误处理

Closes #123
```

---

## 🔄 代码开发流程

### 1. 创建功能分支

```bash
# 从develop创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
```

### 2. 开发功能

```bash
# 编写代码...

# 提交代码
git add .
git commit -m "feat: 添加新功能描述"

# 推送到远程
git push origin feature/new-feature
```

### 3. 创建Pull Request

1. 在GitHub/GitLab上创建PR
2. 目标分支：`develop`
3. 填写PR描述
4. 等待代码审查

### 4. 代码审查

- 至少需要1个审查者批准
- 通过所有CI检查
- 解决所有评论

### 5. 合并到develop

```bash
# 合并后，删除本地分支
git checkout develop
git pull origin develop
git branch -d feature/new-feature
```

---

## 🧪 测试流程

### 1. 本地测试

```bash
# 运行单元测试
pnpm run test

# 运行E2E测试
pnpm run test:e2e

# 代码检查
pnpm run lint

# 类型检查
pnpm run type-check
```

### 2. CI/CD测试

- 自动运行在GitHub Actions/GitLab CI
- 必须通过所有测试才能合并

---

## 🚀 部署流程

### 1. 发布准备

```bash
# 从develop创建release分支
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 更新版本号
# 在 package.json 中更新版本

# 提交版本更新
git add .
git commit -m "chore: 发布版本 v1.0.0"
git push origin release/v1.0.0
```

### 2. 测试release分支

- 在测试环境部署
- 进行全面测试
- 修复发现的问题

### 3. 合并到main

```bash
# 测试通过后，合并到main
git checkout main
git pull origin main
git merge release/v1.0.0

# 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 同时合并回develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

### 4. 部署到生产

```bash
# 在服务器上执行
cd /opt/smart-finance
./scripts/deploy-production.sh
```

---

## 🔥 紧急修复流程

### 1. 创建hotfix分支

```bash
# 从main创建hotfix分支
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-bug
```

### 2. 修复问题

```bash
# 修复代码
git add .
git commit -m "fix: 修复关键bug"
git push origin hotfix/fix-critical-bug
```

### 3. 合并到main和develop

```bash
# 合并到main
git checkout main
git merge hotfix/fix-critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

# 合并到develop
git checkout develop
git merge hotfix/fix-critical-bug
git push origin develop
```

### 4. 部署到生产

```bash
# 立即部署
cd /opt/smart-finance
./scripts/deploy-production.sh
```

---

## 📦 版本管理

### 语义化版本

使用 [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

MAJOR: 不兼容的API更改
MINOR: 向后兼容的功能添加
PATCH: 向后兼容的bug修复
```

### 版本发布流程

1. **开发阶段**: develop分支持续开发
2. **测试阶段**: release分支测试
3. **发布阶段**: 合并到main，打tag
4. **部署阶段**: 部署到生产环境

---

## 📝 开发检查清单

### 提交前检查

- [ ] 代码通过lint检查
- [ ] 所有测试通过
- [ ] 类型检查通过
- [ ] 提交信息符合规范
- [ ] 代码已格式化

### PR前检查

- [ ] 功能完整实现
- [ ] 添加了必要的测试
- [ ] 更新了文档
- [ ] 没有破坏性更改（或已记录）
- [ ] CI检查通过

### 发布前检查

- [ ] 所有功能测试通过
- [ ] 性能测试通过
- [ ] 安全扫描通过
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] CHANGELOG已更新

---

## 🔐 安全注意事项

1. **不要提交敏感信息**
   - 使用 `.env.local` 存储本地配置
   - 使用 `.env.production` 存储生产配置（不提交到Git）

2. **代码审查**
   - 所有代码必须经过审查
   - 关注安全问题

3. **依赖更新**
   - 定期更新依赖
   - 检查安全漏洞

---

## 📚 相关文档

- [部署文档](./DEPLOYMENT.md)
- [API文档](../server/README.md)
- [前端文档](../client/README.md)

---

**最后更新：** 2024-01-15
