🎯 第一部分：项目需求（保存于需求文档）
1.1 项目概述
项目背景
随着个人财务管理需求的增长，市场上缺乏智能化、易用性强的记账工具。本项目旨在通过AI技术解决传统记账繁琐、分析不足的问题。

核心目标
智能记账：降低记账门槛，提高记账效率
深度分析：提供有价值的财务洞察和建议
个性化体验：适应不同用户的财务习惯和需求
数据安全：确保用户财务数据的隐私和安全

目标用户画像
用户类型	占比	核心痛点	期望功能
职场新人	35%	月光族，消费无计划	预算控制，消费提醒
家庭主妇	25%	家庭开支复杂难管理	多人记账，分类统计
自由职业者	20%	收入不稳定，税务复杂	收入追踪，税务统计
理财爱好者	20%	需要深度分析工具	投资追踪，趋势分析
1.2 功能需求详述
模块1：用户系统
功能清单：
注册与登录
邮箱/手机号注册
第三方登录（微信、支付宝）
忘记密码
多设备登录管理
用户配置
个人资料设置
偏好设置（币种、时区、语言）
通知偏好
数据备份设置
验收标准：
注册流程不超过3步
登录响应时间<2秒
支持同时在线设备管理
模块2：核心记账功能
功能清单：
快速记账
金额输入（支持多种货币）
分类选择（多级分类）
账户选择
时间选择（默认当前时间）
备注和标签
高级记账
周期账单（每月自动生成）
转账记录（账户间资金流动）
借贷管理（借入/借出）
投资记录（股票、基金）
验收标准：
单笔记账操作<30秒完成
支持批量操作（最多100条）
数据实时同步
模块3：账户管理
账户类型支持：
账户类型	属性	支持操作
现金账户	余额、币种	收入、支出、转账
银行账户	卡号、银行、余额	同上，支持对账
信用卡	卡号、银行、账单日、还款日	消费、还款、分期
电子钱包	平台、余额	支付、提现
投资账户	类型、市值	买入、卖出、分红
负债账户	贷款方、利率、期限	借款、还款
模块4：预算管理
预算维度：
时间维度
日预算
周预算
月预算
年预算
自定义周期
分类维度
按消费分类
按账户
按标签
预算提醒
预算使用率提醒（50%、80%、90%、100%）
预算超支提醒
预算调整建议
模块5：数据分析
分析报告类型：
日报
当日收支汇总
主要消费类别
与昨日对比
月报
月度收支分析
消费趋势图
预算执行情况
储蓄率分析
年报
年度财务总结
收入增长分析
消费习惯变化
投资回报率
专项分析
餐饮消费分析
交通费用分析
娱乐支出分析
投资组合分析
模块6：AI增强功能
智能功能清单：
智能分类
自动识别交易类型
学习用户分类习惯
支持手动修正并学习
语音记账
语音输入转文字
语音指令识别
多语言支持
图片识别
票据照片识别
截图账单识别
购物小票识别
智能问答
自然语言查询
财务建议生成
趋势预测

1.3 非功能性需求
性能需求
指标	目标值	测量方法
页面加载时间	<2秒	Lighthouse测试
API响应时间	<500ms	APM监控
数据同步延迟	<1秒	端到端测试
并发用户数	10,000+	压力测试
安全需求
数据加密
传输层：TLS 1.3
存储层：AES-256加密
数据库：字段级加密
隐私保护
GDPR合规
数据最小化原则
用户数据删除功能
访问控制
角色权限管理
API访问频率限制
异常登录检测
可用性需求
可访问性
WCAG 2.1 AA标准
屏幕阅读器支持
键盘导航支持
跨平台兼容性
Web：Chrome、Safari、Firefox最新版
移动端：iOS 13+、Android 8+
响应式设计
国际化
多语言支持（中、英、日、韩）
本地化格式（日期、货币）
RTL语言支持

完善的项目初始化AI指令
🚀 Cursor AI指令：项目初始化
项目概况
我正在开发一个名为"智能记账助手"的个人财务管理应用，需要创建完整的项目脚手架。项目采用现代化的技术栈和微服务架构。

技术栈要求
yaml
核心架构: "前后端分离 + 微服务"
开发模式: "基于Docker的开发环境"

前端技术栈:
  - 框架: "React 18 + TypeScript"
  - 构建工具: "Vite 5"
  - UI库: "Ant Design 5.x"
  - 状态管理: "Redux Toolkit + RTK Query"
  - 图表: "ECharts 5"
  - 路由: "React Router 6"
  - HTTP客户端: "Axios"
  - 工具库: "dayjs, lodash-es"
  - CSS方案: "Styled Components + Ant Design Token System"
  - 代码规范: "ESLint + Prettier + Airbnb TypeScript规范"

后端技术栈:
  - 框架: "NestJS 10 + TypeScript"
  - ORM: "Prisma 5"
  - 数据库: "PostgreSQL 15 + Redis 7"
  - 认证: "JWT + Passport"
  - 验证: "class-validator + class-transformer"
  - API文档: "Swagger/OpenAPI 3"
  - 文件存储: "Multer + MinIO"
  - 任务队列: "BullMQ (Redis)"
  - 缓存: "Redis + 内存缓存"
  - 监控: "NestJS内置监控 + 自定义指标"
  - 日志: "Winston + ELK格式"

AI服务栈:
  - 主要AI: "DeepSeek API (深度求索)"
  - 备用AI: "OpenAI兼容接口"
  - 语音识别: "Web Speech API + 备选服务"
  - OCR识别: "Tesseract.js + 自定义模型"
  - 向量数据库: "可选Pinecone/Supabase"
  - 本地AI: "可选Ollama (本地部署)"

移动端技术栈:
  - 框架: "React Native 0.72+"
  - 导航: "React Navigation 6"
  - UI库: "React Native Paper + 自定义组件"
  - 状态管理: "Zustand (轻量级)"
  - 存储: "AsyncStorage + MMKV"
  - 离线支持: "WatermelonDB (可选)"

基础设施:
  - 容器化: "Docker + Docker Compose"
  - 开发环境: "Dev Containers (VS Code)"
  - 本地网络: "Traefik反向代理"
  - 数据库管理: "PgAdmin 7 + Redis Insight"
  - 文件存储: "MinIO控制台"
  - 测试环境: "Jest + Supertest + Cypress"
  - CI/CD: "GitHub Actions模板"
项目结构规范
text
smart-finance-assistant/                    # 项目根目录
├── 📁 .github/                            # GitHub配置
│   ├── 📁 workflows/                      # CI/CD流水线
│   │   ├── ci.yml                        # 持续集成
│   │   ├── cd.yml                        # 持续部署
│   │   └── security-scan.yml            # 安全扫描
│   └── PULL_REQUEST_TEMPLATE.md          # PR模板
│
├── 📁 .vscode/                           # VS Code配置
│   ├── extensions.json                   # 推荐扩展
│   ├── settings.json                     # 项目设置
│   └── devcontainer.json                 # 开发容器配置
│
├── 📁 client/                            # 前端Web应用
│   ├── 📁 public/                        # 静态资源
│   ├── 📁 src/                           # 源码目录
│   │   ├── 📁 api/                       # API调用层
│   │   │   ├── axios.config.ts          # Axios配置
│   │   │   ├── services/                # API服务
│   │   │   └── interceptors/            # 拦截器
│   │   ├── 📁 assets/                    # 静态资源
│   │   ├── 📁 components/                # 通用组件
│   │   │   ├── 📁 common/               # 基础组件
│   │   │   ├── 📁 layout/               # 布局组件
│   │   │   ├── 📁 ui/                   # UI组件
│   │   │   └── 📁 forms/                # 表单组件
│   │   ├── 📁 features/                  # 功能模块（基于业务）
│   │   │   ├── 📁 auth/                 # 认证模块
│   │   │   ├── 📁 dashboard/            # 仪表板模块
│   │   │   ├── 📁 transactions/         # 交易模块
│   │   │   ├── 📁 accounts/             # 账户模块
│   │   │   ├── 📁 categories/           # 分类模块
│   │   │   ├── 📁 budgets/              # 预算模块
│   │   │   ├── 📁 reports/              # 报表模块
│   │   │   ├── 📁 ai-assistant/         # AI助手模块
│   │   │   └── 📁 settings/             # 设置模块
│   │   ├── 📁 hooks/                     # 自定义Hooks
│   │   ├── 📁 lib/                       # 工具库
│   │   ├── 📁 locales/                   # 国际化
│   │   ├── 📁 pages/                     # 页面组件
│   │   ├── 📁 router/                    # 路由配置
│   │   ├── 📁 store/                     # 状态管理
│   │   │   ├── slices/                   # Redux切片
│   │   │   ├── hooks.ts                  # Redux Hooks
│   │   │   └── index.ts                  # Store配置
│   │   ├── 📁 styles/                    # 样式文件
│   │   │   ├── themes/                   # 主题配置
│   │   │   ├── global.css                # 全局样式
│   │   │   └── antd.variables.less       # Ant Design变量
│   │   ├── 📁 types/                     # TypeScript类型定义
│   │   │   ├── api.types.ts              # API类型
│   │   │   ├── domain.types.ts           # 领域类型
│   │   │   └── global.d.ts               # 全局类型
│   │   ├── 📁 utils/                     # 工具函数
│   │   │   ├── date.ts                   # 日期工具
│   │   │   ├── format.ts                 # 格式化工具
│   │   │   ├── validation.ts             # 验证工具
│   │   │   └── index.ts                  # 工具导出
│   │   ├── App.tsx                       # 根组件
│   │   ├── main.tsx                      # 入口文件
│   │   └── vite-env.d.ts                 # Vite环境类型
│   ├── .env.example                      # 环境变量示例
│   ├── .eslintrc.js                      # ESLint配置
│   ├── .prettierrc                       # Prettier配置
│   ├── index.html                        # HTML入口
│   ├── package.json                      # 依赖配置
│   ├── tsconfig.json                     # TypeScript配置
│   ├── tsconfig.node.json                # Node TS配置
│   └── vite.config.ts                    # Vite配置
│
├── 📁 server/                            # 后端API服务
│   ├── 📁 prisma/                        # Prisma配置
│   │   ├── schema.prisma                 # 数据模型
│   │   ├── migrations/                   # 数据库迁移
│   │   └── seed.ts                       # 种子数据
│   ├── 📁 src/                           # 源码目录
│   │   ├── 📁 common/                    # 通用模块
│   │   │   ├── 📁 decorators/           # 自定义装饰器
│   │   │   ├── 📁 filters/              # 异常过滤器
│   │   │   ├── 📁 guards/               # 守卫
│   │   │   ├── 📁 interceptors/         # 拦截器
│   │   │   ├── 📁 middleware/           # 中间件
│   │   │   ├── 📁 pipes/                # 管道
│   │   │   └── 📁 utils/                # 工具函数
│   │   ├── 📁 config/                    # 配置模块
│   │   │   ├── app.config.ts             # 应用配置
│   │   │   ├── database.config.ts        # 数据库配置
│   │   │   ├── redis.config.ts           # Redis配置
│   │   │   ├── jwt.config.ts             # JWT配置
│   │   │   └── upload.config.ts          # 上传配置
│   │   ├── 📁 core/                      # 核心模块
│   │   │   ├── constants.ts              # 常量定义
│   │   │   ├── exceptions/               # 异常定义
│   │   │   └── types/                    # 类型定义
│   │   ├── 📁 modules/                   # 业务模块（每个模块独立）
│   │   │   ├── 📁 auth/                  # 认证模块
│   │   │   │   ├── dto/                  # 数据传输对象
│   │   │   │   ├── entities/             # 实体定义
│   │   │   │   ├── guards/               # 守卫
│   │   │   │   ├── strategies/           # 策略
│   │   │   │   ├── auth.controller.ts    # 控制器
│   │   │   │   ├── auth.module.ts        # 模块定义
│   │   │   │   ├── auth.service.ts       # 服务层
│   │   │   │   └── auth.interface.ts     # 接口定义
│   │   │   ├── 📁 users/                 # 用户模块
│   │   │   ├── 📁 accounts/              # 账户模块
│   │   │   ├── 📁 transactions/          # 交易模块
│   │   │   ├── 📁 categories/            # 分类模块
│   │   │   ├── 📁 budgets/               # 预算模块
│   │   │   ├── 📁 bills/                 # 账单模块
│   │   │   ├── 📁 reports/               # 报表模块
│   │   │   ├── 📁 ai/                    # AI服务模块
│   │   │   └── 📁 health/                # 健康检查模块
│   │   ├── 📁 shared/                    # 共享模块
│   │   │   ├── 📁 database/              # 数据库相关
│   │   │   ├── 📁 redis/                 # Redis相关
│   │   │   └── 📁 utils/                 # 共享工具
│   │   ├── app.module.ts                 # 根模块
│   │   ├── main.ts                       # 入口文件
│   │   └── bootstrap.ts                  # 启动配置
│   ├── 📁 test/                          # 测试文件
│   │   ├── e2e/                          # 端到端测试
│   │   ├── integration/                  # 集成测试
│   │   └── unit/                         # 单元测试
│   ├── .env.example                      # 环境变量示例
│   ├── .eslintrc.js                      # ESLint配置
│   ├── .prettierrc                       # Prettier配置
│   ├── dockerfile                        # Docker构建文件
│   ├── nest-cli.json                     # NestJS CLI配置
│   ├── package.json                      # 依赖配置
│   ├── tsconfig.build.json               # 构建配置
│   ├── tsconfig.json                     # TypeScript配置
│   └── webpack.config.js                 # Webpack配置（可选）
│
├── 📁 mobile/                            # 移动端应用
│   ├── 📁 android/                       # Android原生代码
│   ├── 📁 ios/                           # iOS原生代码
│   ├── 📁 src/                           # React Native源码
│   │   ├── 📁 components/                # 组件
│   │   ├── 📁 screens/                   # 屏幕组件
│   │   ├── 📁 navigation/                # 导航
│   │   ├── 📁 services/                  # 服务
│   │   ├── 📁 store/                     # 状态管理
│   │   ├── 📁 utils/                     # 工具函数
│   │   ├── 📁 types/                     # 类型定义
│   │   ├── App.tsx                       # 根组件
│   │   └── index.js                      # 入口文件
│   ├── .env.example                      # 环境变量示例
│   ├── app.json                          # 应用配置
│   ├── babel.config.js                   # Babel配置
│   ├── metro.config.js                   # Metro配置
│   └── package.json                      # 依赖配置
│
├── 📁 ai-services/                       # AI微服务
│   ├── 📁 classification/                # 分类服务
│   │   ├── 📁 src/                       # 源码
│   │   ├── 📁 tests/                     # 测试
│   │   ├── dockerfile                    # Docker配置
│   │   ├── requirements.txt              # Python依赖
│   │   └── main.py                       # 入口文件
│   ├── 📁 ocr/                           # OCR识别服务
│   ├── 📁 speech/                        # 语音识别服务
│   └── 📁 analysis/                      # 分析服务
│
├── 📁 infrastructure/                    # 基础设施
│   ├── 📁 docker/                        # Docker配置
│   │   ├── 📁 postgres/                  # PostgreSQL配置
│   │   ├── 📁 redis/                     # Redis配置
│   │   ├── 📁 minio/                     # MinIO配置
│   │   └── 📁 traefik/                   # Traefik配置
│   ├── 📁 k8s/                           # Kubernetes配置
│   │   ├── 📁 base/                      # 基础配置
│   │   ├── 📁 overlays/                  # 环境覆盖
│   │   └── kustomization.yaml            # Kustomize配置
│   ├── 📁 monitoring/                    # 监控配置
│   │   ├── prometheus.yml                # Prometheus配置
│   │   ├── grafana-dashboards/           # Grafana面板
│   │   └── alerts/                       # 告警规则
│   ├── 📁 scripts/                       # 部署脚本
│   ├── docker-compose.yml                # Docker Compose开发环境
│   ├── docker-compose.prod.yml           # Docker Compose生产环境
│   └── Makefile                          # 部署命令
│
├── 📁 docs/                              # 项目文档
│   ├── 📁 api/                           # API文档
│   ├── 📁 architecture/                  # 架构文档
│   ├── 📁 database/                      # 数据库文档
│   ├── 📁 deployment/                    # 部署文档
│   ├── 📁 development/                   # 开发文档
│   └── 📁 user-guide/                    # 用户指南
│
├── 📁 packages/                          # 共享包（Monorepo可选）
│   ├── 📁 shared-types/                  # 共享类型定义
│   ├── 📁 ui-components/                 # 共享UI组件
│   └── 📁 utils/                         # 共享工具
│
├── .cursorrules                          # Cursor AI项目规则
├── .cz-config.js                         # Commitizen配置
├── .editorconfig                         # 编辑器配置
├── .env.example                          # 全局环境变量示例
├── .eslintrc.js                          # 根ESLint配置
├── .gitattributes                        # Git属性
├── .gitignore                            # Git忽略文件
├── .husky/                               # Git钩子
│   ├── pre-commit                        # 提交前检查
│   ├── commit-msg                        # 提交信息检查
│   └── _/                                # 钩子脚本
├── .prettierignore                       # Prettier忽略文件
├── .prettierrc                           # 根Prettier配置
├── .nvmrc                                # Node版本控制
├── .dockerignore                         # Docker忽略文件
├── commitlint.config.js                  # Commitlint配置
├── LICENSE                               # 开源许可证
├── Makefile                              # 项目命令
├── package.json                          # 根package.json（workspace配置）
├── pnpm-workspace.yaml                   # pnpm workspace配置
├── README.md                             # 项目说明
└── turbo.json                            # Turborepo配置（如果使用Monorepo）
任务清单（详细版）
阶段1：项目基础配置
创建项目骨架

