---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [update-strategy] | --patch | --minor | --major | --security-only
description: 更新并现代化项目依赖，支持全面测试和兼容性检查
---

# 更新依赖

通过安全检查更新和现代化项目依赖：**$ARGUMENTS**

## 当前依赖状态

- 包管理器：@package.json 或 @requirements.txt 或 @Cargo.toml（检测包管理器）
- 过期的包：!`npm outdated 2>/dev/null || pip list --outdated 2>/dev/null || echo "需要手动检查"`
- 安全问题：!`npm audit --audit-level=moderate 2>/dev/null || pip check 2>/dev/null || echo "运行安全审计"`
- 锁文件：@package-lock.json 或 @poetry.lock 或 @Cargo.lock

## 任务

系统地更新项目依赖，进行全面测试和兼容性验证：

**更新策略**：使用 $ARGUMENTS 指定补丁更新、次要更新、主要更新或仅安全更新

**更新流程**：
1. **依赖分析** - 审计当前版本、识别过期包、评估安全漏洞
2. **影响评估** - 检查变更日志、破坏性更改、弃用警告、兼容性矩阵
3. **分阶段更新** - 首先应用补丁更新，然后次要更新，最后主要版本更新，各阶段之间进行测试
4. **测试与验证** - 运行完整测试套件、构建验证、集成测试、性能检查
5. **回滚策略** - 记录更改、创建还原点、维护回滚程序
6. **文档更新** - 更新 README、依赖列表、迁移指南、团队通知

**安全特性**：更新之间的自动化测试、依赖冲突解决、安全漏洞优先级排序。

**输出**：更新的依赖清单，包含全面的测试结果、安全审计报告和升级文档。
