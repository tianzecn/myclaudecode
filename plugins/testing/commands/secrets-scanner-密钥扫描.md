---
allowed-tools: Read, Bash, Grep, Glob
argument-hint: [scope] | --api-keys | --passwords | --certificates | --fix
description: 扫描代码库中暴露的密钥、凭证和敏感信息
---

# 密钥扫描

扫描代码库中暴露的密钥和敏感信息:**$ARGUMENTS**

## 当前仓库状态

- Git状态: !`git status --porcelain | wc -l` 个未提交文件
- 可扫描文件: !`find . -name "*.js" -o -name "*.py" -o -name "*.env*" -o -name "*.yml" | wc -l` 个

## 任务

在代码库中执行全面的密钥检测和修复:

**扫描范围**: 使用 $ARGUMENTS 聚焦于 API密钥、密码、证书或完整扫描

**检测类别**:
1. **API密钥和令牌** - GitHub、AWS、Google Cloud、Stripe、第三方服务
2. **数据库凭证** - 连接字符串、用户名、密码
3. **证书和密钥** - 私钥、SSH密钥、SSL证书
4. **认证密钥** - JWT密钥、会话密钥、OAuth凭证
5. **配置泄漏** - 硬编码URL、内部端点、调试设置

**修复操作**: 识别暴露的密钥及文件位置和行号,提供安全替代方案,生成.gitignore条目,创建安全配置模板。

**输出**: 详细安全报告,包含风险级别、即时操作和长期安全改进。
