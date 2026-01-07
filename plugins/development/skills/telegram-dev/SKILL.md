---
name: telegram-dev
description: Telegram 生态开发全栈指南 - 涵盖 Bot API、Mini Apps (Web Apps)、MTProto 客户端开发。包括消息处理、支付、内联模式、Webhook、认证、存储、传感器 API 等完整开发资源。
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

async def handle_referral(user_id: int, referrer_id: str):
    """处理推荐关系"""
    # 检查推荐人是否存在
    referrer = await get_user(referrer_id)
    if referrer:
        # 保存推荐关系
        await save_referral(user_id, referrer_id)
        # 发送推荐奖励
        await send_referral_reward(referrer_id)
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
tg.openInvoice('https://t.me/$invoice_link', (status) => {
  if (status === 'paid') {
    console.log('支付成功');
    // 通知 Bot 支付完成
    tg.sendData(JSON.stringify({
      action: 'payment_completed',
      invoice_id: '...'
    }));
  } else if (status === 'cancelled') {
    console.log('支付取消');
  } else if (status === 'pending') {
    console.log('支付处理中');
  } else if (status === 'failed') {
    console.log('支付失败');
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

**Webhook 要求：**
- 必须使用 HTTPS
- 支持 TLS 1.2+
- 端口：443, 80, 88, 8443
- 公共可访问的 URL

### 生产环境部署

#### Heroku 部署 (Webhook 模式)

**1. 创建项目文件：**

`requirements.txt`:
```
python-telegram-bot==20.7
uvicorn[standard]
python-dotenv
```

`Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
```

`runtime.txt`:
```
python-3.11.7
```

`main.py`:
```python
from fastapi import FastAPI, Request
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")

# 创建 Application
application = Application.builder().token(BOT_TOKEN).build()

# 注册处理器
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hello! Bot is running on Heroku!")

application.add_handler(CommandHandler("start", start))
application.add_handler(MessageHandler(filters.TEXT, lambda u, c: None))

# FastAPI Webhook 端点
@app.post("/webhook")
async def telegram_webhook(request: Request):
    update = Update.de_json(await request.json(), application.bot)
    await application.initialize()
    await application.process_update(update)
    await application.shutdown()
    return {"status": "ok"}

# 启动时设置 Webhook
@app.on_event("startup")
async def on_startup():
    webhook_url = f"{WEBHOOK_URL}/webhook"
    await application.bot.set_webhook(url=webhook_url)
    print(f"✓ Webhook 设置为: {webhook_url}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
```

`.env`:
```
BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://your-app-name.herokuapp.com
```

**2. 部署到 Heroku：**

```bash
# 安装 Heroku CLI
# macOS: brew tap heroku/brew && brew install heroku
# Ubuntu: snap install heroku --classic

# 登录
heroku login

# 创建应用
heroku create your-bot-name

# 设置环境变量
heroku config:set BOT_TOKEN=your_bot_token_here
heroku config:set WEBHOOK_URL=https://your-bot-name.herokuapp.com

# 部署
git add .
git commit -m "Initial commit"
git push heroku main

# 查看日志
heroku logs --tail
```

**3. 监控和维护：**

```bash
# 查看应用状态
heroku ps

# 查看资源使用
heroku ps:scale web=1  # 设置 1 个 dyno

# 查看最近的日志
heroku logs -n 100

# 重启应用
heroku restart

# 进入交互式 shell
heroku run bash

# 安装 Redis 附加组件（用于限流和缓存）
heroku addons:create heroku-redis:mini

# 设置计划任务
heroku addons:create scheduler:standard
heroku addons:open scheduler  # 在网页中配置定时任务
```

#### Vercel 部署 (Mini Apps)

**1. 准备 Mini App：**

`vercel.json`:
```json
{
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

**2. 部署：**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

**3. 配置环境变量：**

```bash
# 在 Vercel Dashboard 中设置环境变量
# Settings → Environment Variables
# 添加: API_URL=https://your-backend.com
```

#### Docker 部署

**1. 创建 Dockerfile：**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
```

**2. 创建 docker-compose.yml：**

```yaml
version: '3.8'

services:
  bot:
    build: .
    ports:
      - "5000:5000"
    environment:
      - BOT_TOKEN=${BOT_TOKEN}
      - WEBHOOK_URL=${WEBHOOK_URL}
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  redis_data:
  postgres_data:
```

**3. 运行容器：**

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f bot

# 停止
docker-compose down

# 更新并重启
docker-compose up -d --build
```

#### Nginx 反向代理配置

`/etc/nginx/sites-available/telegram-bot`:
```nginx
server {
    listen 80;
    server_name bot.yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bot.yourdomain.com;

    # SSL 证书 (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/bot.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bot.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 请求体大小限制 (支持大文件上传)
    client_max_body_size 20M;

    # 代理到 Bot 应用
    location /webhook {
        proxy_pass http://localhost:5000/webhook;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 健康检查
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

**启用配置：**

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/telegram-bot /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 获取 SSL 证书
sudo certbot --nginx -d bot.yourdomain.com
```

### 内联键盘

**创建内联键盘：**
```python
def send_inline_keyboard(chat_id):
    keyboard = {
        "inline_keyboard": [
            [
                {"text": "按钮 1", "callback_data": "btn1"},
                {"text": "按钮 2", "callback_data": "btn2"}
            ],
            [
                {"text": "打开链接", "url": "https://example.com"}
            ]
        ]
    }
    
    requests.post(
        f"{API_URL}/sendMessage",
        json={
            "chat_id": chat_id,
            "text": "选择一个选项：",
            "reply_markup": keyboard
        }
    )
```

**处理回调：**
```python
def handle_callback_query(callback_query):
    query_id = callback_query["id"]
    data = callback_query["data"]
    chat_id = callback_query["message"]["chat"]["id"]
    
    # 响应回调
    requests.post(
        f"{API_URL}/answerCallbackQuery",
        json={"callback_query_id": query_id, "text": f"你点击了 {data}"}
    )
    
    # 更新消息
    requests.post(
        f"{API_URL}/editMessageText",
        json={
            "chat_id": chat_id,
            "message_id": callback_query["message"]["message_id"],
            "text": f"你选择了：{data}"
        }
    )
```

### 内联模式

**配置内联模式：**
与 @BotFather 对话，发送 `/setinline`

**处理内联查询：**
```python
def handle_inline_query(inline_query):
    query_id = inline_query["id"]
    query_text = inline_query["query"]
    
    # 创建结果
    results = [
        {
            "type": "article",
            "id": "1",
            "title": "结果 1",
            "input_message_content": {
                "message_text": f"你搜索了：{query_text}"
            }
        }
    ]
    
    requests.post(
        f"{API_URL}/answerInlineQuery",
        json={"inline_query_id": query_id, "results": results}
    )
```

## Mini Apps (Web Apps) 开发

### 初始化 Mini App

**HTML 模板：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <title>My Mini App</title>
</head>
<body>
    <h1>Telegram Mini App</h1>
    <button id="mainBtn">主按钮</button>
    
    <script>
        // 获取 Telegram WebApp 对象
        const tg = window.Telegram.WebApp;
        
        // 通知 Telegram 应用已准备好
        tg.ready();
        
        // 展开到全屏
        tg.expand();
        
        // 显示用户信息
        const user = tg.initDataUnsafe?.user;
        if (user) {
            console.log("用户名:", user.first_name);
            console.log("用户ID:", user.id);
        }
        
        // 配置主按钮
        tg.MainButton.text = "提交";
        tg.MainButton.show();
        tg.MainButton.onClick(() => {
            // 发送数据到 Bot
            tg.sendData(JSON.stringify({action: "submit"}));
        });
        
        // 添加返回按钮
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            tg.close();
        });
    </script>
</body>
</html>
```

### Mini App 核心 API

**WebApp 对象主要属性：**
```javascript
// 初始化数据
tg.initData           // 原始初始化字符串
tg.initDataUnsafe     // 解析后的对象

// 用户和主题
tg.initDataUnsafe.user       // 用户信息
tg.themeParams                // 主题颜色
tg.colorScheme                // 'light' 或 'dark'

// 状态
tg.isExpanded         // 是否全屏
tg.isFullscreen       // 是否全屏
tg.viewportHeight     // 视口高度
tg.platform           // 平台类型

// 版本
tg.version            // WebApp 版本
```

**主要方法：**
```javascript
// 窗口控制
tg.ready()            // 标记应用准备就绪
tg.expand()           // 展开到全高度
tg.close()            // 关闭 Mini App
tg.requestFullscreen() // 请求全屏

// 数据发送
tg.sendData(data)     // 发送数据到 Bot

// 导航
tg.openLink(url)      // 打开外部链接
tg.openTelegramLink(url) // 打开 Telegram 链接

// 对话框
tg.showPopup(params, callback)  // 显示弹窗
tg.showAlert(message)           // 显示警告
tg.showConfirm(message)         // 显示确认

// 分享
tg.shareMessage(message)        // 分享消息
tg.shareUrl(url)                // 分享链接
```

### UI 控件

**主按钮 (MainButton)：**
```javascript
tg.MainButton.setText("点击我");
tg.MainButton.show();
tg.MainButton.enable();
tg.MainButton.showProgress();  // 显示加载
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
```javascript
tg.BackButton.show();
tg.BackButton.onClick(() => {
    // 返回逻辑
});
```

**触觉反馈：**
```javascript
tg.HapticFeedback.impactOccurred('light');  // light, medium, heavy
tg.HapticFeedback.notificationOccurred('success'); // success, warning, error
tg.HapticFeedback.selectionChanged();
```

### 存储 API

**云存储：**
```javascript
// 保存数据
tg.CloudStorage.setItem('key', 'value', (error, success) => {
    if (success) console.log('保存成功');
});

// 获取数据
tg.CloudStorage.getItem('key', (error, value) => {
    console.log('值:', value);
});

// 删除数据
tg.CloudStorage.removeItem('key');

// 获取所有键
tg.CloudStorage.getKeys((error, keys) => {
    console.log('所有键:', keys);
});
```

**本地存储：**
```javascript
// 普通本地存储
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');

// 安全存储（需要生物识别）
tg.SecureStorage.setItem('secret', 'value', callback);
tg.SecureStorage.getItem('secret', callback);
```

### 生物识别认证

```javascript
const bioManager = tg.BiometricManager;

// 初始化
bioManager.init(() => {
    if (bioManager.isInited) {
        console.log('支持的类型:', bioManager.biometricType);
        // 'finger', 'face', 'unknown'
        
        if (bioManager.isAccessGranted) {
            // 已授权，可以使用
        } else {
            // 请求授权
            bioManager.requestAccess({reason: '需要验证身份'}, (success) => {
                if (success) {
                    console.log('授权成功');
                }
            });
        }
    }
});

// 执行认证
bioManager.authenticate({reason: '确认操作'}, (success, token) => {
    if (success) {
        console.log('认证成功，token:', token);
    }
});
```

### 位置和传感器

**获取位置：**
```javascript
tg.LocationManager.init(() => {
    if (tg.LocationManager.isInited) {
        tg.LocationManager.getLocation((location) => {
            console.log('纬度:', location.latitude);
            console.log('经度:', location.longitude);
        });
    }
});
```

**加速度计：**
```javascript
tg.Accelerometer.start({refresh_rate: 100}, (started) => {
    if (started) {
        tg.Accelerometer.onEvent((event) => {
            console.log('加速度:', event.x, event.y, event.z);
        });
    }
});

// 停止
tg.Accelerometer.stop();
```

**陀螺仪：**
```javascript
tg.Gyroscope.start({refresh_rate: 100}, callback);
tg.Gyroscope.onEvent((event) => {
    console.log('旋转速度:', event.x, event.y, event.z);
});
```

**设备方向：**
```javascript
tg.DeviceOrientation.start({refresh_rate: 100}, callback);
tg.DeviceOrientation.onEvent((event) => {
    console.log('方向:', event.absolute, event.alpha, event.beta, event.gamma);
});
```

### 支付集成

**发起支付 (Telegram Stars)：**
```javascript
tg.openInvoice('https://t.me/$invoice_link', (status) => {
    if (status === 'paid') {
        console.log('支付成功');
    } else if (status === 'cancelled') {
        console.log('支付取消');
    } else if (status === 'failed') {
        console.log('支付失败');
    }
});
```

### 数据验证

**服务器端验证 initData (Python)：**
```python
import hmac
import hashlib
from urllib.parse import parse_qs

def validate_init_data(init_data, bot_token):
    # 解析数据
    parsed = parse_qs(init_data)
    received_hash = parsed.get('hash', [''])[0]
    
    # 移除 hash
    data_check_arr = []
    for key, value in parsed.items():
        if key != 'hash':
            data_check_arr.append(f"{key}={value[0]}")
    
    # 排序
    data_check_arr.sort()
    data_check_string = '\n'.join(data_check_arr)
    
    # 计算密钥
    secret_key = hmac.new(
        b"WebAppData",
        bot_token.encode(),
        hashlib.sha256
    ).digest()
    
    # 计算哈希
    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return calculated_hash == received_hash
```

### 启动 Mini App

**从键盘按钮：**
```python
keyboard = {
    "keyboard": [[
        {
            "text": "打开应用",
            "web_app": {"url": "https://yourdomain.com/app"}
        }
    ]],
    "resize_keyboard": True
}

requests.post(
    f"{API_URL}/sendMessage",
    json={
        "chat_id": chat_id,
        "text": "点击按钮打开应用",
        "reply_markup": keyboard
    }
)
```

**从内联按钮：**
```python
keyboard = {
    "inline_keyboard": [[
        {
            "text": "启动应用",
            "web_app": {"url": "https://yourdomain.com/app"}
        }
    ]]
}
```

**从菜单按钮：**
与 @BotFather 对话：
```
/setmenubutton
→ 选择你的 Bot
→ 提供 URL: https://yourdomain.com/app
```

## 客户端开发 (TDLib)

### 使用 TDLib

**Python 示例 (python-telegram)：**
```python
from telegram.client import Telegram

tg = Telegram(
    api_id='your_api_id',
    api_hash='your_api_hash',
    phone='+1234567890',
    database_encryption_key='changeme1234',
)

tg.login()

# 发送消息
result = tg.send_message(
    chat_id=123456789,
    text='Hello from TDLib!'
)

# 获取聊天列表
result = tg.get_chats()
result.wait()
chats = result.update

print(chats)

tg.stop()
```

## Node.js Bot 开发

### Telegraf 框架

**快速开始：**

`package.json`:
```json
{
  "name": "telegram-bot",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "telegraf": "^4.16.0",
    "dotenv": "^16.3.1"
  }
}
```

`.env`:
```
BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://yourdomain.com/webhook
```

`src/index.js`:
```javascript
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// /start 命令
bot.start((ctx) => ctx.reply('欢迎！使用 /help 查看帮助'));

// /help 命令
bot.help((ctx) => {
  ctx.reply(`
🤖 可用命令：
/start - 开始使用
/help - 显示帮助
/info - 显示用户信息
  `);
});

// /info 命令
bot.command('info', (ctx) => {
  const user = ctx.from;
  ctx.reply(`
📊 用户信息：
ID: ${user.id}
姓名: ${user.first_name} ${user.last_name || ''}
用户名: @${user.username || '无'}
语言: ${user.language_code}
  `);
});

// 处理文本消息
bot.on('text', (ctx) => {
  ctx.reply(`你说了：${ctx.message.text}`);
});

// 启动 Bot
bot.launch();

// 优雅关闭
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

**内联键盘：**

```javascript
bot.command('menu', (ctx) => {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔍 搜索', callback_data: 'search' },
        { text: '⚙️ 设置', callback_data: 'settings' },
      ],
      [
        { text: '🌐 访问网站', url: 'https://example.com' },
        { text: '📞 联系客服', url: 'https://t.me/support' },
      ],
      [
        { text: '❤️ 喜欢', callback_data: 'like' },
        { text: '👎 不喜欢', callback_data: 'dislike' },
      ],
    ],
  };

  ctx.reply('请选择操作：', { reply_markup: keyboard });
});

// 处理回调
bot.action('search', (ctx) => {
  ctx.answerCbQuery('打开搜索...');
  ctx.editMessageText('搜索功能开发中...');
});

bot.action('like', (ctx) => {
  ctx.answerCbQuery('❤️ 感谢点赞！');
  ctx.reply('感谢您的反馈！');
});

// 模式匹配回调
bot.action(/settings_(\d+)/, (ctx) => {
  const settingId = ctx.match[1];
  ctx.reply(`您选择了设置 ${settingId}`);
});
```

**回复键盘：**

```javascript
bot.command('keyboard', (ctx) => {
  const keyboard = {
    keyboard: [
      ['📊 数据统计', '📈 趋势分析'],
      ['🔔 通知设置', '🔒 隐私设置'],
      ['❓ 帮助', '👤 个人资料'],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };

  ctx.reply('功能菜单：', { reply_markup: keyboard });
});

// 键盘按钮处理
bot.hears('📊 数据统计', (ctx) => {
  ctx.reply('📊 统计数据...\n\n总用户: 1,234\n今日活跃: 56');
});

bot.hears('📈 趋势分析', (ctx) => {
  ctx.reply('📈 趋势分析...\n\n7天增长: +23%\n30天增长: +156%');
});
```

**Webhook 模式：**

```javascript
import express from 'express';
import { Telegraf } from 'telegraf';

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// 处理 Webhook
app.use(webhookPath, bot.webhookCallback(webhookPath));

// 健康检查
app.get('/health', (req, res) => res.send('OK'));

// 启动服务器
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// 设置 Webhook
await bot.telegram.setWebhook(`${WEBHOOK_URL}/webhook`);
console.log(`✓ Webhook 设置为: ${WEBHOOK_URL}/webhook`);

app.listen(PORT, () => {
  console.log(`✓ 服务器运行在端口 ${PORT}`);
});
```

**中间件：**

```javascript
// 日志中间件
bot.use((ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.from.username}: ${ctx.message?.text}`);
  return next();
});

// 认证中间件
const authMiddleware = (ctx, next) => {
  const allowedUsers = [123456789, 987654321]; // 允许的用户 ID
  if (!allowedUsers.includes(ctx.from.id)) {
    return ctx.reply('❌ 您没有权限使用此功能');
  }
  return next();
};

bot.command('admin', authMiddleware, (ctx) => {
  ctx.reply('🔧 管理员面板');
});
```

### Grammy 框架

**快速开始：**

`package.json`:
```json
{
  "dependencies": {
    "grammy": "^1.19.0"
  }
}
```

`src/index.js`:
```javascript
import { Bot } from 'grammy';

const bot = new Bot(process.env.BOT_TOKEN);

// 路由器
bot.command('start', (ctx) => ctx.reply('欢迎使用！'));

bot.on('message:text', (ctx) => ctx.reply(`你说了：${ctx.message.text}`));

// 启动
bot.start();
```

**会话管理：**

```javascript
import { Bot, session } from 'grammy';
import { MemorySessionStorage } from 'grammy';

const bot = new Bot(process.env.BOT_TOKEN);

// 会话存储
bot.use(session({
  initial: () => ({
    step: 0,
    data: {},
  }),
  storage: new MemorySessionStorage(),
}));

// 多步骤表单
bot.command('register', async (ctx) => {
  ctx.session.step = 1;
  await ctx.reply('请输入您的姓名：');
});

bot.on('message:text', async (ctx) => {
  const step = ctx.session.step;

  switch (step) {
    case 1:
      ctx.session.data.name = ctx.message.text;
      ctx.session.step = 2;
      await ctx.reply('请输入您的邮箱：');
      break;

    case 2:
      ctx.session.data.email = ctx.message.text;
      ctx.session.step = 0;
      await ctx.reply(`
注册成功！
姓名: ${ctx.session.data.name}
邮箱: ${ctx.session.data.email}
      `);
      break;

    default:
      await ctx.reply('使用 /register 开始注册');
  }
});
```

**菜单按钮：**

```javascript
// 设置菜单按钮
await bot.api.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: '打开应用',
    web_app: {
      url: 'https://your-mini-app.com',
    },
  },
});

