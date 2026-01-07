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

```python
from telegram import LabeledPrice

await bot.send_invoice(
    chat_id=chat_id,
    title='高级订阅',
    description='1 个月的高级功能访问',
    payload='premium_subscription',
    provider_token='',  # Telegram Stars 支付不需要
    currency='XTR',  # XTR = Telegram Stars
    prices=[
        LabeledPrice('1 个月', 100),  # 100 Stars
        LabeledPrice('3 个月', 250),  # 250 Stars（优惠）
    ],
    start_parameter='premium_start',
    photo_url='https://example.com/premium.jpg',
    photo_size=800,
    photo_width=800,
    photo_height=800,
    is_flexible=False  # 价格不可变
)
```

**处理预结账查询：**

```python
from telegram import PreCheckoutQuery

@bot.pre_checkout_query_handler
async def pre_checkout_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.pre_checkout_query

    # 验证订单
    if await validate_order(query.invoice_payload, query.from_user.id):
        await query.answer(ok=True)
    else:
        await query.answer(
            ok=False,
            error_message='订单验证失败，请联系客服'
        )

async def validate_order(payload: str, user_id: int) -> bool:
    """验证订单有效性"""
    # 检查用户是否有权限购买
    # 检查订单是否已处理
    # 检查价格是否正确
    return True
```

**处理支付成功：**

```python
@bot.message_handler(content_types=['successful_payment'])
async def successful_payment_handler(message: Message):
    payment = message.successful_payment

    # 解析支付信息
    user_id = message.chat.id
    payload = payment.invoice_payload
    currency = payment.currency  # XTR
    total_amount = payment.total_amount  # Stars 数量

    # 验证并处理支付
    await process_payment(user_id, payload, total_amount)

    await message.reply_text(
        f'✅ 支付成功！\n'
        f'支付: {total_amount} {currency}\n'
        f'订单: {payload}'
    )

async def process_payment(user_id: int, payload: str, amount: int):
    """处理支付后的业务逻辑"""
    if payload == 'premium_subscription':
        # 激活高级功能
        await activate_premium(user_id, duration_days=30)
    elif payload == 'credits':
        # 充值积分
        await add_credits(user_id, amount)
```

**在 Mini App 中发起支付：**

```javascript
const tg = window.Telegram.WebApp;

// 打开发票链接
tg.openInvoice("https://t.me/$invoice_link", (status) => {
  if (status === "paid") {
    console.log("支付成功");
    // 通知 Bot 支付完成
    tg.sendData(
      JSON.stringify({
        action: "payment_completed",
        invoice_id: "...",
      })
    );
  } else if (status === "cancelled") {
    console.log("支付取消");
  } else if (status === "pending") {
    console.log("支付处理中");
  } else if (status === "failed") {
    console.log("支付失败");
  }
});
```

**消息编辑限制**

Telegram 允许编辑消息，但有 48 小时的限制。

```python
import datetime
from telegram.error import BadRequest

async def edit_message_safely(chat_id: int, message_id: int, new_text: str):
    """安全编辑消息，处理时间限制"""
    try:
        # 尝试编辑消息
        await bot.edit_message_text(
            chat_id=chat_id,
            message_id=message_id,
            text=new_text
        )
        return True

    except BadRequest as e:
        error_msg = str(e)

        if 'message is not modified' in error_msg:
            # 消息内容未改变
            print('消息内容未修改')
            return True

        elif 'message to edit not found' in error_msg:
            # 消息已被删除
            print('消息不存在')
            return False

        elif "message can't be edited" in error_msg:
            # 超过 48 小时编辑限制
            print('消息超过 48 小时，无法编辑')

            # 替代方案：发送新消息
            await bot.send_message(
                chat_id=chat_id,
                text=f"（更新）{new_text}"
            )
            return False

        else:
            print(f"编辑失败: {e}")
            return False
```

**获取消息信息：**

```python
# 获取原始消息时间戳
message = await bot.send_message(chat_id, "测试消息")
message_time = message.date  # datetime 对象

# 计算是否可编辑
now = datetime.datetime.now()
can_edit = (now - message_time).total_seconds() < 48 * 3600  # 48 小时

if can_edit:
    await message.edit_text("更新后的文本")
else:
    await bot.send_message(chat_id, "新消息（原消息已过期无法编辑）")
```

**API 端点：**

```
https://api.telegram.org/bot<TOKEN>/METHOD_NAME
```

**获取 Bot Token：**

1. 与 @BotFather 对话
2. 发送 `/newbot`
3. 按提示设置名称
4. 获取 token

**第一个 Bot (Python)：**

