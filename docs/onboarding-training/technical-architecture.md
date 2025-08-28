# 技术架构设计 - 新员工入职培训模块

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档标题 | 新员工入职培训模块技术架构设计 |
| 版本号 | v1.0 |
| 创建日期 | 2025-01-27 |
| 最后更新 | 2025-01-27 |
| 作者 | 技术架构师 |
| 状态 | 设计阶段 |

## 1. 架构概述

### 1.1 设计理念
基于现有e-learning平台的技术架构，采用微服务架构模式扩展新员工入职培训功能。遵循高内聚、低耦合的设计原则，确保系统的可扩展性、可维护性和高性能。

### 1.2 架构原则
- **可扩展性**：支持水平扩展，应对用户增长和功能扩展
- **高可用性**：确保系统7x24小时稳定运行，可用性≥99.9%
- **安全性**：多层次安全防护，保护用户数据和业务安全
- **性能优化**：响应时间≤3秒，支持1000+并发用户
- **易维护性**：模块化设计，便于开发、测试和维护

### 1.3 技术栈选择
```yaml
技术栈:
  前端:
    - 框架: Vue.js 3.x + TypeScript
    - 构建工具: Vite
    - UI组件: Element Plus / Ant Design Vue
    - 状态管理: Pinia
    - 路由: Vue Router 4
    - HTTP客户端: Axios
  
  后端:
    - 语言: Python 3.11+
    - Web框架: FastAPI
    - ASGI服务器: Uvicorn
    - ORM: SQLAlchemy 2.0
    - 数据迁移: Alembic
    - 认证: python-jose (JWT)
    - 数据验证: Pydantic
  
  数据库:
    - 主数据库: PostgreSQL 14+
    - 缓存: Redis 7.0+
    - 搜索引擎: Elasticsearch 8.0+
    - 时序数据库: InfluxDB (用于学习行为分析)
  
  基础设施:
    - 容器化: Docker + Kubernetes
    - 负载均衡: Nginx + Ingress
    - 消息队列: RabbitMQ
    - 对象存储: MinIO / AWS S3
    - 监控: Prometheus + Grafana
    - 日志: ELK Stack (Elasticsearch + Logstash + Kibana)
```

## 2. 整体架构设计

### 2.1 系统架构图
```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端层 (Client Layer)                   │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser  │  Mobile App  │  Desktop App  │  Third-party API  │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API网关层 (API Gateway)                     │
├─────────────────────────────────────────────────────────────────┤
│  Kong / Nginx Ingress  │  Authentication  │  Rate Limiting  │   │
│  Load Balancing       │  Authorization   │  Monitoring     │   │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     微服务层 (Microservices)                     │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │  用户服务   │ │  课程服务   │ │ 入职培训    │ │  评估服务   │ │
│ │   (User)    │ │ (Course)    │ │(Onboarding) │ │(Assessment) │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │  通知服务   │ │  文件服务   │ │  分析服务   │ │  报告服务   │ │
│ │(Notification)│ │   (File)    │ │ (Analytics) │ │  (Report)   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      数据层 (Data Layer)                         │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ PostgreSQL  │ │   Redis     │ │Elasticsearch│ │  InfluxDB   │ │
│ │  (主数据库)  │ │   (缓存)    │ │  (搜索)     │ │ (时序数据)  │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │   MinIO     │ │ RabbitMQ    │ │   Consul    │ │ Prometheus  │ │
│ │ (对象存储)   │ │ (消息队列)  │ │ (服务发现)  │ │  (监控)     │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 微服务架构设计

#### 2.2.1 服务划分原则
- **业务边界清晰**：每个服务负责特定的业务领域
- **数据独立性**：每个服务拥有独立的数据存储
- **技术异构性**：支持不同服务使用不同技术栈
- **可独立部署**：服务可以独立开发、测试和部署

#### 2.2.2 核心微服务定义

**用户服务 (User Service)**
```yaml
用户服务:
  职责:
    - 用户认证和授权
    - 用户信息管理
    - 角色权限管理
    - 用户行为追踪
  
  技术栈:
    - 语言: Python + FastAPI
    - 数据库: PostgreSQL
    - 缓存: Redis
    - 认证: JWT + OAuth2
  
  API端点:
    - POST /auth/login
    - POST /auth/logout
    - GET /users/{user_id}
    - PUT /users/{user_id}
    - GET /users/{user_id}/roles
