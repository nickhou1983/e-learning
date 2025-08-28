# API接口规范 - 新员工入职培训模块

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档标题 | 新员工入职培训模块API接口规范 |
| 版本号 | v1.0 |
| 创建日期 | 2025-01-27 |
| 最后更新 | 2025-01-27 |
| 作者 | API设计师 |
| 状态 | 设计阶段 |

## 1. API概述

### 1.1 设计原则
- **RESTful设计**：遵循REST架构风格，使用标准HTTP方法
- **版本控制**：支持API版本化，确保向后兼容
- **统一响应**：统一的响应格式和错误处理机制
- **安全第一**：完善的认证授权和数据保护机制
- **文档完善**：详细的API文档和使用示例

### 1.2 基础信息
```yaml
API基础信息:
  Base URL: https://api.contoso-learning.com/v1
  协议: HTTPS
  认证方式: JWT Bearer Token
  数据格式: JSON
  字符编码: UTF-8
  时区: UTC
  
  版本控制:
    - URL路径版本化: /api/v1/
    - 向后兼容性: 至少保持3个版本兼容
    - 废弃通知: 至少提前6个月通知
```

### 1.3 通用规范

#### 1.3.1 请求头规范
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
User-Agent: OnboardingClient/1.0.0
X-Request-ID: uuid4-format-string
X-Client-Version: 1.0.0
Accept-Language: zh-CN,en-US
```

#### 1.3.2 统一响应格式
```json
// 成功响应
{
  "success": true,
  "code": 200,
  "message": "Operation successful",
  "data": {
    // 响应数据
  },
  "meta": {
    "timestamp": "2025-01-27T10:00:00Z",
    "request_id": "req-uuid-string",
    "version": "v1.0.0"
  }
}

// 错误响应
{
  "success": false,
  "code": 400,
  "message": "Bad Request",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": "Invalid input parameters",
    "field_errors": {
      "email": ["Invalid email format"],
      "age": ["Must be between 18 and 65"]
    }
  },
  "meta": {
    "timestamp": "2025-01-27T10:00:00Z",
    "request_id": "req-uuid-string",
    "version": "v1.0.0"
  }
}

// 分页响应
{
  "success": true,
  "code": 200,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 150,
      "pages": 8,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2025-01-27T10:00:00Z",
    "request_id": "req-uuid-string"
  }
}
```

#### 1.3.3 错误码定义
```yaml
HTTP状态码:
  200: 请求成功
  201: 资源创建成功
  204: 请求成功，无返回内容
  400: 请求参数错误
  401: 未认证或认证失败
  403: 无权限访问
  404: 资源不存在
  409: 资源冲突
  422: 请求格式正确但语义错误
  429: 请求频率限制
  500: 服务器内部错误
  502: 网关错误
  503: 服务不可用

业务错误码:
  INVALID_CREDENTIALS: 无效的登录凭据
  TOKEN_EXPIRED: 访问令牌已过期
  INSUFFICIENT_PERMISSIONS: 权限不足
  RESOURCE_NOT_FOUND: 资源不存在
  VALIDATION_ERROR: 数据验证失败
  BUSINESS_RULE_VIOLATION: 违反业务规则
  RATE_LIMIT_EXCEEDED: 超过请求频率限制
  SYSTEM_MAINTENANCE: 系统维护中
```

## 2. 认证授权API

### 2.1 用户认证

#### 2.1.1 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john.doe@contoso.com",
  "password": "securePassword123",
  "remember_me": true,
  "mfa_token": "123456"
}
```

**响应示例**
```json
{
  "success": true,
  "code": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": 12345,
      "username": "john.doe",
      "email": "john.doe@contoso.com",
      "full_name": "John Doe",
      "roles": ["trainee"],
      "department": "Engineering",
      "position": "Software Engineer",
      "avatar_url": "https://cdn.contoso.com/avatars/john-doe.jpg",
      "is_new_employee": true,
      "onboarding_status": "in_progress"
    }
  },
  "meta": {
    "timestamp": "2025-01-27T10:00:00Z",
    "request_id": "req-login-001"
  }
}
```

#### 2.1.2 刷新令牌
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2.1.3 用户登出
```http
POST /auth/logout
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "all_devices": false
}
```

### 2.2 密码管理

#### 2.2.1 忘记密码
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe@contoso.com",
  "captcha_token": "captcha-token-here"
}
```

#### 2.2.2 重置密码
```http
POST /auth/reset-password
Content-Type: application/json

