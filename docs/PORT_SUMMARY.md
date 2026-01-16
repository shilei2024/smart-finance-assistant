# 端口配置总结

## 🎯 端口映射方案

为了避免与华为云服务器上其他应用冲突，所有外部端口已调整为非标准端口。

### 核心服务

```
后端API:     3000 (内部) → 30080 (外部)
前端应用:    5173/80 (内部) → 30081 (外部)
```

### 数据库和缓存

```
PostgreSQL:  5432 (内部) → 15432 (外部)
Redis:       6379 (内部) → 16379 (外部)
```

### 对象存储

```
MinIO API:   9000 (内部) → 19000 (外部)
MinIO Console: 9001 (内部) → 19001 (外部)
```

### 管理工具

```
PgAdmin:     80 (内部) → 15050 (外部)
RedisInsight: 5540 (内部) → 15540 (外部)
Prometheus:  9090 (内部) → 19090 (外部)
Grafana:     3000 (内部) → 13001 (外部)
```

## 📝 快速参考

### 访问地址

```bash
# 前端
http://your-server-ip:30081

# 后端API
http://your-server-ip:30080
http://your-server-ip:30080/api/v1/health

# 管理工具
http://your-server-ip:15050    # PgAdmin
http://your-server-ip:15540    # RedisInsight
http://your-server-ip:19001    # MinIO Console
http://your-server-ip:19090    # Prometheus
http://your-server-ip:13001    # Grafana
```

### 防火墙规则

```bash
# 必需端口
sudo ufw allow 30080/tcp   # 后端API
sudo ufw allow 30081/tcp   # 前端应用

# 可选端口（如需要外部访问）
sudo ufw allow 15432/tcp   # PostgreSQL
sudo ufw allow 16379/tcp   # Redis
sudo ufw allow 19000/tcp   # MinIO API
sudo ufw allow 19001/tcp   # MinIO Console
```

## 🔗 相关文档

- [详细端口映射说明](./PORT_MAPPING.md)
- [端口变更说明](./PORT_CHANGES.md)
- [部署文档](./DEPLOYMENT.md)
