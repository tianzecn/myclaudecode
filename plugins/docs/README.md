# Docs Plugin

> 文档技能集合 - 产品文档的 Claude 技能包

## 概述

这个插件包含各种产品和框架的文档技能，帮助你快速了解和使用相关产品。

## 包含的技能

### ShipAny

**描述**: ShipAny 中文文档 - AI SaaS 快速构建平台

**内容**:
- 44 页官方文档
- 邮件服务 (Resend) 配置
- 支付集成 (Stripe, Lemon Squeezy)
- 部署指南
- API 参考

**触发场景**:
- 使用 ShipAny 构建 SaaS 应用
- 配置 ShipAny 邮件、支付等服务
- 部署 ShipAny 项目

## 安装

```bash
/plugin install docs@tianzecn-plugins
```

## 使用

安装后，当你的问题涉及到相关产品时，Claude 会自动使用对应的文档技能来回答。

例如：
- "如何在 ShipAny 中配置 Resend 邮件服务？"
- "ShipAny 支持哪些支付方式？"
- "如何部署 ShipAny 项目？"

## 添加新技能

使用 `skill-seekers` 插件可以轻松添加新的文档技能：

```
帮我把 https://example.com/docs/ 做成技能包
```

然后将生成的技能复制到 `skills/` 目录即可。

## 许可证

MIT License