按照上述结构创建所有目录

初始化Git仓库（包含合理的.gitignore）

设置Monorepo工作区（推荐pnpm workspace）

配置开发环境

Docker开发环境（docker-compose.yml）

VS Code开发容器配置

设置开发脚本（Makefile或package.json scripts）

配置代码规范

ESLint配置（Airbnb TypeScript规范）

Prettier配置（统一代码风格）

EditorConfig（编辑器统一）

Git钩子（Husky + lint-staged）

配置提交规范

Commitizen配置

Commitlint配置

生成标准的CHANGELOG

阶段2：前端初始化
React + TypeScript + Vite配置

创建Vite项目模板

配置TypeScript路径别名

设置环境变量管理

UI和样式配置

集成Ant Design 5.x

配置主题定制

设置Styled Components

配置CSS模块化

状态管理和路由

配置Redux Toolkit + RTK Query

设置React Router 6

创建应用状态管理结构

工具函数和类型定义

创建常用工具函数（日期、格式化、验证）

定义TypeScript类型（API响应、实体）

配置国际化（i18next）

阶段3：后端初始化
NestJS项目配置

创建NestJS项目结构

配置模块化架构

设置环境变量管理

数据库配置

Prisma Schema设计（基于完整需求文档）

数据库连接配置

Redis连接配置

数据迁移脚本

核心模块创建

认证模块（JWT + Passport）

用户管理模块

通用异常处理

请求验证管道

API和文档

RESTful API设计规范

Swagger/OpenAPI文档生成

请求/响应DTO定义

阶段4：基础设施配置
Docker开发环境

PostgreSQL容器配置

Redis容器配置

MinIO文件存储配置

反向代理配置（Traefik）

监控和日志

Winston日志配置

应用性能监控

健康检查端点

测试环境

Jest单元测试配置

E2E测试配置（Cypress）

测试数据工厂

阶段5：开发工具配置
调试配置

VS Code调试配置

浏览器开发者工具集成

API调试工具（Thunder Client/Postman集合）

脚本工具

数据库重置脚本

数据种子脚本

备份/恢复脚本

具体实施要求
1. 环境变量配置
bash
# .env.example 应该包含：
# 前端环境变量
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=智能记账助手
VITE_ENABLE_AI=true

# 后端环境变量
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/smart_finance
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
DEEPSEEK_API_KEY=your-deepseek-api-key
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password
MINIO_BUCKET=smart-finance
2. package.json 依赖要求
前端依赖示例：

json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "@ant-design/icons": "^5.2.6",
    "antd": "^5.12.1",
    "styled-components": "^6.1.1",
    "axios": "^1.6.2",
    "echarts": "^5.4.3",
    "echarts-for-react": "^3.0.2",
    "dayjs": "^1.11.10",
    "lodash-es": "^4.17.21",
    "i18next": "^23.7.6",
    "react-i18next": "^13.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.55.0",
    "eslint-config-airbnb-typescript": "^17.1.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
3. Docker Compose配置要求
yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: smart_finance
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infrastructure/docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass redispass
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: password
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.dev
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://admin:password@postgres:5432/smart_finance
      REDIS_URL: redis://:redispass@redis:6379
    ports:
      - "3000:3000"
    volumes:
      - ./server:/app
      - /app/node_modules
    command: npm run start:dev

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      VITE_API_URL: http://localhost:3000/api/v1
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
  minio_data:
4. Prisma Schema要求
prisma
// 基于完整需求文档的Prisma Schema
// 包含所有表、关系、索引和约束
// 使用UUID作为主键
// 包含软删除支持
// 包含时间戳字段
期望的输出结果
我需要你提供：

完整的文件结构树（如上面所示）

所有关键配置文件（package.json, .eslintrc.js, .prettierrc等）

Docker Compose配置文件（包含所有服务）

Prisma Schema文件（基于完整需求）

基础模块代码（用户认证模块的完整实现）

开发脚本（Makefile或package.json scripts）

环境变量模板（.env.example）

代码规范配置（ESLint, Prettier, EditorConfig）

特别注意事项
安全性：

环境变量管理

JWT密钥安全

API密钥保护

CORS配置

开发体验：

热重载配置

调试配置

错误边界

开发工具集成

可扩展性：

模块化设计

插件架构

配置驱动

依赖注入

性能考虑：

数据库索引

缓存策略

代码分割

懒加载

错误处理：

统一的错误响应格式

异常过滤器

日志记录

用户友好的错误消息

质量检查清单
所有目录结构正确创建

包管理器锁定文件正确生成

TypeScript配置完备

ESLint和Prettier配置正确

Git钩子配置生效

Docker Compose能一键启动所有服务

数据库迁移可以正常运行

前端可以正常启动

后端可以正常启动

API可以正常访问

用户认证流程完整

环境变量配置正确

测试环境配置完成

监控和日志配置完成

请按照上述要求生成完整的项目初始化代码和配置。请确保代码质量高，遵循最佳实践，并且可以直接运行。

🎯 Cursor AI指令：开发所有必要的模块功能
1. 功能基本信息
功能名称：
[中文功能名称] ([英文功能名称])

功能标识符：
[模块前缀]-[功能编号]
示例：TRANS-001 表示交易模块的第一个功能

所属模块：
主要模块：[例如：交易管理]

相关模块：[例如：分类管理、账户管理]

优先级：
[P0] - 核心功能，必须实现

[P1] - 重要功能，尽快实现

[P2] - 增强功能，后续实现

[P3] - 优化功能，可选实现

2. 功能描述
用户场景（User Story）
格式：作为 [用户角色]，我想要 [功能需求]，以便于 [商业价值]。

场景1：

text
用户角色：普通用户
触发条件：用户完成一笔消费
用户行为：用户希望快速记录这笔消费
期望结果：记录被保存，账户余额更新，分类正确
场景2：

text
用户角色：家庭管理者
触发条件：每月固定账单到期
用户行为：系统自动记录或提醒
期望结果：账单被记录，账户余额相应减少
业务流程图
graph TD
    A[开始] --> B{用户操作}
    B -->|手动输入| C[填写表单]
    B -->|语音输入| D[语音识别]
    B -->|图片上传| E[OCR识别]
    C --> F[数据验证]
    D --> F
    E --> F
    F --> G{验证结果}
    G -->|通过| H[保存记录]
    G -->|失败| I[错误提示]
    H --> J[更新相关数据]
    J --> K[发送通知]
    K --> L[结束]
    I --> L

业务规则
数据有效性规则：

金额必须大于0

日期不能超过当前日期30天

分类必须存在且可用

状态转换规则：

text
待处理 → 已确认 → 已完成
        ↓
     已取消
权限规则：

用户只能操作自己的数据

管理员可以查看所有数据

共享账户需要特定权限

3. 输入/输出规范
输入数据格式
typescript
// TypeScript 接口定义
interface CreateTransactionInput {
  // 必需字段
  amount: number;                    // 金额，必须大于0
  type: 'income' | 'expense' | 'transfer'; // 交易类型
  accountId: string;                 // 账户ID，UUID格式
  transactionDate: string;          // ISO 8601日期格式
  
  // 可选字段
  categoryId?: string;              // 分类ID，UUID格式
  payee?: string;                   // 收款方/付款方，最大长度200
  description?: string;            // 描述，最大长度1000
  tags?: string[];                 // 标签数组，每个标签最大长度50
  attachmentUrls?: string[];       // 附件URL数组
  isRecurring?: boolean;           // 是否重复交易
  