```

**入职培训服务 (Onboarding Service)**
```yaml
入职培训服务:
  职责:
    - 入职流程管理
    - 学习路径设计
    - 培训计划制定
    - 进度跟踪监控
  
  技术栈:
    - 语言: Python + FastAPI
    - 数据库: PostgreSQL
    - 消息队列: RabbitMQ
    - 缓存: Redis
  
  API端点:
    - POST /onboarding/plans
    - GET /onboarding/plans/{plan_id}
    - PUT /onboarding/plans/{plan_id}/progress
    - GET /onboarding/dashboards/{user_id}
```

**评估服务 (Assessment Service)**
```yaml
评估服务:
  职责:
    - 在线考试管理
    - 实操任务评估
    - 360度反馈收集
    - 成绩分析统计
  
  技术栈:
    - 语言: Python + FastAPI
    - 数据库: PostgreSQL
    - 搜索引擎: Elasticsearch
    - 文件存储: MinIO
  
  API端点:
    - POST /assessments/exams
    - GET /assessments/exams/{exam_id}/questions
    - POST /assessments/submissions
    - GET /assessments/results/{user_id}
```

**分析服务 (Analytics Service)**
```yaml
分析服务:
  职责:
    - 学习数据分析
    - 行为模式识别
    - 预测模型构建
    - 智能推荐算法
  
  技术栈:
    - 语言: Python + FastAPI
    - 时序数据库: InfluxDB
    - 机器学习: scikit-learn, TensorFlow
    - 任务队列: Celery
  
  API端点:
    - POST /analytics/events
    - GET /analytics/reports/{type}
    - GET /analytics/recommendations/{user_id}
    - POST /analytics/models/train
```

### 2.3 数据架构设计

#### 2.3.1 数据存储策略
```yaml
数据存储策略:
  关系型数据:
    - 存储: PostgreSQL
    - 用途: 核心业务数据、用户信息、课程内容
    - 特点: ACID事务、复杂查询、数据一致性
  
  缓存数据:
    - 存储: Redis
    - 用途: 会话缓存、热点数据、计算结果
    - 特点: 高性能、内存存储、过期策略
  
  搜索数据:
    - 存储: Elasticsearch
    - 用途: 全文搜索、日志分析、数据聚合
    - 特点: 分布式、近实时搜索、分析功能
  
  时序数据:
    - 存储: InfluxDB
    - 用途: 学习行为数据、性能监控数据
    - 特点: 时间序列优化、高写入性能、数据压缩
  
  文件数据:
    - 存储: MinIO / AWS S3
    - 用途: 课程视频、文档、图片、用户上传文件
    - 特点: 分布式、高可用、成本效益
```

#### 2.3.2 数据模型设计

**核心实体关系图**
```sql
-- 扩展现有数据模型，增加入职培训相关表

-- 入职培训计划表
CREATE TABLE onboarding_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    department_id INT NOT NULL,
    position_id INT NOT NULL,
    plan_template_id BIGINT REFERENCES onboarding_templates(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    start_date DATE NOT NULL,
    expected_end_date DATE NOT NULL,
    actual_end_date DATE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, expected_end_date)
);

-- 学习路径表
CREATE TABLE learning_paths (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    department_id INT,
    position_level VARCHAR(50),
    estimated_hours INT DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_department (department_id),
    INDEX idx_mandatory (is_mandatory)
);

-- 路径课程关联表
CREATE TABLE path_courses (
    id BIGSERIAL PRIMARY KEY,
    path_id BIGINT NOT NULL REFERENCES learning_paths(id),
    course_id BIGINT NOT NULL REFERENCES courses(id),
    sequence_order INT NOT NULL,
    is_mandatory BOOLEAN DEFAULT true,
    unlock_conditions JSON,
    estimated_hours INT DEFAULT 0,
    
    UNIQUE KEY unique_path_course (path_id, course_id),
    INDEX idx_path_sequence (path_id, sequence_order)
);

