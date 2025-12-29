---
allowed-tools: Bash(find:*), Bash(ls:*)
description: 为特定文件生成全面的测试
---

## 您的任务

为以下文件生成全面的单元测试：@$ARGUMENTS

要求：
- 使用此项目中现有的测试框架
- 包含边缘情况和错误场景
- 遵循项目的测试约定
- 力求高测试覆盖率
- 包含正向和反向测试用例

## 项目上下文

- 现有测试文件：!`find . -name "*.test.*" -o -name "*.spec.*" | head -10`
- Package.json 测试设置：@package.json
