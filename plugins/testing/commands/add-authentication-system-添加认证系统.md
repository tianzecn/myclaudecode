---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [auth-method] | --oauth | --jwt | --mfa | --passwordless
description: 实现安全的用户认证系统,采用选定的方法和安全最佳实践
---

# 添加认证系统

实现安全的用户认证系统:**$ARGUMENTS**

## 当前应用状态

- 框架检测: @package.json or @requirements.txt or @Cargo.toml
- 现有认证: !`grep -r "auth\|login\|jwt\|session" src/ --include="*.js" --include="*.py" --include="*.rs" | wc -l`
- 安全配置: @.env* (检查认证相关变量)
- 数据库配置: 检查用户模型或认证表

## 任务

实现全面的认证系统,遵循安全最佳实践:

**认证方法**: 根据 $ARGUMENTS 选择用户名/密码、OAuth 2.0、JWT、SAML、MFA 或无密码认证

**实现区域**:
1. **用户管理** - 注册、个人资料、密码策略、账户验证
2. **认证流程** - 登录/登出、会话管理、令牌处理、中间件
3. **授权系统** - RBAC、权限、路由保护、API 安全
4. **安全加固** - 密码哈希、速率限制、CSRF 保护、安全 Cookie
5. **集成** - 前端组件、API 端点、数据库模型、中间件

**安全标准**: 实现 OWASP 认证指南、安全会话管理和适当的错误处理。

**输出**: 生产就绪的认证系统,具有全面的安全控制和用户友好的界面。