-- 用户学习路径分配表
CREATE TABLE user_learning_paths (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    path_id BIGINT NOT NULL REFERENCES learning_paths(id),
    onboarding_plan_id BIGINT REFERENCES onboarding_plans(id),
    assigned_date DATE NOT NULL,
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ASSIGNED',
    
    UNIQUE KEY unique_user_path (user_id, path_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- 学习进度详细记录表
CREATE TABLE learning_progress_details (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    course_id BIGINT NOT NULL REFERENCES courses(id),
    lesson_id BIGINT REFERENCES lessons(id),
    onboarding_plan_id BIGINT REFERENCES onboarding_plans(id),
    progress_type VARCHAR(20) NOT NULL, -- 'STARTED', 'PROGRESS', 'COMPLETED'
    progress_value DECIMAL(5,2) DEFAULT 0.00,
    time_spent_seconds INT DEFAULT 0,
    completion_date TIMESTAMP,
    metadata JSON, -- 额外的进度信息
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_course (user_id, course_id),
    INDEX idx_progress_type (progress_type),
    INDEX idx_completion_date (completion_date)
);

-- 360度反馈表
CREATE TABLE feedback_360 (
    id BIGSERIAL PRIMARY KEY,
    target_user_id BIGINT NOT NULL REFERENCES users(id),
    reviewer_user_id BIGINT NOT NULL REFERENCES users(id),
    onboarding_plan_id BIGINT REFERENCES onboarding_plans(id),
    reviewer_type VARCHAR(20) NOT NULL, -- 'MANAGER', 'PEER', 'SUBORDINATE', 'MENTOR'
    feedback_data JSON NOT NULL, -- 结构化反馈数据
    overall_rating DECIMAL(3,2),
    comments TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_target_user (target_user_id),
    INDEX idx_reviewer_type (reviewer_type),
    INDEX idx_submitted_at (submitted_at)
);

-- 实操任务表
CREATE TABLE practical_tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department_id INT,
    position_level VARCHAR(50),
    task_type VARCHAR(50) NOT NULL, -- 'DOCUMENT', 'PRESENTATION', 'PROJECT', 'OPERATION'
    instructions TEXT,
    evaluation_criteria JSON,
    time_limit_hours INT,
    max_attempts INT DEFAULT 1,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_department (department_id),
    INDEX idx_task_type (task_type)
);

-- 任务提交表
CREATE TABLE task_submissions (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL REFERENCES practical_tasks(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    onboarding_plan_id BIGINT REFERENCES onboarding_plans(id),
    attempt_number INT DEFAULT 1,
    submission_data JSON, -- 提交的内容数据
    file_attachments JSON, -- 附件文件信息
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SUBMITTED', -- 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'
    
    INDEX idx_task_user (task_id, user_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- 任务评估表
CREATE TABLE task_evaluations (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL REFERENCES task_submissions(id),
    evaluator_id BIGINT NOT NULL REFERENCES users(id),
    evaluation_scores JSON, -- 各维度评分
    overall_score DECIMAL(5,2),
    feedback_comments TEXT,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    
    INDEX idx_submission_id (submission_id),
    INDEX idx_evaluator_id (evaluator_id),
    INDEX idx_evaluation_date (evaluation_date)
);
```

### 2.4 服务间通信设计

#### 2.4.1 同步通信
**REST API通信**
```yaml
REST API设计:
  协议: HTTP/HTTPS
  格式: JSON
  版本控制: URL路径版本化 (/api/v1/)
  认证: JWT Token
  限流: 基于用户和IP的限流策略
  
  标准响应格式:
    success:
      code: 200
      message: "Success"
      data: {}
      timestamp: "2025-01-27T10:00:00Z"
    
    error:
      code: 400
      message: "Bad Request"
      error: "详细错误信息"
      timestamp: "2025-01-27T10:00:00Z"
```

**GraphQL API**（用于复杂查询）
```yaml
GraphQL使用场景:
  - 前端需要聚合多个服务数据
  - 移动端需要精确控制数据传输
  - 实时数据查询和订阅
  
  优势:
    - 减少网络请求次数
    - 精确获取所需数据
    - 强类型系统
    - 实时订阅支持
```

#### 2.4.2 异步通信
**消息队列架构**
```yaml
RabbitMQ消息队列:
  交换器类型:
    - Direct: 点对点消息传递
    - Topic: 基于路由键的消息路由
    - Fanout: 广播消息
    - Headers: 基于消息头的路由
  
  主要队列:
    onboarding.events:
      - 入职流程状态变更
      - 学习进度更新
      - 培训完成通知
    
    notifications.queue:
      - 邮件通知
      - 短信提醒
      - 系统内消息
    
    analytics.queue:
      - 学习行为数据
      - 用户操作日志
      - 性能监控数据
    
    file.processing:
      - 文件上传处理
      - 视频转码任务
      - 文档格式转换
```

**事件驱动架构**
```python
# 事件发布示例
from app.events import EventPublisher

class OnboardingService:
    def __init__(self):
        self.event_publisher = EventPublisher()
    
    async def complete_course(self, user_id: int, course_id: int):
        # 业务逻辑处理
        progress = await self.update_progress(user_id, course_id)
        
        # 发布事件
        event = {
            "event_type": "course_completed",
            "user_id": user_id,
            "course_id": course_id,
            "completion_time": datetime.utcnow(),
            "progress_percentage": progress.percentage
        }
        
        await self.event_publisher.publish(
            exchange="onboarding.events",
            routing_key="course.completed",
            message=event
        )

# 事件消费示例
from app.events import EventConsumer

class NotificationService:
    def __init__(self):
        self.event_consumer = EventConsumer()
    
    async def handle_course_completion(self, message):
        user_id = message["user_id"]
        course_id = message["course_id"]
        
        # 发送祝贺通知
        await self.send_completion_notification(user_id, course_id)
        
        # 推荐下一课程
        await self.recommend_next_course(user_id)
```

### 2.5 缓存策略设计

#### 2.5.1 多层缓存架构
```yaml
缓存层级:
  浏览器缓存:
    - 静态资源: 图片、CSS、JS文件
    - 缓存时间: 30天
    - 版本控制: 文件名哈希
  
  CDN缓存:
    - 全球分发: 静态资源就近访问
    - 缓存时间: 7天
    - 自动刷新: 文件更新时自动刷新
  
  应用层缓存:
    - 热点数据: 用户信息、课程数据
    - 缓存时间: 1-24小时
    - 更新策略: 主动失效 + 被动更新
  
  数据库缓存:
    - 查询结果: 复杂查询结果缓存
    - 缓存时间: 10分钟-1小时
    - 失效策略: 数据变更时主动失效
```

#### 2.5.2 Redis缓存设计
```python
# 缓存管理器
class CacheManager:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.default_ttl = 3600  # 1小时
    
    async def get_user_profile(self, user_id: int):
        cache_key = f"user:profile:{user_id}"
        cached_data = await self.redis.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        # 从数据库获取数据
        user_data = await self.fetch_user_from_db(user_id)
        
        # 存入缓存
        await self.redis.setex(
            cache_key, 
            self.default_ttl, 
            json.dumps(user_data)
        )
        
        return user_data
    
    async def invalidate_user_cache(self, user_id: int):
        """用户信息更新时失效缓存"""
        pattern = f"user:*:{user_id}"
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)

# 缓存键命名规范
CACHE_KEYS = {
    "user_profile": "user:profile:{user_id}",
    "course_details": "course:details:{course_id}",
    "learning_progress": "progress:{user_id}:{course_id}",
    "onboarding_plan": "onboarding:plan:{user_id}",
    "assessment_results": "assessment:results:{user_id}:{assessment_id}",
    "recommendations": "recommend:{user_id}:courses",
}
```

### 2.6 安全架构设计

#### 2.6.1 认证授权体系
```yaml
认证体系:
  JWT Token:
    - 访问令牌: 短期有效(15分钟)
    - 刷新令牌: 长期有效(7天)
    - 算法: RS256 (RSA非对称加密)
    - 载荷: 用户ID、角色、权限、过期时间
  
  OAuth2.0:
    - 授权码模式: 第三方应用集成
    - 密码模式: 内部应用认证
    - 客户端凭证: 服务间调用
    - 隐式模式: 单页应用(SPA)
  
  多因子认证:
    - 短信验证码: 敏感操作验证
    - 邮箱验证: 账号安全验证
    - TOTP: 时间基础一次性密码
    - 生物识别: 指纹、人脸识别(移动端)
```

#### 2.6.2 权限控制模型
```python
# RBAC权限模型扩展
class Permission:
    """权限定义"""
    # 入职培训相关权限
    ONBOARDING_VIEW = "onboarding:view"
    ONBOARDING_MANAGE = "onboarding:manage"
    ONBOARDING_ADMIN = "onboarding:admin"
    
    # 评估考试权限
    ASSESSMENT_TAKE = "assessment:take"
    ASSESSMENT_GRADE = "assessment:grade"
    ASSESSMENT_MANAGE = "assessment:manage"
    
    # 数据访问权限
    DATA_VIEW_OWN = "data:view:own"
    DATA_VIEW_TEAM = "data:view:team"
    DATA_VIEW_DEPARTMENT = "data:view:department"
    DATA_VIEW_ALL = "data:view:all"

class Role:
    """角色定义"""
    TRAINEE = {
        "name": "新员工",
        "permissions": [
            Permission.ONBOARDING_VIEW,
            Permission.ASSESSMENT_TAKE,
            Permission.DATA_VIEW_OWN,
        ]
    }
    
    MANAGER = {
        "name": "直属经理",
        "permissions": [
            Permission.ONBOARDING_VIEW,
            Permission.ASSESSMENT_GRADE,
            Permission.DATA_VIEW_TEAM,
        ]
    }
    
    HR_SPECIALIST = {
        "name": "HR专员",
        "permissions": [
            Permission.ONBOARDING_MANAGE,
            Permission.ASSESSMENT_MANAGE,
            Permission.DATA_VIEW_DEPARTMENT,
        ]
    }
    
    TRAINING_ADMIN = {
        "name": "培训管理员",
        "permissions": [
            Permission.ONBOARDING_ADMIN,
            Permission.ASSESSMENT_MANAGE,
            Permission.DATA_VIEW_ALL,
        ]
    }

# 权限验证装饰器
from functools import wraps
from fastapi import HTTPException, status

def require_permission(permission: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            user_permissions = await get_user_permissions(current_user.id)
            
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission '{permission}' required"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# 使用示例
@app.post("/onboarding/plans")
@require_permission(Permission.ONBOARDING_MANAGE)
async def create_onboarding_plan(
    plan_data: OnboardingPlanCreate,
    current_user: User = Depends(get_current_user)
):
    return await onboarding_service.create_plan(plan_data, current_user.id)
```

#### 2.6.3 数据安全保护
```python
# 数据加密工具
from cryptography.fernet import Fernet
import hashlib
import os

class DataEncryption:
    def __init__(self):
        self.key = os.getenv('ENCRYPTION_KEY').encode()
        self.cipher = Fernet(self.key)
    
    def encrypt_sensitive_data(self, data: str) -> str:
        """加密敏感数据"""
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt_sensitive_data(self, encrypted_data: str) -> str:
        """解密敏感数据"""
        return self.cipher.decrypt(encrypted_data.encode()).decode()
    
    def hash_password(self, password: str) -> str:
        """密码哈希"""
        salt = os.urandom(32)
        pwdhash = hashlib.pbkdf2_hmac('sha256', 
                                      password.encode('utf-8'), 
                                      salt, 
                                      100000)
        return salt + pwdhash
    
    def verify_password(self, stored_password: bytes, provided_password: str) -> bool:
        """验证密码"""
        salt = stored_password[:32]
        stored_hash = stored_password[32:]
        pwdhash = hashlib.pbkdf2_hmac('sha256',
                                      provided_password.encode('utf-8'),
                                      salt,
                                      100000)
        return pwdhash == stored_hash

# 数据脱敏工具
class DataMasking:
    @staticmethod
    def mask_email(email: str) -> str:
        """邮箱脱敏"""
        if '@' not in email:
            return email
        
        local, domain = email.split('@')
        if len(local) <= 2:
            return f"{'*' * len(local)}@{domain}"
        
        return f"{local[0]}{'*' * (len(local) - 2)}{local[-1]}@{domain}"
    
    @staticmethod
    def mask_phone(phone: str) -> str:
        """手机号脱敏"""
        if len(phone) < 7:
            return phone
        
        return f"{phone[:3]}****{phone[-4:]}"
    
    @staticmethod
    def mask_id_card(id_card: str) -> str:
        """身份证脱敏"""
        if len(id_card) < 8:
            return id_card
        
        return f"{id_card[:4]}**********{id_card[-4:]}"
```

### 2.7 性能优化设计

#### 2.7.1 数据库优化策略
```sql
-- 索引优化策略
-- 1. 为频繁查询的字段创建索引
CREATE INDEX CONCURRENTLY idx_onboarding_plans_user_status 
ON onboarding_plans(user_id, status) 
WHERE status IN ('ACTIVE', 'IN_PROGRESS');

-- 2. 为时间范围查询创建复合索引
CREATE INDEX CONCURRENTLY idx_learning_progress_user_date 
ON learning_progress_details(user_id, created_at DESC);

-- 3. 为JSON字段的特定键创建GIN索引
CREATE INDEX CONCURRENTLY idx_feedback_360_data_rating 
ON feedback_360 USING GIN ((feedback_data->'overall_rating'));

-- 4. 分区表策略（按月分区）
CREATE TABLE learning_progress_details_y2025m01 
PARTITION OF learning_progress_details 
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 查询优化
-- 1. 使用EXISTS替代IN子查询
SELECT u.id, u.username 
FROM users u 
WHERE EXISTS (
    SELECT 1 FROM onboarding_plans op 
    WHERE op.user_id = u.id 
    AND op.status = 'ACTIVE'
);

-- 2. 使用窗口函数进行排名查询
SELECT 
    user_id,
    course_id,
    progress_percentage,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) as rn
FROM learning_progress_details
WHERE progress_type = 'PROGRESS';

-- 3. 使用LATERAL JOIN进行关联查询
SELECT 
    u.id,
    u.username,
    latest_progress.progress_percentage
FROM users u
LEFT JOIN LATERAL (
    SELECT progress_percentage, updated_at
    FROM user_learning_paths ulp
    WHERE ulp.user_id = u.id
    ORDER BY updated_at DESC
    LIMIT 1
) latest_progress ON true;
```

#### 2.7.2 应用层优化
```python
# 异步编程优化
import asyncio
import aiohttp
from concurrent.futures import ThreadPoolExecutor

class OptimizedOnboardingService:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=10)
    
    async def get_user_dashboard_data(self, user_id: int):
        """并行获取用户仪表板数据"""
        tasks = [
            self.get_onboarding_plan(user_id),
            self.get_learning_progress(user_id),
            self.get_recent_activities(user_id),
            self.get_recommendations(user_id),
            self.get_upcoming_deadlines(user_id)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            "onboarding_plan": results[0],
            "learning_progress": results[1],
            "recent_activities": results[2],
            "recommendations": results[3],
            "upcoming_deadlines": results[4]
        }
    
    async def batch_update_progress(self, progress_updates: List[ProgressUpdate]):
        """批量更新学习进度"""
        # 使用事务批量更新
        async with self.db.transaction():
            tasks = []
            for update in progress_updates:
                task = self.update_single_progress(update)
                tasks.append(task)
            
            await asyncio.gather(*tasks)
        
        # 异步发送通知
        asyncio.create_task(
            self.send_batch_notifications(progress_updates)
        )

# 数据库连接池优化
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import NullPool, QueuePool

class DatabaseConfig:
    DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/db"
    
    # 连接池配置
    ENGINE_CONFIG = {
        "poolclass": QueuePool,
        "pool_size": 20,           # 连接池大小
        "max_overflow": 30,        # 最大溢出连接数
        "pool_pre_ping": True,     # 连接前检查
        "pool_recycle": 3600,      # 连接回收时间(秒)
        "echo": False,             # 生产环境关闭SQL日志
    }

async_engine = create_async_engine(
    DatabaseConfig.DATABASE_URL,
    **DatabaseConfig.ENGINE_CONFIG
)

# 查询优化器
class QueryOptimizer:
    @staticmethod
    def paginate_query(query, page: int, size: int, max_size: int = 100):
        """安全的分页查询"""
        page = max(1, page)
        size = min(max(1, size), max_size)
        offset = (page - 1) * size
        
        return query.offset(offset).limit(size)
    
    @staticmethod
    def optimize_includes(query, includes: List[str]):
        """动态包含关联数据"""
        for include in includes:
            if include == "courses":
                query = query.options(selectinload(User.enrollments))
            elif include == "progress":
                query = query.options(selectinload(User.learning_progress))
        
        return query
```

#### 2.7.3 前端性能优化
```typescript
// Vue.js 性能优化策略

// 1. 组件懒加载
const OnboardingDashboard = defineAsyncComponent({
  loader: () => import('./OnboardingDashboard.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
});

// 2. 虚拟滚动组件（处理大量数据）
<template>
  <VirtualList
    :items="courseList"
    :item-height="80"
    :container-height="600"
    v-slot="{ item, index }"
  >
    <CourseCard :course="item" :key="item.id" />
  </VirtualList>
</template>

// 3. 数据缓存和状态管理优化
import { defineStore } from 'pinia'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    userPlan: null,
    learningProgress: new Map(),
    cache: new Map(),
    cacheTimestamps: new Map()
  }),
  
  actions: {
    async fetchUserPlan(userId: string, forceRefresh = false) {
      const cacheKey = `user_plan_${userId}`;
      const now = Date.now();
      const cached = this.cache.get(cacheKey);
      const timestamp = this.cacheTimestamps.get(cacheKey);
      
      // 缓存有效期5分钟
      if (!forceRefresh && cached && timestamp && (now - timestamp) < 300000) {
        return cached;
      }
      
      const plan = await api.getUserPlan(userId);
      this.cache.set(cacheKey, plan);
      this.cacheTimestamps.set(cacheKey, now);
      this.userPlan = plan;
      
      return plan;
    },
    
    // 批量更新进度，减少API调用
    batchUpdateProgress(updates: ProgressUpdate[]) {
      const grouped = new Map();
      
      updates.forEach(update => {
        const key = `${update.courseId}`;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key).push(update);
      });
      
      // 批量发送更新请求
      grouped.forEach(async (courseUpdates, courseId) => {
        await api.batchUpdateCourseProgress(courseId, courseUpdates);
      });
    }
  }
});