  // 条件字段
  toAccountId?: string;            // 仅当type='transfer'时必需
  recurringRule?: RecurringRule;   // 仅当isRecurring=true时必需
}

// 验证规则
const validationRules = {
  amount: {
    type: 'number',
    min: 0.01,
    max: 99999999.99,
    precision: 2,
    required: true
  },
  payee: {
    type: 'string',
    maxLength: 200,
    pattern: /^[\\p{L}\\p{N}\\s\\-\\.\\,\\(\\)\\[\\]@#]+$/u, // 允许Unicode字符
    trim: true
  }
};
输出数据格式
typescript
// 成功响应
interface SuccessResponse<T = any> {
  success: true;
  code: number;                   // HTTP状态码
  message: string;                // 成功消息（用户友好）
  data: T;                       // 响应数据
  timestamp: string;             // 响应时间戳
  requestId: string;             // 请求ID，用于追踪
  pagination?: PaginationMeta;   // 分页信息（如果有）
}

// 失败响应
interface ErrorResponse {
  success: false;
  code: number;                  // HTTP状态码
  message: string;               // 错误摘要（用户友好）
  errorCode: string;             // 业务错误代码
  errorDetails?: Array<{         // 详细错误信息
    field: string;
    message: string;
    code: string;
  }>;
  timestamp: string;
  requestId: string;
  documentationUrl?: string;     // 相关文档链接
}

// 分页响应示例
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;              // 总记录数
    page: number;              // 当前页码
    limit: number;             // 每页数量
    totalPages: number;        // 总页数
    hasNext: boolean;          // 是否有下一页
    hasPrev: boolean;          // 是否有上一页
  };
}
API端点设计
方法	路径	描述	认证	权限
POST	/api/v1/transactions	创建交易	Bearer Token	transaction:create
GET	/api/v1/transactions	获取交易列表	Bearer Token	transaction:read
GET	/api/v1/transactions/:id	获取单个交易	Bearer Token	transaction:read
PUT	/api/v1/transactions/:id	更新交易	Bearer Token	transaction:update
DELETE	/api/v1/transactions/:id	删除交易	Bearer Token	transaction:delete
4. 错误处理规范
错误分类
typescript
// 错误代码体系
const ErrorCodes = {
  // 系统错误 (1000-1999)
  SYSTEM_ERROR: 1000,           // 系统内部错误
  DATABASE_ERROR: 1001,         // 数据库错误
  NETWORK_ERROR: 1002,          // 网络错误
  
  // 业务错误 (2000-2999)
  VALIDATION_ERROR: 2000,       // 数据验证失败
  NOT_FOUND: 2001,              // 资源不存在
  DUPLICATE_ENTRY: 2002,        // 重复记录
  BUSINESS_RULE_VIOLATION: 2003, // 违反业务规则
  
  // 认证授权错误 (3000-3999)
  UNAUTHORIZED: 3000,           // 未授权
  FORBIDDEN: 3001,              // 权限不足
  TOKEN_EXPIRED: 3002,          // Token过期
  INVALID_CREDENTIALS: 3003,    // 无效凭据
  
  // 资源错误 (4000-4999)
  INSUFFICIENT_BALANCE: 4000,   // 余额不足
  RATE_LIMIT_EXCEEDED: 4001,    // 频率限制
  QUOTA_EXCEEDED: 4002,         // 配额超限
  
  // 第三方服务错误 (5000-5999)
  AI_SERVICE_ERROR: 5000,       // AI服务错误
  PAYMENT_GATEWAY_ERROR: 5001,  // 支付网关错误
};
错误处理策略
typescript
// NestJS异常过滤器示例
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCodes.SYSTEM_ERROR;
    let message = '系统内部错误';
    let errorDetails = null;
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const { message: msg, errorCode: code, details } = exceptionResponse as any;
        message = msg || message;
        errorCode = code || errorCode;
        errorDetails = details;
      }
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      errorCode = ErrorCodes.VALIDATION_ERROR;
      message = '数据验证失败';
      errorDetails = this.formatValidationErrors(exception);
    }
    
    // 记录错误日志
    this.logger.error({
      errorCode,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      user: request.user?.id,
      details: errorDetails,
      stack: exception instanceof Error ? exception.stack : undefined
    });
    
    // 返回标准错误响应
    response.status(status).json({
      success: false,
      code: errorCode,
      message,
      errorDetails,
      timestamp: new Date().toISOString(),
      requestId: request.headers['x-request-id'] || uuidv4(),
      documentationUrl: `https://docs.example.com/errors/${errorCode}`
    });
  }
}
预期错误情况
错误场景	触发条件	处理方式	用户提示
账户余额不足	支出超过账户余额	阻止交易，返回错误	"账户余额不足，请选择其他账户或充值"
重复交易	相同金额、账户、时间	提示用户确认	"检测到可能重复的交易，是否继续？"
无效分类	分类不存在或已禁用	使用默认分类	"分类无效，已使用默认分类"
日期非法	日期超出允许范围	使用当前日期	"日期超出范围，已使用当前日期"
网络超时	API响应超时	自动重试2次	"网络连接不稳定，正在重试..."
5. 技术要求
数据库层设计
sql
-- 表结构变更（如果适用）
-- 1. 主表变更
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS ai_processed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS processing_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_processed_at TIMESTAMP;

-- 2. 索引设计
CREATE INDEX IF NOT EXISTS idx_transactions_user_date_type 
ON transactions(user_id, transaction_date DESC, type);

CREATE INDEX IF NOT EXISTS idx_transactions_user_category 
ON transactions(user_id, category_id) 
WHERE category_id IS NOT NULL;

-- 3. 数据验证约束
ALTER TABLE transactions 
ADD CONSTRAINT check_amount_positive CHECK (amount > 0),
ADD CONSTRAINT check_valid_date CHECK (
  transaction_date >= '2020-01-01' AND 
  transaction_date <= CURRENT_DATE + INTERVAL '30 days'
),
ADD CONSTRAINT check_transfer_accounts CHECK (
  (type = 'transfer' AND from_account_id IS NOT NULL AND to_account_id IS NOT NULL) OR
  (type != 'transfer' AND from_account_id IS NULL AND to_account_id IS NULL)
);

-- 4. 视图创建
CREATE OR REPLACE VIEW v_daily_summary AS
SELECT 
  user_id,
  transaction_date,
  COUNT(*) as transaction_count,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
FROM transactions
WHERE status = 'completed'
GROUP BY user_id, transaction_date;
API层设计
typescript
// 1. DTO（数据传输对象）
export class CreateTransactionDto {
  @ApiProperty({ description: '交易金额', example: 100.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999.99)
  amount: number;
  
  @ApiProperty({ description: '交易类型', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;
  
  @ApiProperty({ description: '账户ID', example: 'uuid' })
  @IsUUID()
  accountId: string;
  
  @ApiProperty({ description: '交易日期', example: '2024-01-15' })
  @IsISO8601()
  @IsDateString()
  transactionDate: string;
  
  // 条件验证
  @ValidateIf(o => o.type === 'transfer')
  @IsUUID()
  toAccountId?: string;
}

// 2. 控制器
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiTags('transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  
  @Post()
  @ApiOperation({ summary: '创建交易', description: '创建一笔新的交易记录' })
  @ApiResponse({ 
    status: 201, 
    description: '交易创建成功',
    type: TransactionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '参数验证失败',
    type: ValidationErrorResponse 
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: AuthenticatedRequest
  ) {
    const userId = req.user.id;
    return this.transactionsService.create(createTransactionDto, userId);
  }
  
  @Get()
  @ApiOperation({ summary: '获取交易列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async findAll(
    @Query() query: TransactionQueryDto,
    @Request() req: AuthenticatedRequest
  ) {
    const userId = req.user.id;
    return this.transactionsService.findAll(query, userId);
  }
}
前端组件设计
typescript
// 1. 组件结构
/**
 * 交易表单组件
 * 功能：创建和编辑交易记录
 * 特性：支持手动输入、语音输入、图片识别
 */
const TransactionForm: React.FC<TransactionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  
  // 表单布局配置
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  
  // 表单提交处理
  const handleSubmit = async (values: TransactionFormValues) => {
    try {
      setLoading(true);
      const result = await onSubmit(values);
      message.success(mode === 'create' ? '交易创建成功' : '交易更新成功');
      form.resetFields();
      return result;
    } catch (error) {
      message.error('操作失败，请重试');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // AI分类建议
  const handleDescriptionChange = useDebounce(async (description: string) => {
    if (description.length > 3) {
      const suggestions = await fetchAiSuggestions(description);
      setAiSuggestions(suggestions);
    }
  }, 500);
  
  return (
    <Card 
      title={mode === 'create' ? '添加交易' : '编辑交易'}
      extra={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button 
            type="primary" 
            onClick={() => form.submit()}
            loading={loading}
          >
            保存
          </Button>
        </Space>
      }
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        {/* 交易类型选择器 */}
        <Form.Item
          name="type"
          label="交易类型"
          rules={[{ required: true, message: '请选择交易类型' }]}
        >
          <Segmented 
            options={[
              { label: '支出', value: 'expense', icon: <ArrowDownOutlined /> },
              { label: '收入', value: 'income', icon: <ArrowUpOutlined /> },
              { label: '转账', value: 'transfer', icon: <SwapOutlined /> }
            ]}
            block
          />
        </Form.Item>
        
        {/* 金额输入 */}
        <Form.Item
          name="amount"
          label="金额"
          rules={[
            { required: true, message: '请输入金额' },
            { pattern: /^\d+(\.\d{1,2})?$/, message: '金额格式不正确' }
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            min={0.01}
            max={99999999.99}
            precision={2}
            addonAfter="¥"
            placeholder="0.00"
          />
        </Form.Item>
        
        {/* AI辅助描述输入 */}
        <Form.Item
          name="description"
          label="描述"
          extra={
            aiSuggestions.length > 0 && (
              <div className="ai-suggestions">
                <span>AI建议：</span>
                {aiSuggestions.map(suggestion => (
                  <Tag 
                    key={suggestion.categoryId}
                    color="blue"
                    onClick={() => {
                      form.setFieldsValue({
                        categoryId: suggestion.categoryId,
                        tags: suggestion.tags
                      });
                    }}
                  >
                    {suggestion.categoryName}
                  </Tag>
                ))}
              </div>
            )
          }
        >
          <Input.TextArea 
            rows={2}
            placeholder="输入消费描述，AI将自动推荐分类..."
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
        </Form.Item>
        
        {/* 更多字段... */}
      </Form>
    </Card>
  );
};
6. 测试要求
测试策略
typescript
// 1. 单元测试
describe('TransactionService', () => {
  let service: TransactionService;
  let repository: MockProxy<TransactionRepository>;
  
  beforeEach(async () => {
    repository = mock<TransactionRepository>();
    service = new TransactionService(repository);
  });
  
  describe('create', () => {
    it('应该成功创建交易', async () => {
      // 准备
      const dto = {
        amount: 100,
        type: 'expense',
        accountId: 'uuid',
        transactionDate: '2024-01-15'
      };
      const userId = 'user-uuid';
      
      repository.create.mockResolvedValue({
        id: 'transaction-uuid',
        ...dto,
        userId,
        status: 'completed'
      });
      
      // 执行
      const result = await service.create(dto, userId);
      
      // 断言
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...dto,
        userId
      }));
      expect(result.id).toBeDefined();
    });
    
    it('当账户余额不足时应抛出错误', async () => {
      // 准备
      const dto = {
        amount: 10000,
        type: 'expense',
        accountId: 'low-balance-account',
        transactionDate: '2024-01-15'
      };
      
      // 模拟账户余额检查失败
      jest.spyOn(service, 'checkAccountBalance').mockRejectedValue(
        new BusinessError('账户余额不足')
      );
      
      // 执行和断言
      await expect(service.create(dto, 'user-uuid'))
        .rejects
        .toThrow('账户余额不足');
    });
  });
});

// 2. 集成测试
describe('Transactions API', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleRef.createNestApplication();
    await app.init();
  });
  
  describe('POST /transactions', () => {
    it('应创建交易并返回201状态码', async () => {
      const createDto = {
        amount: 150.75,
        type: 'expense',
        accountId: 'test-account-id',
        transactionDate: '2024-01-15',
        description: '午餐消费'
      };
      
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', 'Bearer valid-token')
        .send(createDto);
      
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.amount).toBe(150.75);
    });
    
    it('当缺少必需字段时应返回400状态码', async () => {
      const invalidDto = {
        type: 'expense',
        // 缺少 amount 字段
        accountId: 'test-account-id'
      };
      
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidDto);
      
      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });
});

// 3. E2E测试（Cypress）
describe('交易功能E2E测试', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/transactions');
  });
  
