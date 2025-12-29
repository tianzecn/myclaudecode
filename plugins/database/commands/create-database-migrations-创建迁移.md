---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [迁移名称] | --create-table | --add-column | --alter-table
description: 创建和管理数据库迁移，支持适当的版本控制和回滚
---

# 创建数据库迁移

创建和管理数据库迁移：**$ARGUMENTS**

## 当前数据库状态

- ORM 检测：@package.json 或 @requirements.txt（检测 Sequelize、Prisma、Alembic 等）
- 迁移文件：!`find . -name "*migration*" -type f | head -5`
- 数据库配置：@config/database.* 或 @prisma/schema.prisma
- 当前架构：!`ls migrations/ 2>/dev/null | wc -l` 个迁移文件

## 任务

创建具有适当版本控制和回滚能力的全面数据库迁移：

**迁移类型**：使用 $ARGUMENTS 指定表创建、列添加、表修改或数据迁移

**迁移框架**：
1. **迁移规划** - 分析架构变更、依赖关系和数据影响
2. **迁移生成** - 创建带时间戳的迁移文件，包含 up/down 方法
3. **架构更新** - 表创建、列修改、索引管理
4. **数据迁移** - 安全的数据转换和回填
5. **回滚策略** - 为每项变更实施可靠的回滚程序
6. **测试** - 在开发和预发布环境中验证迁移

**最佳实践**：遵循数据库特定约定，维护引用完整性，高效处理大数据集，确保零停机部署。

**输出**：生产就绪的迁移文件，包含全面的回滚支持、适当的索引和数据安全措施。