// 移除菜单按钮
await bot.api.setChatMenuButton({
  menuButton: {
    type: 'default',
  },
});
```

### Node.js 最佳实践

**错误处理：**

```javascript
bot.catch((err, ctx) => {
  console.error(`❌ 处理更新 ${ctx.update.update_id} 时出错:`, err);

  // 通知用户
  ctx.reply('抱歉，发生错误。请稍后重试。').catch(console.error);

  // 记录错误日志
  logError(err, ctx);
});

// 重试机制
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

bot.command('heavy', async (ctx) => {
  const result = await withRetry(async () => {
    return await performHeavyOperation();
  });
  ctx.reply(`结果: ${result}`);
});
```

**数据库集成：**

```javascript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('telegram-bot');

// 保存用户
async function saveUser(userId, username) {
  await db.collection('users').updateOne(
    { userId },
    { $set: { username, lastSeen: new Date() } },
    { upsert: true }
  );
}

bot.command('save', async (ctx) => {
  await saveUser(ctx.from.id, ctx.from.username);
  ctx.reply('✅ 数据已保存');
});

// 查询用户
async function getUser(userId) {
  return await db.collection('users').findOne({ userId });
}
```

### MTProto 协议

**特点：**
- 端到端加密
- 高性能
- 支持所有 Telegram 功能
- 需要 API ID/Hash（从 https://my.telegram.org 获取）

## 错误处理和调试

### 完整错误处理框架

**Python (python-telegram-bot) 异步错误处理：**
```python
import asyncio
import logging
from telegram import Update
from telegram.ext import Application, ContextTypes
from telegram.error import TelegramError, TimedOut, NetworkError

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

async def safe_send_message(
    chat_id: int,
    text: str,
    max_retries: int = 3,
    retry_delay: float = 1.0
) -> bool:
    """带重试机制的安全消息发送"""
    for attempt in range(max_retries):
        try:
            await application.bot.send_message(chat_id=chat_id, text=text)
            return True
        except TimedOut as e:
            logger.warning(f"超时错误 (尝试 {attempt + 1}/{max_retries}): {e}")
            await asyncio.sleep(retry_delay * (attempt + 1))
        except NetworkError as e:
            logger.warning(f"网络错误 (尝试 {attempt + 1}/{max_retries}): {e}")
            await asyncio.sleep(retry_delay * (attempt + 1))
        except TelegramError as e:
            if "Too many requests" in str(e):
                wait_time = 30  # Telegram 速率限制等待
                logger.warning(f"触发速率限制，等待 {wait_time} 秒")
                await asyncio.sleep(wait_time)
            elif "chat not found" in str(e):
                logger.error(f"聊天 {chat_id} 不存在")
                return False
            elif "user is deactivated" in str(e):
                logger.error(f"用户 {chat_id} 已停用账号")
                return False
            else:
                logger.error(f"Telegram API 错误: {e}")
                return False

    logger.error(f"发送消息失败，已达到最大重试次数: {max_retries}")
    return False

async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    """全局错误处理器"""
    logger.error(f"更新 {update} 导致错误: {context.error}")

    if isinstance(context.error, TimedOut):
        logger.error("请求超时，检查网络连接")
    elif isinstance(context.error, NetworkError):
        logger.error("网络错误，检查互联网连接")
    elif isinstance(context.error, TelegramError):
        logger.error(f"Telegram API 错误: {context.error}")

