---
allowed-tools: Read, Bash, Grep
argument-hint: [scope] | --security | --licenses | --updates | --all
description: 审计依赖的安全漏洞、许可证合规性并提供更新建议
---

# 依赖审计

审计依赖的安全漏洞和合规性:**$ARGUMENTS**

## 当前依赖

- 包文件: @package.json or @requirements.txt or @Cargo.toml or @pom.xml
- 锁文件: @package-lock.json or @poetry.lock or @Cargo.lock
- 安全扫描: !`npm audit --audit-level=moderate 2>/dev/null || pip check 2>/dev/null || cargo audit 2>/dev/null || echo "无可用安全扫描器"`
- 过时包: !`npm outdated 2>/dev/null || pip list --outdated 2>/dev/null || echo "手动检查"`

## 任务

执行全面的依赖安全和合规性审计:

**审计范围**: 使用 $ARGUMENTS 聚焦于安全、许可证、更新或完整审计

**分析区域**:
1. **漏洞扫描** - 已知 CVE、安全公告、可利用性
2. **版本分析** - 过时包、破坏性变更、更新建议
3. **许可证合规** - 许可证兼容性、限制、法律义务
4. **供应链安全** - 包真实性、维护者状态、可疑依赖
5. **性能影响** - 包大小、未使用依赖、优化机会

**输出**: 优先级安全报告,包含关键漏洞、建议操作和合规状态。
