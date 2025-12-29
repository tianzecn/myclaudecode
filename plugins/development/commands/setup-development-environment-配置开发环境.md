---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [environment-type] | --local | --docker | --cloud | --full-stack
description: 配置全面的开发环境，包含工具、配置和工作流
---

# 配置开发环境

使用现代工具配置全面的开发环境：**$ARGUMENTS**

## 当前环境状态

- 操作系统：!`uname -s` 和架构检测
- 开发工具：!`node --version 2>/dev/null || python --version 2>/dev/null || echo "未检测到运行时"`
- 包管理器：!`which npm yarn pnpm pip poetry cargo 2>/dev/null | wc -l` 个可用管理器
- IDE/编辑器：检查 VS Code、IntelliJ 或其他开发环境

## 任务

使用现代工具和最佳实践配置完整的开发环境：

**环境类型**：使用 $ARGUMENTS 指定本地设置、基于 Docker、云环境或全栈开发

**环境设置**：
1. **运行时安装** - 编程语言、包管理器、版本管理器（nvm、pyenv、rustup）
2. **开发工具** - IDE 配置、扩展、调试器、性能分析器、数据库客户端
3. **构建系统** - 编译器、打包器、任务运行器、CI/CD 工具、测试框架
4. **代码质量** - Linting、格式化、预提交钩子、代码分析工具
5. **环境配置** - 环境变量、密钥管理、配置文件
6. **团队同步** - 共享配置、文档、入职指南

**高级功能**：热重载、调试配置、性能监控、容器编排。

**自动化**：自动化设置脚本、配置管理、团队环境同步。

**输出**：完整的开发环境，包含文档化的设置过程、团队配置和故障排除指南。
