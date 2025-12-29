---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [analysis-type] | --coverage-quality | --test-effectiveness | --maintainability | --performance-analysis
description: 分析测试套件质量,提供全面指标和改进建议
---

# 测试质量分析器

使用全面指标和可操作改进洞察分析测试套件质量:**$ARGUMENTS**

## 当前质量上下文

- 测试覆盖率: !`find . -name "coverage" -type d | head -1 && echo "覆盖率数据可用" || echo "无覆盖率数据"`
- 测试文件: !`find . -name "*.test.*" -o -name "*.spec.*" | wc -l` 个测试文件

## 任务

执行全面测试质量分析,包含改进建议和优化策略:

**分析类型**: 使用 $ARGUMENTS 聚焦于覆盖率质量、测试有效性、可维护性分析或性能分析

**测试质量分析框架**:
1. **覆盖率质量评估** - 分析覆盖率深度、评估覆盖率质量
2. **测试有效性评估** - 测量缺陷检测能力、分析测试可靠性
3. **可维护性分析** - 评估测试代码质量、分析测试组织
4. **性能评估** - 分析执行性能、识别瓶颈
5. **反模式检测** - 识别测试反模式、检测不稳定测试
6. **质量指标跟踪** - 实现质量评分、跟踪改进趋势

**输出**: 全面的质量分析,包含详细指标、改进建议、优化策略和质量跟踪框架。
