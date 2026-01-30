# Contoso.tech 企业在线培训平台

> 基于 Vue.js 3.x 和 Spring Boot 的现代化企业在线学习管理系统

## 项目概述

Contoso.tech 企业在线培训平台是一个为企业提供完整在线学习解决方案的现代化 Web 应用程序。该平台采用前后端分离的架构设计，提供用户友好的界面和强大的管理功能，帮助企业构建高效的内部培训体系。

### 核心特性

✅ **用户管理系统**
- 用户注册与登录
- 基于角色的权限控制 (学员、讲师、管理员)
- 个人资料管理
- 密码重置和安全验证

✅ **课程管理系统**
- 课程创建、编辑和发布
- 多级课程分类管理
- 课程内容管理 (文档、视频、测试)
- 课程状态跟踪

✅ **学习功能**
- 课程浏览和搜索
- 实时学习进度跟踪
- 课程完成认证
- 学习历史记录

✅ **响应式设计**
- 现代化 UI/UX 设计
- 移动端友好
- 多设备适配

### 技术栈

#### 前端技术
- **框架**: Vue.js 3.x
- **构建工具**: Vite
- **UI 组件**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **样式**: SCSS

#### 后端技术
- **框架**: Spring Boot 3.x
- **语言**: Java 17+
- **安全**: Spring Security + JWT
- **数据库**: MySQL 8.0
- **ORM**: Spring Data JPA
- **构建工具**: Maven
- **API 文档**: OpenAPI 3.0

#### 基础设施
- **容器化**: Docker & Docker Compose
- **代理服务器**: Nginx
- **数据库**: MySQL
- **部署**: Kubernetes (可选)

## 快速开始

### 前置要求
- Node.js 18+
- Java 17+
- MySQL 8.0+
- Docker (推荐)

### 使用 Docker 快速启动 (推荐)

```bash
# 1. 克隆项目
git clone https://github.com/nickhou1983/e-learning.git
cd e-learning

# 2. 启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 3. 访问应用
# 前端: http://localhost:3000
# 后端 API: http://localhost:8080
# API 文档: http://localhost:8080/swagger-ui.html
```

### 手动安装

#### 1. 数据库设置
```bash
# 启动 MySQL
docker run -d --name mysql-elearning \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=elearning \
  -e MYSQL_USER=elearning_user \
  -e MYSQL_PASSWORD=elearning_pass \
  -p 3306:3306 mysql:8.0

# 导入数据库架构
mysql -u elearning_user -p elearning < database/schema.sql
```

#### 2. 后端设置
```bash
cd backend

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件设置数据库连接信息

# 安装依赖并启动
./mvnw clean install
./mvnw spring-boot:run
```

#### 3. 前端设置
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 默认账户
- **管理员**: admin@contoso.com / admin123
- **讲师**: teacher@contoso.com / teacher123
- **学员**: student@contoso.com / student123

## 项目结构

```
e-learning/
├── README.md                 # 项目说明
├── docker-compose.yml        # Docker 编排配置
├── docs/                     # 项目文档
│   ├── architecture.md       # 系统架构设计
│   ├── database-design.md    # 数据库设计
│   ├── api-design.md         # API 设计文档
│   ├── frontend-design.md    # 前端设计文档
│   ├── project-structure.md  # 项目结构说明
│   ├── development-setup.md  # 开发环境搭建
│   └── deployment.md         # 部署指南
├── frontend/                 # Vue.js 前端项目
├── backend/                  # Spring Boot 后端项目
├── database/                 # 数据库脚本和迁移
├── deployment/               # 部署配置文件
└── scripts/                  # 构建和部署脚本
```

## 开发指南

### 开发环境搭建
详细的开发环境配置请参考 [开发环境搭建指南](docs/development-setup.md)

### API 文档
- 在线 API 文档: http://localhost:8080/swagger-ui.html
- API 设计文档: [docs/api-design.md](docs/api-design.md)

### 数据库设计
详细的数据库结构设计请参考 [数据库设计文档](docs/database-design.md)

### 前端开发
- 组件库: Element Plus
- 路由配置: Vue Router 4
- 状态管理: Pinia
- 详细设计: [前端设计文档](docs/frontend-design.md)

### 后端开发
- RESTful API 设计
- JWT 认证授权
- Spring Security 安全配置
- JPA 数据访问层

## 部署指南

### 开发环境部署
```bash
# 使用 Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

### 生产环境部署
```bash
# 构建生产镜像
./scripts/build.sh

# 部署到生产环境
./scripts/deploy.sh production
```

详细部署说明请参考 [部署指南](docs/deployment.md)

## 测试

### 前端测试
```bash
cd frontend

# 单元测试
npm run test

# 端到端测试
npm run test:e2e

# 代码覆盖率
npm run test:coverage
```

### 后端测试
```bash
cd backend

# 运行所有测试
./mvnw test

# 生成测试报告
./mvnw test jacoco:report
```

## 贡献指南

### 开发流程
1. Fork 项目到个人仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范
- 前端: ESLint + Prettier
- 后端: Checkstyle + SpotBugs
- 提交信息: Conventional Commits

### 分支命名规范
- `feature/功能名称` - 新功能开发
- `bugfix/问题描述` - 错误修复
- `hotfix/紧急修复` - 紧急修复
- `docs/文档更新` - 文档更新

## 系统架构

### 整体架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │◄───│   Load Balancer │◄───│   Vue.js App    │
│                 │    │    (Nginx)      │    │   (Frontend)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Spring Boot    │
                       │   (Backend)     │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     MySQL       │
                       │   (Database)    │
                       └─────────────────┘
```

### 技术架构
- **表现层**: Vue.js 3.x + Ant Design Vue
- **业务层**: Spring Boot + Spring Security
- **数据层**: MySQL + Spring Data JPA
- **缓存层**: Redis (Phase 2)
- **消息队列**: RabbitMQ (Phase 2)

### 架构文档
- **📖 [完整架构说明](docs/ARCHITECTURE_OVERVIEW.md)** - 系统架构全面解析（推荐阅读）
- [系统架构设计](docs/architecture.md) - 架构设计详解
- [数据库设计](docs/database-design.md) - 数据模型设计
- [API 设计](docs/api-design.md) - API 接口规范

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- **项目维护者**: Contoso Development Team
- **邮箱**: dev-team@contoso.com
- **问题反馈**: [GitHub Issues](https://github.com/nickhou1983/e-learning/issues)

## 版本历史

### v1.0.0 (MVP)
- ✅ 基础用户管理
- ✅ 课程管理系统
- ✅ 学习功能
- ✅ 响应式UI设计

### v1.1.0 (计划中)
- 🔄 高级搜索功能
- 🔄 课程评价系统
- 🔄 学习统计分析
- 🔄 移动端 App

### v2.0.0 (长期规划)
- 📋 视频会议集成
- 📋 AI 智能推荐
- 📋 多语言支持
- 📋 社交学习功能

## 致谢

感谢所有为这个项目做出贡献的开发者和测试人员。

---

**开始你的在线学习之旅! 🚀**