  it('应该成功添加交易', () => {
    cy.get('[data-testid="add-transaction-btn"]').click();
    cy.get('[data-testid="amount-input"]').type('88.88');
    cy.get('[data-testid="category-select"]').click();
    cy.get('[data-testid="category-food"]').click();
    cy.get('[data-testid="submit-btn"]').click();
    
    cy.get('.ant-message-success').should('contain', '交易创建成功');
    cy.get('[data-testid="transaction-list"]').should('contain', '88.88');
  });
  
  it('应该显示表单验证错误', () => {
    cy.get('[data-testid="add-transaction-btn"]').click();
    cy.get('[data-testid="submit-btn"]').click();
    
    cy.get('.ant-form-item-explain-error').should('contain', '请输入金额');
  });
});
测试覆盖率要求
yaml
测试覆盖率目标:
  - 语句覆盖率: > 85%
  - 分支覆盖率: > 80%
  - 函数覆盖率: > 90%
  - 行覆盖率: > 85%
  
需要测试的场景:
  正面测试:
    - 正常流程（happy path）
    - 边界值测试（最大值、最小值）
    - 可选字段测试
    
  负面测试:
    - 无效输入（空值、错误类型）
    - 权限不足
    - 资源不存在
    - 并发操作
    - 网络超时/中断
    
  性能测试:
    - 响应时间 < 500ms
    - 内存使用 < 100MB
    - 数据库查询优化
7. 性能与安全要求
性能要求
typescript
// 性能指标
const PerformanceMetrics = {
  // API响应时间
  apiResponseTime: {
    p50: '< 100ms',    // 50%的请求
    p90: '< 300ms',    // 90%的请求
    p99: '< 1000ms',   // 99%的请求
  },
  
  // 数据库查询
  databaseQueries: {
    maxComplexity: 3,  // 最大JOIN数量
    maxExecutionTime: '50ms',
    indexingCoverage: '> 95%',
  },
  
  // 前端性能
  frontendMetrics: {
    firstContentfulPaint: '< 1.5s',
    largestContentfulPaint: '< 2.5s',
    cumulativeLayoutShift: '< 0.1',
    firstInputDelay: '< 100ms',
  },
  
  // 缓存策略
  cachingStrategy: {
    redisTTL: {
      short: '60s',    // 短缓存
      medium: '300s',  // 中缓存
      long: '3600s',   // 长缓存
    },
    cacheHitRate: '> 85%',
  }
};
安全要求
typescript
// 安全措施
const SecurityRequirements = {
  // 输入验证
  inputValidation: {
    sanitizeHtml: true,
    validateSchema: true,
    maxLength: {
      strings: 1000,
      arrays: 100,
      numbers: 20
    }
  },
  
  // 数据保护
  dataProtection: {
    encryption: {
      inTransit: 'TLS 1.3',
      atRest: 'AES-256',
      sensitiveFields: ['amount', 'accountNumber', 'personalInfo']
    },
    masking: {
      accountNumbers: 'last4',
      personalInfo: 'partial'
    }
  },
  
  // 访问控制
  accessControl: {
    authentication: 'JWT + Refresh Tokens',
    authorization: 'RBAC + ABAC',
    rateLimiting: {
      perUser: '100 requests/minute',
      perIP: '1000 requests/minute'
    }
  },
  
  // 审计日志
  auditLogging: {
    requiredEvents: [
      'create', 'update', 'delete',
      'login', 'logout', 'failed_attempt'
    ],
    retentionPeriod: '90 days'
  }
};
8. 代码示例（完整实现）
后端服务完整示例
typescript
// transaction.service.ts
@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
    private readonly auditService: AuditService,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: Logger
  ) {}
  
  /**
   * 创建交易
   */
  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
    context?: RequestContext
  ): Promise<TransactionResponse> {
    const startTime = Date.now();
    
    try {
      // 1. 验证业务规则
      await this.validateBusinessRules(createTransactionDto, userId);
      
      // 2. 准备交易数据
      const transactionData = await this.prepareTransactionData(
        createTransactionDto,
        userId
      );
      
      // 3. 开始数据库事务
      const transaction = await this.transactionRepository
        .manager
        .transaction(async (entityManager) => {
          
          // 3.1 保存交易记录
          const transaction = entityManager.create(
            Transaction,
            transactionData
          );
          
          const savedTransaction = await entityManager.save(transaction);
          
          // 3.2 更新账户余额
          await this.updateAccountBalances(
            savedTransaction,
            entityManager
          );
          
          // 3.3 更新预算统计
          await this.updateBudgetStatistics(
            savedTransaction,
            entityManager
          );
          
          return savedTransaction;
        });
      
      // 4. 异步处理任务
      await Promise.all([
        // 4.1 清除相关缓存
        this.cacheService.invalidate([
          `user:${userId}:transactions`,
          `user:${userId}:daily_summary`,
          `user:${userId}:account_balance`
        ]),
        
        // 4.2 发送事件通知
        this.eventEmitter.emitAsync(
          'transaction.created',
          new TransactionCreatedEvent(transaction, userId)
        ),
        
        // 4.3 记录审计日志
        this.auditService.log({
          action: 'transaction.create',
          userId,
          entityId: transaction.id,
          entityType: 'transaction',
          metadata: {
            amount: transaction.amount,
            type: transaction.type
          },
          context
        }),
        
        // 4.4 AI处理（非阻塞）
        this.processWithAI(transaction).catch(err => {
          this.logger.error('AI处理失败', err);
        })
      ]);
      
      // 5. 记录性能指标
      const duration = Date.now() - startTime;
      this.logger.log(`Transaction created in ${duration}ms`, {
        transactionId: transaction.id,
        userId,
        duration
      });
      
      // 6. 返回响应
      return this.mapToResponse(transaction);
      
    } catch (error) {
      this.logger.error('创建交易失败', {
        error: error.message,
        userId,
        dto: createTransactionDto,
        stack: error.stack
      });
      
      if (error instanceof BusinessError) {
        throw error;
      }
      
      throw new InternalServerErrorException('交易创建失败，请稍后重试');
    }
  }
  
  /**
   * 验证业务规则
   */
  private async validateBusinessRules(
    dto: CreateTransactionDto,
    userId: string
  ): Promise<void> {
    const validations = [
      // 验证账户存在且属于用户
      this.validateAccount(dto.accountId, userId),
      
      // 验证分类存在（如果有）
      dto.categoryId ? this.validateCategory(dto.categoryId, userId) : Promise.resolve(),
      
      // 验证金额有效性
      this.validateAmount(dto.amount, dto.type),
      
      // 验证日期有效性
      this.validateDate(dto.transactionDate),
    ];
    
    // 如果是转账，验证目标账户
    if (dto.type === 'transfer' && dto.toAccountId) {
      validations.push(this.validateAccount(dto.toAccountId, userId));
    }
    
    await Promise.all(validations);
  }
  
  /**
   * 准备交易数据
   */
  private async prepareTransactionData(
    dto: CreateTransactionDto,
    userId: string
  ): Promise<Partial<Transaction>> {
    const data: Partial<Transaction> = {
      ...dto,
      userId,
      status: 'completed' as TransactionStatus,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // 使用AI自动分类（如果用户未指定分类）
    if (!dto.categoryId && dto.description) {
      const aiCategory = await this.suggestCategory(dto.description);
      if (aiCategory) {
        data.categoryId = aiCategory.id;
        data.aiProcessed = true;
        data.aiConfidence = aiCategory.confidence;
      }
    }
    
    return data;
  }
}
前端组件完整示例
typescript
// TransactionList.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  DatePicker,
  Select,
  Tag,
  Statistic,
  message,
  Modal,
  Empty,
  Spin
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import TransactionForm from './TransactionForm';
import { Transaction, TransactionQueryParams } from '@/types/transaction';
import { transactionAPI } from '@/api/transaction';
import { useAuth } from '@/hooks/useAuth';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // 状态管理
  const [queryParams, setQueryParams] = useState<TransactionQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'transactionDate',
    sortOrder: 'desc'
  });
  
  const [selectedRows, setSelectedRows] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // 数据查询
  const {
    data: transactionData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['transactions', queryParams],
    queryFn: () => transactionAPI.getTransactions(queryParams),
    enabled: !!user,
    staleTime: 60000, // 1分钟缓存
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000)
  });
  
  // 统计数据查询
  const { data: summaryData } = useQuery({
    queryKey: ['transactionSummary', queryParams],
    queryFn: () => transactionAPI.getSummary(queryParams),
    enabled: !!user && !isLoading
  });
  
  // 删除交易
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionAPI.deleteTransaction(id),
    onSuccess: () => {
      message.success('交易删除成功');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      setSelectedRows([]);
    },
    onError: (error: any) => {
      message.error(`删除失败: ${error.message}`);
    }
  });
  
  // 列定义
  const columns = [
    {
      title: '日期',
      dataIndex: 'transactionDate',
      key: 'date',
      width: 120,
      render: (date: string) => dayjs(date).format('MM/DD'),
      sorter: true
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string, record: Transaction) => (
        <Space direction="vertical" size={2}>
          <div>{text || '无描述'}</div>
          {record.payee && (
            <small style={{ color: '#666' }}>{record.payee}</small>
          )}
        </Space>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: any) => (
        <Tag color={category?.color || '#888'}>
          {category?.name || '未分类'}
        </Tag>
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number, record: Transaction) => (
        <span
          style={{
            color: record.type === 'income' ? '#52c41a' : '#f5222d',
            fontWeight: 500
          }}
        >
          {record.type === 'income' ? '+' : '-'}
          {amount.toFixed(2)}
        </span>
      ),
      sorter: true
    },
    {
      title: '账户',
      dataIndex: 'account',
      key: 'account',
      width: 120,
      render: (account: any) => account?.name || '未知账户'
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Transaction) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={deleteMutation.isLoading}
          />
        </Space>
      )
    }
  ];
  
  // 事件处理
  const handleSearch = (value: string) => {
    setQueryParams(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };
  
  const handleDateChange = (dates: any) => {
    if (dates) {
      setQueryParams(prev => ({
        ...prev,
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
        page: 1
      }));
    }
  };
  
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setQueryParams(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: sorter.field || 'transactionDate',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
    }));
  };
  
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这笔交易吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => deleteMutation.mutate(id)
    });
  };
  
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };
  
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
    refetch();
  };
  
  // 渲染统计卡片
  const renderStatistics = () => {
    if (!summaryData) return null;
    
    return (
      <Card size="small" className="mb-4">
        <div className="grid grid-cols-4 gap-4">
          <Statistic
            title="总收入"
            value={summaryData.totalIncome}
            precision={2}
            valueStyle={{ color: '#52c41a' }}
            prefix="¥"
          />
          <Statistic
            title="总支出"
            value={summaryData.totalExpense}
            precision={2}
            valueStyle={{ color: '#f5222d' }}
            prefix="¥"
          />
          <Statistic
            title="交易笔数"
            value={summaryData.transactionCount}
          />
          <Statistic
            title="净收入"
            value={summaryData.netIncome}
            precision={2}
            valueStyle={{
              color: summaryData.netIncome >= 0 ? '#52c41a' : '#f5222d'
            }}
            prefix="¥"
          />
        </div>
      </Card>
    );
  };
  
  // 渲染筛选器
  const renderFilters = () => (
    <Card size="small" className="mb-4" hidden={!filtersVisible}>
      <div className="grid grid-cols-4 gap-4">
        <Input
          placeholder="搜索描述或收款方"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
        />
        <RangePicker
          style={{ width: '100%' }}
          onChange={handleDateChange}
        />
        <Select placeholder="选择分类" allowClear>
          {/* 分类选项 */}
        </Select>
        <Select placeholder="选择账户" allowClear>
          {/* 账户选项 */}
        </Select>
      </div>
    </Card>
  );
  
  // 错误处理
  if (error) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <p>数据加载失败</p>
              <Button type="link" onClick={() => refetch()}>
                点击重试
              </Button>
            </div>
          }
        />
      </Card>
    );
  }
  
  return (
    <div className="transaction-list">
      {/* 操作栏 */}
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowForm(true)}
            >
              添加交易
            </Button>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              {filtersVisible ? '隐藏筛选' : '显示筛选'}
            </Button>
            {selectedRows.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title: `确认删除${selectedRows.length}笔交易`,
                    content: '此操作不可恢复，确定要删除吗？',
                    onOk: () => {
                      // 批量删除逻辑
                    }
                  });
                }}
              >
                批量删除
              </Button>
            )}
          </Space>
          <Space>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
        </div>
      </Card>
      
      {/* 统计数据 */}
      {renderStatistics()}
      
      {/* 筛选器 */}
      {renderFilters()}
      
      {/* 数据表格 */}
      <Card>
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={transactionData?.data || []}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedRows.map(row => row.id),
              onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            }}
            pagination={{
              current: queryParams.page,
              pageSize: queryParams.limit,
              total: transactionData?.pagination?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              pageSizeOptions: ['20', '50', '100']
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            size="middle"
            bordered
          />
        </Spin>
      </Card>
      
      {/* 交易表单弹窗 */}
      <Modal
        title={editingTransaction ? '编辑交易' : '添加交易'}
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <TransactionForm
          initialValues={editingTransaction}
          onSubmit={async (values) => {
            if (editingTransaction) {
              return transactionAPI.updateTransaction(editingTransaction.id, values);
            } else {
              return transactionAPI.createTransaction(values);
            }
          }}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default TransactionList;
9. 部署与监控要求
部署配置
yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY}
      LOG_LEVEL: info
      SENTRY_DSN: ${SENTRY_DSN}
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
监控指标
typescript
// 需要监控的关键指标
const MonitoringMetrics = {
  // 业务指标
  business: {
    transactionCount: 'transactions_total',
    transactionAmount: 'transactions_amount_total',
    userActivity: 'active_users_total',
    
    // 错误率
    errorRate: 'error_rate',
    
    // 响应时间
    responseTime: 'response_time_seconds',
  },
  
  // 系统指标
  system: {
    cpuUsage: 'cpu_usage_percent',
    memoryUsage: 'memory_usage_bytes',
    diskUsage: 'disk_usage_percent',
    
    // 数据库
    dbConnections: 'db_connections_total',
    dbQueryTime: 'db_query_time_seconds',
    
    // Redis
    redisHitRate: 'redis_hit_rate',
    redisMemory: 'redis_memory_usage_bytes',
  },
  
  // 警报规则
  alerts: [
    {
      alert: 'HighErrorRate',
      expr: 'rate(error_total[5m]) > 0.1',
      for: '5m',
      labels: { severity: 'critical' },
      annotations: {
        summary: '错误率过高',
        description: '最近5分钟错误率超过10%'
      }
    },
    {
      alert: 'SlowResponseTime',
      expr: 'histogram_quantile(0.95, rate(response_time_seconds_bucket[5m])) > 1',
      for: '10m',
      labels: { severity: 'warning' },
      annotations: {
        summary: '响应时间过慢',
        description: '95%的请求响应时间超过1秒'
      }
    }
  ]
};
10. 验收标准
功能验收清单
markdown
- [ ] 功能完整实现所有需求
- [ ] 界面符合设计规范
- [ ] 响应式设计适配所有设备
- [ ] 性能指标达标
- [ ] 安全性要求满足
- [ ] 代码质量合格
- [ ] 测试覆盖率达标
- [ ] 文档完整准确
- [ ] 无已知重大bug
- [ ] 用户体验良好
代码质量检查清单
bash
# 运行代码检查
npm run lint             # ESLint检查
npm run type-check       # TypeScript类型检查
npm run test:coverage    # 测试覆盖率检查
npm run build            # 构建检查
npm run audit            # 安全审计

完善的AI功能集成与代码审查规范
🤖 AI功能集成规范
1. AI功能概览
AI要解决的具体问题清单
功能模块	AI要解决的问题	技术方案	预期效果
智能分类	交易描述自动分类	DeepSeek NLP + 规则引擎	准确率 > 85%，用户修正后学习
语音记账	语音转文字+意图识别	语音识别 + NLP处理	语音识别准确率 > 90%，意图识别 > 80%
图片识别	账单图片文字提取	OCR + 数据结构化	票据关键信息提取准确率 > 95%
财务分析	消费习惯分析建议	数据分析 + 模式识别	提供个性化、可执行的财务建议
智能问答	自然语言财务查询	NLP + 知识图谱	回答准确率 > 90%，支持复杂查询
异常检测	异常消费模式识别	机器学习异常检测	异常检测准确率 > 85%，低误报
预算优化	智能预算分配建议	强化学习 + 历史数据	预算分配合理度提升 > 20%
报告生成	自动生成财务报告	LLM + 模板引擎	报告质量接近人工水平
2. 详细AI功能描述
2.1 智能分类功能
问题描述：
用户输入交易描述（如"星巴克咖啡"），AI需要：

自动识别最合适的分类（餐饮、交通等）

提供备选分类建议

识别可能的标签（如"咖啡"、"早餐"）

识别可能的商家信息

技术实现：

typescript
interface ClassificationRequest {
  description: string;
  amount?: number;
  context?: {
    location?: string;
    time?: string;
    historicalCategories?: string[];
  };
}

interface ClassificationResponse {
  primaryCategory: {
    id: string;
    name: string;
    confidence: number; // 0-1
    reasoning: string;
  };
  alternativeCategories: Array<{
    id: string;
    name: string;
    confidence: number;
  }>;
  extractedTags: string[];
  extractedEntities: {
    merchant?: string;
    location?: string;
    time?: string;
  };
  metadata: {
    modelVersion: string;
    processingTime: number;
    cacheHit: boolean;
  };
}
提示词设计：

javascript
const classificationPrompt = `
你是一个专业的财务分类助手，专门分析消费描述并归类。

## 任务要求
分析以下消费描述，从用户分类中选择最合适的分类。

## 用户分类体系
{用户分类列表，格式：分类ID:分类名称(类型)}

## 输入数据
- 描述：{description}
- 金额：{amount}
- 时间：{time}
- 位置：{location}

## 历史参考
用户历史偏好分类：{historicalCategories}

## 输出要求
返回严格的JSON格式：
{
  "primaryCategory": {
    "id": "分类ID",
    "name": "分类名称",
    "confidence": 0.95,
    "reasoning": "为什么选择这个分类，说明关键词匹配、模式识别等"
  },
  "alternativeCategories": [
    {
      "id": "备选分类ID",
      "name": "备选分类名称",
      "confidence": 0.8
    }
  ],
  "extractedTags": ["标签1", "标签2"],
  "extractedEntities": {
    "merchant": "商家名称（如识别到）",
    "location": "地点（如识别到）",
    "time": "时间信息（如识别到）"
  }
}

## 注意事项
1. 置信度必须在0-1之间，小数点后两位
2. 如果没有识别到实体，对应字段为null
3. reasoning要具体说明匹配的关键词或模式
4. 如果描述模糊，降低置信度并提供多个备选
`;
2.2 财务分析功能
问题描述：
基于用户历史数据，提供：

消费习惯分析

财务健康评分

个性化改进建议

风险预警

技术实现：

typescript
interface FinancialAnalysisRequest {
  userId: string;
  timeRange: {
    start: string; // ISO日期
    end: string;
  };
  analysisType: 'overview' | 'detailed' | 'comparative';
  focusAreas?: string[]; // 如['餐饮', '交通']
}

interface FinancialAnalysisResponse {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingRate: number; // 百分比
    averageDailySpending: number;
  };
  
  financialHealth: {
    score: number; // 0-100
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    breakdown: {
      spendingHabits: number;
      savingRate: number;
      budgetAdherence: number;
      incomeStability: number;
    };
  };
  
  insights: Array<{
    type: 'positive' | 'warning' | 'critical';
    title: string;
    description: string;
    data: any; // 支持数据
    recommendation?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  
  trends: {
    spendingByCategory: Record<string, number>;
    monthlyComparison: Array<{
      month: string;
      income: number;
      expense: number;
      difference: number;
    }>;
    topSpendingDays: Array<{
      date: string;
      amount: number;
      category: string;
    }>;
  };
  
  recommendations: Array<{
    category: string;
    currentSpending: number;
    suggestedSpending: number;
    potentialSavings: number;
    actionSteps: string[];
    expectedImpact: string;
  }>;
}
3. DeepSeek API集成规范
3.1 API调用配置
typescript
interface DeepSeekConfig {
  // 基础配置
  baseUrl: string;
  apiKey: string;
  timeout: number; // 毫秒
  maxRetries: number;
  
  // 模型配置
  defaultModel: 'deepseek-chat';
  availableModels: {
    'deepseek-chat': { contextLength: 16384 };
    'deepseek-coder': { contextLength: 16384 };
  };
  
  // 温度配置（根据不同任务类型）
  temperaturePresets: {
    precise: 0.2;    // 分类、计算等精确任务
    balanced: 0.5;   // 分析、建议等平衡任务
    creative: 0.7;   // 生成、创意任务
  };
  
  // 最大token配置
  maxTokens: {
    classification: 500;
    analysis: 2000;
    generation: 4000;
  };
  
  // 速率限制
  rateLimit: {
    requestsPerMinute: 60;
    tokensPerMinute: 60000;
  };
}

// 具体实现类
class DeepSeekService {
  private config: DeepSeekConfig;
  private cache: CacheService;
  private metrics: MetricsService;
  private fallbackStrategies: FallbackStrategy[];
  
  async callApi<T>(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      useCache?: boolean;
      cacheKey?: string;
      fallbackEnabled?: boolean;
    } = {}
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      // 1. 检查缓存
      if (options.useCache && options.cacheKey) {
        const cached = await this.cache.get<T>(options.cacheKey);
        if (cached) {
          this.metrics.recordCacheHit();
          return cached;
        }
      }
      
      // 2. 构建请求
      const requestPayload = {
        model: options.model || this.config.defaultModel,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的财务助手，帮助用户管理个人财务。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature || this.config.temperaturePresets.balanced,
        max_tokens: options.maxTokens || this.config.maxTokens.analysis,
        stream: false
      };
      
      // 3. 发送请求（带重试）
      const response = await this.executeWithRetry(
        () => axios.post(this.config.baseUrl, requestPayload, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: this.config.timeout
        }),
        this.config.maxRetries
      );
      
      // 4. 解析响应
      const result = this.parseResponse<T>(response.data);
      
      // 5. 验证结果
      this.validateResult(result);
      
      // 6. 缓存结果
      if (options.useCache && options.cacheKey) {
        await this.cache.set(
          options.cacheKey,
          result,
          this.calculateCacheTTL(result)
        );
      }
      
      // 7. 记录指标
      this.metrics.recordApiCall({
        duration: Date.now() - startTime,
        tokensUsed: response.data.usage?.total_tokens || 0,
        model: requestPayload.model,
        success: true
      });
      
      return result;
      
    } catch (error) {
      // 错误处理
      this.metrics.recordApiCall({
        duration: Date.now() - startTime,
        error: error.message,
        success: false
      });
      
      // 降级策略
      if (options.fallbackEnabled) {
        return this.executeFallbackStrategy(prompt);
      }
      
      throw new AiServiceError(
        'AI服务调用失败',
        error,
        { prompt, options }
      );
    }
  }
}
3.2 提示词设计规范
typescript
// 提示词模板系统
class PromptTemplate {
  private templates: Map<string, string>;
  
