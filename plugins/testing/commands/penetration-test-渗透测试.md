---
allowed-tools: Read, Bash, Grep, Glob
argument-hint: [target] | --web-app | --api | --auth | --full-scan
description: 对应用执行渗透测试和漏洞评估
---

# 渗透测试

执行渗透测试和漏洞评估:**$ARGUMENTS**

## 应用上下文

- 运行服务: !`netstat -tlnp 2>/dev/null | grep LISTEN | head -10 || lsof -i -P | grep LISTEN | head -10`
- Web框架: @package.json or @requirements.txt
- API端点数量: !`grep -r "route\|endpoint\|@app\\.route\|@RequestMapping" src/ 2>/dev/null | wc -l`

## 任务

按照道德黑客方法论进行系统渗透测试:

**测试目标**: 使用 $ARGUMENTS 聚焦于 Web 应用、API、认证或综合测试

**测试阶段**:
1. **侦察** - 服务发现、技术指纹识别、攻击面映射
2. **漏洞评估** - OWASP Top 10、注入缺陷、身份验证破坏
3. **漏洞利用测试** - XSS、CSRF、SQL注入、权限提升尝试
4. **认证测试** - 暴力破解、会话管理、授权绕过
5. **API安全测试** - 输入验证、速率限制、认证绕过
6. **基础设施测试** - 网络安全、容器安全、配置问题

**输出**: 全面的渗透测试报告,包含执行摘要、详细发现、风险评级和修复路线图。
