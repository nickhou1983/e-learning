# 飞书 MCP 工具参考

## 文档操作

### 读取文档

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `get_document` / `get_feishu_doc` | 获取文档全文内容 | `document_id`：文档 ID 或 URL |
| `get_document_blocks` | 获取文档块树结构 | `document_id`, `block_id`（可选） |
| `get_block_schema` | 获取块类型的创建参数 schema | `block_type` |

**文档 ID 提取规则：**

```
飞书文档 URL 格式：
https://{domain}.feishu.cn/docx/{document_id}
https://{domain}.feishu.cn/wiki/{wiki_token}
https://{domain}.feishu.cn/sheets/{spreadsheet_token}

示例：
https://example.feishu.cn/docx/ABC123xyz → document_id = ABC123xyz
```

### 创建/编辑文档

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `create_document_block` | 创建文档块 | `document_id`, `parent_block_id`, `block_type`, `content` |
| `update_document_block` | 更新文档块内容 | `document_id`, `block_id`, `content` |
| `delete_document_blocks` | 批量删除文档块 | `document_id`, `block_ids[]` |
| `import_markdown` | 导入 Markdown 到文档 | `document_id`, `markdown` |

### 搜索

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `search_documents` / `search_docs` | 搜索飞书文档 | `query`, `count`（可选）, `doc_type`（可选） |
| `search_content` | 搜索文档内容 | `query`, `document_id`（可选） |

---

## 知识库（Wiki）操作

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `get_wiki_spaces` | 获取知识空间列表 | 无 |
| `get_wiki_nodes` | 获取知识库节点树 | `space_id`, `parent_node_token`（可选） |
| `get_wiki_node_content` | 获取知识库节点内容 | `space_id`, `node_token` |

---

## 云文档（Drive）操作

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `list_drive_files` | 列出云空间文件 | `folder_token`（可选）, `page_size`（可选） |
| `get_file_meta` | 获取文件元信息 | `file_token` |
| `upload_file` | 上传文件到云空间 | `folder_token`, `file_path` |
| `download_file` | 下载云空间文件 | `file_token`, `output_path` |

---

## 电子表格（Sheets）操作

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `get_spreadsheet` | 获取电子表格信息 | `spreadsheet_token` |
| `read_sheet_range` | 读取指定范围数据 | `spreadsheet_token`, `sheet_id`, `range` |
| `write_sheet_range` | 写入数据到指定范围 | `spreadsheet_token`, `sheet_id`, `range`, `values[][]` |
| `append_sheet_data` | 追加数据行 | `spreadsheet_token`, `sheet_id`, `values[][]` |

---

## 消息（IM）操作

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `send_message` | 发送消息 | `receive_id`, `msg_type`, `content` |
| `reply_message` | 回复消息 | `message_id`, `msg_type`, `content` |
| `get_messages` | 获取聊天消息列表 | `chat_id`, `page_size`（可选） |

---

## 多维表格（Bitable）操作

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `get_bitable_records` | 获取数据表记录 | `app_token`, `table_id`, `filter`（可选） |
| `create_bitable_record` | 创建记录 | `app_token`, `table_id`, `fields` |
| `update_bitable_record` | 更新记录 | `app_token`, `table_id`, `record_id`, `fields` |
| `delete_bitable_record` | 删除记录 | `app_token`, `table_id`, `record_id` |

---

## 任务操作

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `get_tasks` | 获取任务列表 | `page_size`（可选） |
| `create_task` | 创建任务 | `summary`, `due`（可选）, `description`（可选） |

---

## 素材管理

| 工具名 | 说明 | 参数 |
| ------ | ---- | ---- |
| `upload_media` | 上传图片/视频/文件 | `file_path`, `parent_type`, `parent_token` |
| `get_media` | 获取素材下载链接 | `file_token` |

---

## 注意事项

- **工具名称因 MCP 实现而异**：不同的飞书 MCP Server 工具命名可能不同，以实际检测到的工具为准
- **权限前置**：调用前确保飞书应用已配置对应权限
- **Token 类型**：不同 URL 格式对应不同的 token 类型（document_id / wiki_token / spreadsheet_token）
- **分页**：列表类接口支持分页，注意使用 `page_token` 获取后续数据