{
  "reset_token": "reset-token-from-email",
  "new_password": "newSecurePassword123",
  "confirm_password": "newSecurePassword123"
}
```

## 3. 入职培训管理API

### 3.1 入职计划管理

#### 3.1.1 创建入职计划
```http
POST /onboarding/plans
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 12345,
  "department_id": 101,
  "position_id": 201,
  "template_id": 301,
  "start_date": "2025-02-01",
  "expected_duration_days": 90,
  "custom_settings": {
    "mentor_id": 54321,
    "buddy_id": 67890,
    "special_requirements": ["remote_work", "part_time"]
  },
  "learning_paths": [
    {
      "path_id": 401,
      "priority": "high",
      "estimated_hours": 40
    },
    {
      "path_id": 402,
      "priority": "medium",
      "estimated_hours": 20
    }
  ]
}
```

**响应示例**
```json
{
  "success": true,
  "code": 201,
  "message": "Onboarding plan created successfully",
  "data": {
    "plan_id": 98765,
    "user_id": 12345,
    "status": "active",
    "start_date": "2025-02-01",
    "expected_end_date": "2025-05-02",
    "progress_percentage": 0.00,
    "total_courses": 15,
    "completed_courses": 0,
    "estimated_total_hours": 60,
    "learning_paths": [
      {
        "path_id": 401,
        "name": "Technical Foundation",
        "progress": 0.00,
        "status": "not_started"
      }
    ],
    "milestones": [
      {
        "milestone_id": 1001,
        "name": "Week 1 - Orientation",
        "target_date": "2025-02-07",
        "status": "pending"
      }
    ],
    "created_at": "2025-01-27T10:00:00Z"
  }
}
```

#### 3.1.2 获取入职计划详情
```http
GET /onboarding/plans/{plan_id}
Authorization: Bearer {access_token}
```

#### 3.1.3 更新入职计划
```http
PUT /onboarding/plans/{plan_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "expected_end_date": "2025-05-15",
  "custom_settings": {
    "mentor_id": 55555,
    "additional_resources": ["advanced_tutorials"]
  },
  "status": "active"
}
```

#### 3.1.4 获取用户入职计划列表
```http
GET /onboarding/plans?user_id={user_id}&status={status}&page={page}&size={size}
Authorization: Bearer {access_token}
```

### 3.2 学习路径管理

#### 3.2.1 获取推荐学习路径
```http
GET /onboarding/learning-paths/recommendations?user_id={user_id}
Authorization: Bearer {access_token}
```

**响应示例**
```json
{
  "success": true,
  "code": 200,
  "message": "Recommendations retrieved successfully",
  "data": {
    "recommended_paths": [
      {
        "path_id": 401,
        "name": "Technical Foundation",
        "description": "Essential technical skills for software engineers",
        "estimated_hours": 40,
        "difficulty_level": "beginner",
        "match_score": 0.95,
        "match_reasons": [
          "Matches your department requirements",
          "Suitable for your experience level",
          "High completion rate among peers"
        ],
        "courses": [
          {
            "course_id": 501,
            "title": "Git Fundamentals",
            "duration_hours": 4,
            "sequence": 1
          }
        ]
      }
    ],
    "algorithm_version": "v2.1.0",
    "generated_at": "2025-01-27T10:00:00Z"
  }
}
```

#### 3.2.2 分配学习路径
```http
POST /onboarding/learning-paths/assignments
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 12345,
  "path_id": 401,
  "target_completion_date": "2025-03-15",
  "priority": "high",
  "auto_assign_courses": true
}
```

#### 3.2.3 获取学习路径进度
```http
GET /onboarding/learning-paths/{path_id}/progress?user_id={user_id}
Authorization: Bearer {access_token}
```

### 3.3 进度跟踪

#### 3.3.1 更新学习进度
```http
POST /onboarding/progress
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 12345,
  "course_id": 501,
  "lesson_id": 601,
  "progress_type": "lesson_completed",
  "progress_value": 100.0,
  "time_spent_seconds": 1800,
  "metadata": {
    "completion_method": "video_watched",
    "quiz_score": 85,
    "notes": "Completed all exercises"
  }
}
```

#### 3.3.2 批量更新进度
```http
POST /onboarding/progress/batch
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "updates": [
    {
      "user_id": 12345,
      "course_id": 501,
      "lesson_id": 601,
      "progress_value": 100.0,
      "time_spent_seconds": 1800
    },
    {
      "user_id": 12345,
      "course_id": 501,
      "lesson_id": 602,
      "progress_value": 50.0,
      "time_spent_seconds": 900
    }
  ]
}
```

#### 3.3.3 获取进度统计
```http
GET /onboarding/progress/stats?user_id={user_id}&date_range={date_range}
Authorization: Bearer {access_token}
```

**响应示例**
```json
{
  "success": true,
  "code": 200,
  "message": "Progress statistics retrieved",
  "data": {
    "overall_progress": {
      "percentage": 35.5,
      "courses_completed": 3,
      "courses_total": 15,
      "hours_spent": 25.5,
      "hours_estimated": 60.0
    },
    "daily_stats": [
      {
        "date": "2025-01-26",
        "hours_spent": 2.5,
        "lessons_completed": 3,
        "courses_accessed": 2
      }
    ],
    "milestone_progress": [
      {
        "milestone_id": 1001,
        "name": "Week 1 - Orientation",
        "progress": 80.0,
        "status": "in_progress",
        "target_date": "2025-02-07"
      }
    ],
    "performance_metrics": {
      "average_lesson_time": 30.5,
      "completion_rate": 90.0,
      "quiz_average_score": 87.5
    }
  }
}
```

## 4. 评估考核API

### 4.1 在线考试

#### 4.1.1 获取考试列表
```http
GET /assessments/exams?user_id={user_id}&status={status}&page={page}&size={size}
Authorization: Bearer {access_token}
```

#### 4.1.2 开始考试
```http
POST /assessments/exams/{exam_id}/start
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 12345,
  "exam_settings": {
    "shuffle_questions": true,
    "time_limit_minutes": 60,
    "allow_review": false
  }
}
```

**响应示例**
```json
{
  "success": true,
  "code": 200,
  "message": "Exam started successfully",
  "data": {
    "session_id": "exam-session-uuid",
    "exam_id": 701,
    "exam_title": "Technical Foundation Assessment",
    "time_limit_minutes": 60,
    "total_questions": 25,
    "instructions": "Please read each question carefully...",
    "questions": [
      {
        "question_id": 801,
        "question_number": 1,
        "question_type": "multiple_choice",
        "question_text": "What is the purpose of version control?",
        "options": [
          {
            "option_id": "A",
            "text": "To track changes in code"
          },
          {
            "option_id": "B", 
            "text": "To compile code"
          }
        ],
        "metadata": {
          "points": 2,
          "difficulty": "easy"
        }
      }
    ],
    "started_at": "2025-01-27T10:00:00Z",
    "expires_at": "2025-01-27T11:00:00Z"
  }
}
```

#### 4.1.3 提交答案
```http
POST /assessments/exams/{exam_id}/answers
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "session_id": "exam-session-uuid",
  "answers": [
    {
      "question_id": 801,
      "selected_options": ["A"],
      "answer_text": null,
      "time_spent_seconds": 45
    },
    {
      "question_id": 802,
      "selected_options": ["B", "C"],
      "answer_text": null,
      "time_spent_seconds": 60
    }
  ],
  "is_final_submission": true
}
```

#### 4.1.4 获取考试结果
```http
GET /assessments/exams/{exam_id}/results?user_id={user_id}
Authorization: Bearer {access_token}
```

### 4.2 实操任务评估

#### 4.2.1 获取任务列表
```http
GET /assessments/tasks?user_id={user_id}&status={status}
Authorization: Bearer {access_token}
```

#### 4.2.2 提交任务作品
```http
POST /assessments/tasks/{task_id}/submissions
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "user_id": 12345,
  "submission_text": "Task completion summary...",
  "files": [file1.pdf, file2.docx],
  "metadata": {
    "completion_time_hours": 4.5,
    "tools_used": ["VS Code", "Git"],
    "challenges_faced": "Integration testing was complex"
  }
}
```

#### 4.2.3 获取任务评估结果
```http
GET /assessments/tasks/{task_id}/evaluations?user_id={user_id}
Authorization: Bearer {access_token}
```

### 4.3 360度反馈

#### 4.3.1 创建反馈请求
```http
POST /assessments/feedback-360
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "target_user_id": 12345,
  "reviewers": [
    {
      "reviewer_id": 54321,
      "reviewer_type": "manager",
      "anonymous": false
    },
    {
      "reviewer_id": 67890,
      "reviewer_type": "peer",
      "anonymous": true
    }
  ],
  "feedback_template_id": 901,
  "deadline": "2025-02-15T23:59:59Z",
  "instructions": "Please provide honest feedback..."
}
```

#### 4.3.2 提交反馈
```http
POST /assessments/feedback-360/{feedback_id}/submit
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "reviewer_id": 54321,
  "ratings": {
    "technical_skills": 4.0,
    "communication": 4.5,
    "teamwork": 5.0,
    "problem_solving": 4.0,
    "adaptability": 4.5
  },
  "comments": {
    "strengths": "Excellent technical skills and quick learner",
    "improvements": "Could improve time management",
    "overall": "Great addition to the team"
  },
  "overall_rating": 4.4
}
```

#### 4.3.3 获取反馈汇总
```http
GET /assessments/feedback-360/{feedback_id}/summary
Authorization: Bearer {access_token}
```

## 5. 数据分析和报告API

### 5.1 学习分析

#### 5.1.1 用户学习分析
```http
GET /analytics/learning/users/{user_id}?period={period}&metrics={metrics}
Authorization: Bearer {access_token}
```

**响应示例**
```json
{
  "success": true,
  "code": 200,
  "message": "Learning analytics retrieved",
  "data": {
    "user_id": 12345,
    "analysis_period": {
      "start_date": "2025-01-01",
      "end_date": "2025-01-27"
    },
    "learning_metrics": {
      "total_learning_time": 45.5,
      "average_daily_time": 1.7,
      "courses_completed": 3,
      "courses_in_progress": 2,
      "quiz_average_score": 87.5,
      "completion_rate": 85.0
    },
    "learning_patterns": {
      "preferred_learning_times": ["09:00-11:00", "14:00-16:00"],
      "learning_streak_days": 12,
      "most_active_day": "tuesday",
      "learning_velocity": "above_average"
    },
    "skill_development": {
      "acquired_skills": ["git", "python_basics", "agile_methodology"],
      "skill_levels": {
        "technical": 3.5,
        "communication": 4.0,
        "problem_solving": 3.8
      }
    },
    "recommendations": [
      {
        "type": "course",
        "title": "Advanced Python Programming",
        "reason": "Based on your progress in Python basics"
      }
    ]
  }
}
```

#### 5.1.2 团队学习分析
```http
GET /analytics/learning/teams/{team_id}?period={period}
Authorization: Bearer {access_token}
```

#### 5.1.3 课程效果分析
```http
GET /analytics/courses/{course_id}/effectiveness
Authorization: Bearer {access_token}
```

### 5.2 报告生成

#### 5.2.1 生成个人学习报告
```http
POST /reports/learning/personal
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 12345,
  "report_type": "comprehensive",
  "period": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-27"
  },
  "include_sections": [
    "progress_summary",
    "skill_assessment",
    "learning_path_analysis",
    "recommendations"
  ],
  "format": "pdf",
  "language": "zh-CN"
}
```

#### 5.2.2 生成团队培训报告
```http
POST /reports/training/team
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "team_id": 101,
  "manager_id": 54321,
  "report_period": "monthly",
  "include_metrics": [
    "completion_rates",
    "engagement_levels",
    "skill_gaps",
    "training_effectiveness"
  ]
}
```

#### 5.2.3 获取报告状态
```http
GET /reports/{report_id}/status
Authorization: Bearer {access_token}
```

#### 5.2.4 下载报告
```http
GET /reports/{report_id}/download
Authorization: Bearer {access_token}
```

## 6. 通知和消息API

### 6.1 通知管理

#### 6.1.1 发送通知
```http
POST /notifications/send
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "recipients": [12345, 67890],
  "notification_type": "course_reminder",
  "channels": ["email", "in_app"],
  "content": {
    "title": "Course Deadline Reminder",
    "message": "Your course 'Git Fundamentals' is due tomorrow",
    "action_url": "/courses/501",
    "action_text": "Continue Learning"
  },
  "priority": "normal",
  "scheduled_at": "2025-01-28T09:00:00Z"
}
```

#### 6.1.2 获取用户通知
```http
GET /notifications?user_id={user_id}&status={status}&page={page}&size={size}
Authorization: Bearer {access_token}
```

#### 6.1.3 标记通知已读
```http
PUT /notifications/{notification_id}/read
Authorization: Bearer {access_token}
```

#### 6.1.4 批量标记已读
```http
PUT /notifications/batch-read
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "notification_ids": [1001, 1002, 1003],
  "mark_all": false
}
```

### 6.2 通知设置

#### 6.2.1 获取通知偏好
```http
GET /notifications/preferences?user_id={user_id}
Authorization: Bearer {access_token}
```

#### 6.2.2 更新通知偏好
```http
PUT /notifications/preferences
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": 12345,
  "preferences": {
    "email_notifications": {
      "course_reminders": true,
      "deadline_alerts": true,
      "achievement_notifications": false
    },
    "in_app_notifications": {
      "course_reminders": true,
      "deadline_alerts": true,
      "achievement_notifications": true
    },
    "sms_notifications": {
      "urgent_only": true
    },
    "quiet_hours": {
      "enabled": true,
      "start_time": "22:00",
      "end_time": "08:00",
      "timezone": "Asia/Shanghai"
    }
  }
}
```

## 7. 文件和资源API

### 7.1 文件上传

#### 7.1.1 获取上传令牌
```http
POST /files/upload-token
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "file_type": "document",
  "file_size": 1048576,
  "file_name": "assignment.pdf",
  "purpose": "task_submission"
}
```

#### 7.1.2 上传文件
```http
POST /files/upload
Authorization: Bearer {upload_token}
Content-Type: multipart/form-data