```python
import requests

BOT_TOKEN = "your_bot_token_here"
API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

# 发送消息
def send_message(chat_id, text):
    url = f"{API_URL}/sendMessage"
    data = {"chat_id": chat_id, "text": text}
    return requests.post(url, json=data)

# 获取更新（长轮询）
def get_updates(offset=None):
    url = f"{API_URL}/getUpdates"
    params = {"offset": offset, "timeout": 30}
    return requests.get(url, params=params).json()

# 主循环
offset = None
while True:
    updates = get_updates(offset)
    for update in updates.get("result", []):
        chat_id = update["message"]["chat"]["id"]
        text = update["message"]["text"]

        # 回复消息
        send_message(chat_id, f"你说了：{text}")

        offset = update["update_id"] + 1
```

### 核心 API 方法

**更新管理：**

- `getUpdates` - 长轮询获取更新
- `setWebhook` - 设置 Webhook
- `deleteWebhook` - 删除 Webhook
- `getWebhookInfo` - 查询 Webhook 状态

**消息操作：**

- `sendMessage` - 发送文本消息
- `sendPhoto` / `sendVideo` / `sendDocument` - 发送媒体
- `sendAudio` / `sendVoice` - 发送音频
- `sendLocation` / `sendVenue` - 发送位置
- `editMessageText` - 编辑消息
- `deleteMessage` - 删除消息
- `forwardMessage` / `copyMessage` - 转发/复制消息

**交互元素：**

- `sendPoll` - 发送投票（最多 12 个选项）
- 内联键盘 (InlineKeyboardMarkup)
- 回复键盘 (ReplyKeyboardMarkup)
- `answerCallbackQuery` - 响应回调查询

**文件操作：**

- `getFile` - 获取文件信息
- `downloadFile` - 下载文件
- 支持最大 2GB 文件（本地 Bot API 模式）

**支付功能：**

- `sendInvoice` - 发送发票
- `answerPreCheckoutQuery` - 处理支付
- Telegram Stars 支付（最高 10,000 Stars）

### Webhook 配置

**设置 Webhook：**

```python
import requests

BOT_TOKEN = "your_token"
WEBHOOK_URL = "https://yourdomain.com/webhook"

requests.post(
    f"https://api.telegram.org/bot{BOT_TOKEN}/setWebhook",
    json={"url": WEBHOOK_URL}
)
```

**Flask Webhook 示例：**

```python
from flask import Flask, request
import requests

app = Flask(__name__)
BOT_TOKEN = "your_token"

@app.route('/webhook', methods=['POST'])
def webhook():
    update = request.get_json()

    chat_id = update["message"]["chat"]["id"]
    text = update["message"]["text"]

    # 发送回复
    requests.post(
        f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
        json={"chat_id": chat_id, "text": f"收到: {text}"}
    )

    return "OK"

if __name__ == '__main__':
    app.run(port=5000)
```

### Mini App 核心 API

**WebApp 对象主要属性：**

```javascript
// 初始化数据
tg.initData; // 原始初始化字符串
tg.initDataUnsafe; // 解析后的对象

// 用户和主题
tg.initDataUnsafe.user; // 用户信息
tg.themeParams; // 主题颜色
tg.colorScheme; // 'light' 或 'dark'

// 状态
tg.isExpanded; // 是否全屏
tg.isFullscreen; // 是否全屏
tg.viewportHeight; // 视口高度
tg.platform; // 平台类型

// 版本
tg.version; // WebApp 版本
```

**主要方法：**

```javascript
// 窗口控制
tg.ready(); // 标记应用准备就绪
tg.expand(); // 展开到全高度
tg.close(); // 关闭 Mini App
tg.requestFullscreen(); // 请求全屏

// 数据发送
tg.sendData(data); // 发送数据到 Bot

// 导航
tg.openLink(url); // 打开外部链接
tg.openTelegramLink(url); // 打开 Telegram 链接

// 对话框
tg.showPopup(params, callback); // 显示弹窗
tg.showAlert(message); // 显示警告
tg.showConfirm(message); // 显示确认

// 分享
tg.shareMessage(message); // 分享消息
tg.shareUrl(url); // 分享链接
```

### UI 控件

**主按钮 (MainButton)：**

```javascript
tg.MainButton.setText("点击我");
tg.MainButton.show();
tg.MainButton.enable();
tg.MainButton.showProgress(); // 显示加载
tg.MainButton.hideProgress();

tg.MainButton.onClick(() => {
  console.log("主按钮被点击");
});
```

**次要按钮 (SecondaryButton)：**

```javascript
tg.SecondaryButton.setText("取消");
tg.SecondaryButton.show();
tg.SecondaryButton.onClick(() => {
  tg.close();
});
```

**返回按钮 (BackButton)：**
