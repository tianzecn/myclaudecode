---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [migration-type] | --github-to-linear | --linear-to-github | --bidirectional | --validate
description: 大规模 GitHub-Linear 数据迁移助手，支持验证和回滚
---

# Sync Migration Assistant - 迁移助手

执行具有企业级能力的 GitHub 和 Linear 之间的全面数据迁移: **$ARGUMENTS**

## 当前迁移环境

- 源系统: !`gh --version 2>/dev/null && echo "GitHub CLI 可用" || echo "需要 GitHub CLI"`
- 目标系统: Linear MCP 服务器连接和认证状态
- 迁移范围: 数据量和复杂度分析以进行规划
- 基础设施: 数据库、队列服务和处理容量评估

## 任务

实现具有全面验证和企业功能的大规模数据迁移:

**迁移类型**: 使用 $ARGUMENTS 指定 GitHub-to-Linear、Linear-to-GitHub、双向设置或验证模式

**迁移框架**:
1. **迁移前评估** - 数据量分析、依赖映射、风险评估、资源规划
2. **迁移规划** - 分阶段方法设计、回滚策略、验证检查点、时间线估算
3. **数据提取** - 全面数据采集、关系保留、元数据捕获、错误处理
4. **转换引擎** - 字段映射、格式转换、验证规则、数据增强
5. **迁移执行** - 批处理、进度跟踪、错误恢复、质量保证
6. **迁移后验证** - 数据完整性验证、关系验证、性能测试、回滚准备

**企业功能**: 大规模批处理、全面错误恢复、详细审计跟踪、回滚能力、性能优化。

**质量保证**: 多阶段验证、数据完整性检查、关系验证、全面测试、企业监控。

**输出**: 完整的迁移系统,包含分阶段执行、全面验证、详细报告和大规模数据转换的企业级可靠性。