  constructor() {
    this.templates = new Map();
    this.registerTemplates();
  }
  
  private registerTemplates() {
    // 分类模板
    this.templates.set('classification', `
你是一个专业的财务分类助手。请分析以下消费描述并归类。

## 用户分类体系
{{categories}}

## 输入信息
- 描述：{{description}}
- 金额：{{amount}}元
- 时间：{{time}}
- 地点：{{location}}

## 用户历史偏好
{{#if historicalData}}
最近常用的分类：{{historicalData.frequentCategories}}
最近使用的标签：{{historicalData.recentTags}}
{{/if}}

## 输出要求
{{formatInstructions}}

## 注意事项
1. 考虑用户的消费习惯和历史偏好
2. 如果描述模糊，提供多个可能的分类
3. 从描述中提取有用的标签
4. 置信度要反映判断的确定性
    `);
    
    // 分析模板
    this.templates.set('financial_analysis', `
你是一个专业的财务顾问。请分析以下财务数据并提供建议。

## 用户基本信息
- 收入水平：{{incomeLevel}}
- 主要收入来源：{{incomeSources}}
- 储蓄目标：{{savingGoals}}

## 消费数据（{{period}}）
{{#each spendingByCategory}}
- {{category}}: {{amount}}元 ({{percentage}}%)
{{/each}}

## 预算执行情况
{{#each budgetStatus}}
- {{category}}: 预算{{budget}}元，实际{{actual}}元，完成度{{completion}}%
{{/each}}

## 用户特殊要求
{{userRequirements}}

## 输出要求
{{formatInstructions}}

## 分析要点
1. 识别过度消费的类别
2. 评估储蓄目标的可达性
3. 提供具体的行动建议
4. 考虑用户的收入水平和生活阶段
    `);
  }
  
