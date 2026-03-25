# Planning Context — 安全漏洞分析

## 上下文摘要
用户要求全面分析代码仓库安全漏洞，涉及前端认证/鉴权、API 安全、数据库种子数据、Docker/K8s 部署、CI/CD 流水线等多个维度。

## 推荐路由
- **主路由**: security-audit Skill (P1 安全专项)
- **命中优先级**: P1
- **编排模式**: 单步

## 关键文件
- frontend/src/stores/user.ts — 认证核心，含硬编码模拟登录
- frontend/src/utils/api.ts — API层安全
- frontend/src/router/index.ts — 路由守卫
- frontend/src/views/auth/LoginPage.vue — 登录页凭据暴露
- frontend/src/components/DebugPanel.vue — 调试面板生产泄露
- frontend/nginx.conf — CSP/安全头
- docker-compose.dev.yml — 硬编码密钥
- .github/workflows/frontend-deploy.yml — CI/CD安全
- deployment/aks/frontend/*.yaml — K8s安全配置
- database/seeds/*.sql — 种子数据安全

## 开放问题
1. 后端认证 API 是否已实现？
2. 项目是否已部署到生产环境？
3. TLS 证书管理方案？
