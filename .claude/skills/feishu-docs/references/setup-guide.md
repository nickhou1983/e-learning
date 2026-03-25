# 飞书 MCP 配置指南

## 方案选择

| 方案 | 适用场景 | 认证方式 | 复杂度 |
| ---- | -------- | -------- | ------ |
| **open-feishu-mcp-server** | 远程部署，多用户，零配置体验 | OAuth 2.0（用户登录） | 中 |
| **lark-tools-mcp** | 本地运行，单用户，快速上手 | App Token（应用凭证） | 低 |
| **mcp_server_lark** | Python 环境，多功能（Sheet/Doc/Message） | App Token | 低 |

## 方案一：open-feishu-mcp-server（推荐）

> GitHub: [ztxtxwd/open-feishu-mcp-server](https://github.com/ztxtxwd/open-feishu-mcp-server)
> 特点：零配置体验，自动管理 token，深度优化工具可用性

### 前置要求

- Node.js 18+
- Cloudflare 账户（生产部署）或本地开发环境
- 飞书开放平台账户

### 步骤 1：创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/) 并登录
2. 进入「开发者后台」→ 创建新应用
3. 配置权限（权限与功能）：
   - `auth:user.id:read` — 获取用户 ID
   - `offline_access` — 获取用户授权凭证
   - `user_profile` — 获取用户基本信息
   - `docx:document` — 文档读写
   - `docx:document:readonly` — 文档只读
   - `wiki:wiki:readonly` — 知识库只读
   - `search:docs:read` — 文档搜索
   - `drive:drive:readonly` — 云文档只读
4. 记录 **App ID** 和 **App Secret**

### 步骤 2：本地开发部署

```bash
git clone https://github.com/ztxtxwd/open-feishu-mcp-server.git
cd open-feishu-mcp-server
npm install

# 创建 .dev.vars 文件
cat > .dev.vars << EOF
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
COOKIE_ENCRYPTION_KEY=$(openssl rand -hex 32)
EOF

npm run dev
# 服务运行在 http://localhost:8788
```

### 步骤 3：VS Code MCP 配置

在 VS Code `settings.json` 中添加：

```json
{
  "mcp": {
    "servers": {
      "feishu": {
        "url": "http://localhost:8788/sse"
      }
    }
  }
}
```

或在飞书应用安全设置中添加回调 URL：`http://localhost:8788/callback`

### 步骤 4：生产部署（可选）

```bash
# 设置 Cloudflare 密钥
wrangler secret put FEISHU_APP_ID
wrangler secret put FEISHU_APP_SECRET
wrangler secret put COOKIE_ENCRYPTION_KEY

# 创建 KV 存储
wrangler kv namespace create "OAUTH_KV"

# 部署
npm run deploy
```

部署后更新 VS Code 配置中的 URL 为生产地址。

---

## 方案二：lark-tools-mcp（轻量）

> GitHub: [VienLi/lark-tools-mcp](https://github.com/VienLi/lark-tools-mcp)
> 特点：本地运行，读取文档/发送消息/审批/数据处理

### 步骤 1：创建飞书应用（同上）

### 步骤 2：安装运行

```bash
git clone https://github.com/VienLi/lark-tools-mcp.git
cd lark-tools-mcp

# 拷贝并编辑 .env
cp .env.example .env
# 填入 FEISHU_APP_ID 和 FEISHU_APP_SECRET

yarn install
yarn start
```

### 步骤 3：VS Code MCP 配置

```json
{
  "mcp": {
    "servers": {
      "feishu": {
        "command": "node",
        "args": ["/path/to/lark-tools-mcp/dist/index.js"],
        "env": {
          "FEISHU_APP_ID": "your_app_id",
          "FEISHU_APP_SECRET": "your_app_secret"
        }
      }
    }
  }
}
```

---

## 方案三：mcp_server_lark（Python）

> GitHub: [kone-net/mcp_server_lark](https://github.com/kone-net/mcp_server_lark)
> 特点：Python 实现，支持 Sheet/Doc/Message

### 安装

```bash
pip install mcp-server-lark
```

### VS Code MCP 配置

```json
{
  "mcp": {
    "servers": {
      "feishu": {
        "command": "python",
        "args": ["-m", "mcp_server_lark"],
        "env": {
          "FEISHU_APP_ID": "your_app_id",
          "FEISHU_APP_SECRET": "your_app_secret"
        }
      }
    }
  }
}
```

---

## 飞书应用权限速查

| 权限 | Scope | 用途 |
| ---- | ----- | ---- |
| 文档只读 | `docx:document:readonly` | 读取文档内容 |
| 文档读写 | `docx:document` | 创建/编辑文档 |
| 知识库只读 | `wiki:wiki:readonly` | 浏览知识空间 |
| 知识库读写 | `wiki:wiki` | 编辑知识库 |
| 文档搜索 | `search:docs:read` | 搜索文档 |
| 云文档只读 | `drive:drive:readonly` | 访问云空间文件 |
| 云文档读写 | `drive:drive` | 管理云空间文件 |
| 电子表格 | `sheets:spreadsheet` | 读写电子表格 |
| 消息发送 | `im:message:send_as_bot` | 机器人发消息 |
| 获取消息 | `im:message:readonly` | 读取消息内容 |
| 任务管理 | `task:task:read` | 读取用户任务 |

## 验证配置

配置完成后，在 VS Code 中测试：

1. 打开 Chat（Ctrl/Cmd + Shift + I）
2. 输入：`读取这个飞书文档：https://xxx.feishu.cn/docx/xxxxx`
3. 如果 Agent 能识别并调用飞书 MCP 工具，说明配置成功
