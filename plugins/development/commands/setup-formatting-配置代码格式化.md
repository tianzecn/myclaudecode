---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [language] | --javascript | --typescript | --python | --multi-language
description: 配置全面的代码格式化工具，强制执行一致的代码风格
---

# 配置代码格式化

配置全面的代码格式化，强制执行一致的风格：**$ARGUMENTS**

## 当前项目状态

- 检测到的语言：!`find . -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.rs" | head -5`
- 现有格式化器：@.prettierrc 或 @pyproject.toml 或 @rustfmt.toml
- 包管理器：@package.json 或 @requirements.txt 或 @Cargo.toml
- IDE 配置：@.vscode/settings.json 或 @.editorconfig

## 任务

设置全面的代码格式化系统，具有自动化执行和团队一致性：

**语言重点**：使用 $ARGUMENTS 配置 JavaScript/TypeScript、Python、Rust 或多语言格式化

**格式化设置**：
1. **工具安装** - Prettier、Black、rustfmt、特定语言的格式化器和插件
2. **配置** - 样式规则、行长度、缩进、引号、尾随逗号、特定语言选项
3. **IDE 集成** - 编辑器扩展、保存时格式化、键盘快捷键、工作区设置
4. **自动化** - 预提交钩子、CI/CD 格式化检查、自动化格式化脚本
5. **团队同步** - 共享配置、样式指南、执行策略、入职文档
6. **验证** - 格式化验证、CI 集成、团队合规性监控

**高级功能**：自定义规则、框架特定格式化、性能优化、增量格式化。

**一致性**：跨平台兼容性、团队标准化、遗留代码迁移策略。

**输出**：完整的格式化系统，具有自动化执行、团队配置和样式合规性监控。
