---
name: telegram-dev
description: Telegram 生态开发全栈指南 - 涵盖 Bot API、Mini Apps (Web Apps)、MTProto 客户端开发。包括消息处理、支付、内联模式、Webhook、认证、存储、传感器 API 等完整开发资源。。
---

# Telegram 生态开发技能

全面的 Telegram 开发指南，涵盖 Bot 开发、Mini Apps (Web Apps)、客户端开发的完整技术栈。

## 📖 目录

### 快速导航

#### 🤖 Bot API 开发

- [快速开始](#bot-api-开发-快速开始) - 获取 Token，第一个 Bot
- [核心 API 方法](#bot-api-开发-core-api-methods) - 消息、交互、文件、支付
- [Webhook 配置](#webhook-配置) - 设置和管理 Webhook
- [内联键盘](#内联键盘) - 交互式按钮
- [内联模式](#内联模式) - 在其他聊天中使用 Bot
- [Bot 菜单按钮](#bot-菜单按钮-menu-button) - Mini App 入口
- [深度链接](#深度链接-deep-links) - 带参数的启动链接
- [Telegram Stars 支付](#telegram-stars-支付) - 虚拟货币支付

#### 🌐 Mini Apps (Web Apps) 开发

- [初始化 Mini App](#mini-apps-web-apps-开发-初始化-mini-app) - HTML 模板和基础设置
- [核心 API](#mini-app-核心-api) - WebApp 对象方法
- [UI 控件](#ui-控件) - 主按钮、次要按钮、触觉反馈
- [存储 API](#存储-api) - 云存储和本地存储
- [生物识别认证](#生物识别认证) - 指纹/面部识别
- [传感器 API](#位置和传感器) - 位置、加速度计、陀螺仪
- [支付集成](#支付集成) - Telegram Stars 支付
- [数据验证](#数据验证) - 服务器端 initData 验证
- [启动方式](#启动-mini-app) - 键盘按钮、内联按钮、菜单按钮

#### 👥 客户端开发 (TDLib)

- [使用 TDLib](#使用-tdlib) - Python 和 JavaScript 示例
- [MTProto 协议](#mtproto-协议) - 特点和限制

#### 🔧 实战指南

- [错误处理和调试](#错误处理和调试) - 完整的错误处理框架
- [部署和运维](#生产环境部署) - Heroku、Vercel、Docker 部署
- [Node.js 开发](#nodejs-bot-开发) - Telegraf 和 Grammy 框架
- [测试指南](#测试指南) - 单元测试、集成测试、Mini Apps 测试
- [安全最佳实践](#安全最佳实践) - Token 管理、输入验证、权限控制
- [性能优化](#性能优化) - 异步编程、缓存、数据库优化
- [故障排除](#故障排除和常见问题) - 常见问题和解决方案

#### 🏗️ 项目架构

- [项目结构](#完整项目结构) - Python 和 Node.js 项目模板
- [模块化设计](#模块化设计原则) - 单一职责、依赖注入
- [配置管理](#配置管理) - 分层配置和环境变量
- [数据库架构](#数据库架构) - Repository 模式
- [日志监控](#日志和监控) - 结构化日志和性能指标

#### 📚 实战案例

- [电商 Bot](#案例-1-电商-bot) - 商品展示、购物车、支付
- [投票 Bot](#案例-2-投票-bot) - 创建投票、匿名投票、结果统计
- [客服 Bot](#案例-3-客服-bot) - FAQ、自动回复、人工转接
- [项目模板](#项目模板) - 快速启动模板

---

## 何时使用此技能

当需要以下帮助时使用此技能：

- 开发 Telegram Bot（消息机器人）
- 创建 Telegram Mini Apps（小程序）
- 构建自定义 Telegram 客户端
- 集成 Telegram 支付和业务功能
- 实现 Webhook 和长轮询
- 使用 Telegram 认证和存储
- 处理消息、媒体和文件
- 实现内联模式和键盘

## Telegram 开发生态概览

### 三大核心 API

1. **Bot API** - 创建机器人程序

   - HTTP 接口，简单易用
   - 自动处理加密和通信
   - 适合：聊天机器人、自动化工具

2. **Mini Apps API** (Web Apps) - 创建 Web 应用

   - JavaScript 接口
   - 在 Telegram 内运行
   - 适合：小程序、游戏、电商

3. **Telegram API & TDLib** - 创建客户端
   - 完整的 Telegram 协议实现
   - 支持所有平台
   - 适合：自定义客户端、企业应用

## Bot API 开发

### 快速开始

**Bot 菜单按钮 (Menu Button)**

Bot 菜单按钮是 Telegram 在聊天界面提供的简化入口，让用户可以快速启动 Mini App。

**设置菜单按钮（Bot Father）：**

```
1. 与 @BotFather 对话
2. 发送 /setmenubutton
3. 选择你的 Bot
4. 提供菜单按钮类型和 URL
```

**菜单按钮类型：**

```python
# 类型 1: Web App 按钮
await bot.set_chat_menu_button(
    menu_button={
        'type': 'web_app',
        'text': '打开应用',
        'web_app': {'url': 'https://your-mini-app.com'}
    }
)

# 类型 2: 默认按钮（恢复默认）
await bot.set_chat_menu_button(menu_button={'type': 'default'})

# 类型 3: 命令按钮（快速执行命令）
await bot.set_chat_menu_button(
    menu_button={
        'type': 'commands',
        'text': '命令列表'
    }
)

# 查询当前菜单按钮
menu_button_info = await bot.get_chat_menu_button()
print(menu_button_info)
```

**深度链接 (Deep Links)**

深度链接允许用户通过点击链接直接与 Bot 交互，并传递参数。

**创建深度链接：**

```python
# 格式: https://t.me/{bot_username}?start={parameter}
# 参数: 64 字符以内的字符串（A-Z, a-z, 0-9, _, -）

invite_link = f"https://t.me/{bot_username}?start=user_12345"

# 生成邀请链接（群组）
group_link = await bot.create_chat_invite_link(
    chat_id=group_chat_id,
    name='加入我们的群组',
    creates_join_request=True  # 需要管理员审核
)
print(group_link.invite_link)
```

**处理深度链接：**

```python
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

@bot.command('start')
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理 /start 命令，包括深度链接参数"""
    user_id = update.effective_user.id

    # 检查是否通过深度链接启动
    if context.args:
        parameter = context.args[0]  # 获取参数

        # 示例: 处理用户推荐链接
        if parameter.startswith('user_'):
            referrer_id = parameter[5:]  # 提取推荐人 ID
            await handle_referral(user_id, referrer_id)

        # 示例: 处理产品链接
        elif parameter.startswith('product_'):
            product_id = parameter[8:]
            await show_product(update, product_id)

        # 示例: 处理活动链接
        elif parameter.startswith('event_'):
            event_code = parameter[6:]
            await join_event(update, event_code)

        await update.message.reply_text(f"欢迎！参数: {parameter}")
    else:
        # 普通 /start 命令
        await update.message.reply_text("欢迎！使用 /help 查看帮助")


```

**内联深度链接：**

```python
# 格式: https://t.me/{bot_username}?startapp={parameter}
# 用于 Mini Apps 的内联深度链接

@bot.command('start')
async def start_with_app(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.args and context.args[0].startswith('app_'):
        # 这是一个 Mini App 深度链接
        app_parameter = context.args[0][4:]

        # 创建内联键盘打开 Mini App
        keyboard = {
            'inline_keyboard': [[
                {
                    'text': '打开应用',
                    'web_app': {
                        'url': f'https://your-mini-app.com?param={app_parameter}'
                    }
                }
            ]]
        }

        await update.message.reply_text(
            '点击按钮打开应用',
            reply_markup=keyboard
        )
```

**Telegram Stars 支付**

Telegram Stars 是 Telegram 的虚拟货币系统，支持小额支付。

**创建 Stars 发票：**