  // 模板渲染
  render(templateName: string, data: any, options?: {
    format?: 'json' | 'text';
    instructions?: string;
  }): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }
    
    // 使用模板引擎渲染
    const rendered = this.compile(template, data);
    
    // 添加格式指令
    const formatInstructions = options?.format === 'json' 
      ? this.getJsonFormatInstructions(options.instructions)
      : this.getTextFormatInstructions(options.instructions);
    
    return rendered + '\n\n' + formatInstructions;
  }
  
  private getJsonFormatInstructions(schema?: string): string {
    return `
## 输出格式要求
返回严格的JSON格式，符合以下schema：
${schema || this.getDefaultSchema()}

## 格式规则
1. 必须是有效的JSON
2. 所有数字使用number类型
3. 所有字符串使用双引号
4. 不允许有注释
5. 不允许有多余的空格或换行
    `;
  }
}
3.3 错误处理策略
typescript
// 完整的错误处理体系
class AiErrorHandler {
  
  // 错误分类
  static readonly ErrorTypes = {
    API_ERROR: 'api_error',
    RATE_LIMIT: 'rate_limit',
    TIMEOUT: 'timeout',
    INVALID_RESPONSE: 'invalid_response',
    CONTENT_FILTER: 'content_filter',
    MODEL_OVERLOAD: 'model_overload'
  };
  
  // 错误处理策略
  private strategies: Map<string, ErrorHandlerStrategy> = new Map();
  
  constructor() {
    this.initStrategies();
  }
  
  private initStrategies() {
    // 1. 重试策略（适用于临时性错误）
    this.strategies.set('retry', {
      name: 'retry_with_backoff',
      canHandle: (error) => this.isRetryableError(error),
      execute: async (operation, context) => {
        const maxRetries = 3;
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const backoff = this.calculateBackoff(attempt);
            await this.sleep(backoff);
            
            return await operation();
          } catch (error) {
            lastError = error;
            
            if (!this.isRetryableError(error) || attempt === maxRetries) {
              break;
            }
            
            this.logRetryAttempt(attempt, error, context);
          }
        }
        
        throw lastError;
      }
    });
    
    // 2. 降级策略（返回简化结果）
    this.strategies.set('fallback', {
      name: 'simplified_fallback',
      canHandle: (error) => true, // 总是可以降级
      execute: async (operation, context) => {
        try {
          // 尝试使用简化模型或规则引擎
          return await this.simplifiedAnalysis(context);
        } catch (fallbackError) {
          // 如果降级也失败，返回预定义的结果
          return this.getDefaultResult(context);
        }
      }
    });
    
    // 3. 缓存策略（返回最近的缓存结果）
    this.strategies.set('cache_fallback', {
      name: 'cached_response',
      canHandle: (error) => this.hasRecentCache(context),
      execute: async (operation, context) => {
        const cached = await this.cacheService.getRecentSimilar(
          context.cacheKey,
          { maxAge: 24 * 60 * 60 * 1000 } // 24小时内的缓存
        );
        
        if (cached) {
          this.logger.warn('使用缓存结果作为降级', {
            cacheAge: cached.age,
            context
          });
          
          return cached.data;
        }
        
        throw new Error('No cached result available');
      }
    });
  }
  
  // 智能错误路由
  async handleError<T>(
    error: any,
    context: ErrorContext,
    operation: () => Promise<T>
  ): Promise<T> {
    // 1. 记录错误
    this.logError(error, context);
    
    // 2. 识别错误类型
    const errorType = this.classifyError(error);
    
    // 3. 选择处理策略（按优先级）
    const strategies = this.getApplicableStrategies(errorType, context);
    
    // 4. 按顺序尝试策略
    for (const strategy of strategies) {
      try {
        const result = await strategy.execute(operation, context);
        
        // 记录降级成功
        this.metrics.recordFallbackSuccess(strategy.name);
        
        return result;
      } catch (strategyError) {
        // 策略失败，尝试下一个
        continue;
      }
    }
    
    // 5. 所有策略都失败，抛出最终错误
    throw this.wrapFinalError(error, context);
  }
}

// 错误监控和报警
class AiErrorMonitor {
  private metrics: Map<string, ErrorMetrics> = new Map();
  private alertRules: AlertRule[] = [];
  
  constructor() {
    this.setupAlertRules();
  }
  
  private setupAlertRules() {
    this.alertRules = [
      {
        name: 'high_error_rate',
        condition: (metrics) => {
          const window = metrics.getWindow('1h');
          return window.errorRate > 0.1; // 10%错误率
        },
        action: async (metrics) => {
          // 发送警报
          await this.sendAlert({
            severity: 'critical',
            title: 'AI服务错误率过高',
            message: `过去1小时错误率${metrics.errorRate.toFixed(2)}%`,
            data: metrics
          });
          
          // 自动触发诊断
          await this.triggerDiagnostics();
        }
      },
      {
        name: 'response_time_degradation',
        condition: (metrics) => {
          const current = metrics.getWindow('5m');
          const baseline = metrics.getBaseline();
          return current.avgResponseTime > baseline.avgResponseTime * 2;
        },
        action: async (metrics) => {
          await this.sendAlert({
            severity: 'warning',
            title: 'AI服务响应时间下降',
            message: `当前响应时间${current.avgResponseTime}ms，比基线高100%`
          });
        }
      }
    ];
  }
  
  recordError(error: AiError) {
    const key = this.getErrorKey(error);
    const metrics = this.metrics.get(key) || new ErrorMetrics();
    
    metrics.record(error);
    this.metrics.set(key, metrics);
    
    // 检查警报规则
    this.checkAlerts(metrics);
    
    // 自动调整策略
    this.adjustStrategyBasedOnErrors(error);
  }
}
3.4 缓存策略优化
typescript
class AiCacheManager {
  private redis: Redis;
  private localCache: Map<string, CacheEntry>;
  private readonly cacheLayers = ['local', 'redis', 'persistent'];
  
  constructor() {
    this.setupCacheLayers();
  }
  
  private setupCacheLayers() {
    // 三层缓存架构
    this.localCache = new Map(); // 内存缓存，最快
    this.redis = new Redis(/* 配置 */); // 分布式缓存
    // persistent 层可以是数据库或文件系统
  }
  
  // 智能缓存键生成
  generateCacheKey(
    template: string,
    data: any,
    options: CacheKeyOptions
  ): string {
    // 1. 基础键
    const baseKey = `ai:${template}:${options.model || 'default'}`;
    
    // 2. 数据哈希（排除不稳定的字段）
    const stableData = this.extractStableFields(data);
    const dataHash = this.hashObject(stableData);
    
    // 3. 用户上下文
    const userContext = options.userId 
      ? `:user:${options.userId}` 
      : ':anonymous';
    
    // 4. 版本标识
    const version = options.version || 'v1';
    
    return `${baseKey}:${dataHash}${userContext}:${version}`;
  }
  
  // 自适应TTL计算
  calculateTTL(result: any, context: CacheContext): number {
    const baseTTL = 5 * 60; // 5分钟基础TTL
    
    // 根据置信度调整
    const confidence = result.confidence || 0.5;
    const confidenceMultiplier = Math.max(0.5, confidence);
    
    // 根据使用频率调整
    const frequency = this.getAccessFrequency(context.key);
    const frequencyMultiplier = frequency > 10 ? 2 : 1;
    
    // 根据数据新鲜度要求调整
    const freshnessRequirement = context.freshness || 'standard';
    const freshnessMultiplier = {
      'high': 0.2,    // 要求高新鲜度，TTL缩短
      'standard': 1,  // 标准新鲜度
      'low': 5        // 可接受较旧数据，TTL延长
    }[freshnessRequirement];
    
    return baseTTL * confidenceMultiplier * frequencyMultiplier * freshnessMultiplier;
  }
  
  // 缓存预热机制
  async warmUpCache(userId: string): Promise<void> {
    const userPatterns = await this.analyzeUserPatterns(userId);
    
    const warmUpTasks = userPatterns.map(pattern => {
      return this.precachePattern(pattern, userId);
    });
    
    // 并发预热，但控制并发数
    await this.executeWithConcurrency(warmUpTasks, 3);
  }
  
  private async precachePattern(pattern: UserPattern, userId: string) {
    // 基于用户模式预测可能的查询
    const likelyQueries = this.predictQueriesFromPattern(pattern);
    
    for (const query of likelyQueries) {
      try {
        // 异步预取结果
        const result = await this.aiService.process(query, { userId });
        
        // 缓存结果，设置较长TTL
        await this.set(
          this.generateCacheKey('prediction', query, { userId }),
          result,
          { ttl: 30 * 60 } // 30分钟
        );
      } catch (error) {
        // 预热失败不影响主流程
        this.logger.debug('预热缓存失败', { error, query });
      }
    }
  }
  
  // 缓存失效策略
  async invalidateRelatedCaches(entityType: string, entityId: string) {
    const patterns = [
      `${entityType}:${entityId}:*`,
      `*:${entityId}:*`,
      `user:*:${entityType}:${entityId}`
    ];
    
    for (const pattern of patterns) {
      await this.redis.delPattern(pattern);
    }
    
    // 清理本地缓存
    this.clearLocalCacheByPattern(pattern);
  }
}
3.5 学习与优化机制
typescript
class AiLearningSystem {
  private feedbackStore: FeedbackStore;
  private modelOptimizer: ModelOptimizer;
  private experimentManager: ExperimentManager;
  
  // 用户反馈收集
  async collectFeedback(
    request: AiRequest,
    response: AiResponse,
    userFeedback: UserFeedback
  ): Promise<void> {
    const feedbackRecord: FeedbackRecord = {
      id: uuid(),
      timestamp: new Date(),
      request: this.sanitizeRequest(request),
      originalResponse: response,
      userFeedback,
      corrections: userFeedback.corrections,
      rating: userFeedback.rating,
      metadata: {
        userId: request.userId,
        sessionId: request.sessionId,
        modelVersion: response.metadata?.modelVersion
      }
    };
    
    // 存储反馈
    await this.feedbackStore.save(feedbackRecord);
    
    // 实时分析反馈
    await this.analyzeFeedback(feedbackRecord);
    
    // 如果反馈是纠正，更新学习数据
    if (userFeedback.corrections) {
      await this.updateLearningData(feedbackRecord);
    }
  }
  
  // 模型优化建议
  async generateOptimizationSuggestions(): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    
    // 1. 分析错误模式
    const errorPatterns = await this.analyzeErrorPatterns();
    suggestions.push(...this.getSuggestionsFromErrors(errorPatterns));
    
    // 2. 分析用户反馈
    const feedbackAnalysis = await this.analyzeUserFeedback();
    suggestions.push(...this.getSuggestionsFromFeedback(feedbackAnalysis));
    
    // 3. 分析性能数据
    const performanceData = await this.analyzePerformance();
    suggestions.push(...this.getSuggestionsFromPerformance(performanceData));
    
    // 按优先级排序
    return suggestions.sort((a, b) => {
      const priorityScore = (s: OptimizationSuggestion) => {
        return s.expectedImpact * s.confidence * (s.implementationComplexity ? 1/s.implementationComplexity : 1);
      };
      
      return priorityScore(b) - priorityScore(a);
    });
  }
  
  // A/B测试框架
  class ABTestManager {
    private experiments: Map<string, Experiment> = new Map();
    private assignmentStrategy: AssignmentStrategy;
    
    // 创建实验
    async createExperiment(config: ExperimentConfig): Promise<string> {
      const experimentId = uuid();
      
      const experiment: Experiment = {
        id: experimentId,
        name: config.name,
        description: config.description,
        startDate: new Date(),
        status: 'active',
        variants: config.variants,
        metrics: config.metrics,
        assignment: {
          strategy: config.assignmentStrategy || 'random',
          weights: config.variantWeights || {}
        },
        targetAudience: config.targetAudience,
        exclusionGroups: config.exclusionGroups || []
      };
      
      this.experiments.set(experimentId, experiment);
      
      // 初始化数据收集
      await this.initExperimentTracking(experimentId);
      
      return experimentId;
    }
    
    // 分配变体
    assignVariant(
      experimentId: string,
      userId: string,
      context: AssignmentContext
    ): string {
      const experiment = this.experiments.get(experimentId);
      if (!experiment || experiment.status !== 'active') {
        return 'control'; // 默认返回控制组
      }
      
      // 检查排除条件
      if (this.shouldExclude(userId, experiment)) {
        return 'control';
      }
      
      // 应用分配策略
      switch (experiment.assignment.strategy) {
        case 'random':
          return this.assignRandom(experiment);
        case 'weighted':
          return this.assignWeighted(experiment);
        case 'contextual':
          return this.assignContextual(experiment, context);
        case 'bandit':
          return this.assignBandit(experiment, userId);
        default:
          return 'control';
      }
    }
    
    // 分析实验结果
    async analyzeExperiment(experimentId: string): Promise<ExperimentResult> {
      const experiment = this.experiments.get(experimentId);
      if (!experiment) {
        throw new Error(`Experiment ${experimentId} not found`);
      }
      
      // 收集所有指标数据
      const metricsData = await this.collectMetricsData(experimentId);
      
      // 统计显著性检验
      const results = this.calculateStatisticalSignificance(metricsData);
      
      // 生成报告
      const report: ExperimentResult = {
        experimentId,
        analysisDate: new Date(),
        totalParticipants: this.calculateTotalParticipants(metricsData),
        durationDays: this.calculateDuration(experiment),
        results,
        recommendations: this.generateRecommendations(results),
        confidenceLevel: this.calculateConfidence(results),
        rawData: metricsData
      };
      
      // 自动决策（可选）
      if (experiment.autoDecide && report.confidenceLevel > 0.95) {
        await this.implementWinningVariant(experimentId, report);
      }
      
      return report;
    }
  }
}
🔍 代码审查规范（完整版）
1. 代码审查流程
审查流程设计
typescript
interface CodeReviewProcess {
  // 阶段1：自动化检查（每次提交触发）
  automatedChecks: {
    staticAnalysis: boolean;    // 静态代码分析
    securityScan: boolean;      // 安全扫描
    testCoverage: boolean;      // 测试覆盖率检查
    buildValidation: boolean;   // 构建验证
    linting: boolean;           // 代码规范检查
  };
  
