---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [操作] | --pull | --push | --diff | --validate
description: 使用 MCP 集成同步数据库架构到 Supabase
---

# Supabase 架构同步

在本地和 Supabase 之间同步数据库架构，并进行全面验证：**$ARGUMENTS**

## 当前 Supabase 上下文

- MCP 连接：配置了只读访问权限的 Supabase MCP 服务器
- 本地架构：!`find . -name "schema.sql" -o -name "migrations" -type d | head -3` 本地数据库文件
- 项目配置：!`find . -name "supabase" -type d -o -name ".env*" | grep -v node_modules | head -3` 配置文件
- Git 状态：!`git status --porcelain | grep -E "\\.sql$|\\.ts$" | head -5` 数据库相关变更

## 任务

执行与 Supabase 集成的全面架构同步：

**同步操作**：使用 $ARGUMENTS 指定从远程拉取、推送到远程、差异对比或架构验证

**架构同步框架**：
1. **MCP 集成** - 通过 MCP 服务器连接到 Supabase，使用项目凭证认证，验证连接状态
2. **架构分析** - 对比本地与远程架构，识别结构差异，分析迁移需求，评估破坏性变更
3. **同步操作** - 执行拉取/推送操作，应用架构迁移，处理冲突解决，验证数据完整性
4. **验证流程** - 验证架构一致性，验证外键约束，检查索引性能，测试查询兼容性
5. **迁移管理** - 生成迁移脚本，追踪版本历史，实施回滚程序，优化执行顺序
6. **安全检查** - 备份关键数据，验证权限，检查生产影响，实施模拟运行模式

**高级功能**：自动冲突解决，架构版本控制，性能影响分析，团队协作流程，CI/CD 集成。

**质量保证**：架构验证，数据完整性检查，性能优化，回滚准备，团队同步。

**输出**：完整的架构同步，包含验证报告、迁移脚本、冲突解决和团队协作更新。
