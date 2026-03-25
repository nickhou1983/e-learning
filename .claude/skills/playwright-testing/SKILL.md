---
name: playwright-testing
description: "使用 Playwright MCP 进行 UI/E2E 自动化测试。支持页面探索、测试用例生成、执行验证、截图对比。触发条件：(1) UI 自动化测试，(2) E2E 端到端测试，(3) 页面功能验证，(4) 浏览器测试，(5) Playwright 测试生成与执行。"
argument-hint: "提供目标 URL 和要测试的功能描述"
---

# Playwright UI/E2E 测试

通过 Playwright MCP 工具进行浏览器自动化测试，生成可维护的 TypeScript 测试代码。

## 参考文件

| 文件 | 用途 |
| ---- | ---- |
| [best-practices.md](./references/best-practices.md) | Playwright 测试最佳实践和编码规范 |
| [locator-guide.md](./references/locator-guide.md) | 定位器选择指南和优先级 |

## 测试用例目录

生成的测试文件统一存放到 `tests/` 目录下，按功能模块组织：

```
tests/
├── e2e/                    # 端到端测试
│   ├── auth.spec.ts        # 登录/注册/鉴权
│   ├── navigation.spec.ts  # 页面导航和路由
│   └── ...
├── ui/                     # UI 组件测试
│   ├── forms.spec.ts       # 表单交互
│   ├── modals.spec.ts      # 弹窗/对话框
│   └── ...
├── visual/                 # 视觉回归测试
│   └── screenshots/        # 截图基线
└── playwright.config.ts    # Playwright 配置
```

## 工作流

### 步骤 1：确认测试目标

1. **获取 URL**：确认要测试的目标页面 URL
2. **明确功能**：确认要测试的具体功能（登录、表单提交、导航等）
3. **确定测试类型**：
   - E2E 测试：完整用户流程
   - UI 测试：单个组件交互
   - 视觉测试：页面截图对比

### 步骤 2：通过 Playwright MCP 探索页面

**关键规则：必须先探索再编写，禁止仅凭描述生成代码。**

1. **导航到目标 URL** — 使用 Playwright MCP 的 `browser_navigate` 工具
2. **探索页面结构** — 使用 `browser_snapshot` 获取页面 Accessibility Tree
3. **交互验证** — 逐步执行关键操作（点击、填写、提交），确认实际行为
4. **记录发现** — 记录关键元素的 role、name、text 用于编写定位器

### 步骤 3：生成测试代码

基于探索结果，编写 TypeScript 测试文件：

```typescript
import { test, expect } from '@playwright/test';

test.describe('功能模块名称', () => {
  test('具体测试场景', async ({ page }) => {
    // 1. 导航
    await page.goto('https://example.com');

    // 2. 交互 — 使用 role-based locators
    await page.getByRole('button', { name: '提交' }).click();

    // 3. 断言 — 使用 auto-retrying assertions
    await expect(page.getByRole('heading', { name: '成功' })).toBeVisible();
  });
});
```

### 步骤 4：保存测试文件

1. 根据测试类型选择目录：`tests/e2e/` 或 `tests/ui/` 或 `tests/visual/`
2. 使用描述性文件名：`<功能>.spec.ts`
3. 如果 `playwright.config.ts` 不存在，生成默认配置

### 步骤 5：执行与迭代

1. 运行测试文件：`npx playwright test <path>`
2. 检查结果：
   - **通过** → 完成，输出测试报告
   - **失败** → 分析错误，修复测试代码，重新运行
3. 迭代直到所有测试通过
4. （可选）运行完整测试套件检查回归

## 定位器优先级

按以下优先级选择定位器（参考 [locator-guide.md](./references/locator-guide.md)）：

| 优先级 | 定位器 | 示例 |
|--------|--------|------|
| 1 | `getByRole` | `page.getByRole('button', { name: '提交' })` |
| 2 | `getByText` | `page.getByText('欢迎回来')` |
| 3 | `getByLabel` | `page.getByLabel('用户名')` |
| 4 | `getByPlaceholder` | `page.getByPlaceholder('请输入邮箱')` |
| 5 | `getByTestId` | `page.getByTestId('submit-btn')` |

**禁止使用**：CSS 选择器、XPath（除非没有其他选择）。

## 断言规范

使用 auto-retrying assertions，不添加手动 timeout：

```typescript
// ✅ 正确 — auto-retrying
await expect(page.getByRole('alert')).toBeVisible();
await expect(page.getByText('保存成功')).toBeVisible();
await expect(page).toHaveURL(/dashboard/);

// ❌ 错误 — 手动等待
await page.waitForTimeout(3000);
await page.waitForSelector('.alert');
```

## 输出格式

```markdown
## Playwright 测试报告

**目标 URL**: <tested URL>
**测试类型**: E2E | UI | Visual
**测试文件**: <file path>

### 测试用例
| 用例 | 描述 | 结果 |
|------|------|------|
| test name | what it verifies | ✅ / ❌ |

### 执行结果
- Total: <count> | Passed: <count> | Failed: <count>
- Duration: <time>

### 页面发现
- 关键元素和定位器记录
- 交互行为记录
```