{
  "file": [binary_file_data],
  "metadata": {
    "description": "Task submission document",
    "tags": ["assignment", "final_project"]
  }
}
```

#### 7.1.3 获取文件信息
```http
GET /files/{file_id}
Authorization: Bearer {access_token}
```

### 7.2 文件下载

#### 7.2.1 下载文件
```http
GET /files/{file_id}/download
Authorization: Bearer {access_token}
```

#### 7.2.2 获取文件预览URL
```http
GET /files/{file_id}/preview-url
Authorization: Bearer {access_token}
```

## 8. 系统管理API

### 8.1 系统状态

#### 8.1.1 健康检查
```http
GET /health
```

**响应示例**
```json
{
  "success": true,
  "code": 200,
  "message": "System is healthy",
  "data": {
    "status": "healthy",
    "checks": {
      "database": "healthy",
      "redis": "healthy",
      "rabbitmq": "healthy",
      "external_apis": "healthy"
    },
    "version": "1.0.0",
    "uptime": 3600,
    "environment": "production"
  },
  "meta": {
    "timestamp": "2025-01-27T10:00:00Z",
    "request_id": "health-check-001"
  }
}
```

#### 8.1.2 系统信息
```http
GET /system/info
Authorization: Bearer {access_token}
```

#### 8.1.3 API使用统计
```http
GET /system/stats/api-usage?period={period}
Authorization: Bearer {access_token}
```

### 8.2 配置管理

#### 8.2.1 获取系统配置
```http
GET /config/system?category={category}
Authorization: Bearer {access_token}
```

#### 8.2.2 更新配置
```http
PUT /config/system/{config_key}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "value": "new_config_value",
  "description": "Updated configuration"
}
```

## 9. API安全和限流

### 9.1 认证安全

#### 9.1.1 JWT令牌格式
```json
// JWT Header
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "key-id-123"
}

