# Planning Context: 安全风险分析

## 上下文摘要
- 前端: Vue 3 + Pinia + Vue Router + Ant Design Vue + Axios
- 后端: **完全未实现**（仅有 README 目录结构）
- 数据库: MySQL 8.0, schema 已设计完成
- 部署: Docker + Azure AKS + GitHub Actions CI/CD
- 安全工具: Trivy（已集成）

## 推荐路由
- `security-audit` Skill — OWASP Top 10 系统化安全审查

## 审查范围
- frontend/src/stores/user.ts — 认证逻辑
- frontend/src/utils/api.ts — API 配置
- frontend/src/router/index.ts — 路由守卫
- frontend/src/views/auth/LoginPage.vue — 登录页
- docker-compose.dev.yml — 开发环境配置
- database/seeds/test_users.sql — 测试数据
- deployment/aks/ — K8s 部署配置
- frontend/nginx.conf — Nginx 安全配置
- frontend/package.json — 依赖清单

## 开放问题
1. 后端完全未实现，当前所有安全控制仅依赖前端
2. Mock 认证是否仅用于开发阶段？
3. 生产环境 Secrets 管理策略是否已确定？
