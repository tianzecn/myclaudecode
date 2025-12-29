---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [orchestration-type] | --parallel | --sequential | --conditional | --pipeline-optimization
description: 编排全面的测试自动化,支持智能执行和优化
---

# 测试自动化编排器

使用执行优化和资源管理编排智能测试自动化:**$ARGUMENTS**

## 当前编排上下文

- 测试套件: !`find . -name "*.test.*" -o -name "*.spec.*" | wc -l` 个项目测试文件
- 测试框架: !`find . -name "jest.config.*" -o -name "cypress.config.*" -o -name "playwright.config.*" | wc -l` 个配置的框架

## 任务

实现智能测试编排,包含执行优化和资源管理:

**编排类型**: 使用 $ARGUMENTS 聚焦于并行执行、顺序执行、条件测试或管道优化

**测试编排框架**:
1. **测试发现和分类** - 分析测试套件、分类测试类型
2. **执行策略设计** - 设计并行执行策略、实现智能批处理
3. **依赖管理** - 分析测试依赖、实现执行排序
4. **资源优化** - 配置并行执行、实现资源池
5. **管道集成** - 设计CI/CD集成、实现阶段编排
6. **监控和分析** - 实现执行监控、配置性能跟踪

**输出**: 完整的测试编排系统,包含优化的执行、智能资源管理、全面监控和性能分析。
