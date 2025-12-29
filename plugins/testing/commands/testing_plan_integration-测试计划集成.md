---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [target-code] | [test-type] | --rust | --inline | --refactoring-suggestions
description: 创建全面的集成测试计划,包含内联测试和重构建议
---

# 测试计划集成

创建集成测试计划,包含内联测试策略和重构建议:**$ARGUMENTS**

## 当前测试上下文

- 项目类型: !`[ -f Cargo.toml ] && echo "Rust项目" || [ -f package.json ] && echo "Node.js项目" || echo "多语言项目"`
- 测试框架: !`find . -name "*.test.*" -o -name "*.spec.*" | head -3` 现有测试
- 目标代码: 分析 $ARGUMENTS 以进行可测试性评估

## 任务

执行全面的集成测试计划,包含可测试性分析:

**规划重点**: 使用 $ARGUMENTS 指定目标代码、测试类型需求、Rust内联测试或重构建议

**集成测试框架**:
1. **代码可测试性分析** - 分析目标代码结构、识别测试挑战
2. **测试策略设计** - 设计集成测试方法、规划内联vs单独测试文件
3. **重构评估** - 识别可测试性改进、建议依赖注入
4. **测试用例规划** - 设计集成场景、识别关键路径
5. **Mock策略** - 规划外部依赖mock、设计测试替身
6. **执行规划** - 设计测试执行顺序、规划测试数据管理

**输出**: 全面的集成测试计划,包含测试用例规范、重构建议、实现策略和质量指标。