// 4. 防抖和节流优化
import { debounce, throttle } from 'lodash-es';

export default defineComponent({
  setup() {
    // 搜索防抖
    const searchCourses = debounce(async (query: string) => {
      if (query.length < 2) return;
      const results = await api.searchCourses(query);
      searchResults.value = results;
    }, 300);
    
    // 进度上报节流
    const reportProgress = throttle(async (courseId: string, progress: number) => {
      await api.updateProgress(courseId, progress);
    }, 1000);
    
    return {
      searchCourses,
      reportProgress
    };
  }
});
```

### 2.8 监控和运维

#### 2.8.1 应用监控体系
```yaml
监控体系:
  应用性能监控(APM):
    工具: New Relic / Datadog / 自建
    指标:
      - 响应时间: P50, P95, P99
      - 错误率: 4xx, 5xx错误统计
      - 吞吐量: QPS, TPS
      - 资源使用: CPU, 内存, 磁盘
  
  基础设施监控:
    工具: Prometheus + Grafana
    指标:
      - 服务器资源: CPU, 内存, 磁盘, 网络
      - 数据库性能: 连接数, 查询时间, 锁等待
      - 中间件状态: Redis, RabbitMQ, Elasticsearch
  
  业务监控:
    关键业务指标:
      - 用户活跃度: DAU, MAU, 留存率
      - 学习完成率: 课程完成率, 路径完成率
      - 系统使用率: 功能使用频率, 用户行为分析
      - 培训效果: 考试通过率, 满意度评分
  
  日志监控:
    工具: ELK Stack (Elasticsearch + Logstash + Kibana)
    日志类型:
      - 应用日志: 业务操作日志
      - 访问日志: API调用日志
      - 错误日志: 异常和错误信息
      - 安全日志: 认证、授权、安全事件
