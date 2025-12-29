---
allowed-tools: Read, Write, Edit, Glob
argument-hint: [scope] | --claude-md | --documentation | --outdated-patterns | --implementation-sync
description: 清理并组织项目记忆文件，同步实现和更新模式
---

# 记忆清理

清理并同步项目记忆与当前实现模式：**$ARGUMENTS**

## 当前记忆上下文

- 记忆文件：项目中有 !`find . -name "CLAUDE*.md" | wc -l` 个 CLAUDE.md 文件
- 文档：总共 !`find . -name "README*" -o -name "*.md" | wc -l` 个文档文件
- 最后更新：!`find . -name "CLAUDE.md" -exec stat -c "%y" {} \; 2>/dev/null | head -1 || echo "No CLAUDE.md found"`
- 实现偏差：已记录模式与实际模式的分析

## 任务

执行全面的记忆清理，包含实现同步：

**清理范围**：使用 $ARGUMENTS 聚焦于 CLAUDE.md 文件、常规文档、过时模式识别或实现同步

**记忆清理框架**：
1. **记忆文件发现** - 定位所有 CLAUDE.md 和文档文件、评估层次结构和组织、识别冗余内容
2. **实现分析** - 比较已记录模式与实际代码、识别实现偏差、评估准确性差距
3. **模式验证** - 验证已记录约定、验证代码示例、检查依赖准确性、评估技术栈一致性
4. **内容优化** - 删除过时信息、合并重复内容、改进组织结构、增强清晰度
5. **同步更新** - 更新开发命令、刷新技术栈引用、同步架构模式、验证工作流
6. **质量保证** - 确保文件间一致性、验证 markdown 格式、检查链接完整性、维护版本一致性

**高级功能**：自动模式检测、实现偏差分析、交叉引用验证、文档健康评分。

**记忆健康**：内容新鲜度指标、准确性验证、使用模式分析、维护调度建议。

**输出**：清理并同步的记忆文件，包含更新的模式、验证的实现和维护建议。
