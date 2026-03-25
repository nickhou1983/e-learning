# 架构说明快速入口

本文档提供项目架构文档的快速导航。

## 📖 核心架构文档

### [完整架构说明 (ARCHITECTURE_OVERVIEW.md)](docs/ARCHITECTURE_OVERVIEW.md)
**强烈推荐首先阅读此文档**

这是对整个 Contoso.tech 企业在线培训平台的全面架构说明，包含：

- **项目概述**: 项目简介、核心价值、主要功能
- **系统架构**: 整体架构、技术栈详解（前端、后端、基础设施）
- **数据库架构**: 数据模型、表结构设计、设计原则
- **模块功能**: 用户管理、课程管理、学习功能、系统管理
- **安全架构**: 认证授权、数据安全、API 安全
- **部署架构**: 开发环境、生产环境（Azure AKS）、CI/CD 流水线
- **性能优化**: 前端优化、后端优化、监控和日志
- **开发规范**: 代码规范、Git 工作流、测试策略
- **技术债务**: 当前状态、Phase 2 规划、长期技术演进
- **总结**: 架构优势、当前状态、下一步工作

**文档规模**: 26KB，695 行，10 个主要章节

---

## 📚 其他架构相关文档

### 详细设计文档
- [系统架构设计 (architecture.md)](docs/architecture.md) - 原有架构设计文档
- [数据库设计 (database-design.md)](docs/database-design.md) - 数据库表结构和关系
- [API 设计 (api-design.md)](docs/api-design.md) - RESTful API 接口规范
- [前端设计 (frontend-design.md)](docs/frontend-design.md) - 前端架构和组件设计
- [项目结构 (project-structure.md)](docs/project-structure.md) - 目录结构说明
- [技术规格说明 (technical-specifications.md)](docs/technical-specifications.md) - 详细技术规格

### 运维和部署
- [部署指南 (deployment.md)](docs/deployment.md) - 各环境部署说明
- [开发环境搭建 (development-setup.md)](docs/development-setup.md) - 本地开发环境配置
- [Azure AKS 部署 (deployment/aks/README.md)](deployment/aks/README.md) - Kubernetes 部署配置

### 决策和上下文
- [产品上下文 (memory-bank/productContext.md)](memory-bank/productContext.md) - 产品背景和功能
- [决策日志 (memory-bank/decisionLog.md)](memory-bank/decisionLog.md) - 技术决策记录
- [系统模式 (memory-bank/systemPatterns.md)](memory-bank/systemPatterns.md) - 设计模式和最佳实践

---

## 🎯 阅读建议

### 对于新加入的开发人员
1. 先阅读 [完整架构说明](docs/ARCHITECTURE_OVERVIEW.md) 了解全局
2. 查看 [项目 README](README.md) 了解快速开始
3. 根据工作方向阅读对应的详细文档：
   - 前端开发 → [前端设计](docs/frontend-design.md)
   - 后端开发 → [API 设计](docs/api-design.md) + [数据库设计](docs/database-design.md)
   - 运维部署 → [部署指南](docs/deployment.md)

### 对于架构师和技术负责人
1. [完整架构说明](docs/ARCHITECTURE_OVERVIEW.md) - 整体架构全貌
2. [技术规格说明](docs/technical-specifications.md) - 详细技术规格
3. [决策日志](memory-bank/decisionLog.md) - 了解技术选型背景

### 对于产品经理和项目经理
1. [产品上下文](memory-bank/productContext.md) - 产品功能和路线图
2. [完整架构说明](docs/ARCHITECTURE_OVERVIEW.md) 的第 1、4 章节 - 项目概述和功能模块

---

## 📊 架构图快速预览

### 整体架构
```
客户端 (浏览器) → 前端 (Vue.js) → 后端 (Spring Boot) → 数据库 (MySQL)
                     ↓
                 Nginx/CDN
                     ↓
              Azure AKS (生产环境)
```

### 技术栈
- **前端**: Vue.js 3 + TypeScript + Ant Design Vue + Pinia
- **后端**: Spring Boot 3 + Spring Security + MySQL + JPA
- **部署**: Docker + Kubernetes (Azure AKS) + GitHub Actions

---

## 🔄 文档更新

- **最后更新**: 2026年1月30日
- **版本**: v1.0
- **维护**: 请保持文档与代码同步更新

如有问题或建议，请提交 [GitHub Issue](https://github.com/nickhou1983/e-learning/issues)。