```

#### 2.8.2 告警机制
```python
# 告警规则配置
ALERT_RULES = {
    "high_error_rate": {
        "condition": "error_rate > 5%",
        "duration": "5m",
        "severity": "warning",
        "actions": ["email", "slack"]
    },
    "critical_error_rate": {
        "condition": "error_rate > 10%",
        "duration": "2m", 
        "severity": "critical",
        "actions": ["email", "slack", "sms", "phone"]
    },
    "slow_response": {
        "condition": "response_time_p95 > 3s",
        "duration": "10m",
        "severity": "warning",
        "actions": ["email"]
    },
    "database_connection_issue": {
        "condition": "db_connection_errors > 10",
        "duration": "1m",
        "severity": "critical",
        "actions": ["email", "slack", "sms"]
    },
    "learning_system_down": {
        "condition": "service_availability < 99%",
        "duration": "2m",
        "severity": "critical", 
        "actions": ["email", "slack", "sms", "phone"]
    }
}

# 自定义健康检查
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/health")
async def health_check():
    """系统健康检查端点"""
    checks = {
        "database": await check_database_health(),
        "redis": await check_redis_health(), 
        "rabbitmq": await check_rabbitmq_health(),
        "external_apis": await check_external_apis_health()
    }
    
    overall_health = all(checks.values())
    status_code = 200 if overall_health else 503
    
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "healthy" if overall_health else "unhealthy",
            "checks": checks,
            "timestamp": datetime.utcnow().isoformat(),
            "version": app.version
        }
    )

