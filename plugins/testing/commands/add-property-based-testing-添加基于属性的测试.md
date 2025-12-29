---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [language] | --javascript | --python | --java | --haskell | --rust | --clojure
description: 实现基于属性的测试,支持框架选择和不变量识别
---

# 添加基于属性的测试

实现基于属性的测试框架,包含不变量分析和测试生成:**$ARGUMENTS**

## 当前测试上下文

- 语言: !`find . -name "*.js" -o -name "*.ts" | head -1 >/dev/null && echo "JavaScript/TypeScript" || find . -name "*.py" | head -1 >/dev/null && echo "Python" || echo "Multi-language"`
- 测试框架: !`find . -name "jest.config.*" -o -name "pytest.ini" | head -1 || echo "检测框架"`
- 数学函数: 代码库中可进行属性测试的函数分析
- 业务逻辑: 域逻辑中的不变量和属性识别

## 任务

实现全面的基于属性的测试,包含不变量分析和自动化测试生成:

**语言焦点**: 使用 $ARGUMENTS 指定 JavaScript、Python、Java、Haskell、Rust、Clojure 或从代码库自动检测

**基于属性的测试框架**:

1. **框架选择** - 选择合适的工具 (fast-check、Hypothesis、QuickCheck、proptest),安装依赖,配置集成
2. **属性识别** - 分析数学属性,识别业务不变量,发现对称性,评估往返属性
3. **生成器设计** - 创建自定义数据生成器,实现基于约束的生成,设计组合生成器,优化生成策略
4. **属性实现** - 编写属性测试,实现前置条件,设计后置条件,创建不变量检查
5. **收缩配置** - 配置测试用例收缩,优化失败最小化,实现自定义收缩器,增强调试能力
6. **集成与报告** - 与现有测试套件集成,配置报告,设置 CI 集成,优化执行性能

**高级功能**: 有状态属性测试、基于模型的测试、自定义生成器、并行属性执行、性能属性测试。

**质量保证**: 属性完整性分析、边缘情况覆盖、性能优化、可维护性评估。

**输出**: 完整的基于属性的测试设置,包含已识别的属性、自定义生成器、集成的测试套件和性能优化。
