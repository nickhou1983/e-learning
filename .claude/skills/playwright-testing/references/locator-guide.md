# 定位器选择指南

## 优先级规则

Playwright 推荐根据用户可见行为选择定位器，优先级从高到低：

### 1. `getByRole` — 最推荐

基于 ARIA role 和 accessible name，最接近用户/辅助技术的交互方式。

```typescript
page.getByRole('button', { name: '提交' })
page.getByRole('heading', { name: '欢迎' })
page.getByRole('link', { name: '首页' })
page.getByRole('textbox', { name: '用户名' })
page.getByRole('checkbox', { name: '记住我' })
page.getByRole('dialog')
page.getByRole('navigation')
```

### 2. `getByText` — 静态文本

匹配页面上可见的文本内容。

```typescript
page.getByText('暂无数据')
page.getByText('欢迎回来', { exact: true })
page.getByText(/总计 \d+ 条/)
```

### 3. `getByLabel` — 表单字段

通过关联的 `<label>` 文本定位表单控件。

```typescript
page.getByLabel('邮箱地址')
page.getByLabel('密码')
```

### 4. `getByPlaceholder` — 占位符

通过 `placeholder` 属性定位输入框。

```typescript
page.getByPlaceholder('请输入搜索关键词')
page.getByPlaceholder('your@email.com')
```

### 5. `getByTestId` — 最后手段

当以上定位器都不适用时，使用 `data-testid` 属性。

```typescript
page.getByTestId('submit-button')
page.getByTestId('user-avatar')
```

## 避免使用

| 方式 | 原因 |
| ---- | ---- |
| `page.$('.class-name')` | CSS 类名不稳定 |
| `page.locator('//div[@id="x"]')` | XPath 脆弱，不可读 |
| `page.locator('#id')` | ID 可能变化 |
| `page.locator('div > span:nth-child(2)')` | 结构耦合，极易因 DOM 变化失败 |

## 组合定位器

当单一定位器无法唯一定位时，使用 `filter` 链式缩小范围：

```typescript
page
  .getByRole('listitem')
  .filter({ hasText: '产品A' })
  .getByRole('button', { name: '购买' })
```