async def check_database_health() -> bool:
    """检查数据库连接健康状态"""
    try:
        async with get_db_session() as session:
            result = await session.execute(text("SELECT 1"))
            return result.scalar() == 1
    except Exception:
        return False

async def check_redis_health() -> bool:
    """检查Redis连接健康状态"""
    try:
        await redis_client.ping()
        return True
    except Exception:
        return False
```

#### 2.8.3 容器化部署
```yaml
# Docker配置
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 安装Python依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非root用户
RUN useradd --create-home --shell /bin/bash appuser
RUN chown -R appuser:appuser /app
USER appuser

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

---
# docker-compose.yml
version: '3.8'

services:
  onboarding-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/onboarding
      - REDIS_URL=redis://redis:6379
      - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
    depends_on:
      - db
      - redis
      - rabbitmq
    restart: unless-stopped
    
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=onboarding
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "15672:15672"
    restart: unless-stopped

volumes:
  postgres_data:

---
# Kubernetes部署配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: onboarding-api
  labels:
    app: onboarding-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: onboarding-api
  template:
    metadata:
      labels:
        app: onboarding-api
    spec:
      containers:
      - name: onboarding-api
        image: onboarding-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: onboarding-api-service
spec:
  selector:
    app: onboarding-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: LoadBalancer