# 配置全局错误处理
application.add_error_handler(error_handler)
```

**请求验证和参数检查：**
```python
from typing import Optional

def validate_message_text(text: str, max_length: int = 4096) -> bool:
    """验证消息文本"""
    if not text or not text.strip():
        raise ValueError("消息文本不能为空")
    if len(text) > max_length:
        raise ValueError(f"消息文本过长，最大 {max_length} 字符")
    return True

def validate_chat_id(chat_id: Optional[int]) -> int:
    """验证聊天 ID"""
    if chat_id is None:
        raise ValueError("聊天 ID 不能为 None")
    if not isinstance(chat_id, int) or chat_id <= 0:
        raise ValueError("无效的聊天 ID")
    return chat_id

# 使用示例
try:
    validate_message_text(user_input)
    validate_chat_id(chat_id)
    await safe_send_message(chat_id, user_input)
except ValueError as e:
    logger.error(f"参数验证失败: {e}")
    await safe_send_message(chat_id, f"❌ 输入错误: {e}")
```

### 日志和监控

**结构化日志记录：**
```python
import json
from datetime import datetime
from pathlib import Path

class BotLogger:
    def __init__(self, log_dir: str = "logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        self.log_file = self.log_dir / f"bot_{datetime.now().strftime('%Y%m%d')}.log"

    def log_message(self, user_id: int, username: str, message: str, action: str):
        """记录用户消息"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "username": username,
            "message": message[:100],  # 限制长度
            "action": action,
        }
        with open(self.log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")

    def log_error(self, error: str, context: dict = None):
        """记录错误"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "level": "ERROR",
            "error": error,
            "context": context or {},
        }
        with open(self.log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")

# 使用
logger = BotLogger()
logger.log_message(123456, "user1", "Hello", "message_received")
logger.log_error("API 错误", {"chat_id": 123456, "error_code": 400})
```

### 调试技巧

**开发环境 Webhook 测试：**
```bash
# 使用 ngrok 暴露本地服务器
ngrok http 5000

# 获取公开 URL，如：https://abc123.ngrok.io
# 设置 Webhook：
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://abc123.ngrok.io/webhook"}'
```

**调试模式：**
```python
import os

DEBUG = os.getenv("DEBUG", "false").lower() == "true"

async def debug_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """调试命令处理器"""
    if not DEBUG:
        return

    user = update.effective_user
    chat_id = update.effective_chat.id

    debug_info = f"""
🔍 调试信息
━━━━━━━━━━━━━━━━
用户 ID: {user.id}
用户名: @{user.username}
语言: {user.language_code}
聊天 ID: {chat_id}
更新 ID: {update.update_id}
消息类型: {update.message.content_type}

完整更新对象:
{json.dumps(update.to_dict(), indent=2, ensure_ascii=False)}
"""
    await context.bot.send_message(chat_id=chat_id, text=debug_info)

# 注册调试命令
application.add_handler(CommandHandler("debug", debug_handler))
```

**Webhook 健康检查：**
```python
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/webhook-info")
async def get_webhook_info():
    """获取 Webhook 信息"""
    try:
        info = await application.bot.get_webhook_info()
        return {
            "url": info.url,
            "has_custom_certificate": info.has_custom_certificate,
            "pending_update_count": info.pending_update_count,
            "last_error_date": info.last_error_date,
            "last_error_message": info.last_error_message
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 数据验证和清理

**使用 Pydantic 验证输入：**
```python
from pydantic import BaseModel, validator
from typing import Optional

class UserInput(BaseModel):
    username: Optional[str] = None
    phone: str
    email: str

    @validator('phone')
    def validate_phone(cls, v):
        if not v.startswith('+') or len(v) < 10:
            raise ValueError('无效的电话号码格式')
        return v

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v or '.' not in v.split('@')[-1]:
            raise ValueError('无效的邮箱格式')
        return v

# 使用
try:
    user_data = UserInput(
        username="john_doe",
        phone="+1234567890",
        email="john@example.com"
    )
    print("验证通过:", user_data)
except ValueError as e:
    print("验证失败:", e)
```

**消息内容清理：**
```python
import re

def sanitize_text(text: str) -> str:
    """清理用户输入文本"""
    # 移除控制字符（保留换行和制表符）
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)

    # 限制长度
    text = text[:4096]

    # 移除多余空格
    text = re.sub(r'\s+', ' ', text).strip()

    return text

def sanitize_markdown(text: str) -> str:
    """清理 Markdown 文本以防止格式错误"""
    # 转义特殊字符
    escape_chars = r'_*[]()~`>#+-=|{}.!'
    for char in escape_chars:
        text = text.replace(char, f'\\{char}')
    return text
```

## 最佳实践

### Bot 开发

1. **错误处理**
    ```python
    try:
        response = requests.post(url, json=data, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
    ```

2. **速率限制**
   - 群组消息：最多 20 条/分钟
   - 私聊消息：最多 30 条/秒
   - 全局限制：避免过于频繁

3. **使用 Webhook 而非长轮询**
   - 更高效
   - 更低延迟
   - 更好的可扩展性

4. **数据验证**
   - 始终验证 initData
   - 不要信任客户端数据
   - 服务器端验证所有操作

### Mini Apps 开发

1. **响应式设计**
   ```javascript
   // 监听主题变化
   tg.onEvent('themeChanged', () => {
       document.body.style.backgroundColor = tg.themeParams.bg_color;
   });
   
   // 监听视口变化
   tg.onEvent('viewportChanged', () => {
       console.log('新高度:', tg.viewportHeight);
   });
   ```

2. **性能优化**
   - 最小化 JavaScript 包大小
   - 使用懒加载
   - 优化图片和资源

3. **用户体验**
   - 适配深色/浅色主题
   - 使用原生 UI 控件（MainButton 等）
   - 提供触觉反馈
   - 快速响应用户操作

4. **安全考虑**
    - HTTPS 强制
    - 验证 initData
    - 不在客户端存储敏感信息
    - 使用 SecureStorage 存储密钥

## 安全最佳实践

### 1. Token 和密钥管理

**环境变量配置：**

`.env`:
```env
# Bot Token
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# API 凭证
API_ID=123456
API_HASH=abc123def456

# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379/0

# 第三方服务
STRIPE_API_KEY=sk_test_...
FIREBASE_PROJECT_ID=my-project

# JWT 密钥
JWT_SECRET=your-super-secret-key-at-least-32-chars

# Webhook 密钥（验证来源）
WEBHOOK_SECRET=random-secret-string
```

**.env.example`:
```env
# 复制此文件为 .env 并填写实际值
BOT_TOKEN=your_bot_token_here
API_ID=your_api_id
DATABASE_URL=postgresql://user:pass@localhost/db
```

**使用 python-dotenv 加载：**

```python
import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv('BOT_TOKEN')
if not BOT_TOKEN:
    raise ValueError('BOT_TOKEN 环境变量未设置')
```

**密钥管理服务：**

```python
# AWS Secrets Manager
import boto3

secrets_client = boto3.client('secretsmanager')

def get_secret(secret_name):
    response = secrets_client.get_secret_value(SecretId=secret_name)
    return response['SecretString']

# 使用
bot_token = get_secret('telegram-bot-token')

# Azure Key Vault
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
client = SecretClient(
    vault_url="https://your-keyvault.vault.azure.net/",
    credential=credential
)

bot_token = client.get_secret("bot-token").value
```

### 2. 输入验证和清理

**防止命令注入：**

```python
import re

def sanitize_input(text: str) -> str:
    """清理用户输入"""
    # 移除危险字符
    text = re.sub(r'[<>\"\'\\]', '', text)
    # 限制长度
    text = text[:1000]
    # 移除多余空格
    text = ' '.join(text.split())
    return text

def validate_command(command: str) -> bool:
    """验证命令安全性"""
    # 只允许字母数字和下划线
    return bool(re.match(r'^[a-zA-Z0-9_]+$', command))
```

**防止 SQL 注入：**

```python
# 使用参数化查询
cursor.execute(
    "SELECT * FROM users WHERE id = %s",
    (user_id,)
)

# 使用 ORM (SQLAlchemy)
from sqlalchemy import text

result = session.execute(
    text("SELECT * FROM users WHERE id = :id"),
    {'id': user_id}
)
```

### 3. Webhook 安全

**验证 Webhook 来源：**

```python
from fastapi import Request, HTTPException, Header
import hmac
import hashlib

WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET')

@app.post("/webhook")
async def webhook(request: Request, x_telegram_bot_api_secret_token: str = Header(None)):
    # 验证 Secret Token
    if WEBHOOK_SECRET and x_telegram_bot_api_secret_token != WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Invalid secret token")

    # 处理更新
    update_data = await request.json()
    await process_update(update_data)

    return {"status": "ok"}

# 设置 Webhook 时配置 secret_token
await bot.set_webhook(
    url="https://yourdomain.com/webhook",
    secret_token="your-secret-token"
)
```

**HTTPS 强制：**

```python
from fastapi import RedirectResponse
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app.add_middleware(HTTPSRedirectMiddleware)

@app.get("/webhook")
async def webhook_redirect():
    # 自动重定向 HTTP 到 HTTPS
    pass
```

### 4. 用户权限控制

**用户白名单：**

```python
AUTHORIZED_USERS = {
    123456789: "admin",
    987654321: "moderator",
}

async def check_permission(ctx: ContextTypes.DEFAULT_TYPE, required_role: str = "user") -> bool:
    """检查用户权限"""
    user_id = ctx.effective_user.id
    user_role = AUTHORIZED_USERS.get(user_id, "user")

    # 角色层级: admin > moderator > user
    role_hierarchy = {"admin": 3, "moderator": 2, "user": 1}
    if role_hierarchy.get(user_role, 0) < role_hierarchy.get(required_role, 0):
        await ctx.reply("❌ 您没有权限执行此操作")
        return False

    return True

@bot.command('admin')
async def admin_command(ctx):
    if not await check_permission(ctx, "admin"):
        return

    await ctx.reply("🔧 管理员面板")
```

**群组权限：**

```python
@bot.command('ban')
async def ban_command(ctx):
    # 仅管理员可在群组中使用
    if not ctx.message.chat.type.endswith('group'):
        return await ctx.reply("此命令仅限群组使用")

    chat_member = await ctx.chat.get_member(ctx.from.id)
    if chat_member.status not in ['creator', 'administrator']:
        return await ctx.reply("❌ 只有管理员可以使用此命令")

    # 执行封禁操作
    await ctx.bot.ban_chat_member(ctx.chat.id, ctx.message.reply_to_message.from_user.id)
```

### 5. 数据加密

**敏感数据加密：**

```python
from cryptography.fernet import Fernet

class EncryptionManager:
    def __init__(self, key: str):
        self.cipher = Fernet(key.encode() if isinstance(key, str) else key)

    def encrypt(self, data: str) -> str:
        """加密数据"""
        return self.cipher.encrypt(data.encode()).decode()

    def decrypt(self, encrypted_data: str) -> str:
        """解密数据"""
        return self.cipher.decrypt(encrypted_data.encode()).decode()

# 生成密钥（只需一次）
from cryptography.fernet import Fernet
key = Fernet.generate_key()
print(f"保存此密钥: {key.decode()}")

# 使用
encryption = EncryptionManager(os.getenv('ENCRYPTION_KEY'))

# 加密存储
encrypted_token = encryption.encrypt(user_token)

# 解密使用
token = encryption.decrypt(encrypted_token)
```

**密码哈希：**

```python
import bcrypt

def hash_password(password: str) -> str:
    """生成密码哈希"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, hashed: str) -> bool:
    """验证密码"""
    return bcrypt.checkpw(password.encode(), hashed.encode())
```

### 6. 速率限制和防滥用

**基于 Redis 的速率限制：**

```python
import redis
import asyncio

redis_client = redis.from_url(os.getenv('REDIS_URL'))

async def rate_limit_check(user_id: int, limit: int = 10, window: int = 60) -> bool:
    """
    速率限制检查
    user_id: 用户 ID
    limit: 时间窗口内允许的请求数
    window: 时间窗口（秒）
    返回: True 允许, False 拒绝
    """
    key = f"ratelimit:{user_id}"

    # 获取当前计数
    current = redis_client.incr(key)

    if current == 1:
        # 第一次请求，设置过期时间
        redis_client.expire(key, window)

    if current > limit:
        return False

    return True

async def protected_command(ctx: ContextTypes.DEFAULT_TYPE):
    user_id = ctx.effective_user.id

    if not await rate_limit_check(user_id, limit=5, window=60):
        await ctx.reply("⚠️ 您的请求过于频繁，请稍后再试")
        return

    # 处理命令
    await ctx.reply("✅ 请求成功")
```

**防止机器人注册：**

```python
async def check_new_user(user_id: int) -> bool:
    """检查是否为可疑新用户"""
    key = f"newuser:{user_id}"

    # 检查是否在观察期
    if redis_client.exists(key):
        return False  # 仍在观察期

    # 获取用户加入时间
    user_info = await bot.get_chat_member(user_id, user_id)
    join_date = user_info.join_date

    # 检查是否刚注册（24小时内）
    import time
    if join_date and (time.time() - join_date.timestamp()) < 86400:
        # 添加到观察期
        redis_client.setex(key, 86400, '1')
        return False

    return True
```

### 7. 日志和审计

**安全日志记录：**

```python
import logging
from datetime import datetime

security_logger = logging.getLogger('security')

async def log_security_event(
    event_type: str,
    user_id: int,
    details: dict = None
):
    """记录安全事件"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'event_type': event_type,
        'user_id': user_id,
        'details': details or {}
    }
    security_logger.warning(log_entry)

# 使用示例
await log_security_event(
    'failed_login',
    user_id,
    {'ip': request.client.host, 'reason': 'Invalid credentials'}
)
```

**审计跟踪：**

```python
async def audit_action(
    user_id: int,
    action: str,
    target: str,
    result: str = "success"
):
    """记录用户操作审计"""
    await db.execute(
        """
        INSERT INTO audit_log
        (user_id, action, target, result, timestamp)
        VALUES ($1, $2, $3, $4, $5)
        """,
        user_id, action, target, result, datetime.now()
    )

# 使用
await audit_action(
    user_id=123,
    action="delete_message",
    target="message:456",
    result="success"
)
```

### 8. Mini Apps 安全

**CSRF 防护：**

```javascript
// 生成随机 nonce
function generateNonce() {
  return crypto.getRandomValues(new Uint8Array(16))
    .toString();
}

// 在 Mini App 启动时生成 nonce
const nonce = generateNonce();
localStorage.setItem('csrf_nonce', nonce);

// 发送请求时包含 nonce
async function makeRequest(data) {
  const response = await fetch('/api/action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Nonce': localStorage.getItem('csrf_nonce')
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

**CORS 配置：**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://t.me"],  # 仅允许 Telegram
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 9. 安全检查清单

**部署前检查：**

- [ ] 所有敏感信息存储在环境变量或密钥管理服务中
- [ ] Webhook 使用 HTTPS 和 secret token
- [ ] 所有用户输入经过验证和清理
- [ ] 实施了速率限制防止滥用
- [ ] 数据库查询使用参数化查询
- [ ] 敏感数据加密存储
- [ ] 实施了权限控制
- [ ] 配置了安全日志和审计跟踪
- [ ] Mini Apps 验证 initData
- [ ] 定期更新依赖项（特别是安全补丁）
- [ ] 设置了数据库备份和恢复计划
- [ ] 配置了监控和告警

## 性能优化

### 1. 异步编程和并发处理

**异步数据库查询：**

```python
import asyncpg
from telegram.ext import Application

# 连接池
db_pool = None

async def init_db():
    """初始化数据库连接池"""
    global db_pool
    db_pool = await asyncpg.create_pool(
        database='bot_db',
        user='postgres',
        password='password',
        min_size=5,
        max_size=20
    )

async def get_user(user_id: int):
    """异步获取用户"""
    async with db_pool.acquire() as conn:
        return await conn.fetchrow(
            "SELECT * FROM users WHERE id = $1",
            user_id
        )

async def bulk_fetch(user_ids: list[int]):
    """批量获取用户（并发）"""
    tasks = [get_user(uid) for uid in user_ids]
    return await asyncio.gather(*tasks, return_exceptions=True)
```

**并发处理更新：**

```python
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=10)

async def process_updates_concurrently(updates: list[Update]):
    """并发处理多个更新"""
    loop = asyncio.get_event_loop()

    tasks = []
    for update in updates:
        task = loop.run_in_executor(executor, handle_update, update)
        tasks.append(task)

    results = await asyncio.gather(*tasks, return_exceptions=True)

    # 处理异常
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.error(f"处理更新 {i} 失败: {result}")
```

### 2. 缓存策略

**Redis 缓存：**

```python
import redis
import json
from functools import wraps

redis_client = redis.from_url(os.getenv('REDIS_URL'))

def cache(ttl: int = 300):
    """缓存装饰器"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 生成缓存键
            cache_key = f"cache:{func.__name__}:{str(args)}:{str(kwargs)}"

            # 尝试从缓存获取
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

            # 执行函数
            result = await func(*args, **kwargs)

            # 存入缓存
            redis_client.setex(
                cache_key,
                ttl,
                json.dumps(result, default=str)
            )

            return result
        return wrapper
    return decorator

# 使用
@cache(ttl=600)  # 缓存 10 分钟
async def get_user_profile(user_id: int):
    return await db.fetchrow("SELECT * FROM profiles WHERE user_id = $1", user_id)

# 清除缓存
def invalidate_user_cache(user_id: int):
    patterns = [f"cache:get_user_profile:*:{user_id}:*"]
    for pattern in patterns:
        for key in redis_client.scan_iter(match=pattern):
            redis_client.delete(key)
```

**内存缓存：**

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def calculate_expensive(data: str) -> int:
    """计算密集型函数（使用 LRU 缓存）"""
    # 复杂计算...
    return result

# 使用缓存时注意线程安全，适合纯函数
```

### 3. 数据库优化

**索引优化：**

```sql
-- 为常用查询添加索引
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_date ON messages(created_at DESC);

-- 复合索引
CREATE INDEX idx_user_messages ON messages(user_id, created_at DESC);

-- 唯一索引
CREATE UNIQUE INDEX idx_users_telegram_id ON users(telegram_id);
```

**查询优化：**

```python
# 使用 EXPLAIN ANALYZE 分析查询
async def analyze_query():
    result = await db.fetchrow(
        """
        EXPLAIN ANALYZE
        SELECT * FROM messages
        WHERE chat_id = $1 AND created_at > NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
        LIMIT 100
        """,
        chat_id
    )
    print(result)

# 使用 JOIN 优化 N+1 查询
async def get_messages_with_users(chat_id: int):
    result = await db.fetch("""
        SELECT m.*, u.first_name, u.username
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.chat_id = $1
        ORDER BY m.created_at DESC
        LIMIT 50
    """, chat_id)
    return result
```

**批量操作：**

```python
async def bulk_insert_messages(messages: list[dict]):
    """批量插入消息"""
    query = """
        INSERT INTO messages (user_id, chat_id, text, created_at)
        VALUES ($1, $2, $3, $4)
    """
    values = [
        (msg['user_id'], msg['chat_id'], msg['text'], msg['created_at'])
        for msg in messages
    ]

    await db.executemany(query, values)

# 或使用 COPY 命令（大批量）
async def copy_messages_from_file(file_path: str):
    async with db.transaction():
        await db.execute(f"""
            COPY messages(user_id, chat_id, text)
            FROM '{file_path}'
            DELIMITER ','
            CSV HEADER
        """)
```

### 4. API 请求优化

**批量 API 调用：**

```python
async def batch_get_chat_member(chat_id: int, user_ids: list[int]):
    """批量获取聊天成员信息"""
    tasks = [
        bot.get_chat_member(chat_id, uid)
        for uid in user_ids
    ]
    return await asyncio.gather(*tasks)

# 使用
members = await batch_get_chat_member(chat_id, [123, 456, 789])
```

**请求队列：**

```python
import asyncio
from collections import deque

class RequestQueue:
    def __init__(self, rate_limit: int = 20, per_seconds: int = 1):
        self.queue = deque()
        self.rate_limit = rate_limit
        self.per_seconds = per_seconds
        self.semaphore = asyncio.Semaphore(rate_limit)

    async def process_queue(self):
        """处理队列中的请求"""
        while self.queue:
            async with self.semaphore:
                func, args, kwargs = self.queue.popleft()
                try:
                    result = await func(*args, **kwargs)
                except Exception as e:
                    logger.error(f"请求失败: {e}")

            await asyncio.sleep(self.per_seconds / self.rate_limit)

    async def add(self, func, *args, **kwargs):
        """添加请求到队列"""
        self.queue.append((func, args, kwargs))

# 使用
request_queue = RequestQueue(rate_limit=20, per_seconds=1)

# 启动队列处理器
asyncio.create_task(request_queue.process_queue())

# 添加请求
await request_queue.add(bot.send_message, chat_id, "Hello")
```

### 5. Mini Apps 性能优化

**代码分割和懒加载：**

```javascript
// 动态导入
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**图片优化：**

```javascript
// 延迟加载图片
<img
  src={imageSrc}
  loading="lazy"
  decoding="async"
  alt="Description"
/>

// 响应式图片
<picture>
  <source
    media="(max-width: 600px)"
    srcSet={`image-small.jpg 1x, image-small@2x.jpg 2x`}
  />
  <source
    media="(min-width: 601px)"
    srcSet={`image-large.jpg 1x, image-large@2x.jpg 2x`}
  />
  <img src="image-medium.jpg" alt="Description" />
</picture>
```

**虚拟滚动：**

```javascript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**本地存储优化：**

```javascript
// 使用 IndexedDB 存储大量数据
import { openDB } from 'idb';

const db = await openDB('my-db', 1, {
  upgrade(db) {
    db.createObjectStore('cache');
  },
});

// 存储数据
await db.put('cache', largeData, 'key');

// 获取数据
const data = await db.get('cache', 'key');
```

### 6. 内存和资源管理

**连接池管理：**

```python
# PostgreSQL 连接池
import asyncpg

db_pool = await asyncpg.create_pool(
    min_size=5,      # 最小连接数
    max_size=20,     # 最大连接数
    command_timeout=60  # 命令超时
)

# Redis 连接池
import redis.asyncio as redis

redis_pool = redis.ConnectionPool.from_url(
    os.getenv('REDIS_URL'),
    max_connections=20
)
redis_client = redis.Redis(connection_pool=redis_pool)
```

**资源清理：**

```python
import atexit

async def cleanup():
    """清理资源"""
    await db_pool.close()
    await redis_client.close()
    await bot.stop()

# 注册清理函数
atexit.register(lambda: asyncio.run(cleanup()))
```

### 7. 监控和分析

**性能指标收集：**

```python
import time
from prometheus_client import Counter, Histogram, generate_latest

# 指标定义
request_count = Counter('bot_requests_total', 'Total requests')
request_duration = Histogram('bot_request_duration_seconds', 'Request duration')

async def track_request(handler):
    """追踪请求性能"""
    start_time = time.time()
    request_count.inc()

    try:
        result = await handler()
        return result
    finally:
        duration = time.time() - start_time
        request_duration.observe(duration)

# 使用
@track_request
async def handle_message(update: Update):
    # 处理逻辑
    pass
```

**性能分析工具：**

```bash
# Python cProfile
python -m cProfile -o profile.stats main.py

# 分析结果
python -c "import pstats; p=pstats.Stats('profile.stats'); p.sort_stats('cumulative'); p.print_stats(20)"

# 内存分析
pip install memory_profiler
python -m memory_profiler main.py

# 异步性能分析
pip install aiodebug
python -m aiodebug.log_slow_callbacks main.py
```

### 8. 性能优化检查清单

**Bot 性能：**
- [ ] 使用异步 I/O
- [ ] 实施缓存策略（Redis）
- [ ] 数据库查询优化（索引、批量操作）
- [ ] API 调用批处理和队列管理
- [ ] 连接池配置合理
- [ ] 实施速率限制防止滥用

**Mini Apps 性能：**
- [ ] 代码分割和懒加载
- [ ] 图片优化（延迟加载、响应式）
- [ ] 虚拟滚动（长列表）
- [ ] 使用 IndexedDB 存储大数据
- [ ] 减少 JavaScript 包大小
- [ ] 使用 CDN 分发静态资源

**监控和调优：**
- [ ] 配置性能监控
- [ ] 定期分析慢查询
- [ ] 监控内存和 CPU 使用
- [ ] 设置告警阈值
- [ ] 定期进行负载测试

## 故障排除和常见问题

### Bot 常见问题

**问题 1: Webhook 不工作**

症状: Bot 收不到消息，Webhook 设置失败

原因和解决方案:

```bash
# 1. 检查 Webhook 状态
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# 检查响应中的 last_error_message

# 2. 验证 URL 可访问性
curl -X POST https://yourdomain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 3. 检查 SSL 证书（必须有效）
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# 4. 重新设置 Webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourdomain.com/webhook",
    "secret_token": "your-secret-token",
    "drop_pending_updates": true
  }'

# 5. 检查防火墙和端口
# 确保端口 443 (HTTPS) 开放

# 6. 删除 Webhook 切换到长轮询（测试用）
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
```

**问题 2: 速率限制错误**

症状: `Too many requests` 错误

解决方案:

```python
# 实施速率限制（见性能优化部分）
# 或使用以下降级策略

import time

class RateLimiter:
    def __init__(self, limit: int, period: float):
        self.limit = limit
        self.period = period
        self.requests = []

    async def wait_if_needed(self):
        now = time.time()
        self.requests = [t for t in self.requests if now - t < self.period]

        if len(self.requests) >= self.limit:
            wait_time = self.period - (now - self.requests[0])
            if wait_time > 0:
                await asyncio.sleep(wait_time)
                self.requests = []

        self.requests.append(now)

# 使用
limiter = RateLimiter(limit=20, period=1)  # 20 请求/秒
await limiter.wait_if_needed()
```

**问题 3: 消息发送失败 - "chat not found"**

原因: Bot 未加入群组，或用户已封禁 Bot

```python
# 解决方案：检查 Bot 是否在群组中
async def ensure_bot_in_group(group_id: int):
    try:
        # 尝试获取群组信息
        chat = await bot.get_chat(group_id)
        print(f"Bot 在群组中: {chat.title}")

        # 检查 Bot 权限
        member = await bot.get_chat_member(group_id, bot.id)
        print(f"Bot 状态: {member.status}")

    except Exception as e:
        error_msg = str(e)
        if "chat not found" in error_msg:
            print("Bot 不在此群组中，需要通过链接邀请:")
            invite_link = f"https://t.me/{bot.username}?startgroup=true"
            print(invite_link)
        elif "bot was blocked by the user" in error_msg:
            print("用户已封禁 Bot")
        else:
            print(f"错误: {e}")
```

**问题 4: 内联按钮不响应**

症状: 点击按钮没有反应

检查清单:

```python
# 1. 验证 callback_data 长度（最大 64 字节）
callback_data = "data"  # 必须 <= 64 字节

# 2. 确保正确响应 callback_query
async def handle_callback_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query

    # 必须调用此方法
    await query.answer(text="收到", show_alert=False)

    # 更新消息（可选）
    await query.edit_message_text("新文本")

# 3. 检查处理器注册
application.add_handler(CallbackQueryHandler(handle_callback_query))

# 4. 验证模式匹配
# 如果使用模式匹配，确保正确
application.add_handler(CallbackQueryHandler(
    handle_callback_query,
    pattern=r'^btn_\d+$'
))
```

**问题 5: Bot API 401 Unauthorized**

原因: Token 无效或错误

```python
# 解决方案
import os

BOT_TOKEN = os.getenv('BOT_TOKEN')

# 验证 Token 格式（应为数字:字符串）
if not BOT_TOKEN or ':' not in BOT_TOKEN:
    raise ValueError("无效的 Bot Token 格式")

# 测试 Token
async def test_token():
    try:
        bot = Bot(token=BOT_TOKEN)
        me = await bot.get_me()
        print(f"✓ Bot 工作正常: @{me.username}")
        return True
    except Exception as e:
        print(f"✗ Token 无效: {e}")
        print("请从 @BotFather 获取新的 Token")
        return False
```

### Mini Apps 常见问题

**问题 1: WebApp 对象未定义**

症状: `window.Telegram.WebApp is undefined`

解决方案:

```html
<!-- 确保 script 在 head 中加载 -->
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>

<!-- 检查对象是否存在 -->
<script>
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
  } else {
    console.error('Telegram WebApp API 不可用');
    // 提供回退 UI
    document.getElementById('app').innerHTML = '<p>请在 Telegram 中打开此应用</p>';
  }
</script>
```

**问题 2: initData 验证失败**

症状: 服务器验证 initData 返回 false

检查和修复:

```python
from urllib.parse import parse_qs, unquote

def validate_init_data_v2(init_data: str, bot_token: str) -> bool:
    """改进的 initData 验证"""
    try:
        # 解析数据
        parsed = parse_qs(unquote(init_data))
        received_hash = parsed.get('hash', [''])[0]

        if not received_hash:
            return False

        # 构建数据检查字符串
        data_check_arr = []
        for key in sorted(parsed.keys()):
            if key != 'hash':
                data_check_arr.append(f"{key}={parsed[key][0]}")

        data_check_string = '\n'.join(data_check_arr)

        # 计算密钥
        secret_key = hmac.new(
            b"WebAppData",
            bot_token.encode(),
            hashlib.sha256
        ).digest()

        # 计算哈希
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()

        return calculated_hash == received_hash

    except Exception as e:
        print(f"验证失败: {e}")
        return False

# Mini App 端检查
if (!tg.initData) {
  console.error('没有 initData，可能是在外部浏览器打开');
  // 显示登录页面
} else {
  // 发送到服务器验证
}
```

**问题 3: Mini App 加载慢**

优化建议:

```javascript
// 1. 延迟加载非关键资源
import('./heavy-module.js').then(module => {
  module.init();
});

// 2. 预加载关键资源
<link rel="preload" href="critical.css" as="style">

// 3. 使用 Service Worker 缓存
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// 4. 优化图片
<img src="image.jpg" loading="lazy" decoding="async">

// 5. 减少包大小
// 使用代码分割和 tree-shaking
```

**问题 4: 触觉反馈不工作**

```javascript
// 检查平台支持
if (tg.HapticFeedback) {
  // 触觉反馈必须在用户交互后触发
  button.onclick = () => {
    tg.HapticFeedback.impactOccurred('light');
  };
} else {
  console.log('此平台不支持触觉反馈');
}
```

### 数据库问题

**问题 1: 连接池耗尽**

```python
# 增加连接池大小
db_pool = await asyncpg.create_pool(
    min_size=10,
    max_size=50,  # 增加到 50
    max_inactive_connection_lifetime=300.0
)

# 或使用连接超时
await db_pool.execute(
    "SET statement_timeout = '30s'"
)
```

**问题 2: 慢查询**

```sql
-- 1. 识别慢查询
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- 2. 分析查询计划
EXPLAIN ANALYZE
SELECT * FROM messages WHERE chat_id = 12345;

-- 3. 添加索引
CREATE INDEX idx_messages_chat_id ON messages(chat_id);

-- 4. 优化查询（避免 SELECT *）
SELECT id, text, created_at FROM messages WHERE chat_id = 12345;
```

### 部署问题

**问题 1: Heroku 应用崩溃**

```bash
# 查看日志
heroku logs --tail

# 常见原因和解决方案

# 1. 内存不足
# 解决: 增加 dyno 大小或优化内存使用
heroku ps:resize web=standard-2x

# 2. 端口问题
# 确保使用环境变量 PORT
port = int(os.getenv('PORT', 5000))

# 3. 依赖问题
# 检查 requirements.txt 或 package.json

# 4. 启动超时
# 在 Procfile 中使用 --timeout 参数
# web: gunicorn app:app --timeout 120
```

**问题 2: SSL 证书问题**

```bash
# 1. 使用 Let's Encrypt 获取免费证书
sudo certbot --nginx -d yourdomain.com

# 2. 自动续期
sudo certbot renew --dry-run

# 3. 检查证书有效期
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# 4. 强制 HTTPS (Nginx 配置见部署部分)
```

### 调试技巧

**1. 启用详细日志**

```python
import logging

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.DEBUG,  # 开发环境使用 DEBUG
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler()
    ]
)
```

**2. 使用调试模式**

```python
DEBUG = os.getenv('DEBUG') == 'true'

if DEBUG:
    # 启用详细错误信息
    import traceback
    bot.catch = lambda error, update: (
        print(f"Update {update} caused error {error}"),
        print(traceback.format_exc())
    )
```

**3. 监控更新**

```python
@bot.middleware
async def log_update(update, handler):
    logger.info(f"收到更新: {update.update_id}")
    result = await handler(update)
    logger.info(f"处理完成: {update.update_id}")
    return result
```

### 常见错误代码参考

| 错误代码 | 说明 | 解决方案 |
|---------|------|---------|
| 401 | Unauthorized (Token 无效) | 检查 Token 是否正确 |
| 403 | Forbidden (权限不足) | Bot 需要管理员权限或加入群组 |
| 404 | Not Found (聊天不存在) | 检查 chat_id 或邀请链接 |
| 429 | Too Many Requests (速率限制) | 实施速率限制或等待 |
| 500 | Internal Server Error (服务器错误) | 重试或联系 Telegram 支持 |
| `Bad Request: message is not modified` | 尝试编辑未修改的消息 | 检查消息内容是否真正改变 |
| `Bad Request: can't parse entities` | Markdown/HTML 格式错误 | 检查特殊字符转义 |

### 获取帮助

**官方资源：**
- Bot API 文档: https://core.telegram.org/bots/api
- FAQ: https://core.telegram.org/bots/faq
- GitHub Issues: https://github.com/tdlib/telegram-bot-api/issues

**社区资源：**
- Python Telegram Bot Forum: https://t.me/pythontelegrambotgroup
- Node Telegram Bot Group: https://t.me/node_telegram_bot_group
- Stack Overflow (标签: telegram-bot)

## 常用库和工具

### Python
- `python-telegram-bot` - 功能强大的 Bot 框架
- `aiogram` - 异步 Bot 框架
- `telethon` / `pyrogram` - MTProto 客户端

### Node.js
- `node-telegram-bot-api` - Bot API 包装器
- `telegraf` - 现代 Bot 框架
- `grammy` - 轻量级框架

### 其他语言
- PHP: `telegram-bot-sdk`
- Go: `telegram-bot-api`
- Java: `TelegramBots`
- C#: `Telegram.Bot`

## 测试指南

### Bot 单元测试

**Python (pytest):**

`tests/test_bot.py`:
```python
import pytest
from telegram import Update, Message, User, Chat
from telegram.ext import Application, CommandHandler
from unittest.mock import AsyncMock, MagicMock

# 导入你的 bot 模块
from main import start_command, echo_handler

@pytest.fixture
def update():
    """创建模拟的 Update 对象"""
    user = User(id=123, first_name="Test", is_bot=False)
    chat = Chat(id=123, type="private")
    message = Message(
        message_id=1,
        date=None,
        chat=chat,
        from_user=user,
        text="test message"
    )
    update = Update(update_id=1, message=message)
    return update

@pytest.fixture
def bot():
    """创建模拟的 Bot 对象"""
    bot = MagicMock()
    bot.send_message = AsyncMock()
    return bot

@pytest.mark.asyncio
async def test_start_command(update, bot):
    """测试 /start 命令"""
    context = MagicMock()
    context.bot = bot

    await start_command(update, context)

    # 验证发送了消息
    bot.send_message.assert_called_once()
    call_args = bot.send_message.call_args
    assert call_args[1]['chat_id'] == 123
    assert '欢迎' in call_args[1]['text']

@pytest.mark.asyncio
async def test_echo_handler(update, bot):
    """测试回声处理器"""
    context = MagicMock()
    context.bot = bot

    await echo_handler(update, context)

    # 验证回复了相同文本
    bot.send_message.assert_called_once_with(
        chat_id=123,
        text="test message"
    )

def test_validate_message_text():
    """测试消息验证函数"""
    from main import validate_message_text

    # 正常情况
    assert validate_message_text("Hello") is True

    # 空文本
    with pytest.raises(ValueError):
        validate_message_text("")

    # 过长的文本
    with pytest.raises(ValueError):
        validate_message_text("a" * 5000)

@pytest.mark.asyncio
async def test_callback_query_handler():
    """测试回调查询处理器"""
    # 创建回调查询更新
    update = Update(
        update_id=1,
        callback_query=MagicMock(
            id="123",
            data="button_click",
            from_user=User(id=123, first_name="Test")
        )
    )

    context = MagicMock()
    context.bot = MagicMock()
    context.bot.answer_callback_query = AsyncMock()
    context.bot.edit_message_text = AsyncMock()

    # 调用处理器
    await handle_callback_query(update, context)

    # 验证行为
    context.bot.answer_callback_query.assert_called_once()
    context.bot.edit_message_text.assert_called_once()
```

`requirements-dev.txt`:
```
pytest==7.4.0
pytest-asyncio==0.21.0
pytest-mock==3.11.1
```

**运行测试：**

```bash
# 安装测试依赖
pip install -r requirements-dev.txt

# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_bot.py

# 运行特定测试
pytest tests/test_bot.py::test_start_command

# 显示详细输出
pytest -v

# 显示测试覆盖率
pytest --cov=. --cov-report=html

# 运行并生成覆盖率报告
pytest --cov=main --cov-report=term-missing
```

**集成测试：**

`tests/test_integration.py`:
```python
import pytest
from telegram import Update
from telegram.ext import Application
import os

@pytest.fixture
async def application():
    """创建测试用的 Application"""
    app = Application.builder().token(os.getenv("TEST_BOT_TOKEN")).build()

    # 注册处理器
    app.add_handler(CommandHandler("test", lambda u, c: None))

    await app.initialize()
    yield app
    await app.shutdown()

@pytest.mark.asyncio
async def test_webhook_processing(application):
    """测试 Webhook 处理"""
    # 创建模拟的更新数据
    update_data = {
        "update_id": 1,
        "message": {
            "message_id": 1,
            "from": {"id": 123, "first_name": "Test"},
            "chat": {"id": 123, "type": "private"},
            "text": "/test"
        }
    }

    # 处理更新
    update = Update.de_json(update_data, application.bot)
    await application.process_update(update)

    # 验证处理成功
    assert True  # 如果没有抛出异常，则测试通过
```

### Webhook 本地测试

**使用 ngrok:**

```bash
# 1. 安装 ngrok
brew install ngrok  # macOS
# 或下载: https://ngrok.com/download

# 2. 启动本地服务器
python main.py  # 或 node index.js

# 3. 在另一个终端启动 ngrok
ngrok http 5000

# 4. 获取公开 URL（如 https://abc123.ngrok.io）

# 5. 设置 Webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://abc123.ngrok.io/webhook"}'

# 6. 测试 Bot，查看 ngrok 终端的请求日志

# 7. 测试完成后删除 Webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
```

**本地 Webhook 工具 (localtunnel):**

```bash
# 安装
npm install -g localtunnel

# 启动隧道
lt --port 5000

# 获取 URL 并设置 Webhook
```

### Mini Apps 测试

**Playwright 测试：**

`tests/mini-app.spec.js`:
```javascript
import { test, expect } from '@playwright/test';

test.describe('Telegram Mini App', () => {
  test('应显示用户信息', async ({ page }) => {
    // 模拟 Telegram WebApp 环境
    await page.goto('http://localhost:3000');

    // 注入模拟的 Telegram WebApp 对象
    await page.evaluate(() => {
      window.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: 123,
              first_name: 'Test',
              username: 'testuser'
            }
          },
          themeParams: {
            bg_color: '#ffffff',
            text_color: '#000000'
          },
          ready: () => {},
          expand: () => {},
          version: '6.9'
        }
      };
    });

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 验证用户信息显示
    await expect(page.locator('text=Test')).toBeVisible();
    await expect(page.locator('text=testuser')).toBeVisible();
  });

  test('主按钮应可点击', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 注入模拟环境
    await page.evaluate(() => {
      window.Telegram = {
        WebApp: {
          MainButton: {
            text: '提交',
            show: () => {},
            onClick: (callback) => {},
            isVisible: true,
            isActive: true
          },
          ready: () => {}
        }
      };
    });

    // 点击主按钮
    await page.click('button[data-testid="main-button"]');

    // 验证发送数据
    await expect(page.locator('text=提交成功')).toBeVisible();
  });

  test('应响应主题变化', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 注入模拟环境
    await page.evaluate(() => {
      window.Telegram = {
        WebApp: {
          themeParams: {
            bg_color: '#ffffff'
          },
          ready: () => {},
          onEvent: (event, callback) => {
            if (event === 'themeChanged') {
              setTimeout(() => callback({
                theme_params: { bg_color: '#1a1a1a' }
              }), 100);
            }
          }
        }
      };
    });

    // 验证深色主题应用
    await page.waitForTimeout(200);
    const bgColor = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toBe('rgb(26, 26, 26)');
  });
});
```

**运行 Playwright 测试：**

```bash
# 安装 Playwright
npm install -D @playwright/test

# 安装浏览器
npx playwright install

# 运行测试（有界面）
npx playwright test

# 运行测试（无界面）
npx playwright test --headed=false

# 运行特定测试
npx playwright test mini-app.spec.js

# 生成测试报告
npx playwright show-report
```

**Telegram Mini Apps 测试工具：**

```javascript
// public/test-embed.html - Mini App 测试环境
<!DOCTYPE html>
<html>
<head>
  <title>Mini App Test Environment</title>
</head>
<body>
  <iframe id="app-frame" width="400" height="800" src="/"></iframe>

  <script>
    // 模拟 Telegram WebApp API
    const mockWebApp = {
      initDataUnsafe: {
        user: {
          id: 123456789,
          first_name: 'Test User',
          username: 'testuser',
          language_code: 'en'
        },
        query_id: 'AAHdF6IQAAAAAN0LoiDqW1Pq',
        auth_date: 1601234567
      },
      themeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff'
      },
      colorScheme: 'light',
      version: '6.9',
      platform: 'web',
      isExpanded: true,
      viewportHeight: 800,
      ready: () => console.log('WebApp.ready() called'),
      expand: () => console.log('WebApp.expand() called'),
      close: () => console.log('WebApp.close() called'),
      sendData: (data) => console.log('WebApp.sendData()', data),
      MainButton: {
        text: 'Submit',
        color: '#2481cc',
        textColor: '#ffffff',
        isVisible: false,
        isActive: false,
        isProgressVisible: false,
        setText: (text) => mockWebApp.MainButton.text = text,
        show: () => { mockWebApp.MainButton.isVisible = true; updateMainButton(); },
        hide: () => { mockWebApp.MainButton.isVisible = false; updateMainButton(); },
        onClick: null,
        setParams: (params) => Object.assign(mockWebApp.MainButton, params)
      }
    };

    // 将模拟对象注入到 iframe
    const iframe = document.getElementById('app-frame');
    iframe.onload = () => {
      iframe.contentWindow.Telegram = { WebApp: mockWebApp };

      // 监听 Mini App 的 sendData 调用
      mockWebApp.sendData = (data) => {
        console.log('Mini App sent data:', data);
        alert('Data sent:\n' + JSON.stringify(data, null, 2));
      };
    };

    function updateMainButton() {
      // 更新测试界面上的主按钮状态
    }
  </script>
</body>
</html>
```

### 性能测试

**Bot 响应时间测试：**

```python
import pytest
import time
from telegram import Update
from unittest.mock import MagicMock

@pytest.mark.asyncio
async def test_handler_performance():
    """测试处理器性能"""
    update = Update(update_id=1, message=MagicMock())
    context = MagicMock()

    start_time = time.time()
    await your_handler(update, context)
    response_time = time.time() - start_time

    # 验证响应时间 < 1 秒
    assert response_time < 1.0, f"响应时间过长: {response_time:.3f}s"
```

**负载测试：**

`tests/load_test.py`:
```python
import asyncio
import aiohttp
import time
from typing import List

async def send_request(session: aiohttp.ClientSession, url: str) -> float:
    """发送单个请求并返回响应时间"""
    start = time.time()
    async with session.get(url) as response:
        await response.text()
    return time.time() - start

async def load_test(url: str, num_requests: int, concurrency: int):
    """负载测试"""
    async with aiohttp.ClientSession() as session:
        start_time = time.time()
        response_times = []

        # 并发请求
        semaphore = asyncio.Semaphore(concurrency)

        async def limited_request():
            async with semaphore:
                response_time = await send_request(session, url)
                response_times.append(response_time)

        await asyncio.gather(*[limited_request() for _ in range(num_requests)])

        total_time = time.time() - start_time

        # 计算统计信息
        avg_response = sum(response_times) / len(response_times)
        max_response = max(response_times)
        min_response = min(response_times)
        requests_per_second = num_requests / total_time

        print(f"""
负载测试结果:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
请求数: {num_requests}
并发数: {concurrency}
总耗时: {total_time:.2f}s

响应时间:
  平均: {avg_response:.3f}s
  最大: {max_response:.3f}s
  最小: {min_response:.3f}s

吞吐量: {requests_per_second:.2f} 请求/秒
        """)

        return {
            'avg_response': avg_response,
            'max_response': max_response,
            'requests_per_second': requests_per_second
        }

# 运行测试
if __name__ == '__main__':
    # 测试本地 Webhook
    asyncio.run(load_test('http://localhost:5000/health', 100, 10))
```

## 项目结构和最佳实践

### 完整项目结构

**Python 项目：**

```
telegram-bot/
├── .env                      # 环境变量（不提交到 git）
├── .env.example              # 环境变量模板
├── .gitignore
├── requirements.txt          # 生产依赖
├── requirements-dev.txt      # 开发依赖
├── README.md
├── Procfile                  # Heroku 部署
├── Dockerfile
├── docker-compose.yml
├── main.py                   # 应用入口
├── config.py                 # 配置管理
├── database.py               # 数据库连接
├── utils/
│   ├── __init__.py
│   ├── logger.py            # 日志工具
│   ├── validators.py        # 输入验证
│   └── helpers.py           # 辅助函数
├── handlers/
│   ├── __init__.py
│   ├── commands/
│   │   ├── __init__.py
│   │   ├── start.py         # /start 命令
│   │   ├── help.py          # /help 命令
│   │   └── settings.py      # /settings 命令
│   ├── callbacks/
│   │   ├── __init__.py
│   │   ├── menu.py          # 菜单回调
│   │   └── buttons.py       # 按钮回调
│   └── messages/
│       ├── __init__.py
│       ├── text.py          # 文本消息处理
│       └── media.py         # 媒体消息处理
├── keyboards/
│   ├── __init__.py
│   ├── inline.py            # 内联键盘
│   └── reply.py             # 回复键盘
├── services/
│   ├── __init__.py
│   ├── user_service.py      # 用户服务
│   ├── payment_service.py   # 支付服务
│   └── notification_service.py  # 通知服务
├── models/
│   ├── __init__.py
│   ├── user.py              # 用户模型
│   └── subscription.py      # 订阅模型
├── repositories/
│   ├── __init__.py
│   ├── user_repository.py   # 用户数据访问
│   └── base_repository.py   # 基础仓储类
├── middleware/
│   ├── __init__.py
│   ├── logging.py           # 日志中间件
│   └── auth.py              # 认证中间件
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # pytest 配置
│   ├── test_handlers.py     # 处理器测试
│   ├── test_services.py     # 服务测试
│   └── test_integration.py  # 集成测试
├── migrations/              # 数据库迁移
│   └── versions/
├── logs/                    # 日志目录
│   └── .gitkeep
├── docs/                    # 文档
│   ├── api.md               # API 文档
│   └── deployment.md        # 部署文档
└── scripts/                 # 脚本
    ├── init_db.py           # 初始化数据库
    └── create_superuser.py  # 创建管理员
```

**Node.js 项目：**

```
telegram-bot/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json            # TypeScript 配置
├── README.md
├── src/
│   ├── index.ts             # 应用入口
│   ├── config.ts            # 配置
│   ├── bot.ts               # Bot 实例
│   ├── handlers/            # 处理器
│   │   ├── commands/
│   │   │   ├── start.ts
│   │   │   └── help.ts
│   │   ├── callbacks/
│   │   └── messages/
│   ├── middlewares/         # 中间件
│   ├── services/            # 服务
│   ├── repositories/        # 数据访问
│   ├── types/               # TypeScript 类型
│   └── utils/               # 工具函数
├── tests/                   # 测试
├── dist/                    # 编译输出
├── logs/                    # 日志
└── docs/                    # 文档
```

### 模块化设计原则

**1. 单一职责原则**

每个模块只负责一个功能：

```python
# handlers/commands/start.py
from telegram import Update
from telegram.ext import ContextTypes

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """只处理 /start 命令逻辑"""
    user = update.effective_user
    await update.message.reply_text(f"欢迎 {user.first_name}!")

# 注册处理器
def register(application):
    """注册此模块的所有处理器"""
    application.add_handler(CommandHandler('start', start_command))
```

**2. 依赖注入**

```python
# config.py
class Config:
    """配置类"""
    def __init__(self):
        self.BOT_TOKEN = os.getenv('BOT_TOKEN')
        self.DATABASE_URL = os.getenv('DATABASE_URL')
        self.REDIS_URL = os.getenv('REDIS_URL')

# services/user_service.py
class UserService:
    """用户服务"""
    def __init__(self, user_repository):
        self.user_repository = user_repository

    async def get_user(self, user_id: int):
        return await self.user_repository.find_by_id(user_id)

# main.py
config = Config()
db = Database(config.DATABASE_URL)
user_repository = UserRepository(db)
user_service = UserService(user_repository)
```

**3. 错误处理集中化**

```python
# exceptions.py
class BotError(Exception):
    """基础 Bot 错误"""
    pass

class UserNotFoundError(BotError):
    """用户未找到"""
    pass

class PaymentError(BotError):
    """支付错误"""
    pass

# 在处理器中使用
try:
    user = await user_service.get_user(user_id)
except UserNotFoundError:
    await update.message.reply_text("用户不存在")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    await update.message.reply_text("发生错误，请稍后重试")
```

### 配置管理

**分层配置：**

```python
# config.py
import os
from functools import lru_cache
from pydantic import BaseSettings

class Settings(BaseSettings):
    """应用配置"""
    # Bot 配置
    BOT_TOKEN: str
    BOT_USERNAME: str

    # 数据库
    DATABASE_URL: str

    # Redis
    REDIS_URL: str

    # Webhook
    WEBHOOK_URL: str
    WEBHOOK_SECRET: str

    # 应用
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # 速率限制
    RATE_LIMIT: int = 20
    RATE_PERIOD: int = 60

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    """获取配置单例"""
    return Settings()
```

### 数据库架构

**Repository 模式：**

```python
# repositories/base_repository.py
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class BaseRepository(Generic[T], ABC):
    """基础仓储类"""

    @abstractmethod
    async def find_by_id(self, id: int) -> Optional[T]:
        pass

    @abstractmethod
    async def create(self, entity: T) -> T:
        pass

    @abstractmethod
    async def update(self, entity: T) -> T:
        pass

    @abstractmethod
    async def delete(self, id: int) -> bool:
        pass

# repositories/user_repository.py
class UserRepository(BaseRepository[User]):
    """用户仓储"""

    def __init__(self, db):
        self.db = db

    async def find_by_id(self, id: int) -> Optional[User]:
        row = await self.db.fetchrow(
            "SELECT * FROM users WHERE id = $1",
            id
        )
        return User.from_dict(row) if row else None

    async def find_by_telegram_id(self, telegram_id: int) -> Optional[User]:
        row = await self.db.fetchrow(
            "SELECT * FROM users WHERE telegram_id = $1",
            telegram_id
        )
        return User.from_dict(row) if row else None

    async def create(self, user: User) -> User:
        user_id = await self.db.fetchval(
            """INSERT INTO users (telegram_id, username, first_name)
               VALUES ($1, $2, $3)
               RETURNING id""",
            user.telegram_id, user.username, user.first_name
        )
        user.id = user_id
        return user
```

### 日志和监控

**结构化日志：**

```python
# utils/logger.py
import logging
import json
from datetime import datetime
from pathlib import Path

class StructuredLogger:
    """结构化日志记录器"""

    def __init__(self, name: str, log_dir: str = "logs"):
        self.logger = logging.getLogger(name)
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)

        # 设置日志格式
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

        # 文件处理器
        file_handler = logging.FileHandler(
            self.log_dir / f"{name}.log"
        )
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

    def log(self, level: str, message: str, **kwargs):
        """记录结构化日志"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'level': level,
            'message': message,
            **kwargs
        }
        self.logger.info(json.dumps(log_entry, ensure_ascii=False))

    def info(self, message: str, **kwargs):
        self.log('INFO', message, **kwargs)

    def error(self, message: str, **kwargs):
        self.log('ERROR', message, **kwargs)

# 使用
logger = StructuredLogger('bot')
logger.info('User joined', user_id=123, username='testuser')
```

### 测试策略

**测试金字塔：**

```
        /\
       /E2E\       10%  - 端到端集成测试
      /------\
     /Integration\ 20%  - API/数据库集成测试
    /--------------\
   /   Unit Tests   \ 70%  - 单元测试
  /------------------\
```

**单元测试示例：**

```python
# tests/test_user_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock

@pytest.mark.asyncio
async def test_get_user_found():
    """测试获取存在的用户"""
    # Mock 仓储
    mock_repo = AsyncMock()
    mock_user = User(id=1, telegram_id=123, username='test')
    mock_repo.find_by_id.return_value = mock_user

    # 创建服务
    service = UserService(mock_repo)

    # 测试
    result = await service.get_user(1)

    # 验证
    assert result.id == 1
    assert result.telegram_id == 123
    mock_repo.find_by_id.assert_called_once_with(1)
```

**集成测试示例：**

```python
# tests/test_integration.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_webhook_endpoint():
    """测试 Webhook 端点"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/webhook",
            json={
                "update_id": 1,
                "message": {
                    "message_id": 1,
                    "from": {"id": 123, "first_name": "Test"},
                    "chat": {"id": 123, "type": "private"},
                    "text": "/start"
                }
            }
        )
    assert response.status_code == 200
```

### 部署最佳实践

**环境分离：**

```
development/    # 开发环境
staging/        # 预发布环境
production/     # 生产环境
```

**配置文件分离：**

```bash
# .env.development
DEBUG=true
DATABASE_URL=postgresql://localhost/dev_db
LOG_LEVEL=DEBUG

# .env.staging
DEBUG=false
DATABASE_URL=postgresql://staging-db/staging_db
LOG_LEVEL=INFO

# .env.production
DEBUG=false
DATABASE_URL=${PROD_DATABASE_URL}
LOG_LEVEL=WARNING
```

### 文档规范

**API 文档：**

```python
"""
用户服务

提供用户相关的业务逻辑操作。

方法:
    get_user(user_id): 获取用户信息
    create_user(user_data): 创建新用户
    update_user(user_id, updates): 更新用户信息

示例:
    >>> service = UserService(user_repository)
    >>> user = await service.get_user(123)
    >>> print(user.username)
"""
```

### 代码审查清单

**提交前检查：**

- [ ] 代码符合 PEP8 / ESLint 规范
- [ ] 所有函数都有文档字符串
- [ ] 添加了必要的错误处理
- [ ] 编写了单元测试（测试覆盖率 > 80%）
- [ ] 敏感信息使用环境变量
- [ ] 数据库查询使用了参数化
- [ ] 日志记录了关键操作
- [ ] 更新了相关文档
- [ ] 通过了所有测试

## 实战案例和项目模板

### 案例 1: 电商 Bot

**功能需求：**
- 商品展示和搜索
- 购物车管理
- Telegram Stars 支付
- 订单跟踪
- 用户认证

**项目结构：**

```
ecommerce-bot/
├── bot.py
├── config.py
├── services/
│   ├── product_service.py
│   ├── cart_service.py
│   ├── order_service.py
│   └── payment_service.py
├── handlers/
│   ├── commands/
│   │   ├── start.py
│   │   ├── catalog.py
│   │   └── cart.py
│   └── callbacks/
│       ├── product.py
│       └── order.py
├── models/
│   ├── product.py
│   ├── cart.py
│   └── order.py
└── keyboards/
    └── product_keyboard.py
```

**核心代码示例：**

```python
# handlers/commands/catalog.py
from telegram import Update
from telegram.ext import ContextTypes
from services.product_service import ProductService
from keyboards.product_keyboard import product_keyboard

product_service = ProductService()

async def catalog_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """显示商品目录"""
    products = await product_service.get_all_products()

    for product in products:
        keyboard = product_keyboard(product.id)
        await update.message.reply_photo(
            photo=product.image_url,
            caption=f"{product.name}\n💰 {product.price} Stars",
            reply_markup=keyboard
        )

# handlers/callbacks/product.py
async def product_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理商品回调"""
    query = update.callback_query
    await query.answer()

    action, product_id = query.data.split('_')
    product_id = int(product_id)

    if action == 'add':
        # 添加到购物车
        await cart_service.add_item(query.from_user.id, product_id)
        await query.edit_message_text(
            f"✅ 已添加到购物车\n{product.name}",
            reply_markup=product_keyboard(product_id)
        )
    elif action == 'info':
        # 显示商品详情
        product = await product_service.get_product(product_id)
        await query.edit_message_text(
            f"{product.name}\n\n{product.description}\n\n💰 {product.price} Stars",
            reply_markup=product_keyboard(product_id)
        )
```

**支付处理：**

```python
# services/payment_service.py
from telegram import LabeledPrice, Update
from telegram.ext import ContextTypes

async def create_payment_invoice(chat_id: int, cart_items: list):
    """创建支付发票"""
    total_stars = sum(item.price * item.quantity for item in cart_items)

    await bot.send_invoice(
        chat_id=chat_id,
        title='购物车结账',
        description=f'共 {len(cart_items)} 件商品',
        payload=f'cart_{chat_id}',
        currency='XTR',
        prices=[LabeledPrice('总计', total_stars)]
    )

@bot.pre_checkout_query_handler
async def pre_checkout_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.pre_checkout_query

    # 验证购物车
    user_id = query.from_user.id
    cart_items = await cart_service.get_cart(user_id)

    if not cart_items:
        await query.answer(ok=False, error_message='购物车为空')
        return

    await query.answer(ok=True)

@bot.successful_payment_handler
async def successful_payment_handler(message: Message):
    payment = message.successful_payment
    user_id = message.chat.id

    # 创建订单
    order = await order_service.create_order(
        user_id=user_id,
        total_amount=payment.total_amount,
        invoice_payload=payment.invoice_payload
    )

    # 清空购物车
    await cart_service.clear_cart(user_id)

    await message.reply_text(
        f'✅ 支付成功！\n'
        f'订单号: #{order.id}\n'
        f'金额: {payment.total_amount} Stars'
    )
```

### 案例 2: 投票 Bot

**功能需求：**
- 创建投票（最多 12 选项）
- 匿名投票
- 实时结果统计
- 投票历史记录

**核心代码：**

```python
# services/vote_service.py
from typing import List
from models.vote import Vote, VoteOption

class VoteService:
    def __init__(self, db):
        self.db = db

    async def create_vote(
        self,
        creator_id: int,
        question: str,
        options: List[str],
        is_anonymous: bool = False
    ) -> Vote:
        """创建投票"""
        async with self.db.transaction():
            vote_id = await self.db.fetchval("""
                INSERT INTO votes (creator_id, question, is_anonymous)
                VALUES ($1, $2, $3)
                RETURNING id
            """, creator_id, question, is_anonymous)

            # 插入选项
            for i, option_text in enumerate(options):
                await self.db.execute("""
                    INSERT INTO vote_options (vote_id, option_number, text)
                    VALUES ($1, $2, $3)
                """, vote_id, i, option_text)

            return await self.get_vote(vote_id)

    async def vote(self, vote_id: int, user_id: int, option_number: int):
        """投票"""
        # 检查是否已投票
        existing = await self.db.fetchval("""
            SELECT id FROM user_votes
            WHERE vote_id = $1 AND user_id = $2
        """, vote_id, user_id)

        if existing:
            raise Exception("您已经投过票了")

        # 记录投票
        await self.db.execute("""
            INSERT INTO user_votes (vote_id, user_id, option_number)
            VALUES ($1, $2, $3)
        """, vote_id, user_id, option_number)

        # 更新选项计数
        await self.db.execute("""
            UPDATE vote_options
            SET votes_count = votes_count + 1
            WHERE vote_id = $1 AND option_number = $2
        """, vote_id, option_number)

    async def get_results(self, vote_id: int) -> dict:
        """获取投票结果"""
        vote = await self.get_vote(vote_id)
        options = await self.db.fetch("""
            SELECT option_number, text, votes_count
            FROM vote_options
            WHERE vote_id = $1
            ORDER BY option_number
        """, vote_id)

        total_votes = sum(option['votes_count'] for option in options)

        results = []
        for option in options:
            percentage = (option['votes_count'] / total_votes * 100) if total_votes > 0 else 0
            results.append({
                'option': option['text'],
                'votes': option['votes_count'],
                'percentage': round(percentage, 2)
            })

        return {
            'question': vote.question,
            'total_votes': total_votes,
            'results': results
        }
```

**使用示例：**

```python
# handlers/commands/vote.py
from telegram import Poll
from telegram.ext import ContextTypes

async def create_vote_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """创建投票"""
    if not context.args:
        await update.message.reply_text(
            "用法: /vote 问题? 选项1 选项2 选项3...\n\n"
            "最多 12 个选项"
        )
        return

    # 解析参数
    parts = ' '.join(context.args).split('?')
    if len(parts) < 2:
        await update.message.reply_text("格式错误，请包含问题和选项")
        return

    question = parts[0].strip()
    options = [opt.strip() for opt in parts[1].split()]

    if len(options) > 12:
        await update.message.reply_text("选项不能超过 12 个")
        return

    # 创建投票
    vote = await vote_service.create_vote(
        creator_id=update.effective_user.id,
        question=question,
        options=options
    )

    # 发送投票消息
    poll = Poll(
        question=question,
        options=options,
        type=Poll.REGULAR,
        is_anonymous=True
    )

    await update.message.reply_poll(
        question=poll.question,
        options=[opt['text'] for opt in poll.options],
        type=poll.type,
        is_anonymous=poll.is_anonymous
    )
```

### 案例 3: 客服 Bot

**功能需求：**
- 自动回复常见问题（FAQ）
- 收集用户消息
- 人工转接
- 客服面板
- 消息转发

**自动回复系统：**

```python
# services/faq_service.py
import re
from typing import Optional

class FAQService:
    def __init__(self):
        # FAQ 数据库
        self.faqs = {
            r'价格|多少钱|费用': '我们的产品定价如下：\n基础版：免费\n专业版：¥99/月\n企业版：¥999/月',
            r'退款|退货': '支持7天无理由退款。请联系客服处理。',
            r'配送|快递': '全国包邮，3-5个工作日送达。',
            r'客服|人工': '正在为您转接人工客服，请稍候...',
            r'帮助|help': '可用命令：\n/faq - 常见问题\n/contact - 联系客服\n/order - 订单查询'
        }

    def get_answer(self, user_message: str) -> Optional[str]:
        """匹配 FAQ 答案"""
        for pattern, answer in self.faqs.items():
            if re.search(pattern, user_message, re.IGNORECASE):
                return answer
        return None

    def add_faq(self, question: str, answer: str):
        """添加新的 FAQ"""
        # 提取关键词
        keywords = extract_keywords(question)
        pattern = '|'.join(keywords)
        self.faqs[pattern] = answer

# 使用
faq_service = FAQService()

@bot.message_handler(content_types=['text'])
async def handle_message(message: Message):
    # 先检查是否为命令
    if message.text.startswith('/'):
        return

    # 尝试 FAQ 匹配
    answer = faq_service.get_answer(message.text)
    if answer:
        await message.reply_text(answer)
    else:
        # 未匹配，转发给客服
        await forward_to_support(message)
```

**人工转接：**

```python
# services/support_service.py
class SupportService:
    def __init__(self, db):
        self.db = db

    async def create_ticket(self, user_id: int, message: str) -> int:
        """创建支持工单"""
        ticket_id = await self.db.fetchval("""
            INSERT INTO support_tickets (user_id, message, status, created_at)
            VALUES ($1, $2, 'open', NOW())
            RETURNING id
        """, user_id, message)

        return ticket_id

    async def assign_agent(self, ticket_id: int, agent_id: int):
        """分配客服代表"""
        await self.db.execute("""
            UPDATE support_tickets
            SET agent_id = $1, status = 'assigned'
            WHERE id = $2
        """, agent_id, ticket_id)

    async def add_message(self, ticket_id: int, sender_id: int, message: str, is_agent: bool):
        """添加工单消息"""
        await self.db.execute("""
            INSERT INTO ticket_messages (ticket_id, sender_id, message, is_agent)
            VALUES ($1, $2, $3, $4)
        """, ticket_id, sender_id, message, is_agent)
```

**客服面板（Mini App）：**

```javascript
// 客服 Mini App
import React, { useState, useEffect } from 'react';

function SupportPanel() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const response = await fetch('/api/support/tickets');
    const data = await response.json();
    setTickets(data);
  };

  const sendMessage = async (message) => {
    await fetch('/api/support/tickets/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticket_id: selectedTicket.id,
        message: message
      })
    });
  };

  return (
    <div className="support-panel">
      <div className="ticket-list">
        {tickets.map(ticket => (
          <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
            #{ticket.id} - {ticket.user_name}
          </div>
        ))}
      </div>
      {selectedTicket && (
        <div className="ticket-chat">
          <div className="messages">
            {selectedTicket.messages.map(msg => (
              <div key={msg.id} className={msg.is_agent ? 'agent' : 'user'}>
                {msg.message}
              </div>
            ))}
          </div>
          <textarea onKeyPress={(e) => e.key === 'Enter' && sendMessage(e.target.value)} />
        </div>
      )}
    </div>
  );
}
```

### 项目模板

**快速启动模板：**

```python
# main.py - 完整的启动模板
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters
from dotenv import load_dotenv
import os

