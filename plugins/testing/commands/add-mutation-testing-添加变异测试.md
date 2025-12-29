---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [language] | --javascript | --java | --python | --rust | --go | --csharp
description: 配置全面的变异测试,支持框架选择和 CI 集成
---

# 添加变异测试

配置变异测试框架,包含质量指标和 CI 集成:**$ARGUMENTS**

## 当前测试上下文

- 语言: !`find . -name "*.js" -o -name "*.ts" | head -1 >/dev/null && echo "JavaScript/TypeScript" || find . -name "*.py" | head -1 >/dev/null && echo "Python" || find . -name "*.java" | head -1 >/dev/null && echo "Java" || echo "Multi-language"`
- 测试覆盖率: !`find . -name "coverage" -o -name ".nyc_output" | head -1 || echo "无覆盖率数据"`
- 测试框架: !`grep -l "jest\\|mocha\\|pytest\\|junit" package.json pom.xml setup.py 2>/dev/null | head -1 || echo "从测试中检测"`
- CI 系统: !`find . -name ".github" -o -name ".gitlab-ci.yml" -o -name "Jenkinsfile" | head -1 || echo "未检测到 CI"`

## 任务

实现全面的变异测试,包含框架优化和质量控制:

**语言焦点**: 使用 $ARGUMENTS 指定 JavaScript、Java、Python、Rust、Go、C# 或从代码库自动检测

**变异测试框架**:

1. **工具选择与设置** - 选择框架 (Stryker、PIT、mutmut、cargo-mutants),安装依赖,配置基本设置,验证安装
2. **变异操作符配置** - 配置算术运算符、关系运算符、逻辑运算符、条件边界、语句变异
3. **性能优化** - 设置并行执行,配置增量测试,优化文件过滤,实现缓存策略
4. **质量指标** - 配置变异得分计算,设置存活分析,实现阈值强制,跟踪有效性趋势
5. **CI/CD 集成** - 自动化执行触发器,配置性能监控,设置结果报告,实现部署门控
6. **结果分析** - 设置可视化仪表板,配置存活变异分析,实现修复工作流,跟踪回归模式

**高级功能**: 选择性变异测试、性能分析、自动化测试改进建议、变异趋势分析、质量门控集成。

**框架支持**: 特定语言优化、工具生态系统集成、性能调优、报告定制。

**输出**: 完整的变异测试设置,包含配置的框架、CI 集成、质量阈值和分析工作流。
