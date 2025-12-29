---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [language] | --javascript | --typescript | --python | --multi-language
description: 配置全面的代码检查和质量分析工具，自动化强制执行
---

# 配置代码检查

配置全面的代码检查和质量分析：**$ARGUMENTS**

## 当前代码质量状态

- 检测到的语言：!`find . -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.rs" | head -5`
- 现有检查器：@.eslintrc.* 或 @pyproject.toml 或 @tslint.json
- 包管理器：@package.json 或 @requirements.txt 或 @Cargo.toml
- 代码质量工具：!`which eslint flake8 pylint mypy clippy 2>/dev/null | wc -l`

## 任务

设置全面的代码检查系统，具有质量分析和自动化执行：

**语言重点**：使用 $ARGUMENTS 配置 JavaScript/TypeScript ESLint、Python Linting 或多语言质量分析

**检查配置**：
1. **工具安装** - ESLint、Flake8、Pylint、MyPy、Clippy、特定语言的检查器和插件
2. **规则配置** - 代码样式规则、错误检测、最佳实践、安全模式、性能指南
3. **IDE 集成** - 实时检查、错误高亮、快速修复、工作区设置
4. **质量门控** - 预提交验证、CI/CD 集成、Pull Request 检查、质量指标
5. **自定义规则** - 项目特定模式、架构约束、团队约定
6. **性能** - 增量检查、缓存策略、并行执行、优化

**高级功能**：安全检查、可访问性检查、性能分析、依赖分析、代码复杂度指标。

**团队标准**：共享配置、样式指南、审查指南、入职文档。

**输出**：完整的检查系统，具有自动化质量门控、团队标准执行和全面的代码分析。