```

## 3. 技术实施计划

### 3.1 开发阶段规划

#### 3.1.1 第一阶段：基础架构搭建（2周）
```yaml
第一阶段任务:
  基础设施:
    - 搭建开发环境
    - 配置CI/CD流水线
    - 建立代码仓库和分支策略
    - 搭建监控和日志系统
  
  核心服务框架:
    - 用户服务扩展
    - 入职培训服务框架
    - API网关配置
    - 数据库模型设计
  
  开发工具:
    - 代码质量检查工具
    - 自动化测试框架
    - 文档生成工具
    - 部署脚本编写
```

#### 3.1.2 第二阶段：核心功能开发（6周）
```yaml
第二阶段任务:
  入职流程管理:
    - 入职前准备功能
    - 第一天引导流程
    - 试用期培训管理
    - 转正评估系统
  
  学习路径设计:
    - 智能路径推荐
    - 多维度路径设计
    - 自适应学习系统
    - 进度跟踪功能
  
  评估考核模块:
    - 在线考试系统
    - 实操任务评估
    - 360度反馈系统
    - 成绩分析统计
```

#### 3.1.3 第三阶段：高级功能和优化（4周）
```yaml
第三阶段任务:
  数据分析:
    - 学习数据分析
    - 行为模式识别
    - 预测模型构建
    - 智能推荐系统
  
  系统集成:
    - HR系统对接
    - OA系统集成
    - 第三方服务集成
    - 数据同步优化
  
  性能优化:
    - 数据库查询优化
    - 缓存策略优化
    - 前端性能优化
    - 系统负载测试