# 加载环境变量
load_dotenv()

# 创建应用
application = Application.builder().token(os.getenv('BOT_TOKEN')).build()

# 导入处理器
from handlers.commands.start import start_command
from handlers.commands.help import help_command
from handlers.callbacks.menu import menu_callback
from handlers.messages.text import text_handler

# 注册处理器
application.add_handler(CommandHandler('start', start_command))
application.add_handler(CommandHandler('help', help_command))
application.add_handler(CallbackQueryHandler(menu_callback))
application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_handler))

# 错误处理
from utils.error_handler import error_handler
application.add_error_handler(error_handler)

# 启动
if __name__ == '__main__':
    import asyncio

    # Webhook 模式
    if os.getenv('USE_WEBHOOK') == 'true':
        application.run_webhook(
            listen='0.0.0.0',
            port=int(os.getenv('PORT', 5000)),
            webhook_url=os.getenv('WEBHOOK_URL'),
            secret_token=os.getenv('WEBHOOK_SECRET')
        )
    # 长轮询模式（开发环境）
    else:
        print("Bot 启动中...（长轮询模式）")
        application.run_polling()
```

**.env.example 模板：**

```env
# Bot 配置
BOT_TOKEN=your_bot_token_here
USE_WEBHOOK=false
WEBHOOK_URL=https://yourdomain.com/webhook
WEBHOOK_SECRET=random_secret_string

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/bot_db
REDIS_URL=redis://localhost:6379/0

