---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [framework] | --cypress | --playwright | --webdriver | --puppeteer | --mobile
description: 配置全面的端到端测试套件,支持框架选择和 CI 集成
---

# 端到端测试配置

配置全面的端到端测试套件,包含框架优化:**$ARGUMENTS**

## 当前 E2E 上下文

- 应用类型: !`find . -name "index.html" -o -name "app.js" -o -name "App.tsx" | head -1 && echo "Web应用" || echo "检测应用类型"`
- 框架: !`grep -l "react\\|vue\\|angular" package.json 2>/dev/null || echo "检测框架"`
- 现有测试: !`find . -name "cypress" -o -name "playwright" -o -name "e2e" | head -1 || echo "无E2E配置"`
- CI 系统: !`find . -name ".github" -o -name ".gitlab-ci.yml" | head -1 || echo "未检测到CI"`

## 任务

实现全面的端到端测试,包含框架选择和优化:

**框架焦点**: 使用 $ARGUMENTS 指定 Cypress、Playwright、WebDriver、Puppeteer、移动测试或自动检测最佳匹配

**E2E 测试框架**:

1. **框架选择与设置** - 选择最优 E2E 工具,安装依赖,配置基本设置,设置项目结构
2. **测试环境配置** - 设置测试环境,配置基础 URL,实现环境切换,优化测试隔离
3. **页面对象模式** - 设计页面对象模型,创建可重用组件,实现元素选择器,优化可维护性
4. **测试数据管理** - 设置测试数据策略,实现测试夹具,配置数据库种子,设计清理程序
5. **跨浏览器测试** - 配置多浏览器执行,设置移动测试,实现响应式测试,优化兼容性
6. **CI/CD 集成** - 配置自动化执行,设置并行测试,实现报告,优化性能

**高级功能**: 视觉回归测试、可访问性测试、性能监控、API 测试集成、移动设备测试。

**质量保证**: 测试可靠性优化、防止不稳定测试、执行速度优化、调试能力。

**输出**: 完整的 E2E 测试设置,包含框架配置、测试套件、CI 集成和维护工作流。
