---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [focus-area] | --headers | --auth | --encryption | --infrastructure
description: 强化应用安全配置,包含全面的安全控制
---

# 安全加固

强化应用安全配置和控制:**$ARGUMENTS**

## 当前安全态势

- 框架: @package.json or @requirements.txt or @Cargo.toml
- 安全头: !`curl -I http://localhost:3000 2>/dev/null | grep -i 'x-\|content-security\|strict-transport' || echo "无服务器运行"`

## 任务

基于安全最佳实践实现全面安全加固:

**加固重点**: 使用 $ARGUMENTS 针对特定区域或应用全面加固

**安全控制**:
1. **认证和授权** - MFA、RBAC、会话安全、密码策略
2. **输入验证** - XSS防护、SQL注入保护、CSRF令牌
3. **安全通信** - HTTPS/TLS、HSTS、证书管理
4. **数据保护** - 静态/传输加密、密钥管理、安全存储
5. **安全头** - CSP、CORS、安全响应头
6. **基础设施安全** - 容器加固、网络分段、监控

**输出**: 加固的应用,具有全面的安全控制、适当的配置和监控能力。
