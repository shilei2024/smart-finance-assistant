# 生产环境部署检查清单

## 📋 部署前检查

### 1. 服务器环境
- [ ] 服务器配置满足最低要求（2核CPU，4GB内存，40GB硬盘）
- [ ] 已安装 Docker (>= 20.10)
- [ ] 已安装 Docker Compose (>= 2.20)
- [ ] 已配置防火墙规则
- [ ] 已配置域名和DNS解析（如需要）

### 2. 环境变量配置
- [ ] 已创建 `.env.production` 文件
- [ ] 已修改所有默认密码和密钥
- [ ] `JWT_SECRET` 和 `JWT_REFRESH_SECRET` 至少32个字符
- [ ] `POSTGRES_PASSWORD` 使用强密码
- [ ] `REDIS_PASSWORD` 使用强密码
- [ ] `MINIO_ACCESS_KEY` 和 `MINIO_SECRET_KEY` 已修改
- [ ] `CORS_ORIGIN` 配置正确的前端域名
- [ ] `APP_URL` 配置正确的应用地址
- [ ] `DEEPSEEK_API_KEY` 已配置（如使用AI功能）
- [ ] `GRAFANA_PASSWORD` 已修改

### 3. SSL/HTTPS 配置（推荐）
- [ ] 已获取 SSL 证书
- [ ] 证书文件已放置在 `infrastructure/docker/nginx/ssl/` 目录
- [ ] 已取消注释 `infrastructure/docker/nginx/nginx.conf` 中的 HTTPS 配置
- [ ] 已配置证书路径

### 4. 数据库配置
- [ ] 数据库连接字符串正确
- [ ] 数据库用户权限配置正确
- [ ] 已规划数据库备份策略

### 5. 监控配置
- [ ] Prometheus 配置正确
- [ ] Grafana 密码已修改
- [ ] 已配置监控告警（如需要）

## 🚀 部署步骤

### 1. 准备部署
```bash
# 克隆项目
cd /opt
git clone <repository-url> smart-finance
cd smart-finance

# 配置环境变量
cp .env.production.example .env.production
nano .env.production  # 编辑配置
```

### 2. 执行部署
```bash
# 使用生产部署脚本（推荐）
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh

# 或使用通用部署脚本
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh -e production -b -d
```

### 3. 验证部署
```bash
# 检查服务状态
cd infrastructure
docker-compose -f docker-compose.prod.yml ps

# 健康检查
curl http://localhost:30080/health

# 检查日志
docker-compose -f docker-compose.prod.yml logs -f
```

## ✅ 部署后检查

### 1. 服务状态
- [ ] 所有服务容器运行正常
- [ ] 健康检查通过
- [ ] 前端可以正常访问
- [ ] 后端API可以正常访问
- [ ] 数据库连接正常
- [ ] Redis连接正常

### 2. 功能测试
- [ ] 用户注册/登录功能正常
- [ ] 记账功能正常
- [ ] 数据查询正常
- [ ] AI功能正常（如启用）
- [ ] 文件上传功能正常（如启用）

### 3. 性能检查
- [ ] 页面加载时间 < 2秒
- [ ] API响应时间 < 500ms
- [ ] 数据库查询性能正常

### 4. 安全检查
- [ ] HTTPS已启用（如配置）
- [ ] CORS配置正确
- [ ] 防火墙规则正确
- [ ] 敏感信息未泄露

### 5. 监控检查
- [ ] Prometheus 数据采集正常
- [ ] Grafana 仪表板正常
- [ ] 日志记录正常

## 🔄 维护任务

### 定期任务
- [ ] 数据库备份（建议每日）
- [ ] 日志清理（建议每周）
- [ ] 安全更新（建议每月）
- [ ] 性能优化（建议每季度）

### 备份策略
```bash
# 数据库备份
docker exec smart-finance-postgres-prod pg_dump -U admin smart_finance > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker exec -i smart-finance-postgres-prod psql -U admin smart_finance < backup_20240101.sql
```

## 🆘 故障处理

### 常见问题
1. **服务无法启动**
   - 检查日志: `docker-compose -f docker-compose.prod.yml logs -f <service>`
   - 检查环境变量配置
   - 检查端口占用

2. **数据库连接失败**
   - 检查 PostgreSQL 容器状态
   - 检查数据库连接字符串
   - 检查网络配置

3. **前端无法访问后端**
   - 检查 CORS 配置
   - 检查 Nginx 配置
   - 检查防火墙规则

4. **性能问题**
   - 检查资源使用情况: `docker stats`
   - 检查数据库查询性能
   - 检查缓存配置

## 📞 支持

如遇到问题，请：
1. 查看日志文件
2. 检查文档: `docs/` 目录
3. 提交 Issue

---

**重要提示**: 生产环境部署前，请务必完成所有检查项！