// JWT Payload
{
  "sub": "12345",
  "username": "john.doe",
  "email": "john.doe@contoso.com",
  "roles": ["trainee"],
  "permissions": ["onboarding:view", "assessment:take"],
  "iat": 1643270400,
  "exp": 1643271300,
  "iss": "contoso-learning-api",
  "aud": "contoso-learning-client"
}
```

#### 9.1.2 权限验证
```yaml
权限验证规则:
  路径权限:
    - GET /onboarding/plans/{plan_id}: onboarding:view
    - POST /onboarding/plans: onboarding:manage
    - PUT /onboarding/plans/{plan_id}: onboarding:manage
    - DELETE /onboarding/plans/{plan_id}: onboarding:admin
  
  资源权限:
    - 用户只能访问自己的数据
    - 经理可以访问下属的数据
    - HR可以访问部门内的数据
    - 管理员可以访问所有数据
  
  操作权限:
    - 读取操作: view权限
    - 创建修改: manage权限
    - 删除操作: admin权限
    - 敏感操作: 需要额外验证
```

### 9.2 限流策略

#### 9.2.1 请求限流
```yaml
限流规则:
  用户级限流:
    - 普通接口: 100请求/分钟
    - 上传接口: 10请求/分钟
    - 报告生成: 5请求/小时
  
  IP级限流:
    - 总请求: 1000请求/分钟
    - 登录接口: 20请求/分钟
    - 注册接口: 5请求/分钟
  
  接口级限流:
    - 分析接口: 50请求/分钟
    - 批量接口: 20请求/分钟
    - 导出接口: 10请求/小时
