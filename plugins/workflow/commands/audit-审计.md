---
allowed-tools: Bash(find:*), Bash(grep:*)
description: 对代码库执行安全审计
---

## 上下文

- Package.json 依赖项: @package.json
- 环境文件: !`find . -name ".env*" -o -name "config.*" | head -10`
- 潜在安全文件: !`find . -name "*secret*" -o -name "*key*" -o -name "*password*" | head -10`

## 你的任务

执行安全审计，重点关注：

1. **依赖项漏洞**: 检查已知的 CVE 漏洞
2. **认证/授权**: 审查认证实现
3. **输入验证**: 检查注入漏洞
4. **数据暴露**: 查找敏感数据泄露
5. **配置安全**: 审查安全配置
6. **密钥管理**: 确保正确处理密钥

目标: $ARGUMENTS (如果指定，否则审计整个代码库)

提供按优先级排序的发现结果及修复步骤。
