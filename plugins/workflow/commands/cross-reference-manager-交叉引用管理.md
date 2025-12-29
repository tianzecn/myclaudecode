---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [action] | audit | repair | map | validate | export
description: 管理 GitHub 和 Linear 之间的跨平台引用链接，支持完整性检查
---

# Cross-Reference Manager - 交叉引用管理器

管理具有完整性验证的跨平台引用链接: **$ARGUMENTS**

## 当前引用状态

- GitHub CLI: !`gh --version 2>/dev/null && echo "✓ 可用" || echo "⚠ 不可用"`
- Linear MCP: 检查 Linear MCP 服务器连接和认证
- 引用数据库: @.reference-mappings.json 或引用状态文件
- 链接完整性: !`find . -name "*sync*" -o -name "*reference*" | wc -l` 个映射文件

## 任务

实现 GitHub-Linear 集成的全面交叉引用管理:

**管理操作**: 使用 $ARGUMENTS 指定审计、修复、映射、验证或导出操作

**引用管理框架**:
1. **引用数据库** - 初始化映射存储,跟踪双向链接,维护同步历史
2. **完整性审计** - 扫描交叉引用,识别孤立链接,检测不匹配,验证一致性
3. **智能修复** - 修复断开的引用,更新过时链接,合并重复项,删除无效条目
4. **映射可视化** - 显示引用网络,展示连接健康度,突出问题,提供统计
5. **深度验证** - 验证链接功能,测试双向导航,检查字段一致性,确保数据完整性
6. **导出与文档** - 生成映射报告,创建备份文件,提供导入说明,维护审计跟踪

**高级功能**: 自动孤立检测,智能引用重建,重复合并,全面验证。

**数据保护**: 修改前备份,基于事务的操作,回滚能力,全面日志记录。

**输出**: 完整的引用管理系统,包含完整性报告、修复摘要、映射可视化和全面的跨平台链接维护。
