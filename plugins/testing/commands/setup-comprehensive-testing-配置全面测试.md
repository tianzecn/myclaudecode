---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [scope] | --unit | --integration | --e2e | --visual | --performance | --full-stack
description: 配置完整的测试基础设施,包含框架配置和 CI 集成
---

# 配置全面测试

使用多层测试策略设置完整测试基础设施:**$ARGUMENTS**

## 当前测试基础设施

- 项目类型: !`[ -f package.json ] && echo "Node.js" || [ -f requirements.txt ] && echo "Python" || echo "多语言"`
- 现有测试: !`find . -name "*.test.*" -o -name "*.spec.*" | wc -l` 个测试文件

## 任务

使用多层测试策略实现全面测试基础设施:

**设置范围**: 使用 $ARGUMENTS 聚焦于单元、集成、e2e、视觉、性能测试或全栈实现

**全面测试框架**:
1. **测试策略设计** - 分析项目需求、定义测试金字塔、规划覆盖目标
2. **单元测试设置** - 配置主要框架(Jest、Vitest、pytest)
3. **集成测试** - 设置集成测试框架、配置测试数据库
4. **E2E测试配置** - 设置浏览器测试(Cypress、Playwright)
5. **视觉和性能测试** - 设置视觉回归测试、配置性能基准
6. **CI/CD集成** - 配置自动化测试执行、设置并行测试

**输出**: 完整的测试基础设施,包含配置的框架、CI集成、质量指标和维护工作流。