```

#### 3.1.4 第四阶段：测试和部署（2周）
```yaml
第四阶段任务:
  测试验证:
    - 功能测试
    - 性能测试
    - 安全测试
    - 用户验收测试
  
  部署上线:
    - 生产环境部署
    - 数据迁移
    - 系统监控配置
    - 培训和支持
```

### 3.2 技术风险评估

#### 3.2.1 技术风险识别
```yaml
技术风险:
  数据同步风险:
    - 风险: HR系统数据不一致
    - 影响: 用户信息错误，培训分配失误
    - 缓解: 增量同步+数据校验+人工审核
  
  性能风险:
    - 风险: 大量用户并发访问导致系统响应慢
    - 影响: 用户体验差，培训效率低
    - 缓解: 负载测试+性能优化+弹性扩容
  
  安全风险:
    - 风险: 用户数据泄露或系统被攻击
    - 影响: 企业信息安全事故
    - 缓解: 多层安全防护+定期安全审计
  
  集成风险:
    - 风险: 第三方系统接口变更或服务不稳定
    - 影响: 功能异常，数据丢失
    - 缓解: 接口版本控制+降级方案+备用方案
```

#### 3.2.2 风险应对策略
```yaml
风险应对:
  技术方案:
    - 采用成熟稳定的技术栈
    - 设计降级和容错机制
    - 建立完善的监控告警
    - 制定详细的应急预案
  
  团队建设:
    - 技术培训和知识分享
    - 代码审查和质量控制
    - 定期技术讨论和改进
    - 建立技术文档和知识库
  
  项目管理:
    - 敏捷开发和迭代交付
    - 定期风险评估和调整
    - 充分的测试和验证
    - 用户反馈和持续改进
```

---

本技术架构设计为新员工入职培训模块提供了完整的技术实施蓝图，确保系统具备高性能、高可用、高安全的技术特性，同时保证系统的可扩展性和可维护性，为企业入职培训提供稳定可靠的技术支撑。