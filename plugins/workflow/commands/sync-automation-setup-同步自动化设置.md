---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [setup-mode] | --full | --webhooks-only | --monitoring | --deploy-target
description: 配置全面的自动化同步工作流，支持监控和 CI/CD 集成
---

# Sync Automation Setup - 同步自动化设置

设置全面的自动化同步工作流: **$ARGUMENTS**

## 当前基础设施状态

- GitHub CLI: !`gh --version 2>/dev/null && echo "✓ 可用" || echo "⚠ 不可用"`
- Linear MCP: 检查 Linear MCP 服务器可用性和配置
- 基础设施: Docker、webhook 端点、数据库连接、队列服务
- CI/CD: !`find . -name ".github" -o -name ".gitlab-ci.yml" -o -name "azure-pipelines.yml" | wc -l` 个现有工作流

## 任务

配置生产就绪的自动化同步与全面基础设施:

**设置模式**: 使用 $ARGUMENTS 指定完全自动化、仅 webhooks、监控设置或部署目标

**自动化框架**:
1. **先决条件设置** - 验证 GitHub/Linear 访问,检查基础设施需求,配置认证,测试连接
2. **Webhook 配置** - 设置 GitHub/Linear webhooks,配置端点,实现安全,测试交付
3. **CI/CD 集成** - 创建 GitHub Actions 工作流,设置定时同步,实现事件处理,配置部署
4. **同步服务器部署** - 配置同步引擎,设置队列管理,实现错误处理,启用监控
5. **数据库与状态管理** - 初始化同步数据库,设置模式,配置备份,实现状态跟踪
6. **监控与告警** - 配置仪表板,设置告警,实现健康检查,启用通知

**高级功能**: 实时 webhook 处理,智能冲突解决,全面监控,可扩展基础设施。

**生产就绪**: 高可用性设置,全面错误处理,性能监控,安全实现,自动备份。

**输出**: 完整的自动化基础设施,包括 webhook 集成、CI/CD 工作流、监控仪表板和生产部署能力。