```

#### 9.2.2 限流响应
```json
{
  "success": false,
  "code": 429,
  "message": "Rate limit exceeded",
  "error": {
    "type": "RATE_LIMIT_EXCEEDED",
    "details": "Too many requests, please try again later",
    "retry_after": 60
  },
  "meta": {
    "timestamp": "2025-01-27T10:00:00Z",
    "request_id": "rate-limit-001"
  }
}
```

## 10. API测试和文档

### 10.1 API测试

#### 10.1.1 测试环境
```yaml
测试环境:
  开发环境:
    - Base URL: https://dev-api.contoso-learning.com/v1
    - 用途: 开发阶段测试
    - 数据: 模拟数据
  
  测试环境:
    - Base URL: https://test-api.contoso-learning.com/v1
    - 用途: 功能测试和集成测试
    - 数据: 测试数据集
  
  预生产环境:
    - Base URL: https://staging-api.contoso-learning.com/v1
    - 用途: 生产前最终验证
    - 数据: 生产数据副本
```

#### 10.1.2 测试账号
```yaml
测试账号:
  新员工账号:
    - username: trainee.test@contoso.com
    - password: TestPassword123
    - roles: [trainee]
  
  经理账号:
    - username: manager.test@contoso.com
    - password: TestPassword123
    - roles: [manager]
  
  HR账号:
    - username: hr.test@contoso.com
    - password: TestPassword123
    - roles: [hr_specialist]
  
  管理员账号:
    - username: admin.test@contoso.com
    - password: TestPassword123
    - roles: [training_admin]