  // 阶段2：AI辅助审查（自动生成审查意见）
  aiAssistedReview: {
    enabled: boolean;
    focusAreas: Array<'security' | 'performance' | 'maintainability' | 'best-practices'>;
    severityThreshold: 'info' | 'warning' | 'error';
  };
  
  // 阶段3：人工审查（必要步骤）
  manualReview: {
    required: boolean;
    requiredApprovals: number;
    reviewTimeout: number; // 小时
    allowedReviewers: string[]; // 角色或用户列表
  };
  
  // 阶段4：合并前检查
  preMergeChecks: {
    conflictCheck: boolean;
    integrationTest: boolean;
    performanceRegression: boolean;
    deployPreview: boolean;
  };
}

// 代码审查检查表
const CodeReviewChecklist = {
  // 通用检查项
  general: [
    { id: 'G001', description: '代码符合项目编码规范', required: true },
    { id: 'G002', description: '有意义的提交信息', required: true },
    { id: 'G003', description: '适当的代码注释', required: false },
    { id: 'G004', description: '删除未使用的代码', required: true },
    { id: 'G005', description: '代码复杂度合理', required: true },
  ],
  
  // 安全性检查项
  security: [
    { id: 'S001', description: '无硬编码的敏感信息', required: true },
    { id: 'S002', description: '输入验证和清理', required: true },
    { id: 'S003', description: 'SQL注入防护', required: true },
    { id: 'S004', description: 'XSS防护', required: true },
    { id: 'S005', description: 'CSRF防护', required: true },
    { id: 'S006', description: '认证授权检查', required: true },
    { id: 'S007', description: 'API速率限制', required: false },
    { id: 'S008', description: '日志中无敏感信息', required: true },
  ],
  
  // 性能检查项
  performance: [
    { id: 'P001', description: '数据库查询优化', required: true },
    { id: 'P002', description: '缓存策略合理', required: true },
    { id: 'P003', description: '内存泄漏检查', required: true },
    { id: 'P004', description: '异步处理耗时操作', required: true },
    { id: 'P005', description: '前端资源优化', required: true },
    { id: 'P006', description: 'API响应时间合理', required: true },
  ],
  
  // 测试相关检查项
  testing: [
    { id: 'T001', description: '有相应的单元测试', required: true },
    { id: 'T002', description: '测试覆盖率达标', required: true },
    { id: 'T003', description: '边缘情况测试', required: true },
    { id: 'T004', description: '集成测试覆盖', required: false },
    { id: 'T005', description: '测试代码质量', required: true },
  ],
  
  // 可维护性检查项
  maintainability: [
    { id: 'M001', description: '单一职责原则', required: true },
    { id: 'M002', description: '依赖注入合理', required: true },
    { id: 'M003', description: '配置外部化', required: true },
    { id: 'M004', description: '错误处理完整', required: true },
    { id: 'M005', description: '日志记录适当', required: true },
    { id: 'M006', description: '文档完整/更新', required: true },
  ]
};
2. AI辅助代码审查
AI审查提示词设计
javascript
const codeReviewPrompt = `
你是一个经验丰富的全栈开发工程师，正在进行代码审查。请仔细审查以下代码。

## 审查代码
文件路径：{{filePath}}
代码类型：{{codeType}} (如：TypeScript、Python、SQL等)

\`\`\`{{language}}
{{codeSnippet}}
\`\`\`

## 上下文信息
- 项目类型：智能记账软件
- 技术栈：{{techStack}}
- 相关PR描述：{{prDescription}}
- 修改目的：{{changePurpose}}

## 审查要求
请从以下几个方面进行审查，每个问题提供：
1. 问题描述
2. 严重程度（Critical/High/Medium/Low/Info）
3. 影响范围
4. 具体修改建议
5. 最佳实践示例（如果需要）

## 审查维度

### 1. 安全性审查
重点检查：
- 输入验证和清理
- SQL注入风险
- XSS漏洞
- 敏感信息泄露
- 认证授权漏洞
- 不安全依赖
- 硬编码凭证

### 2. 性能审查
重点检查：
- 数据库查询优化（N+1问题、缺少索引）
- 算法复杂度（时间和空间）
- 内存泄漏风险
- 不必要的计算或渲染
- 网络请求优化
- 缓存策略合理性

### 3. 代码质量审查
重点检查：
- TypeScript类型安全（any使用、类型断言）
- 代码重复度（DRY原则）
- 函数复杂度（圈复杂度 > 10）
- 错误处理完整性
- 异步处理正确性
- 资源管理（关闭连接、释放资源）

### 4. 可维护性审查
重点检查：
- 单一职责原则
- 开闭原则
- 依赖注入合理
- 配置外部化
- 适当的注释和文档
- 清晰的命名
- 合理的代码结构

### 5. 测试审查
重点检查：
- 测试覆盖率
- 测试质量（边界条件、异常情况）
- 测试的可维护性
- 测试的性能影响

## 输出格式
请返回JSON格式：
{
  "summary": {
    "overallAssessment": "总体评价",
    "riskLevel": "风险等级",
    "confidence": 0.95
  },
  "issues": [
    {
      "id": "问题唯一标识",
      "type": "security|performance|quality|maintainability|test",
      "severity": "critical|high|medium|low|info",
      "description": "详细问题描述",
      "location": {
        "file": "文件路径",
        "line": 行号,
        "column": 列号
      },
      "impact": "可能的影响",
      "suggestion": "具体的修改建议",
      "codeExample": "改进后的代码示例（如果适用）",
      "references": [
        {
          "type": "documentation|article|rule",
          "title": "参考标题",
          "url": "参考链接"
        }
      ]
    }
  ],
  "positiveFindings": [
    {
      "aspect": "做得好的方面",
      "description": "具体描述",
      "example": "代码示例"
    }
  ],
  "recommendations": {
    "mustFix": ["必须修复的问题ID列表"],
    "shouldFix": ["建议修复的问题ID列表"],
    "consider": ["可以考虑的改进ID列表"]
  },
  "metrics": {
    "estimatedTimeToFix": "预估修复时间",
    "complexityScore": "复杂度评分",
    "riskScore": "风险评分"
  }
}

## 注意事项
1. 区分必须修复和建议修复的问题
2. 提供具体的代码示例
3. 引用相关的编码规范或最佳实践
4. 考虑项目的具体上下文
5. 保持建设性和专业性
`;
AI审查实现示例
typescript
class AICodeReviewer {
  private deepseekService: DeepSeekService;
  private ruleEngine: RuleEngine;
  private metricsCollector: MetricsCollector;
  
  async reviewCode(request: ReviewRequest): Promise<ReviewResult> {
    const startTime = Date.now();
    
    try {
      // 1. 规则引擎检查（快速、确定性的问题）
      const ruleResults = await this.ruleEngine.analyze(request.code);
      
      // 2. AI深度分析（复杂、需要上下文理解的问题）
      const aiResults = await this.deepseekReview(request);
      
      // 3. 合并结果
      const allIssues = [...ruleResults.issues, ...aiResults.issues];
      
      // 4. 去重和排序
      const uniqueIssues = this.deduplicateIssues(allIssues);
      const sortedIssues = this.sortIssuesBySeverity(uniqueIssues);
      
      // 5. 生成综合报告
      const report = this.generateReport(
        sortedIssues,
        ruleResults.metrics,
        aiResults.metrics
      );
      
      // 6. 记录指标
      this.metricsCollector.recordReview({
        duration: Date.now() - startTime,
        fileType: request.fileType,
        issuesFound: report.issues.length,
        aiConfidence: aiResults.confidence
      });
      
      return report;
      
    } catch (error) {
      // 降级到规则引擎
      const fallbackResults = await this.ruleEngine.analyze(request.code);
      
      return {
        issues: fallbackResults.issues,
        summary: {
          overallAssessment: 'AI审查失败，使用规则引擎结果',
          riskLevel: 'medium',
          confidence: 0.7
        },
        metrics: {
          aiFailed: true,
          error: error.message
        }
      };
    }
  }
  
  private async deepseekReview(request: ReviewRequest): Promise<AIReviewResult> {
    // 构建提示词
    const prompt = this.buildReviewPrompt(request);
    
    // 调用AI服务
    const response = await this.deepseekService.callApi<AIReviewResult>(prompt, {
      model: 'deepseek-chat',
      temperature: 0.1, // 低温度，确保审查严谨性
      maxTokens: 4000,
      useCache: true,
      cacheKey: this.generateCacheKey(request)
    });
    
    // 验证AI响应
    this.validateAIResponse(response);
    
    return response;
  }
  
  private buildReviewPrompt(request: ReviewRequest): string {
    const template = `
# 代码审查请求

## 代码信息
文件路径：${request.filePath}
文件类型：${request.fileType}
代码片段：
\`\`\`${request.language}
${request.code}
\`\`\`

## 上下文信息
- 项目：智能记账助手
- 技术栈：${JSON.stringify(request.techStack)}
- 相关修改：${request.relatedChanges || '无'}
- 代码目的：${request.purpose}

## 审查重点
请特别关注以下方面：
${request.focusAreas?.map(area => `- ${area}`).join('\n')}

## 已知问题
${request.knownIssues?.map(issue => `- ${issue}`).join('\n') || '无'}

## 审查深度
${request.depth === 'deep' ? '进行深度审查，包括潜在的优化建议' : '进行常规审查'}
    `;
    
    return template;
  }
}
3. 具体审查要点示例
3.1 安全性审查细节
typescript
// 常见安全问题检查示例
class SecurityReviewer {
  
  async checkSqlInjection(code: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    
    // 检查字符串拼接的SQL
    const sqlPatterns = [
      /execute\(.*\+.*\)/g,
      /query\(.*\$\{.*\}.*\)/g,
      /`SELECT.*\$\{.*\}`/g
    ];
    
    for (const pattern of sqlPatterns) {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        issues.push({
          type: 'security',
          severity: 'critical',
          description: '潜在的SQL注入漏洞',
          location: this.getLocation(code, match.index!),
          suggestion: '使用参数化查询或ORM提供的安全方法',
          example: {
            bad: 'connection.query(`SELECT * FROM users WHERE id = ${id}`)',
            good: 'connection.query("SELECT * FROM users WHERE id = ?", [id])'
          }
        });
      }
    }
    
