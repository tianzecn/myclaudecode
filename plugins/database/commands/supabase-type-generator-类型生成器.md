---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [生成范围] | --all-tables | --specific-table | --functions | --enums | --views
description: 从 Supabase 架构生成 TypeScript 类型定义，自动同步和验证
---

# Supabase 类型生成器

从 Supabase 架构生成全面的 TypeScript 类型，并自动同步：**$ARGUMENTS**

## 当前类型上下文

- Supabase 架构：通过 MCP 集成访问数据库架构
- 类型定义：!`find . -name "types" -type d -o -name "*.d.ts" | head -5` 现有 TypeScript 定义
- 应用程序使用：!`find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "Database\|Table\|Row" 2>/dev/null | head -3` 类型使用模式
- 构建配置：!`find . -name "tsconfig.json" -o -name "*.config.ts" | head -3` TypeScript 设置

## 任务

执行全面的类型生成，包含架构同步和应用程序集成：

**生成范围**：使用 $ARGUMENTS 生成所有表类型、特定表类型、函数签名、枚举定义或视图类型

**类型生成框架**：
1. **架构分析** - 通过 MCP 提取数据库架构，分析表结构，识别关系，将数据类型映射到 TypeScript
2. **类型生成** - 生成表接口，创建工具类型，实施类型守卫，优化类型定义
3. **集成设置** - 配置导入路径，设置类型导出，实施自动补全，集成到构建流程
4. **验证流程** - 验证生成的类型，测试类型兼容性，验证应用程序集成，检查构建成功
5. **同步机制** - 监控架构变更，自动重新生成类型，验证破坏性变更，通知开发团队
6. **开发者体验** - 实施 IDE 集成，提供类型提示，创建使用示例，优化开发流程

**高级功能**：自动类型更新，破坏性变更检测，自定义类型转换，文档生成，IDE 插件集成。

**质量保证**：类型准确性验证，应用程序兼容性测试，性能影响评估，开发者反馈集成。

**输出**：完整的 TypeScript 类型定义，包含架构同步、应用程序集成、验证程序和开发者文档。