# 应用
DEBUG=false
LOG_LEVEL=INFO

# 速率限制
RATE_LIMIT=20
RATE_PERIOD=60

# 第三方服务
STRIPE_API_KEY=sk_test_...
```

## 参考资源

### 官方文档

## 参考资源

### 官方文档
- Bot API: https://core.telegram.org/bots/api
- Mini Apps: https://core.telegram.org/bots/webapps
- Mini Apps Platform: https://docs.telegram-mini-apps.com
- Telegram API: https://core.telegram.org

### GitHub 仓库
- Bot API 服务器: https://github.com/tdlib/telegram-bot-api
- Android 客户端: https://github.com/DrKLO/Telegram
- Desktop 客户端: https://github.com/telegramdesktop/tdesktop
- 官方组织: https://github.com/orgs/TelegramOfficial/repositories

### 工具
- @BotFather - 创建和管理 Bot
- https://my.telegram.org - 获取 API ID/Hash
- Telegram Web App 测试环境

## 参考文件

此技能包含详细的 Telegram 开发资源索引和完整实现模板：

- **index.md** - 完整的资源链接和快速导航
- **Telegram_Bot_按钮和键盘实现模板.md** - 交互式按钮和键盘实现指南（404 行，12 KB）
  - 三种按钮类型详解（Inline/Reply/Command Menu）
  - python-telegram-bot 和 Telethon 双实现对比
  - 完整的即用代码示例和项目结构
  - Handler 系统、错误处理和部署方案
- **动态视图对齐实现文档.md** - Telegram 数据展示指南（407 行，12 KB）
  - 智能动态对齐算法（三步法，O(n×m) 复杂度）
  - 等宽字体环境的完美对齐方案
  - 智能数值格式化系统（B/M/K 自动缩写）
  - 排行榜和数据表格专业展示

这些精简指南提供了核心的 Telegram Bot 开发解决方案：
- 按钮和键盘交互的所有实现方式
- 消息和数据的专业格式化展示
- 实用的最佳实践和快速参考

---

**使用此技能掌握 Telegram 生态的全栈开发！**