    return issues;
  }
  
  async checkXssVulnerabilities(code: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    
    // 检查React中的XSS风险
    const dangerousPatterns = [
      {
        pattern: /dangerouslySetInnerHTML/g,
        description: '使用dangerouslySetInnerHTML可能导致XSS',
        suggestion: '使用安全的替代方案，如textContent或经过清理的HTML'
      },
      {
        pattern: /innerHTML\s*=/g,
        description: '直接设置innerHTML可能导致XSS',
        suggestion: '使用textContent或DOMPurify清理HTML'
      },
      {
        pattern: /eval\(/g,
        description: '使用eval函数可能导致代码注入',
        suggestion: '避免使用eval，使用JSON.parse或Function构造函数（如果需要）'
      }
    ];
    
    for (const check of dangerousPatterns) {
      if (check.pattern.test(code)) {
        issues.push({
          type: 'security',
          severity: 'high',
          description: check.description,
          location: this.getLocation(code, code.search(check.pattern)),
          suggestion: check.suggestion
        });
      }
    }
    
    return issues;
  }
  
  async checkSensitiveDataExposure(code: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    
    // 检查硬编码的敏感信息
    const sensitivePatterns = [
      { pattern: /password\s*=\s*["'].*["']/, type: '硬编码密码' },
      { pattern: /api[Kk]ey\s*=\s*["'].*["']/, type: '硬编码API密钥' },
      { pattern: /secret\s*=\s*["'].*["']/, type: '硬编码密钥' },
      { pattern: /token\s*=\s*["'].*["']/, type: '硬编码令牌' },
      { pattern: /private[Kk]ey\s*=\s*["'].*["']/, type: '硬编码私钥' }
    ];
    
    for (const sensitive of sensitivePatterns) {
      const matches = code.matchAll(sensitive.pattern);
      for (const match of matches) {
        issues.push({
          type: 'security',
          severity: 'critical',
          description: `发现${sensitive.type}`,
          location: this.getLocation(code, match.index!),
          suggestion: '将敏感信息移到环境变量或配置文件中',
          example: {
            bad: 'const apiKey = "sk-1234567890abcdef"',
            good: 'const apiKey = process.env.API_KEY'
          }
        });
      }
    }
    
    return issues;
  }
}
3.2 性能审查细节
typescript
class PerformanceReviewer {
  
  async checkDatabaseQueries(code: string): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    // 检查N+1查询问题
    const nPlusOnePatterns = [
      {
        pattern: /for.*of.*\.map.*await.*find/g,
        description: '可能的N+1查询问题',
        suggestion: '使用批量查询或关联预加载'
      },
      {
        pattern: /\.forEach.*await.*find/g,
        description: '循环内的数据库查询',
        suggestion: '将查询移到循环外，使用批量操作'
      }
    ];
    
    for (const check of nPlusOnePatterns) {
      if (check.pattern.test(code)) {
        issues.push({
          type: 'performance',
          severity: 'high',
          description: check.description,
          location: this.getLocation(code, code.search(check.pattern)),
          suggestion: check.suggestion,
          example: {
            bad: `users.forEach(async user => {
  const orders = await Order.find({ userId: user.id });
})`,
            good: `const userIds = users.map(u => u.id);
const allOrders = await Order.find({ userId: { $in: userIds } });`
          }
        });
      }
    }
    
    return issues;
  }
  
  async checkMemoryLeaks(code: string): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    // 检查常见的内存泄漏模式
    const leakPatterns = [
      {
        pattern: /setInterval.*=>/g,
        description: '未清理的setInterval可能导致内存泄漏',
        suggestion: '在组件卸载或不再需要时清除interval'
      },
      {
        pattern: /addEventListener.*=>.*removeEventListener/g,
        description: '事件监听器未正确移除',
        suggestion: '确保每个addEventListener都有对应的removeEventListener'
      },
      {
        pattern: /new Promise.*resolve.*reject/g,
        description: '未处理的Promise可能导致内存泄漏',
        suggestion: '总是处理Promise的拒绝情况'
      }
    ];
    
    for (const check of leakPatterns) {
      const matches = code.matchAll(check.pattern);
      for (const match of matches) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          description: check.description,
          location: this.getLocation(code, match.index!),
          suggestion: check.suggestion,
          example: {
            bad: `useEffect(() => {
  const interval = setInterval(() => {
    // 一些操作
  }, 1000);
  // 缺少清理
}, []);`,
            good: `useEffect(() => {
  const interval = setInterval(() => {
    // 一些操作
  }, 1000);
  return () => clearInterval(interval);
}, []);`
          }
        });
      }
    }
    
    return issues;
  }
  
  async checkAlgorithmComplexity(code: string): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    // 检查高复杂度算法
    const complexityPatterns = [
      {
        pattern: /for.*for.*for/g,
        description: '三层嵌套循环，时间复杂度O(n³)',
        suggestion: '考虑优化算法，降低复杂度'
      },
      {
        pattern: /\.sort\(.*\)\.filter\(.*\)\.map\(.*\)\.reduce/g,
        description: '连续的数据转换可能导致性能问题',
        suggestion: '合并操作或使用更高效的数据结构'
      }
    ];
    
    for (const check of complexityPatterns) {
      if (check.pattern.test(code)) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          description: check.description,
          location: this.getLocation(code, code.search(check.pattern)),
          suggestion: check.suggestion
        });
      }
    }
    
    return issues;
  }
}
3.3 代码质量审查细节
typescript
class CodeQualityReviewer {
  
  async checkTypeScriptSafety(code: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    
    // 检查TypeScript类型安全问题
    const typeSafetyPatterns = [
      {
        pattern: /as any/g,
        description: '使用类型断言any',
        suggestion: '使用更具体的类型或泛型'
      },
      {
        pattern: /:\s*any\s*(?!=)/g,
        description: '使用any类型',
        suggestion: '使用unknown或更具体的类型'
      },
      {
        pattern: /!\s*;/g,
        description: '使用非空断言操作符',
        suggestion: '添加空值检查或使用可选链'
      }
    ];
    
    for (const check of typeSafetyPatterns) {
      const matches = code.matchAll(check.pattern);
      for (const match of matches) {
        issues.push({
          type: 'quality',
          severity: 'medium',
          description: check.description,
          location: this.getLocation(code, match.index!),
          suggestion: check.suggestion,
          example: {
            bad: 'const data = response.data as any;',
            good: 'const data = response.data as UserData;'
          }
        });
      }
    }
    
    return issues;
  }
  
  async checkCodeDuplication(code: string, context?: CodeContext): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    
    // 使用AST分析代码重复
    const ast = this.parseToAST(code);
    const duplicates = this.findDuplicateCodeBlocks(ast);
    
    for (const duplicate of duplicates) {
      if (duplicate.similarity > 0.8) {
        issues.push({
          type: 'quality',
          severity: 'medium',
          description: `发现重复代码，相似度${Math.round(duplicate.similarity * 100)}%`,
          location: duplicate.locations[0],
          suggestion: '提取公共函数或组件',
          references: duplicate.locations.slice(1)
        });
      }
    }
    
    return issues;
  }
  
  async checkErrorHandling(code: string): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    
    // 检查错误处理完整性
    const errorHandlingPatterns = [
      {
        pattern: /try\s*{[\s\S]*?\}\s*catch\s*\(\s*\)/g,
        description: '空的catch块',
        suggestion: '在catch块中处理错误或记录日志'
      },
      {
        pattern: /async.*=>.*\{[^}]*await[^}]*\}(?!\s*catch)/g,
        description: '异步函数缺少错误处理',
        suggestion: '添加try-catch或.catch()处理错误'
      },
      {
        pattern: /throw new Error\(["'][^"']*["']\)/g,
        description: '抛出通用错误',
        suggestion: '使用具体的错误类型，提供更多上下文'
      }
    ];
    
    for (const check of errorHandlingPatterns) {
      const matches = code.matchAll(check.pattern);
      for (const match of matches) {
        issues.push({
          type: 'quality',
          severity: 'medium',
          description: check.description,
          location: this.getLocation(code, match.index!),
          suggestion: check.suggestion,
          example: {
            bad: `try {
  await someAsyncOperation();
} catch {}`,
            good: `try {
  await someAsyncOperation();
} catch (error) {
  logger.error('操作失败', error);
  throw new OperationError('操作失败', { cause: error });
}`
          }
        });
      }
    }
    
    return issues;
  }
}
4. 代码审查报告模板
typescript
interface CodeReviewReport {
  // 基本信息
  metadata: {
    reviewId: string;
    reviewDate: string;
    reviewer: string; // 人或AI
    filePath: string;
    commitHash: string;
    timeSpent: number; // 分钟
  };
  
  // 审查结果概览
  summary: {
    overallStatus: 'approved' | 'changes_requested' | 'blocked';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidenceScore: number; // 0-1，AI审查的置信度
    statistics: {
      totalIssues: number;
      criticalIssues: number;
      highIssues: number;
      mediumIssues: number;
      lowIssues: number;
      securityIssues: number;
      performanceIssues: number;
      qualityIssues: number;
    };
  };
  
  // 详细问题列表
  issues: Array<{
    id: string;
    type: 'security' | 'performance' | 'quality' | 'maintainability' | 'test';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    status: 'open' | 'resolved' | 'won\'t_fix';
    title: string;
    description: string;
    
    // 位置信息
    location: {
      file: string;
      line: number;
      column?: number;
      codeSnippet: string;
    };
    
    // 影响分析
    impact: {
      description: string;
      probability: 'low' | 'medium' | 'high';
      businessImpact: 'low' | 'medium' | 'high';
      userImpact: string;
    };
    
    // 建议
    suggestion: string;
    codeExample?: {
      before: string;
      after: string;
    };
    
    // 参考
    references?: Array<{
      type: 'documentation' | 'article' | 'rule';
      title: string;
      url: string;
    }>;
    
    // 处理
    assignedTo?: string;
    dueDate?: string;
    resolution?: string;
  }>;
  
  // 正面反馈
  positiveAspects: Array<{
    aspect: string;
    description: string;
    codeExample: string;
  }>;
  
  // 改进建议
  recommendations: {
    immediateActions: string[];
    shortTermImprovements: string[];
    longTermConsiderations: string[];
  };
  
  // 指标和建议
  metrics: {
    estimatedFixTime: number; // 小时
    complexityScore: number; // 0-100
    maintainabilityIndex: number; // 0-100
    testCoverage: number; // 百分比
    
    // AI特定指标
    aiMetrics?: {
      modelUsed: string;
      confidence: number;
      processingTime: number;
      cacheHit: boolean;
    };
  };
  
  // 审查结论
  conclusion: {
    canMerge: boolean;
    mergeConditions: string[];
    nextSteps: string[];
    reviewComplete: boolean;
  };
}

// 报告生成器
class ReviewReportGenerator {
  async generateReport(
    issues: ReviewIssue[],
    metrics: ReviewMetrics,
    context: ReviewContext
  ): Promise<CodeReviewReport> {
    
    // 分析统计数据
    const stats = this.calculateStatistics(issues);
    
    // 确定总体状态
    const overallStatus = this.determineOverallStatus(issues);
    
    // 评估风险等级
    const riskLevel = this.calculateRiskLevel(issues, context);
    
    // 生成报告
    return {
      metadata: {
        reviewId: uuid(),
        reviewDate: new Date().toISOString(),
        reviewer: context.reviewer || 'AI Assistant',
        filePath: context.filePath,
        commitHash: context.commitHash,
        timeSpent: metrics.timeSpent
      },
      summary: {
        overallStatus,
        riskLevel,
        confidenceScore: metrics.confidence || 0.8,
        statistics: stats
      },
      issues: this.formatIssues(issues),
      positiveAspects: this.extractPositiveAspects(issues, context),
      recommendations: this.generateRecommendations(issues, context),
      metrics: {
        estimatedFixTime: this.estimateFixTime(issues),
        complexityScore: this.calculateComplexityScore(context.code),
        maintainabilityIndex: this.calculateMaintainabilityIndex(context.code),
        testCoverage: context.testCoverage || 0
      },
      conclusion: {
        canMerge: overallStatus === 'approved',
        mergeConditions: this.getMergeConditions(issues),
        nextSteps: this.getNextSteps(issues, context),
        reviewComplete: true
      }
    };
  }
}
5. 集成到开发流程
yaml
# .github/workflows/code-review.yml
name: Code Review Automation

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main, develop]

jobs:
  automated-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run static analysis
        run: npm run lint
        
      - name: Run security scan
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high
        
      - name: Run tests with coverage
        run: npm run test:coverage
        
      - name: AI Code Review
        if: always()
        uses: your-org/ai-code-review-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openai_key: ${{ secrets.OPENAI_KEY }}
          config_path: .aicodereview.yaml
        
      - name: Generate Review Report
        if: always()
        run: npm run review:report
        
      - name: Upload Review Report
        uses: actions/upload-artifact@v3
        with:
          name: code-review-report
          path: review-report.json
          
  human-review:
    needs: [automated-review]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Check Review Results
        uses: your-org/review-gate@v1
        with:
          required-checks: |
            lint
            security-scan
            test-coverage
            ai-review
          min-approvals: 2
          allowed-reviewers: team-leads,senior-developers
          
      - name: Notify Reviewers
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ 代码审查未通过，请查看自动化检查结果并处理发现的问题。'
            })#   s m a r t - f i n a n c e - a s s i s t a n t  
 