```

### 10.2 API文档

#### 10.2.1 OpenAPI规范
```yaml
openapi: 3.0.0
info:
  title: Onboarding Training API
  version: 1.0.0
  description: API for employee onboarding training system
  contact:
    name: API Support
    email: api-support@contoso.com
  license:
    name: Proprietary
    
servers:
  - url: https://api.contoso-learning.com/v1
    description: Production server
  - url: https://staging-api.contoso-learning.com/v1
    description: Staging server

paths:
  /onboarding/plans:
    post:
      summary: Create onboarding plan
      tags: [Onboarding]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OnboardingPlanCreate'
      responses:
        '201':
          description: Plan created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OnboardingPlanResponse'
```

#### 10.2.2 SDK和代码示例
```javascript
// JavaScript SDK示例
import { OnboardingAPI } from '@contoso/learning-sdk';

const api = new OnboardingAPI({
  baseURL: 'https://api.contoso-learning.com/v1',
  apiKey: 'your-api-key'
});

// 创建入职计划
const plan = await api.onboarding.createPlan({
  userId: 12345,
  departmentId: 101,
  positionId: 201,
  startDate: '2025-02-01'
});

// 获取学习进度
const progress = await api.onboarding.getProgress(12345);

// 更新进度
await api.onboarding.updateProgress({
  userId: 12345,
  courseId: 501,
  progressValue: 75.0
});
```

```python
# Python SDK示例
from contoso_learning_sdk import OnboardingAPI

api = OnboardingAPI(
    base_url='https://api.contoso-learning.com/v1',
    api_key='your-api-key'
)

# 创建入职计划
plan = api.onboarding.create_plan(
    user_id=12345,
    department_id=101,
    position_id=201,
    start_date='2025-02-01'
)

# 获取学习进度
progress = api.onboarding.get_progress(user_id=12345)

# 批量更新进度
api.onboarding.batch_update_progress([
    {'user_id': 12345, 'course_id': 501, 'progress_value': 75.0},
    {'user_id': 12345, 'course_id': 502, 'progress_value': 60.0}
])
```

---

本API接口规范为新员工入职培训模块提供了完整的接口定义，确保前后端开发团队能够基于统一的接口规范进行开发，同时为第三方系统集成提供了详细的技术文档。