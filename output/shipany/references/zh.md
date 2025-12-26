# Shipany - Zh

**Pages:** 44

---

## Resend

**URL:** https://shipany.ai/zh/docs/email/resend

**Contents:**
- Resend
- 快速开始
- 自定义发送邮件
  - 发送纯文本邮件
  - 发送 HTML 富文本邮件
  - 发送模板邮件
  - 使用 React Email 构建邮件模板

ShipAny 集成了 Resend 作为邮件服务提供商，可用于发送登录验证码、发送客户欢迎邮件、发送订阅通知等场景。

参考以下步骤，在你的项目快速接入 Resend 邮件服务。

在 Resend 控制台，进入 Domains 页面，点击 Add Domain 按钮，添加一个邮件域名。

可以是子域名或主域名。比如：mail.shipany.codes

按照指示，完成邮件域名的 DNS 解析和验证。

在 Resend 控制台，进入 API Keys 页面，点击 Create API Key 按钮，创建一个 API 密钥。

在项目管理后台，进入 Settings -> Email -> Resend 面板，

在 Resend API Key 字段填入上一步创建的 API 密钥。

在 Resend Sender Email 字段填入一个用于发送邮件的邮箱地址，域名需要与在 Resend 控制台添加的邮件域名一致，@ 符号前面的邮箱别名可以任意指定，比如：no-reply@mail.shipany.codes。

如果需要显示发送者名称，可以填写带发送者名称的邮箱地址，比如：

通过 curl 命令，请求项目的邮件发送接口，测试邮件发送能力：

请求成功后，curl 命令会返回邮件发送结果：

邮件接收方，登录自己的邮箱，看到邮件内容如下：

至此，Resend 邮件服务配置成功，后面就可以在项目中使用 Resend 发送邮件了。

你可以在项目中，根据具体的业务需求，自定义发送邮件的方式和内容。

先在项目文件中，使用 React 组件定义邮件模板。

比如，在 src/shared/blocks/email/verification-code.tsx 文件中，定义一个验证码邮件模板：

React Email 是一个用于构建邮件模板的库，可以用于构建复杂的邮件模板。

你需要在项目中安装 react-email 库

使用 React Email 组件库，构建邮件模板。

比如，在 src/shared/blocks/email/react-email.tsx 文件中，定义一个邮件模板：

你可以在 React Email 模板市场 中，找到一些常用的邮件模板，

**Examples:**

Example 1 (python):
```python
ShipAny Two <no-reply@mail.shipany.codes>
```

Example 2 (json):
```json
curl -X POST https://{your-domain}/api/email/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emails":["support@xxx.com"],
    "subject":"Test Email"
  }'
```

Example 3 (json):
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "success": true,
    "messageId": "xxx",
    "provider": "resend"
  }
}
```

Example 4 (javascript):
```javascript
import { getEmailService } from '@/shared/services/email';

const emails = ['support@xxx.com'];
const subject = 'Test Email';

const emailService = await getEmailService();
const emailProvider = emailService.getProvider('resend');

const result = await emailProvider.sendEmail({
  to: emails,
  subject: subject,
  text: 'Hello World.',
});

console.log('send email result', result);
```

---

## 使用 Dokploy 部署

**URL:** https://shipany.ai/zh/docs/deploy/dokploy

**Contents:**
- 使用 Dokploy 部署
- 搭建 Dokploy 部署面板
- 构建 Docker 镜像
- 使用 Dokploy 部署项目
- 绑定自定义域名
- 设置环境变量
- 配置访问统计

ShipAny 可以构建成 Docker 镜像，支持部署到任意支持 Docker 的平台。

Dokploy 是一款开源的部署面板，可以让你用自己的服务器搭建类似 Vercel 一样的项目部署平台。

你可以按照下面的步骤，搭建 Dokploy 部署面板，使用 Dokploy 部署 ShipAny 项目。

你需要先购买一台服务器，用于搭建 Dokploy 部署面板。

购买服务器的平台有很多，比如：AWS Lightsail、DigitalOcean、LightNode、Hostinger 等，也可以在任意的云服务器厂商购买。

推荐配置：4 核 8G 内存 100G 硬盘，操作系统选择 Ubuntu 24.04。

使用 Dokploy 官方提供的脚本，一键安装 Dokploy 部署面板。

通过 http://your-server-ip:3000 访问 Dokploy 部署面板。

在 Web Server 页面绑定域名，后面就可以通过域名来访问 Dokploy 部署面板。

基于 ShipAny 创建的项目，在项目根目录下有一个 Dockerfile 文件，你可以基于项目代码构建 Docker 镜像。

进入按照 快速开始 创建的项目，在项目根目录下执行以下命令，构建 Docker 镜像。

在构建镜像前，请确保你执行构建命令的环境安装了 Docker。如果是 MacOS 系统，推荐 OrbStack，其他操作系统请自行搜索 Docker 的安装方式。

ShipAny 项目的 cf 分支不支持 Docker，请确保你是基于 main 分支或 dev 分支创建的项目。

构建镜像完成后，在项目根目录下执行以下命令，基于 Docker 镜像启动项目。

然后访问 http://localhost:8080，就可以预览项目了。

此步骤是为了验证 Docker 镜像构建是否正常。如果你不想本地安装 Docker，可以跳过此步骤，把代码推送到 Github 走远程构建。

基于 ShipAny 创建的项目，在根目录下有一个 .github/workflows/docker-build.yaml 文件，定义了使用 Github Actions 远程构建 Docker 镜像的流程。

默认情况下，会在 main 分支代码有更新时，自动构建 Docker 镜像，并推送到 ghcr.io 镜像仓库。你可以根据自己的需求，修改 docker-build.yaml 文件的内容。

在确保上面的步骤，使用 Github Actions 远程构建 Docker 镜像成功后。我们可以在 Dokploy 部署面板创建项目，拉取远程的 Docker 镜像进行部署。

在 Dokploy 部署面板，进入 Projects 页面，点击 Create Project 按钮，创建一个新项目。

点击进入上一步创建的项目，点击 Create Service 按钮，选择 Application，创建一个新应用。

参考 ghcr 镜像仓库设置，进入 Github Settings 页面，创建一个新 Token，用于访问 ghcr.io 镜像仓库。

进入第 2 步创建的应用，在 General 标签页，选择 Provider -> Docker，配置 Docker 部署。

配置好 Docker 部署后，点击 Deploy 按钮，开始部署应用。

在 Deployments 标签页，可以查看部署记录，点击 View 按钮，可以看到部署的进度和状态。

可以看到，拉取远程构建好的镜像到 Dokploy 部署的方式，只花了十几秒就完成了部署，非常快速。

至此，我们已经完成了通过 Dokploy 部署 ShipAny 项目的流程。接下来，可以通过 绑定自定义域名、设置环境变量、配置访问统计 等操作，让新项目正式上线运营。

进入项目的 Domains 页面，点击 Add Domain 按钮，添加自定义域名。

输入你想绑定的自定义域名，可以是根域名，也可以是子域名。部署路径使用根目录，容器端口使用默认的 3000。 开启 HTTPS 选项，让 Dokploy 自动为你的域名生成 SSL 证书。点击 Create 按钮，添加自定义域名。

登录你的域名服务商的 DNS 解析页面，为你添加的域名配置一条 A 记录，解析到 Dokploy 部署面板所在的服务器 IP 地址。

请注意：Dokploy 部署面板所在服务器的 IP 地址必须可公网访问。调整防火墙，开启 80、443、3000 等端口的访问。

等 DNS 解析生效（一般半小时内生效，最多可能需要 48 小时），在浏览器访问你的自定义域名，就可以预览项目了。

在项目正式上线运行前，请修改环境变量，确保项目在线上运行时，使用正确的配置。

先在本地项目根目录下设置 .env.production 文件，填入项目在线上运行的配置，NEXT_PUBLIC_APP_URL 填入上一步添加的自定义域名。

进入 Dokploy 项目的 Environment 标签页，粘贴本地 .env.production 文件中的环境变量内容，点击 Save 按钮，设置环境变量。

进入 Dokploy 项目的 General 标签页，点击 Reload 按钮，重载应用，加载最新设置的环境变量。

再次访问你的自定义域名，新版本已经使用了最新设置的环境变量内容。

Plausible 是一套开源的访问统计系统。你可以通过 Dokploy 面板一键安装 Plausible，搭建自己的访问统计系统。

等 Plausible 安装完成后，点击 Domains 标签页，可以看到 Dokploy 默认分配的域名，类似：xxx.traefik.me。你可以直接使用默认分配的域名做访问统计，也可以添加自己的域名。

Service Name 选择 plausible，容器端口填写 8000，勾选启用 HTTPS 选项，点击 Create 按钮，绑定自定义域名。

同样需要去域名服务商做 DNS 解析，为自定义域名添加一条 A 记录，解析到 Dokploy 部署面板所在的服务器 IP 地址。

进入 Environment 标签页，修改 BASE_URL，改成你的自定义域名，另外两个参数保持默认。

进入 Plausible 应用的 General 标签页，点击 Reload 按钮，重载应用，加载最新设置的环境变量。

通过自定义域名访问 Plausible 应用，设置管理员账号和登录密码。

至此，在 Dokploy 面板已成功安装 Plausible 访问统计系统，接下来就可以添加网站做访问统计了。

通过自定义域名访问 Plausible 应用，点击 Add website 按钮，添加你要统计的网站域名。

按照指示一直往下走，最后会提示你在你的网站添加一段这样的脚本：

登录你的 ShipAny 项目管理后台，在 Settings -> Analytics 页面，找到 Plausible 面板，填入上一步 data-domain 和 src 的值，点击 Save 按钮，配置 Plausible 访问统计。

配置完成后，等项目正式上线运营后，你就可以在 Plausible 系统后台看到项目的访问统计数据了。

部署到 Cloudflare Workers

**Examples:**

Example 1 (unknown):
```unknown
curl -sSL https://dokploy.com/install.sh | sh
```

Example 2 (unknown):
```unknown
docker build -t my-shipany-project .
```

Example 3 (json):
```json
docker run -p 8080:3000 my-shipany-project:latest
```

Example 4 (yaml):
```yaml
on:
  push:
    branches: ['main']
  pull_request:
    branches: ['main']
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  SVR_NAME: ${{ github.event.repository.name }}
```

---

## 可视化配置

**URL:** https://shipany.ai/zh/docs/config/admin-settings

**Contents:**
- 可视化配置
- 快速开始
- 配置项
  - 通用项
  - 登录鉴权
  - 支付
  - 邮件
  - 存储
  - AI
  - 数据统计

ShipAny 支持通过管理后台可视化修改项目中用到的配置项。

登录项目管理后台，进入 Admin -> Settings 面板，找到对应的配置项，填入配置值，即可动态更新项目配置。

支持在项目管理后台可视化修改的配置项，分为以下几大部分。

系统初始化后，默认开启邮箱登录，你可以在配置其他登录方式后，可选择关闭邮箱登录。

---

## 常见问题解答

**URL:** https://shipany.ai/zh/docs/guide/faq

**Contents:**
- 常见问题解答
- ShipAny Two 跟 ShipAny One 有什么区别？
- ShipAny Two 需要单独购买吗？
- ShipAny 模板如何激活？
- 如何开始使用 ShipAny Two？
- 如何获得技术支持？
- 购买的模板可以退款吗？
- ShipAny Two 代码仓库不能 fork 吗？
- 如何同步 ShipAny Two 的更新？
- 如何更新数据库表结构？

ShipAny Two 是 ShipAny 的第二个版本，相比于 ShipAny One，在架构设计、功能丰富度、性能优化等方面都有很大提升。 包括以下几个方面：

更多内容可以查阅 ShipAny Two 系统架构。

在 个人中心 -> 活动 -> 已购模板 查看是否有 ShipAny Two 模板，如果没有，参考下面的流程购买。

原有 ShipAny 高级版用户在 ShipAny Two 模板详情页 支付 0 元购买，再绑定 Github 用户名激活。

新用户在 定价页面 购买 ShipAny 高级版，自动获得 ShipAny Two 模板，再绑定 Github 用户名激活。

在 个人中心 -> 活动 -> 已购模板 查看已购买模板，如果是未激活状态，可以点击 "激活" 按钮，在激活页面输入你的 Github 用户名，提交激活。

请注意，一定要填写你的 Github 用户名，而不是邮箱。在浏览器访问：github.com/your-github-username，确保能进入你的 Github 个人主页，在激活页面填入 your-github-username 提交激活。

如果模板已激活，但是 Github 邀请过期了。可以选择已购买模板右侧的下拉菜单，点击 重新激活 按钮，在激活页面重新提交激活。这种情况，不能修改 Github 用户名，只能重新发送 Github 邀请。

参考 获取 ShipAny 获得 ShipAny Two 代码仓库访问权限。

参考 快速开始 使用 ShipAny Two 启动你的项目。

环境配置、Next.js、React 等常规问题，建议优先通过搜索 + AI 问答等方式自行解决。ShipAny 框架相关问题，可在代码仓库提 issue 或在 Discord 交流。

在 个人中心 -> 活动 -> 已购模板 查看已购买模板，如果是未激活状态，可以申请退款。

私有仓库，不支持 fork。你需要创建自己的 Github 私有仓库，保存你的项目代码。

比如，你在 Github 创建了一个私有仓库来保存你的项目代码，仓库地址是：github.com/idoubi/my-shipany-project

你可以按需更新 ShipAny Two 最新代码，如果上游代码跟你的项目代码有冲突，你需要手动解决冲突。

如果上游代码改动较大，请谨慎同步。可以使用 cherry-pick 命令，只同步你需要的变更。

每次同步完上游代码，记得更新一下数据表结构，确保你的项目能同步上游的数据表变更。

**Examples:**

Example 1 (python):
```python
git clone git@github.com:shipanyai/shipany-template-two my-shipany-project
```

Example 2 (markdown):
```markdown
# 进入项目根目录
cd my-shipany-project
# 修改代码托管地址
git remote set-url origin git@github.com:idoubi/my-shipany-project.git
# 推送代码
git push origin main
```

Example 3 (python):
```python
git remote add upstream git@github.com:shipanyai/shipany-template-two.git
```

Example 4 (markdown):
```markdown
# 拉取上游仓库的更新
git fetch upstream
# 合并上游仓库的更新
git merge upstream/main
# 推送代码到你的私有 Github 仓库
git push origin main
```

---

## 自定义多语言

**URL:** https://shipany.ai/zh/docs/customize/locale

**Contents:**
- 自定义多语言
- 设置多语言切换
- 设置默认显示的语言
- 自定义多语言页面

ShipAny 基于 next-intl 实现多语言系统。

你可以参考以下内容，为你的项目自定义多语言展示。

在 src/config/locale/index.ts 配置文件中，设置项目支持显示的语言。

你可以根据需求，自行添加或删除支持显示的语言。

在 src/config/locale/messages/{locale}/landing.json 文件中，通过 header 区块和 footer 区块的 show_locale 字段，控制是否显示语言切换按钮。

注意：请根据启用的语言列表，修改每种语言对应的 src/config/locale/messages/{locale}/ 文件夹里面的配置内容，确保每种语言的页面内容都能正常显示。

如果项目第一版上线，不需要支持多语言，可以设置：

并把 src/config/locale/messages/en/landing.json 文件中的 show_locale 字段设置为 false。

项目默认显示的语言是英文，如果你希望默认显示其他语言，比如中文，可以通过环境变量来配置默认语言。

默认语言访问，不会在 URL 中显示对应的语言代码。非默认语言访问，会在 URL 中显示对应的语言代码。

比如按照上述配置，访问中文价格表，路由是：/pricing，访问英文价格表，路由是：/en/pricing。

比如你希望在项目中新增一个 /about 页面，并支持多语言展示。

在 src/config/locale/messages/{locale} 文件夹下面，创建对应的页面文件，支持二级目录。

比如新建英文显示的页面文件：src/config/locale/messages/en/pages/about.json。

注意：根据配置的语言列表，为每种语言都创建对应的页面文件。

在 src/config/locale/index.ts 文件导出的 localeMessagesPaths 数组中，添加新创建的多语言文件：

在 src/app/[locale] 文件夹下面，创建支持多语言访问的页面路由文件。

比如 /about 页面对应的路由文件是：src/app/[locale]/about/page.tsx。

注意：如果你希望复用着陆页的布局，创建的页面路由文件应该是： src/app/[locale]/(landing)/about/page.tsx。

访问 /about 页面时，看到的效果如下：

**Examples:**

Example 1 (typescript):
```typescript
export const localeNames: any = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

export const locales = ['en', 'zh', 'ja'];
```

Example 2 (typescript):
```typescript
export const localeNames: any = {
  en: 'English',
};

export const locales = ['en'];
```

Example 3 (unknown):
```unknown
NEXT_PUBLIC_DEFAULT_LOCALE = "zh"
```

Example 4 (json):
```json
{
  "metadata": {
    "title": "About",
    "description": "Nano Banana Pro is an AI image generator based on the Nano Banana Pro model, powered by Gemini 3 Pro image generation technology. Create stunning images with advanced AI capabilities."
  }
}
```

---

## 访问统计

**URL:** https://shipany.ai/zh/docs/analytics

**Contents:**
- 访问统计

---

## Stripe

**URL:** https://shipany.ai/zh/docs/payment/stripe

**Contents:**
- Stripe
- 接入 Stripe 支付
- 设计价格表
- 配置支付回调
- 配置支付通知
- 本地调试支付通知
- 自定义支付选项
  - 多币种支付
  - 微信 / 支付宝 支付

ShipAny 集成了 Stripe 作为支付服务供应商，只需简单配置即可接入使用。

按照以下步骤为你的项目接入 Stripe 支付。

参考 Stripe 商家入驻指南 开通 Stripe 商户。

你可以以个人身份或企业身份开通 Stripe 商户，绑定你的提现账户，设置商户基本信息。

在 Stripe 管理后台进入你的商户页面，依次选择 Developers -> API keys -> Standard keys -> Create secret key 创建 API 密钥。

复制得到 Publishable key 和 Secret key。

注意：Secret key 仅在创建时可以复制，为敏感信息，谨防泄露。

你可以在 Stripe 控制台左上角切换商户的地方，依次点击 Switch to sanbox -> Test mode 进入测试环境，创建测试用的 API 密钥。

在项目管理后台，进入 Settings -> Payment -> Stripe 面板，在 Stripe Publishable Key 和 Stripe Secret Key 字段分别填入上一步设置的 Publishable key 和 Secret key。

Stripe Signing Secret 是验证支付通知的签名密钥，可以先留空，等在后续步骤配置了支付通知后再填入。

注意：本地开发时，你可以填入上一步设置的测试 API 密钥，等部署上线时，再填入正式的 API 密钥。

访问项目的 /pricing 页面，查看默认的价格表，选择一个价格方案，点击下单按钮。

如果能正常跳转到 Stripe 支付页面，说明支付配置成功。

如果上一步填入的是测试 API 密钥，可以复制一个 Stripe 测试卡号 进行支付验证。

默认的价格表配置在 src/config/locale/messages/{locale}/pages/pricing.json 文件中，支持多语言，每个 locale 对应一个独立的价格表配置。

pricing.groups 字段定义了价格方案分组，默认值如下

pricing.items 字段定义了价格方案列表，默认的其中一个价格方案数据结构如下：

请根据你的项目需求，参考默认的价格表配置，修改对应的字段内容，设计价格表。

注意：如果你的项目支持多语言，请修改每个 locale 对应的价格表配置。

选择价格方案后，请求下单的接口是 /api/payment/checkout，请求参数示例：

注意：修改完价格表配置后，访问 /pricing 页面查看新的价格表。选择一个价格方案下单，支付成功后，在 /settings/payments 页面查看支付记录，检查支付金额、币种、付费周期，是否与配置的价格方案一致。 在 /settings/credits 页面查看积分发放记录，检查积分数量、过期时间（支付时间 + 有效天数），是否与配置的价格方案一致。

用户在价格表页面选择价格方案下单成功后，会跳转到 Stripe 支付页面，支付成功后，会跳转到项目的回调接口：/api/payment/callback。

在回调接口中，会根据订单号更新订单状态，再跳转到配置的 callbackUrl。

这个配置的 callbackUrl 是在下单接口：/api/payment/checkout 中指定的：

按照默认配置，如果是一次性支付，最终会跳转到 /settings/payments 页面；如果是订阅支付，最终会跳转到 /settings/billing 页面。

你可以根据项目需求，自行修改用户支付完成后的跳转地址。

注意：支付回调是同步跳转的，如果用户在 Stripe 支付页面确认支付，在页面跳转前关闭了浏览器，未能正常跳转到项目回调接口，订单状态无法更新，用户在个人中心无法看到已支付的订单。此类情况叫做：丢单。

为了避免支付回调的 丢单 情况，建议项目上线运营时，在 Stripe 后台配置支付通知。

在 Stripe 商户后台，进入 Developers -> Webhooks 页面，点击 Add destination 按钮，添加支付通知地址。

Events from 选择 Your account

API version 选择 2025-10-29.clover，这是目前调试过的最新版本。

Events 通过关键词搜索过滤，勾选以下几项：

Destination type 选择 Webhook endpoint

Destination name 输入配置名称，给自己看的，随便填。

Endpoint URL 输入接收通知的地址。必须是可以公网访问的 https 地址。格式为：

把 {your-domain.com} 替换为你的项目域名，可以是根域名，也可以是子域名。

填写完配置后，点击 Create destination 按钮，添加支付通知地址。

创建完支付通知地址后，会自动跳转到支付通知地址的详情页面，点击 Signing secret 下方的复制图标，复制 whsec_ 开头的支付通知的签名密钥。

在项目管理后台，进入 Settings -> Payment -> Stripe 面板，在 Stripe Signing Secret 字段填入上一步复制的支付通知签名密钥。

在上一步配置支付通知时，填写的 Endpoint URL 必须是一个可以公网访问的 https 地址。

项目部署上线前，需要先在本地调试，接收支付通知内容，进行必要的修改和验证。

通过 内网穿透，可以把一个公网地址映射到本地开发机，下面的步骤主要演示使用 ngrok 实现 内网穿透。

访问 ngrok 官网，注册账号，登录管理后台。

在管理后台的 Setup & Instalation 页面，选择你的操作系统类型，按照指示步骤安装 ngrok 命令行工具。

执行以下命令，在指定端口启动项目的开发服务器。

回到 配置支付通知 步骤，复制 ngrok 的代理地址，填入 Endpoint URL。

注意：每次执行 ngrok http {port} 命令，都会生成一个新的代理地址，需要在 Stripe 后台重新配置 Endpoint URL。请确保仅在开发调试时配置，不要在线上环境使用 ngrok 的代理地址。

在按照以上步骤配置支付通知后，在价格表页面选择一个价格方案下单，就可以在本地接收 Stripe 的支付通知了。

默认的支付通知处理逻辑在 src/app/api/payment/notify/[provider]/route.ts 文件中。你可以根据项目需求，自行修改相应的逻辑。

你可以根据项目需求，根据以下列举的例子，自定义支付选项。

设计价格表 时，在价格方案中使用 currency 字段指定下单的币种。比如 原价 199 美元，标价 99 美元，对应的价格方案配置是：

如果要在价格表页面，允许用户选择不同的币种下单，可以参考以下配置：

配置之后，可以看到价格方案多了一个切换币种的选项。价格方案配置中，外层的 currency 是默认币种，currencies 里面的 currency 是可切换的币种。

注意：currency 字段不区分大小写，amount 单位是：分。

按照以下步骤，在你的项目启用 微信 / 支付宝 支付。

在 Stripe 商户后台，进入 Settings -> Payments -> Payment methods -> Default，申请开通 WeChat Pay 和 Alipay。需要提交审核，等审批通过后才能启用。

如果要支持 微信 / 支付宝 支付，在价格方案配置中，currency 字段必须是 cny。

默认美元下单，允许切换人民币支付，配置参考：

在修改完价格方案配置后，需要在管理后台，调整 Stripe Payment Methods 的配置。

勾选你希望用户进入 Stripe 支付页面看到的支付选项。

比如，只允许用户使用微信支付，就勾选 Wechat Pay，取消勾选 Card 和 Alipay

注意：此处勾选的支付方式，必须在 Stripe 商户后台是 Enabled 状态，否则下单会报错。

**Examples:**

Example 1 (json):
```json
{
  "pricing": {
    "groups": [
      {
        "name": "one-time",
        "title": "Pay as you go"
      },
      {
        "name": "monthly",
        "title": "Monthly",
        "is_featured": true,
        "label": "save 15%"
      },
      {
        "name": "yearly",
        "title": "Annually"
      }
    ]
  }
}
```

Example 2 (json):
```json
{
  "pricing": {
    "items": [
      {
        "title": "Starter",
        "description": "Get started with your first SaaS startup.",
        "features_title": "Includes",
        "features": [
          "100 credits, valid for 1 month",
          "NextJS boilerplate",
          "SEO-friendly structure",
          "Payment with Stripe",
          "Data storage with Supabase",
          "Google Oauth & One-Tap Login",
          "i18n support"
        ],
        "interval": "one-time",
        "amount": 9900,
        "currency": "USD",
        "price": "$99",
        "original_price": "$199",
        "unit": "",
        "is_featured": false,
        "tip": "Pay once. Build unlimited projects!",
        "button": {
          "title": "Get ShipAny",
          "url": "/#pricing",
          "icon": "RiFlashlightFill"
        },
        "product_id": "starter",
        "product_name": "ShipAny Boilerplate Starter",
        "credits": 100,
        "valid_days": 30,
        "group": "one-time"
      }
    ]
  }
}
```

Example 3 (json):
```json
{
  "product_id": "starter",
  "currency": "USD",
  "locale": "en",
  "payment_provider": "stripe",
  "metadata": {}
}
```

Example 4 (javascript):
```javascript
const callbackUrl =
  paymentType === PaymentType.SUBSCRIPTION
    ? `${callbackBaseUrl}/settings/billing`
    : `${callbackBaseUrl}/settings/payments`;
```

---

## Google Analytics

**URL:** https://shipany.ai/zh/docs/analytics/ga

**Contents:**
- Google Analytics
- 快速开始

ShipAny 集成了 Google Analytics 作为访问统计服务提供商，只需简单配置即可接入使用。

参考以下步骤，在你的项目快速接入 Google Analytics 访问统计服务。

访问 Google Analytics 官网，注册一个账户。

在 Google Analytics 控制台，进入 Admin 页面，点击 Create -> Property 按钮，按照指示输入属性名称和你的网站域名，进入到 Set up a Google tag 页面。

在项目管理后台，进入 Settings -> Analytics 页面，找到 Google Analytics 面板，在 Google Analytics ID 字段填入上一步复制的属性 ID，点击 Save 按钮。

回到 Google Analytics 控制台的 Set up a Google tag 页面，点击 Test installation 按钮，验证 Google Analytics 接入是否成功。

配置完成后，等项目正式上线运营后，你就可以在 Google Analytics 控制台看到项目的访问统计数据了。

---

## 前置要求

**URL:** https://shipany.ai/zh/docs/guide/prerequisites

**Contents:**
- 前置要求
- 网络环境畅通
- 搭建本地开发环境
- AI 辅助编程工具
- 其他工具

为确保你能顺利使用 ShipAny 开发项目，请确保完成以下前置要求。

请确保你的网络环境可以正常访问 Github、Google 等第三方服务。

可以在终端执行以下命令，查看你的网络出口 ip：

如果网络环境不佳，可能会导致无法正常安装项目必须的 npm 依赖，无法连接云数据库、无法使用 AI 生成图片等功能。

请根据你的操作系统，搭建本地开发环境，安装必要的开发工具。以 Mac OS 为例：

推荐使用以下或更高版本的 NodeJS 和 npm：

为了更好地理解 ShipAny 框架，更高效地开发项目，推荐使用以下 AI 工具辅助开发

在 AI 编辑器中安装以下插件，可以更好地辅助开发：

**Examples:**

Example 1 (unknown):
```unknown
curl https://ipinfo.io
```

Example 2 (unknown):
```unknown
curl https://google.com
```

Example 3 (unknown):
```unknown
$ node -v
v22.2.0

$ npm -v
10.7.0
```

Example 4 (unknown):
```unknown
$ npm install -g pnpm
```

---

## Supabase

**URL:** https://shipany.ai/zh/docs/database/supabase

**Contents:**
- Supabase
- 快速开始
- 自定义
  - 修改数据表
  - 修改数据库连接
  - 部署到 Cloudflare Workers
  - 通过 Schema 隔离数据
- 参考

Supabase 是一个以 PostgreSQL 为核心的云数据库开发平台，它围绕 PostgreSQL 构建，提供包括数据库、身份认证、实时订阅、文件存储和边缘函数等后端服务，并通过 RESTful 和 GraphQL API 将 PostgreSQL 的能力暴露给开发者，无需自己搭建后端服务。

在 ShipAny 项目中，你可以使用 Supabase 来存储和管理你的数据。

你可以按照以下步骤，在 ShipAny 项目中接入 Supabase。

访问 Supabase 官网，注册一个 Supabase 账号。.

进入 Supabase 控制台，创建一个项目。

输入项目名称，点击 Generate a password，生成随机密码，点击 Copy 按钮，复制密码。

进入上一步创建的项目管理页面，点击顶部的 Connect 按钮，切换到 ORMs -> Drizzle 标签页，复制 DATABASE_URL 的值。

把 [YOUR-PASSWORD] 替换成上一步生成的随机密码，得到 Supabase 项目的 DATABASE_URL。类似这种：

使用 psql 工具，测试数据库是否能正常连接。

请自行搜索 psql 工具的安装方法。一般情况，在本地安装 PostgreSQL 后，会自带 psql 工具。

复制上一步设置的数据库 DATABASE_URL。

在项目的环境变量文件中，填入 Supabase 数据库相关的配置。

使用 Supabase 数据库时，数据表结构定义在 ./src/config/db/schema.postgres.ts 文件中，你需要导出这个文件的数据表。

打开 ./src/config/db/schema.ts 文件，修改内容为：

你可以在 Supabase 控制台 管理数据库，也可以在本地执行命令:

如果你需要新增数据表，或者修改数据表字段，可以打开 ./src/config/db/schema.postgres.ts 文件，修改数据表结构。

如果你需要修改数据表连接参数，比如配置自定义选项、连接池等，可以修改 ./src/core/db/postgres.ts 文件中的逻辑。

在进行数据操作时，默认使用的是 ./src/core/db/index.ts 导出的 db() 对象，导出类型是 any，在某些情况下，可能会缺乏类型提示。

如果你希望使用强类型的数据库对象，可以在操作数据时，使用以下方式获取数据库对象：

Supabase 数据库支持部署到 Cloudflare Workers，也支持使用 Hyperdrive 加速数据库访问。

使用 Hyperdrive 加速数据库访问的配置参考：配置 Hyperdrive。

在 Cloudflare Workers 部署项目使用 Supabase 数据库的 wrangler.toml 部分内容参考：

Supabase 每新建一个项目，需要额外支付 10 美金/月的基础费用。如果你的项目比较多，可以考虑复用同一个 Supabase 项目，通过 Schema 隔离数据。

Supabase 使用 public 作为默认 Schema。在同一个 Supabase 项目中，可以创建多个 Schema，来存储多个不同项目的数据。

进入 Supabase 项目的 Table Editor 页面，点击 schema 下拉框，点击 Create a new schema，输入 Schema name 创建自定义 Schema。

比如这里创建一个名为 project_2 的 Schema。

在新项目的环境变量文件中，填入 Supabase 数据库相关的配置。

你可以在 Supabase 控制台 ，切换到新项目的 Schema，管理数据表。

打开数据库管理面板，切换到新项目的 Schema，管理数据表。

**Examples:**

Example 1 (yaml):
```yaml
postgresql://postgres.seilzcqsafesmugglqlk:xxxxxx@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
```

Example 2 (python):
```python
psql "postgresql://postgres.seilzcqsafesmugglqlk:xxxxxx@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

Example 3 (unknown):
```unknown
DATABASE_PROVIDER = "postgresql"
DATABASE_URL = "supabase-database-url"
DB_SCHEMA_FILE = "./src/config/db/schema.postgres.ts"
DB_MIGRATIONS_OUT = "./src/config/db/migrations"
```

Example 4 (sql):
```sql
export * from './schema.postgres';
```

---

## 介绍

**URL:** https://shipany.ai/zh/docs/

**Contents:**
- 介绍
- 什么是 ShipAny?
- ShipAny Two

ShipAny 是一个基于 NextJS 的 AI SaaS 开发框架，内置丰富的组件和业务功能，帮助你快速发布自己的产品。

当前文档针对的是 ShipAny Two 的使用说明，ShipAny One 的使用说明请参考 ShipAny One 文档。

ShipAny Two 是 ShipAny 的第二个版本，功能极其丰富，包括以下几部分：

支持 stripe / creem / paypal

支持 cloudflare r2 / aws s3

支持 openrouter / replicate / fal / kie

支持 google analytics / clarity / plausible / openpanel / vercel analytics

支持 affonso / promotekit

---

## 环境变量

**URL:** https://shipany.ai/zh/docs/config/env-variables

**Contents:**
- 环境变量
- 覆盖可视化配置项
- 设置自定义配置项
- 使用 envConfigs

ShipAny 支持通过环境变量来配置项目中的各种功能。

ShipAny 支持通过项目管理后台可视化修改项目中的配置项。但是此功能依赖数据库。

在未配置数据库的情况下，你可以通过环境变量来覆盖可视化配置项。

比如，项目上线的第一个版本，你只做了着陆页，暂未配置数据库，但是希望通过 Plausible 统计访问量，你可以参考如下步骤进行配置。

通过可视化配置的 配置项 介绍，找到 Plausible 统计对应的配置项变量。

修改环境变量配置文件，填写对应的配置项变量值。

配置变量可以是全大写，或者全小写。比如也可以配置成这样：

可视化配置中列举的所有配置项变量，都支持通过环境变量进行增量覆盖。

除了 ShipAny 内置的配置项，你也可以通过环境变量设置自定义配置项。

在环境变量文件中，可以设置以下格式的配置项：

在项目逻辑中，通过 process.env 读取配置项。

NEXT_PUBLIC_ 开头的配置项，可以在客户端和服务端组件中访问。非 NEXT_PUBLIC_ 开头的配置项，只能在服务端组件访问。

在线上环境运行项目时，如果修改了环境变量中的配置项的值，一般需要重启项目，新的配置项才会生效。

ShipAny 在 src/config/index.ts 文件中，定义了 envConfigs 对象，内置了常用的几个配置项。

你可以在项目逻辑中，通过 envConfigs 对象读取这些配置项。

非 NEXT_PUBLIC_ 开头的配置项，只能在服务端组件访问。

你可以把在环境变量文件中定义的配置项，设置到 envConfigs 对象中，方便在项目逻辑中读取。

在 src/config/index.ts 文件中，设置 envConfigs 配置项：

同样，在环境变量文件中设置的配置项，配置到 envConfigs 对象中后，也需要重启项目后才会生效。

**Examples:**

Example 1 (markdown):
```markdown
# plausible
plausible_domain = "my-project.com"
plausible_src = "https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
```

Example 2 (markdown):
```markdown
# plausible
PLAUSIBLE_DOMAIN = "my-project.com"
PLAUSIBLE_SRC = "https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
```

Example 3 (markdown):
```markdown
# api settings
NEXT_PUBLIC_API_BASE_URL = "https://api.my-product.com"
API_KEY = "xxxxxx"
```

Example 4 (javascript):
```javascript
export async function GET() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.API_KEY;

  return new Response(`API Base URL: ${apiBaseUrl}, API Key: ${apiKey}`);
}
```

---

## 系统架构

**URL:** https://shipany.ai/zh/docs/guide/architecture

**Contents:**
- 系统架构
- 1. 核心系统（app）
- 2. 核心模块（core）
- 3. 扩展模块（extensions）
- 4. 主题系统（themes）
- 5. 配置系统（config）
- 6. 内容管理系统（cms）

ShipAny Two 基于最新的 Next.js 16，在编译性能方面有很大提升，本地开发更快、内存占用更小。

在框架设计层面，分为核心系统、核心模块、扩展模块、主题系统、配置系统、内容管理系统六大件。

ShipAny Two 内置 Landing、Admin、User Console 三套核心系统，对应三套独立的页面布局，用于实现网站着陆页、后台管理、用户中心三类常见业务功能。

通过 json 文件控制页面内容，方便 AI 修改，支持多语言；页面按区块（blocks）拆分，可自由组装，灵活度高；通过 theme.css 调整配色和字体，个性化程度高

集成用户管理、订单管理、积分管理功能；集成配置中心，可视化开启/关闭各类功能；集成 CURD 操作，通过自定义的 PageBuilder 做到几行代码渲染数据管理页面（table、form）

用户在 Settings 面板管理自己的账单、订阅、支付、积分流水，修改头像昵称；用户在 Activity 面板查看AI 生成任务和 AI 对话记录

三套核心系统在 src/app 目录实现，按功能划分文件夹，开发者很容易新增自己的功能。

ShipAny 把框架全局支持的功能归为核心模块，包括 db、auth、i18n、rbac 几类

基于 drizzle orm 集成数据库功能，支持 postgres、mysql、sqlite 等数据库类型；通过 schema 定义数据表，支持增量迁移；CURD 数据操作层面用同一套 sql 语法，抹平各类数据库的差异

基于 better-auth 实现登录鉴权功能，可以在管理后台一键开启常用的登录方式

基于权限的管理控制，通过自定义的角色和权限节点控制后台管理系统的访问

基于 next-intl 实现国际化功能，通过 json 文件控制多语言显示

ShipAny 的核心模块定义在 src/core 下面

ShipAny 利用 extensions 支持可插拔架构，每一类扩展定义一个统一的 interface，每个扩展按接口实现具体的功能逻辑。目前支持的 extensions 包括

联盟营销。集成 affonso、promotekit

AI 供应商。集成 OpenRouter、Fal、Replicate、Kie

数据统计。集成 ga、clarity、plausible、open-panel、vercel-analytics

支付。集成 Stripe、Creem、PayPal

存储。集成 aws s3，cloudflare r2

ShipAny 的扩展模块定义在 src/extentions 目录下，每一类扩展要新增一个选项，只需要写很少的代码

ShipAny 支持多主题系统，让开发者可以自定义主题实现个性化的页面展示。

主题系统定义在 src/themes 下面

组合管理配置项，实现低代码的功能，不是很懂代码的用户也能方便地使用 ShipAny

ShipAny 实现的内容管理系统包括三个层面的内容管理

通过管理后台写入博客内容，也可以在 content/posts 目录用 markdown 写博客。博客可以给你的网站增加 SEO 权重，也能通过 guest post 接商单。

基于 fumadocs 实现文档系统，在 content/docs 目录写内容，几分钟为你的网站渲染一个 /docs 文档

在 content/pages 目录写内容动态创建页面，比如常用的网站协议页面 /privacy-policy 和/terms-of-service

---

## Turso

**URL:** https://shipany.ai/zh/docs/database/turso

**Contents:**
- Turso
- 快速开始
- 自定义
  - 修改数据表
  - 修改数据库连接
  - 部署到 Cloudflare Workers
- 参考

Turso 定位是“小而强”的边缘数据库，百分百兼容 SQLite语法，并发读写性能远高于传统 SQLite，主打 AI 应用、嵌入式和 Serverless 场景。

ShipAny 已集成 Turso，按照下面的步骤快速接入。

注册 Turso Cloud 账号，登录管理后台，点击 Create Database 按钮，创建一个数据库。

进入上一步创建的数据库，点击 Create Token 按钮，创建一个过期时间为 Nerver，有 Read & Write 权限的 Token。

复制上一步设置的数据库 Database URL 和 Token。

在项目的环境变量文件中，填入 Turso 数据库相关的配置。

使用 Turso 数据库时，数据表结构定义在 ./src/config/db/schema.sqlite.ts 文件中，你需要导出这个文件的数据表。

打开 ./src/config/db/schema.ts 文件，修改内容为：

你可以在 Turso Cloud 管理数据库，也可以在本地执行命令:

如果你需要新增数据表，或者修改数据表字段，可以打开 ./src/config/db/schema.sqlite.ts 文件，修改数据表结构。

如果你需要修改数据表连接参数，比如配置自定义选项、连接池等，可以修改 ./src/core/db/sqlite.ts 文件中的逻辑。

在进行数据操作时，默认使用的是 ./src/core/db/index.ts 导出的 db() 对象，导出类型是 any，在某些情况下，可能会缺乏类型提示。

如果你希望使用强类型的数据库对象，可以在操作数据时，使用以下方式获取数据库对象：

Turso 数据库支持部署到 Cloudflare Workers，但是不支持使用 Hyperdrive 加速数据库访问。

Hyperdrive 目前只面向基于 TCP 的关系型数据库连接池/代理（典型是 Postgres / MySQL 这类），不是给 SQLite/libSQL 这种协议用的。

所以在 Cloudflare Workers 上部署时，只需要填 Turso Cloud 的配置信息即可，无需配置 Hyperdrive。

在 Cloudflare Workers 部署的 wrangler.toml 部分内容参考：

**Examples:**

Example 1 (unknown):
```unknown
DATABASE_PROVIDER = "turso"
DATABASE_URL = "turso-database-url"
DATABASE_AUTH_TOKEN = "turso-auth-token"
DB_SCHEMA_FILE = "./src/config/db/schema.sqlite.ts"
DB_MIGRATIONS_OUT = "./src/config/db/migrations_turso"
```

Example 2 (sql):
```sql
export * from './schema.sqlite';
```

Example 3 (unknown):
```unknown
pnpm db:generate
pnpm db:migrate
```

Example 4 (unknown):
```unknown
pnpm db:studio
```

---

## 氛围编程

**URL:** https://shipany.ai/zh/docs/vibe-coding

**Contents:**
- 氛围编程

---

## SQLite

**URL:** https://shipany.ai/zh/docs/database/sqlite

**Contents:**
- SQLite
- 快速开始
- 自定义
  - 修改数据表
  - 修改数据库连接
  - 部署到 Cloudflare Workers
- 参考

ShipAny 支持 SQLite 数据库。按照以下步骤快速开始。

根据你的操作系统类型，自行搜索安装 SQLite，安装完成后，通过命令行创建数据库文件：

你也可以跳过这一步，在项目中配置 SQLite 后，执行数据表迁移命令时，会自动创建数据库文件。

在项目的环境变量文件中，填入 SQLite 数据库相关的配置。

使用 SQLite 数据库时，数据表结构定义在 ./src/config/db/schema.sqlite.ts 文件中，你需要导出这个文件的数据表。

打开 ./src/config/db/schema.ts 文件，修改内容为：

如果你需要新增数据表，或者修改数据表字段，可以打开 ./src/config/db/schema.sqlite.ts 文件，修改数据表结构。

如果你需要修改数据表连接参数，比如配置自定义选项、连接池等，可以修改 ./src/core/db/sqlite.ts 文件中的逻辑。

在进行数据操作时，默认使用的是 ./src/core/db/index.ts 导出的 db() 对象，导出类型是 any，在某些情况下，可能会缺乏类型提示。

如果你希望使用强类型的数据库对象，可以在操作数据时，使用以下方式获取数据库对象：

使用 Cloudflare Workers 部署项目时，暂不支持使用 SQLite 数据库。

你可以使用 Turso 等兼容 SQLite 的数据库服务。

**Examples:**

Example 1 (unknown):
```unknown
sqlite3 data/local.db
```

Example 2 (unknown):
```unknown
DATABASE_PROVIDER = "sqlite"
DATABASE_URL = "file:data/local.db"
DB_SCHEMA_FILE = "./src/config/db/schema.sqlite.ts"
DB_MIGRATIONS_OUT = "./src/config/db/migrations_sqlite"
```

Example 3 (sql):
```sql
export * from './schema.sqlite';
```

Example 4 (unknown):
```unknown
pnpm db:generate
pnpm db:migrate
```

---

## MCP

**URL:** https://shipany.ai/zh/docs/vibe-coding/mcp

**Contents:**
- MCP
- 挂载文档
  - Ref MCP
  - Context7 MCP

ShipAny 支持 MCP 实现 氛围编程。

以下介绍在 ShipAny 项目中使用 MCP 服务器的主要场景。

在基于 ShipAny 开发项目时，经常需要查询 ShipAny 开发文档，引导 Coding Agent 快速实现相应的功能。

ShipAny Two 的在线文档地址是：https://shipany.ai/zh/docs

在开发项目时，你可以打开文档中某部分内容，把链接贴给 Coding Agent，让 Coding Agent 快速了解相关知识，辅助你完成开发任务。

ShipAny Two 的文档在 Github 开源，仓库地址是：https://github.com/shipanyai/shipany-two-docs

你也可以把整个文档项目拉到本地，在开发项目时，提示 Coding Agent 扫描文档项目，辅助你完成开发任务。

另外，你也可以使用 MCP 服务器挂载 ShipAny 开发文档。推荐使用 Ref MCP 和 Context7 MCP。

进入 Ref API Keys 页面，生成你的 API Key。

在 Ref Install 页面，选择一种方式，在你使用的 AI 应用中安装 Ref MCP。

比如在 Cursor 安装 Ref MCP 后，实际填入的 MCP 服务器配置是：

在开发项目时，提示 Coding Agent 使用 Ref MCP，快速了解相应的知识。

可以看到，Coding Agent 通过 Ref MCP 的 ref_search_documentation 工具，查询到了相关的文档链接，

然后多次调用 ref_read_url 工具，读取了相关的文档内容，最终给出了答案。

进入 Context7 Dashboard 页面，点击 Create API Key 按钮，生成你的 API Key。

在 Connect 面板，选择一种方式，在你的 AI 应用中安装 Context7 MCP。

比如在 Cursor 安装 Context7 MCP 后，实际填入的 MCP 服务器配置是：

在开发项目时，提示 Coding Agent 使用 Context7 MCP，快速了解相应的知识。

可以看到，Coding Agent 通过 Context7 MCP 的 resolve-library-id 工具，查询到了相关的文档仓库 ID，

然后多次调用 get-library-docs 工具，读取了相关的文档内容，最终给出了答案。

通过以上两个 MCP 服务器，你可以在开发项目时，随时查询 ShipAny 开发文档，让 Coding Agent 快速了解相应的知识，辅助你完成开发任务。

**Examples:**

Example 1 (python):
```python
git clone git@github.com:shipanyai/shipany-two-docs.git
```

Example 2 (json):
```json
{
  "mcpServers": {
    "Ref": {
      "type": "http",
      "url": "https://api.ref.tools/mcp?apiKey=ref-xxxxxxx",
      "headers": {}
    }
  }
}
```

Example 3 (unknown):
```unknown
Use Ref MCP to check the development documentation of ShipAny,
tell me how to integrate Stripe payment
```

Example 4 (json):
```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "ctx7sk-xxxxxx"
      }
    }
  }
}
```

---

## 静态页面构建

**URL:** https://shipany.ai/zh/docs/page-builder/static-page

**Contents:**
- 静态页面构建
- 默认静态页面
- 新建静态页面

ShipAny 支持静态页面构建，无需编写代码，只需一个 Markdown 文件，即可渲染一个静态页面。

静态页面文件定义在 content/pages 目录，一个文件对应一个页面，支持多语言。

访问路由是：/terms-of-service，对应的文件是 content/pages/terms-of-service.mdx。

访问路由是：/privacy-policy，对应的文件是 content/pages/privacy-policy.mdx。

静态页面展示支持多语言，比如你的项目需要展示中文隐私政策页面，访问路由是：/zh/privacy-policy，则需要创建静态页面文件： content/pages/privacy-policy.zh.mdx。

比如，我们希望创建一个公司介绍页面，访问路由是：/about/company

在 content/pages 目录下，创建 about/company.mdx 文件。

按照 Markdown 格式书写页面内容。文件开头包裹在 --- 里的 title、description、created_at 字段是可选的，用于设置页面标题、描述和创建时间。

访问 /about/company 页面，看到的效果是：

如果你的项目要支持多语言访问静态页面，你需要为每个语言创建对应的静态页面文件。

比如访问 /ja/about/company 页面，对应的静态页面文件是 content/pages/about/company.ja.mdx。

content/pages 是静态页面文件的根目录，在此目录下支持创建多级子目录。比如可以创建 content/pages/foo/bar/abc.mdx 文件，对应的访问路由是：/foo/bar/abc。

**Examples:**

Example 1 (yaml):
```yaml
---
title: ShipAny Company
description: Introduction about our company
created_at: 2025-12-05
---

## Company Introduction

ShipAny is a company that helps our customers build AI SaaS products quickly and easily.

![](/preview.png)
```

---

## 页面构建器

**URL:** https://shipany.ai/zh/docs/page-builder

**Contents:**
- 页面构建器

---

## 自定义主题

**URL:** https://shipany.ai/zh/docs/customize/theme

**Contents:**
- 自定义主题
- 设置主题样式
- 设置外观
- 设置主题文件夹

在 快速开始 文档中，初始化项目并启动开发服务器，在浏览器打开预览地址，可以看到默认的主题页面。

ShipAny 基于 shadcn/ui 实现主题样式切换功能，你可以选择任何一个 shadcn 样式生成器来生成主题样式，自定义 主题配色 和 字体效果，让你的网站项目更加个性化。

推荐使用 tweakcn 作为主题样式生成器。

将主题样式代码，粘贴到 ShipAny 项目的 src/config/style/theme.css 文件中，替换掉默认的样式代码。

再次打开项目预览地址，可以看到新的样式效果。

ShipAny 项目通过 .env* 文件中的 NEXT_PUBLIC_APPEARANCE 变量，控制项目默认显示的外观。此变量的默认值是 system，会根据用户电脑设置的系统主题自动切换 light 或 dark 模式。

这样，用户初次访问你的网站时，看到的就是暗色主题了。

ShipAny 支持多主题系统。基于此，你可以自定义自己的主题，实现更加个性化的页面效果。

默认的主题基于 shadcn + tailark 实现，对应的主题文件夹是 src/themes/default。

以 ShipAny 官网 为例，演示如何设置主题文件夹，实现自定义主题效果。

在 src/themes 文件夹，根据配置的自定义主题名称，创建主题文件夹。

比如，这里需要创建的主题文件夹是 src/themes/shipany

参考 src/themes/default 文件夹的主题文件内容，实现自定义的主题文件内容。

你无需完全复制默认的主题文件夹，只需在自定义主题文件夹中，创建跟默认主题文件夹同名的文件，即可实现对默认主题文件的增量覆盖。

自定义主题 shipany 的文件结构示例。

访问 ShipAny 官网 ，可以看到自定义主题的效果。

参考上述自定义主题的流程，你可以选择任意你喜欢的 UI 组件库，根据你的业务特点，定制自己的项目主题，让你的项目更加地高端大气。

**Examples:**

Example 1 (unknown):
```unknown
NEXT_PUBLIC_APPEARANCE = "dark"
```

Example 2 (unknown):
```unknown
NEXT_PUBLIC_THEME = "shipany"
```

---

## 视频教程

**URL:** https://shipany.ai/zh/docs/guide/tutorial

**Contents:**
- 视频教程
- ShipAny 开发实战
  - 使用 ShipAny 一小时极速上站
  - 使用 ShipAny 重构 AI Wallpaper Generator

视频教程讲解的内容，使用的 ShipAny 模板不是最新版本，演示的代码跟最新版本的内容或路径不完全一致，仅供参考。实际开发请以最新的文档内容为准。

视频链接：小红书直播回放，从 18:30 开始看

视频链接：腾讯会议回放，访问密码：ARCE

---

## 自定义应用信息

**URL:** https://shipany.ai/zh/docs/customize/appinfo

**Contents:**
- 自定义应用信息
- 设置应用基本信息
- 设置应用图标和预览图片
- 设置站点地图
- 设置爬虫访问规则
- 设置网站协议

应用基本信息影响网站文本显示、版权主体显示、授权登录后回调、支付后跳转等功能。

请在项目部署上线前，根据项目实际情况，设置应用基本信息。

本地开发环境，在 .env.development 中设置：

线上生产环境，在 .env.production 中设置：

应用图标包括 Logo、Favicon，应该符合品牌形象。

在社交平台分享项目链接时，会显示预览图片。

请为你的项目自定义 Logo、Favicon、预览图，并替换默认的文件。

或者使用 Nano Banana Pro，ChatGPT 等 AI 辅助设计工具。

替换掉默认的图标文件后，打开项目首页刷新，可以看到顶部的 Logo 和浏览器标签页的图标已经更新为你设置的图标。

如果你的 Logo、Favicon、预览图，不是默认的文件，你需要在环境变量文件中定义文件路径。

比如自定义的 Logo、Favicon、预览图文件路径分别是：

站点地图是搜索引擎索引网站的文件，用于告诉搜索引擎哪些页面需要索引。

网站部署上线前，请设置 public/sitemap.xml 文件，更新为你网站的页面列表。

robots.txt 是搜索引擎爬虫访问网站的规则文件，用于告诉搜索引擎哪些页面需要索引，哪些页面不需要索引。

网站部署上线前，请设置 public/robots.txt 文件，更新为你网站的爬虫访问规则。

默认的 robots.txt 文件内容如下：

v1.6.0 版本开始，在框架层面动态生成 robots.txt 的内容，无需在 public 目录下创建 robots.txt 文件。 而是在 src/app/robots.ts 文件中配置爬虫访问规则。

默认的 src/app/robots.ts 文件内容如下：

你可以根据项目实际情况修改。访问路径与原来一致，都是 /robots.txt。

网站协议包括隐私政策、服务条款等，应该跟你的项目定位和业务相匹配。

协议文件内容在 content/pages 目录下，包括：

如果你的项目支持多语言，在 content/pages 目录下，还会有对应的语言版本协议文件，比如：

请根据你的项目实际情况，修改协议文件内容。

可以利用 AI 辅助生成协议文件内容，参考的提示词：

协议文件内容修改后，打开对应的协议文件页面，检查内容是否正确。

**Examples:**

Example 1 (markdown):
```markdown
# app
NEXT_PUBLIC_APP_URL = "http://localhost:3000"
NEXT_PUBLIC_APP_NAME = "My ShipAny Project"
```

Example 2 (markdown):
```markdown
# app
NEXT_PUBLIC_APP_URL = "https://your-domain.com"
NEXT_PUBLIC_APP_NAME = "My ShipAny Project"
```

Example 3 (markdown):
```markdown
# app
NEXT_PUBLIC_APP_LOGO = "/custom-logo.svg"
NEXT_PUBLIC_APP_FAVICON = "/custom-favicon.ico"
NEXT_PUBLIC_APP_PREVIEW_IMAGE = "/custom-preview.png"
```

Example 4 (xml):
```xml
<?xml version='1.0' encoding='utf-8' standalone='yes'?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2025-11-15T10:00:00+00:00</lastmod>
  </url>
  <url>
    <loc>https://your-domain.com/blog</loc>
    <lastmod>2025-11-15T10:00:00+00:00</lastmod>
  </url>
  <url>
    <loc>https://your-domain.com/showcases</loc>
    <lastmod>2025-11-15T10:00:00+00:00</lastmod>
  </url>
</urlset>
```

---

## PostgreSQL

**URL:** https://shipany.ai/zh/docs/database/postgresql

**Contents:**
- PostgreSQL
- 快速开始
- 自定义
  - 修改数据表
  - 修改数据库连接
  - 部署到 Cloudflare Workers
  - 通过 Schema 隔离数据
- 参考

PostgreSQL 是一个流行的开源关系型数据库管理系统。它广泛用于 Web 应用程序和后端系统。

ShipAny 支持 PostgreSQL 数据库。按照以下步骤快速开始。

根据你的操作系统类型，自行搜索安装 PostgreSQL，通过命令行创建数据库：

或者你也可以使用各类云服务器厂商提供的 PostgreSQL 云数据库服务。

对上一步创建的数据库，你需要设置用户名、密码，分配权限，开启远程访问权限等。

得到的数据库连接地址 DATABASE_URL 如下：

在项目的环境变量文件中，填入 PostgreSQL 数据库相关的配置。

使用 PostgreSQL 数据库时，数据表结构定义在 ./src/config/db/schema.postgres.ts 文件中，你需要导出这个文件的数据表。

打开 ./src/config/db/schema.ts 文件，修改内容为：

你可以在 PostgreSQL 数据库管理后台管理数据库，也可以在本地执行命令:

如果你需要新增数据表，或者修改数据表字段，可以打开 ./src/config/db/schema.postgres.ts 文件，修改数据表结构。

如果你需要修改数据表连接参数，比如配置自定义选项、连接池等，可以修改 ./src/core/db/postgres.ts 文件中的逻辑。

在进行数据操作时，默认使用的是 ./src/core/db/index.ts 导出的 db() 对象，导出类型是 any，在某些情况下，可能会缺乏类型提示。

如果你希望使用强类型的数据库对象，可以在操作数据时，使用以下方式获取数据库对象：

使用 Cloudflare Workers 部署项目时，暂不支持使用 PostgreSQL 数据库。

你可以使用 Supabase、Neon 等兼容 PostgreSQL 的数据库服务。

PostgreSQL 使用 public 作为默认 Schema。在同一个 PostgreSQL 数据库中，可以创建多个 Schema，来存储多个不同项目的数据。

通过命令登录到 PostgreSQL 数据库。

比如这里创建一个名为 project_2 的 Schema，创建自定义 Schema 的命令如下：

在新项目的环境变量文件中，填入 PostgreSQL 数据库相关的配置。

可以通过命令登录到 PostgreSQL 数据库。

打开数据库管理面板，切换到新项目的 Schema，管理数据表。

Drizzle ORM 接入 PostgreSQL 文档

**Examples:**

Example 1 (yaml):
```yaml
postgresql://user:password@host:port/database
```

Example 2 (python):
```python
psql "postgresql://user:password@host:port/database"
```

Example 3 (unknown):
```unknown
DATABASE_PROVIDER = "postgresql"
DATABASE_URL = "postgresql-database-url"
DB_SCHEMA_FILE = "./src/config/db/schema.postgres.ts"
DB_MIGRATIONS_OUT = "./src/config/db/migrations"
```

Example 4 (sql):
```sql
export * from './schema.postgres';
```

---

## MySQL

**URL:** https://shipany.ai/zh/docs/database/mysql

**Contents:**
- MySQL
- 快速开始
- 自定义
  - 修改数据表
  - 修改数据库连接
  - 部署到 Cloudflare Workers
- 参考

MySQL 是一个流行的开源关系型数据库管理系统。它广泛用于 Web 应用程序和后端系统。

ShipAny 支持 MySQL 数据库。按照以下步骤快速开始。

根据你的操作系统类型，自行搜索安装 MySQL 数据库，通过命令行创建数据库：

或者你也可以使用各类云服务器厂商提供的 MySQL 云数据库服务。

对上一步创建的数据库，你需要设置用户名、密码，分配权限，开启远程访问权限等。

得到的数据库连接地址 DATABASE_URL 如下：

在项目的环境变量文件中，填入 MySQL 数据库相关的配置。

使用 MySQL 数据库时，数据表结构定义在 ./src/config/db/schema.mysql.ts 文件中，你需要导出这个文件的数据表。

打开 ./src/config/db/schema.ts 文件，修改内容为：

你可以在 MySQL 数据库管理后台管理数据库，也可以在本地执行命令:

如果你需要新增数据表，或者修改数据表字段，可以打开 ./src/config/db/schema.mysql.ts 文件，修改数据表结构。

如果你需要修改数据表连接参数，比如配置自定义选项、连接池等，可以修改 ./src/core/db/mysql.ts 文件中的逻辑。

在进行数据操作时，默认使用的是 ./src/core/db/index.ts 导出的 db() 对象，导出类型是 any，在某些情况下，可能会缺乏类型提示。

如果你希望使用强类型的数据库对象，可以在操作数据时，使用以下方式获取数据库对象：

使用 Cloudflare Workers 部署项目时，暂不支持使用 MySQL 数据库。

你可以使用 Supabase / Turso 等云数据库服务。

**Examples:**

Example 1 (unknown):
```unknown
mysql -u user -p password -h host -P port -D database
```

Example 2 (yaml):
```yaml
mysql://user:password@host:port/database
```

Example 3 (unknown):
```unknown
DATABASE_PROVIDER = "mysql"
DATABASE_URL = "mysql-database-url"
DB_SCHEMA_FILE = "./src/config/db/schema.mysql.ts"
DB_MIGRATIONS_OUT = "./src/config/db/migrations_mysql"
```

Example 4 (sql):
```sql
export * from './schema.mysql';
```

---

## 广告

**URL:** https://shipany.ai/zh/docs/ads

**Contents:**
- 广告

---

## Google 登录

**URL:** https://shipany.ai/zh/docs/auth/google

**Contents:**
- Google 登录
- 快速开始

按照以下步骤为你的项目配置 Google 登录。

进入 Google Cloud 控制台，进入 API & Services -> Credentials 页面。

点击左上角的项目选择器，选择一个项目，或者新建一个项目。

在 API & Services -> Credentials 页面，点击 Create Credentials 按钮，选择 OAuth client ID，开始创建 OAuth 客户端。

在 Authorized javascript origins 下面添加你的项目域名，比如：

在 Authorized redirect URIs 下面添加你的项目回调地址，格式为：

点击 Create 按钮，在弹出的窗口中，复制 Client ID 和 Client secret。

注意：如果是新项目创建 OAuth 客户端，需要先完成 OAuth consent screen 配置，按照提示一步步操作即可。记得不要上传 App logo，否则会触发验证。

在项目管理后台，进入 Settings -> Auth -> Google Auth 面板，填入上一步复制的 Client ID 和 Client secret。

打开 Auth Enabled 开关启用谷歌跳转登录功能，打开 OneTap Enabled 开关启用谷歌快捷登录功能。

进入项目主页，刷新页面，可以看到右上角弹出 谷歌快捷登录 弹窗，用户可以使用谷歌账号一键登录你的网站。

在页面右上角点击 Sign In 按钮，显示登录弹窗，底部包含 谷歌登录 按钮，用户点击跳转 谷歌 OAuth 登录。

**Examples:**

Example 1 (yaml):
```yaml
https://your-domain.com
```

Example 2 (yaml):
```yaml
https://your-domain.com/api/auth/callback/google
```

---

## 快速开始

**URL:** https://shipany.ai/zh/docs/quick-start

**Contents:**
- 快速开始
- 本地开发
  - 初始化项目
  - 配置环境变量
  - 配置数据库
  - 配置登录鉴权
  - 配置管理后台访问
- 自定义配置
- 发布上线
- 功能配置

在开始使用 ShipAny 之前，请确保你已经 获取 ShipAny 并已获得 ShipAny Two 代码仓库访问权限。 并且确保你已经完成了 前置要求。

默认拉取的是 dev 分支的代码，基于 Next.js 16，可部署在 Vercel，或通过 VPS + Dokploy 部署。

dev 分支是开发分支，更新迭代快，包含最新的功能特性。如果你追求版本稳定性，可以选择拉取 main 分支的代码。

如果你需要部署在 Cloudflare Workers，请拉取 cf 分支的代码，此分支基于 Next.js 15.5.5，暂不支持 Next.js 16。

拉取完代码之后，进入项目根目录，后续的命令行操作都在项目根目录下执行。

点击输出的 Local 地址，在浏览器打开网页：http://localhost:3000，即可预览项目。

启动的开发服务器默认监听 3000 端口，如果你希望使用其他端口，可以在启动开发服务器时指定端口。

新的项目预览地址就是：http://localhost:8080。

打开项目预览地址，首次看到的页面是这样的：

如果你想通过 AI 快速完成项目初始化，可以参考 使用 Agent Skills 初始化项目。

通过下面的命令，复制一份配置文件，用于配置本地开发用到的环境变量。

根据你的项目信息，自行修改配置文件中的内容。

NEXT_PUBLIC_THEME：项目主题。默认是 default，对应的主题文件夹是： src/themes/default。如果你有自定义主题的需求，可以修改此选项。

NEXT_PUBLIC_APPEARANCE：项目外观。默认是 system，会根据用户电脑设置的系统主题自动切换。你可以改成 light 或 dark，来控制项目默认显示的外观。

DATABASE_URL：数据库连接地址。如果你需要用户登录、管理后台等功能，需要配置此项。

DATABASE_PROVIDER：数据库提供商。目前仅支持 postgresql。支持 Supabase, Neon 等云数据库和自建的 PostgreSQL 数据库。

DB_SINGLETON_ENABLED：数据库单例模式。默认是 true，会复用数据库连接。如果部署在 Cloudflare Workers 等 Serverless 平台，需要改为 false。

DB_MAX_CONNECTIONS：数据库连接池最大连接数。默认是 1，你可适当调大此值，提升数据库并发能力。

AUTH_SECRET：鉴权密钥。如果要开启用户登录功能，需要配置此项。

如果你的项目需要用户登录、管理后台等功能，必须按照以下步骤配置数据库。

你可以在 Supabase、Neon 等云数据库平台创建数据库，得到云数据库的远程连接地址，类似这种：

你也可以使用自建的 PostgreSQL 数据库，得到数据库的连接地址，类似这种：

建议本地开发使用自建的 PostgreSQL 数据库，线上版本使用 Supabase，Neon 等云数据库（兼容 PostgreSQL，无缝切换）。

或者本地开发使用 SQLite 数据库，线上版本使用 Turso 等云数据库（兼容 SQLite，无缝切换）。

常用数据库的创建和连接地址获取，可以参考：数据库 部分的文档。

把上一步骤得到的数据库连接地址填入环境变量 DATABASE_URL。

迁移数据表命令，在连接数据库时，读取的是 .env.development 文件中的 DATABASE_URL 变量。

如果在执行迁移命令：pnpm db:migrate 时遇到 Timeout 超时问题，或者长时间无响应。你需要通过以下命令检查你的数据库能否被正常连接。

如果通过命令直接连接数据库也无法连上，你需要检查你的数据库地址是否有误，或者是否存在网络问题（比如防火墙、代理等）。

正常执行 pnpm db:migrate 迁移数据表成功后，你可以再次执行上述命令，验证数据表是否成功创建。

你可以在本地开发时，把 DATABASE_URL 设置成本地数据库地址。部署上线前，把 DATABASE_URL 设置成线上数据库地址，执行完迁移数据表命令，再改回本地数据库地址。

在 .env.development 文件中，通过注释来切换数据库地址。

ShipAny 使用了 Better Auth 实现用户登录鉴权功能。

如果你的网站只使用 Landing Page 实现静态网站功能，可以不配置登录鉴权。

如果你的网站需要用户登录、支付、管理后台等功能，必须配置登录鉴权。

把上一步骤生成的鉴权密钥填入 .env.development 文件中的 AUTH_SECRET 变量。

配置了 AUTH_SECRET 后，默认开启邮箱登录，用户访问你的网站时，会请求 /api/auth/get-session 接口检查登录状态。未配置 AUTH_SECRET 时，不会检查登录状态。

ShipAny 内置了后台管理系统和基于权限的访问控制（RBAC），你需要先完成上面的 配置数据库 和 配置登录鉴权 步骤，再按照下面的步骤配置管理后台访问。

此步骤会往数据库写入默认的角色和权限列表，连接的是 .env.development 文件中 DATABASE_URL 对应的数据库。

如果连接的是远程数据库，此步骤可能会遇到 Timeout 超时问题，重试即可。

可以配置 DB_SINGLETON_ENABLED = "true"，启用数据库单例模式，复用连接，提升初始化速度。

访问 http://your-domain/admin 进入后台管理系统，第一次会遇到登录拦截，重定向到 /sign-in 登录页面。你需要先通过邮箱注册一个管理员账户，比如 admin@xxx.com

执行以下命令，给新注册的账户分配超级管理员权限

再次访问 http://your-domain/admin，使用管理员账户登录，即可进入管理后台。

在完成本地开发和自定义配置之后，你可以选择一种部署方案，将你的项目发布上线。

项目发布上线后，通过 https://your-domain/admin 进入管理后台，按需配置所需的功能。

**Examples:**

Example 1 (python):
```python
git clone git@github.com:shipanyai/shipany-template-two my-shipany-project
```

Example 2 (python):
```python
git clone -b main git@github.com:shipanyai/shipany-template-two my-shipany-project
```

Example 3 (python):
```python
git clone -b cf git@github.com:shipanyai/shipany-template-two my-shipany-project
```

Example 4 (unknown):
```unknown
cd my-shipany-project
```

---

## 邮箱登录

**URL:** https://shipany.ai/zh/docs/auth/email

**Contents:**
- 邮箱登录
- 快速开始
- 关闭邮箱登录
- 邮箱验证

ShipAny 默认支持邮箱登录，简单配置即可启用。

在启用邮箱登录功能前，你需要先配置好数据库和登录鉴权。

在完成数据库和鉴权配置后，访问网站首页，点击右上角的 登录 按钮，即可看到邮箱登录入口。

你可以使用邮箱注册一个新账户，并在此页面使用邮箱登录。

参考：配置管理后台，为使用邮箱注册的第一个账户配置超级管理员权限。

登录管理后台，可配置其他登录方式，可选择关闭邮箱登录。

在项目管理后台，进入 Settings -> Auth -> Email Auth 面板，点击 Enabled 开关，关闭邮箱登录。

关闭邮箱登录后，用户在登录页面将看不到邮箱登录入口。请确保你已经配置了其他登录方式后再关闭邮箱登录。

在开启邮箱登录功能后，默认情况下，用户可以使用任意符合邮箱格式的邮箱地址注册新账户并登录。

用户使用的邮箱，格式虽然符合邮箱格式，但也许不能正常接收邮件。比如：test@111.com。

为了防止恶意注册，你可以选择开启邮箱验证功能。

邮箱验证依赖邮件服务。在开启邮箱验证功能前，请确保你已经配置了邮件服务。

在项目管理后台，进入 Settings -> Auth -> Email Auth 面板，点击 Email Verification Required 开关，开启邮箱验证功能。

开启邮箱验证后，用户使用邮箱注册或登录后，如果邮箱未验证，将会跳转到等待验证页面。

用户邮箱会收到一封验证邮件，点击验证链接完成验证后，才能正常使用邮箱登录。

---

## 获取 ShipAny

**URL:** https://shipany.ai/zh/docs/guide/get-shipany

**Contents:**
- 获取 ShipAny
- 新用户操作流程
- 高级版用户获取新模板
- 非高级版用户升级高级版
- FAQ

之前未购买过 “ShipAny 高级版” 的用户，可以按照以下步骤获取 ShipAny 高级版

访问 ShipAny 定价页面 -> 点击 "获取 ShipAny" 按钮 -> 下单并完成支付

支付完成后，自动购买“ShipAny Template Two”模板，并跳转到已购买模板页面。

在 个人中心 -> 活动 -> 模板页面 可以查看你的所有已购买模板。

选择一个已购买模板，点击 "激活" 按钮 -> 在激活页面输入你的 GitHub 用户名 -> 提交激活

在已购买模板列表页面，选择一个模板，点击已激活的 “Github 用户名”，访问模板对应的代码仓库。

参考 快速开始 文档，开始使用 ShipAny。

之前购买过“ShipAny 高级版” 的用户，可以按照以下步骤获取新模板

在 个人中心 -> 设置 -> 支付页面 可以查看你的所有购买记录。

正常情况下，这里会有一条“ShipAny 高级版”的支付订单。

在 ShipAny 模板市场 可以查看所有已上架的模板，你可以按需购买。

“ShipAny 高级版”用户可以使用专享价购买模板市场中的模板，包括官方发布的模板和第三方开发者发布的模板。

ShipAny 高级版用户可以 0 元购买 ShipAny 官方发布的两套基础模板

在 个人中心 -> 活动 -> 模板页面 可以查看你的所有已购买模板。

选择一个已购买模板，点击 "激活" 按钮 -> 在激活页面输入你的 GitHub 用户名 -> 提交激活

在已购买模板列表页面，选择一个模板，点击已激活的 “Github 用户名”，访问模板对应的代码仓库。

参考 快速开始 文档，开始使用 ShipAny。

之前购买了“ShipAny 入门版” / “ShipAny 标准版”的用户，可以通过 微信 / 邮箱 / Discord 等渠道联系作者，补差价升级“ShipAny 高级版”。

在 个人中心 -> 设置 -> 支付页面 可以查看你的所有购买记录。

正常情况下，这里会有一条“ShipAny 入门版” 或 “ShipAny 标准版”的支付订单。

在 个人中心 -> 活动 -> 模板页面 可以查看你的所有已购买模板。

正常情况下，这里会有一条“ShipAny Template One” 的购买记录。

在 ShipAny 模板市场 可以查看所有已上架的模板，你可以按需购买。

非高级版用户需要使用模板标价购买模板，不享受优惠价格。

确认你在 ShipAny 官网 登录的邮箱，跟你购买时的邮箱一致。

分别尝试一下谷歌登录和 Github 登录。

确认在 个人中心 -> 设置 -> 支付页面 看不到订单。

通过 微信 / 邮箱 / Discord 等渠道联系作者，提供购买时的邮箱和 Github 用户名，修复订单。

免费赠送的版本，可以直接访问 ShipAny Template One 高级版代码仓库。在 ShipAny 官网没有订单记录，不能享受 ShipAny 高级版权益。

如需获取 ShipAny Template Two，或其他业务模板，需要在官网购买 ShipAny 高级版。

双十一半价活动，持续到 2025.11.30，可以在 ShipAny 官网 半价购买 ShipAny 高级版。

“哥飞的朋友们”社群成员，可以使用专属折扣码，半价购买 ShipAny 高级版，长期有效。

“1024 全栈开发”社群成员，可以使用专属折扣码，半价购买 ShipAny 高级版，长期有效。社群续费赠送 ShipAny 高级版。

建议懂点 HTML / CSS / JavaScript 基础，熟悉 Typescript / React / NextJS 更佳。

完全零基础需要有一定的学习能力，至少你能借助 AI 搞定本地开发环境搭建，能够通过 AI 辅助编程，实现自定义功能。

ShipAny 模板降低了开发门槛，但是有点编程基础可以更好的使用。

---

## 自定义页面展示

**URL:** https://shipany.ai/zh/docs/customize/page

**Contents:**
- 自定义页面展示
- 设置通用展示内容
- 设置着陆页内容
- 自定义着陆页展示
  - 自定义 Header
  - 自定义区块
- 自定义后台展示

项目的通用展示内容，对应的配置文件是 src/config/locale/messages/{locale}/common.json

包括网站 metadata 信息，sign 登录注册文案，locale_detector 语言检测文案等。

你可以根据项目实际情况，按需修改配置文件内容。

其中 metadata 信息，是给搜索引擎收录的网站信息，在项目部署上线前，请一定要修改。

你可以利用 AI 辅助生成配置文件内容，参考的提示词：

修改完成后，刷新项目页面，通过 AITDK 插件 检测网站的 metadata 信息是否正确。

你可以根据检测结果，继续手动调整配置文件中 metadata 的内容。

其中网站头部和底部，对应的区块是 header / footer。内容定义在 src/config/locale/messages/{locale}/landing.json 文件中。

网站首页内容，对应的配置文件是 src/config/locale/messages/{locale}/pages/index.json

默认的首页内容，定义了 hero / features / testimonials / faq / cta 等区块的显示内容。你可以根据项目情况，部分或全部替换默认内容。

利用 AI 辅助生成配置文件内容，参考的提示词：

修改完成后，刷新项目页面，通过 AITDK 插件 检测网站的着陆页内容是否正确。

可以看到着陆页内容已经修改为你设置的内容，包含了指定的关键词。

你可以根据项目情况，继续手动调整配置文件中着陆页内容。

在通过 AI 辅助设置着陆页内容后，你可以手动调整配置文件内容，精细化控制着陆页展示。

文件路径：src/config/locale/messages/{locale}/landing.json

根据上述配置内容，看到的 Header 效果如下：

Footer 区块，自定义展示方式与 Header 类似，可以参考上述配置内容。

你可以按照以下步骤，自定义在网站首页展示的区块。

在 src/config/locale/messages/{locale}/pages/index.json 文件中，删除不需要的区块，或者添加自定义区块。

在 src/config/locale/messages/{locale}/pages/index.json 文件中，调整 show_sections 数组，只包含需要显示的区块。

在 src/themes/default/pages/dynamic-page.tsx 文件中，为特定的区块，指定对应的展示组件。

以上自定义区块展示的方式，也可以不修改默认的 dynamic-page.tsx 文件，而是通过页面配置文件实现。

默认的页面区块，定义在 src/themes/default/blocks 目录下。如果默认的区块不满足你的需求，你可以参考 自定义展示区块 文档，创建自定义区块文件。

默认的页面布局文件，定义在 src/themes/default/layouts/landing.tsx 文件中。

包含 Header 和 Footer 两个区块。

如果你不想修改默认的主题，可以参考 设置主题文件夹 文档，通过自定义主题来定制页面的布局和展示。

通过修改 src/config/locale/messages/{locale}/admin/sidebar.json 配置文件，可以自定义后台展示。

根据上述配置内容，看到的后台展示效果如下：

**Examples:**

Example 1 (json):
```json
{
  "metadata": {
    "title": "ShipAny Template Two",
    "description": "ShipAny is a NextJS boilerplate for building AI SaaS startups. Ship Fast with a variety of templates and components.",
    "keywords": "shipany, shipany-boilerplate, shipany-template-two-demo"
  }
}
```

Example 2 (unknown):
```unknown
The project I am developing is an AI image generator based on Nano Banana Pro model,
please refer to the content on the webpage: https://gemini.google/overview/image-generation/,
help me modify the metadata information in the common configuration file under src/config/locale/messages/{locale}/common.json.
My project name is: Nano Banana Pro,
Keywords contains: nano banana pro, nano banana, nano banana 2, gemini 3 pro image.
```

Example 3 (unknown):
```unknown
The project I am developing is an AI image generator based on Nano Banana Pro model,
please refer to the content on the webpage: https://gemini.google/overview/image-generation/,
help me modify the landing page header and footer content defined in file: src/config/locale/messages/{locale}/landing.json.
and modify the home page content defined in file: src/config/locale/messages/{locale}/pages/index.json.
My project title is: Nano Banana Pro,
Keywords contains: nano banana pro, nano banana, nano banana 2, gemini 3 pro image.
```

Example 4 (json):
```json
{
  "header": {
    "id": "header",
    "brand": {
      "title": "Nano Banana Pro",
      "logo": {
        "src": "/imgs/logos/banana.png",
        "alt": "Nano Banana Pro"
      },
      "url": "/"
    },
    "nav": {
      "items": [
        {
          "title": "Features",
          "url": "/#features",
          "icon": "Sparkles"
        }
      ]
    },
    "buttons": [
      {
        "title": "Quick Start",
        "url": "/docs/quick-start",
        "icon": "BookOpenText",
        "target": "_self",
        "variant": "outline"
      }
    ],
    "user_nav": {},
    "show_sign": false,
    "show_theme": false,
    "show_locale": false
  }
}
```

---

## Cloudflare R2

**URL:** https://shipany.ai/zh/docs/storage/cloudflare-r2

**Contents:**
- Cloudflare R2
- 快速开始

ShipAny 项目需要配置文件存储服务，才能正常使用图片上传功能，影响用户编辑头像、存储 AI 生成图片等功能。

按照以下步骤，为你的项目配置 Cloudflare R2 文件存储。

从 Cloudflare 控制台进入 Storage & databases -> R2 object storage -> Overview 页面，点击 Create bucket 按钮，创建存储桶。

填写存储桶名称，选择存储桶区域（或者使用默认区域），点击 Create 按钮，创建存储桶。

进入存储桶设置页面，点击 Public Development URL 右侧的 Enable 按钮，启用存储桶默认的访问域名。

存储桶默认的访问域名有速率限制，可以在开发调试时使用。项目正式上线时，建议配置自定义域名。

点击 Custom Domains 右侧的 Add 按钮，添加自定义域名。在弹出的输入框中输入你的自定义域名，比如：r2.shipany.ai

你可能需要为自定义域名配置 DNS 解析，如果你的域名是托管在 Cloudflare，添加之后会自动添加 DNS 解析记录。

回到第一步的 R2 object storage 页面，点击右下角的 Account Details -> API Tokens 右边的 Manage 按钮，进入 API 密钥管理页面。

点击 User API Tokens 右侧的 Create User API token 按钮，创建 API 密钥。

点击 Create User API Token 按钮，创建访问存储桶的 API 密钥。

在密钥展示页面，复制 Access Key ID、Secret Access Key 和 Default 下的三个值。

在项目管理后台，进入 Settings -> Storage -> Cloudflare R2 面板，填入 Cloudflare R2 的存储桶配置，点击 Save 按钮保存配置。

进入项目的 /settings/profile 页面，点击上传头像，如果图片能上传成功，右键 在新标签页中打开图片，看到的图片访问地址跟在存储桶中配置的自定义域名一致，说明 Cloudflare R2 存储配置成功。

**Examples:**

Example 1 (yaml):
```yaml
https://pub-xxx.r2.dev
```

Example 2 (yaml):
```yaml
https://r2.shipany.ai
```

---

## 部署到 Cloudflare Workers

**URL:** https://shipany.ai/zh/docs/deploy/cloudflare

**Contents:**
- 部署到 Cloudflare Workers
- 项目适配
- 项目部署
- 绑定自定义域名
- 配置 Hyperdrive
- 查看项目运行日志

基于 ShipAny 开发的项目支持部署到 Cloudflare Workers。利用 Cloudflare Workers 的 Serverless 特性，可以实现高可用、低成本的部署。

按照以下步骤完成 Cloudflare Workers 的适配与部署。

让你的项目能正常运行在 Cloudflare Workers 上，需要做项目适配，一般有三种情况。

在参考 快速开始 初始化项目时，选择拉取 cf 分支的代码。此分支代码已适配 Cloudflare Workers，在此基础上开发的项目，可一键部署到 Cloudflare Workers。

如果你的项目是基于 main 分支或 dev 分支创建的，一开始是部署到 Vercel 等平台，后来需要重新部署到 Cloudflare Workers，你可以选择合并适配好的分支代码，完成项目适配。

请注意：直接合并上游分支代码可能会遇到冲突，需要手动解决冲突。

如果你的已有项目，相较于上游项目，有较大的改动，不适合直接合并上游仓库代码。你可以参考 OpenNext 文档，自行适配。

按照文档示例的步骤一步步操作，完成项目适配。

请注意：OpenNext 目前不支持 Next.js 16，在适配前请先把项目降级到 Next.js 15.5.5。

在完成上述的项目适配流程后，就可以按照下面的步骤，将你的项目部署到 Cloudflare Workers 了。

在项目根目录创建一个 .env.production 文件。可以手动创建，也可以通过下面的命令创建。

把 .env.production 文件中的环境变量值，改成线上环境配置。

在项目根目录创建一个 wrangler.toml 文件。可以手动创建，也可以通过下面的命令创建。

然后修改 wrangler.toml 文件中的内容，根据你的项目在线上部署的情况，修改对应的变量值。

复制上一步设置的 .env.production 文件中的内容，替换掉 wrangler.toml 文件中 [vars] 下面的内容。

注意：第一次部署时，我们先注释掉 wrangler.toml 文件中的 [[hyperdrive]] 配置，等部署完成后再来设置。Cloudflare Workers 是 Serverless 平台，不支持数据库单例模式，确保设置 DB_SINGLETON_ENABLED = "false"

在项目根目录下执行以下命令，安装项目依赖。

依赖安装完后，会自动安装 wrangler 命令行工具。

然后在项目根目录下执行以下命令，部署项目到 Cloudflare Workers。

如果是第一次部署项目到 Cloudflare Workers，命令行会输出 Cloudflare 的授权地址。你需要点击打开链接，在浏览器登录你的 Cloudflare 账户，完成对项目的授权。

授权完成后，部署命令会继续执行，编译项目代码，上传部署文件，最终把你的项目发布到 Cloudflare Workers，并输出预览地址。

至此，项目已经成功部署到 Cloudflare Workers。打开输出的预览地址，就可以看到项目页面了。

接下来，你可以通过 绑定自定义域名、配置 Hyperdrive 等操作，让项目正式上线运营。

如果你的域名是在其他域名服务商（Godaddy、Namecheap 等）注册的，你可以选择在 Cloudflare 添加自定义域名。

然后去你的域名管理后台，把域名的 NAMESERVER 设置为 Cloudflare 提供的 Nameservers

域名托管到 Cloudflare 后，可以使用 Cloudflare 提供的 DNS 解析、SSL 证书、CDN 加速等功能。

进入部署在 Cloudflare Workers 的项目管理页面，进入 Settings -> Domains & Routers 页面，点击 Add 按钮，选择 Custom Domain，输入你的自定义域名（可以是托管在 Cloudflare 的根域名，或者子域名），点击 Add Domain 按钮，添加自定义域名。

上一步添加自定义域名后，Cloudflare 会自动为域名添加到 Cloudflare Workers 的 DNS 解析记录。等 DNS 解析生效（一般半小时内生效，最多可能需要 48 小时），就可以通过自定义域名访问你的项目了。

Hyperdrive 是一项由 Cloudflare 提供的，用于加速全球用户对现有数据库访问的服务。

通过以下步骤配置 Hyperdrive，加快 Cloudflare Workers 上部署的项目对外部数据库的访问速度。

进入 Cloudflare 控制台，在 Storage & databases -> Hyperdrive 页面点击 Create configuration 按钮，创建 Hyperdrive 配置。

在创建 Hyperdrive 配置页面，选择 Connect to public database，然后填入数据库配置信息。

Configuration name 是给你自己看的配置名称，填什么无所谓。

Connection String 要填写项目线上环境的数据库连接地址。

在 Hyperdrive 配置管理页面，复制 Hyperdrive 配置 ID。

修改项目根目录下的 wrangler.toml 文件，开启 [[hyperdrive]] 配置，填入 Hyperdrive 配置 ID 和线上环境的数据库连接地址。

在项目根目录下执行以下命令，重新部署项目。

重新部署项目后，项目会自动使用 Hyperdrive 加速数据库访问。可以在 Hyperdrive 管理页面，看到数据查询请求的统计信息。

在 Cloudflare 控制台，进入 Workers & Pages 页面，选择部署在 Cloudflare Workers 的项目，进入项目管理页面。

点击 Observability 标签进入项目运行日志页面。可以在此处查看项目运行过程中输出的系统日志和调试内容。

如果你希望通过日志排查问题，可以在项目代码里面通过 console.log 打印调试日志，重新部署上线。

然后在 Observability 页面点击 Live 按钮，监听实时输出的日志内容。刷新线上访问地址，查看日志输出，根据日志内容定位具体问题。

**Examples:**

Example 1 (python):
```python
git clone -b cf git@github.com:shipanyai/shipany-template-two my-shipany-project
```

Example 2 (markdown):
```markdown
# 为你的项目创建新分支
git checkout -b cf
# 把 ShipAny 仓库代码设为上游
git remote add upstream git@github.com:shipanyai/shipany-template-two.git
# 拉取上游仓库的更新
git fetch upstream
# 合并上游仓库指定分支的更新
git merge upstream/cf
```

Example 3 (unknown):
```unknown
cp .env.example .env.production
```

Example 4 (markdown):
```markdown
# app
NEXT_PUBLIC_APP_URL = "https://your-domain.com"
NEXT_PUBLIC_APP_NAME = "Your App Name"

# theme
NEXT_PUBLIC_THEME = "default"

# appearance
NEXT_PUBLIC_APPEARANCE = "dark"

# database
DATABASE_URL = "postgresql://user:password@domain:port/database"
DATABASE_PROVIDER = "postgresql"
DB_SINGLETON_ENABLED = "false"

# auth secret
# openssl rand -base64 32
AUTH_SECRET = "your-secret-key"
```

---

## Adsense

**URL:** https://shipany.ai/zh/docs/ads/adsense

**Contents:**
- Adsense
- 快速开始

ShipAny 集成了 Adsense 作为广告服务提供商，只需简单配置即可接入使用。

参考以下步骤，在你的项目快速接入 Adsense 广告服务。

访问 Adsense 官网，注册一个账户。

在 Adsense 控制台，进入 Sites 页面，点击 New site 按钮，在 Add site 弹窗中，输入你的网站域名，比如：shipany.site，点击 Save 按钮，添加网站。

在验证页面，复制 ca-pub-xxx 格式的一段代码。

在项目管理后台，进入 Settings -> Ads -> Adsense 面板，在 Adsense Code 字段填入上一步复制的代码。

回到第二步在 Adsense 控制台的网站验证页面，勾选 I've placed the code 选项，点击 Verify 按钮，完成网站验证。

如果选择 AdSense code snippet 不能验证通过，请切换 Ads.txt snippet，Meta tag 两种方式重试验证。直接访问 {your-domain}/ads.txt 页面，查看输出内容是否与 Ads.txt snippet 中的内容一致。

---

## 动态页面构建

**URL:** https://shipany.ai/zh/docs/page-builder/dynamic-page

**Contents:**
- 动态页面构建
- 新建动态页面
- 添加展示区块
  - 区块类型定义
  - 内置区块列表
- 自定义展示区块

ShipAny 支持动态页面构建，无需编写代码，只需一个 JSON 文件，即可渲染一个动态页面。

动态页面文件定义在 src/config/locale/messages/{locale}/pages 目录，一个文件对应一个页面，支持多语言。

在动态页面文件中，通过组合区块，渲染着陆页面。

比如，我们希望创建一个 AI 图片生成器 的着陆页面，访问路由是：/features/ai-image-generator，可以按照下面的步骤，快速创建。

在 src/config/locale/messages/en/pages 目录下，创建 features/ai-image-generator.json 文件。

在 src/config/locale/index.ts 文件导出的 localeMessagesPaths 数组中，添加新创建的动态页面文件：

访问 /features/ai-image-generator 页面，看到的效果是：

我们在没有编写任何代码的情况下，通过一个 JSON 文件，渲染了一个动态页面。

如果你的项目要支持多语言访问动态页面，你需要为每一种语言，在 src/config/locale/messages/{locale}/pages 目录下，创建对应的动态页面文件。

比如上面创建的页面，要显示中文页面，访问的路由是 /zh/features/ai-image-generator，则需要在 src/config/locale/messages/zh/pages 目录下，创建 features/ai-image-generator.json 文件。

写入跟英文页面文件一样结构，但是翻译成对应语言的内容。

src/config/locale/index.ts 导出的 localeMessagesPaths 数组，无需为每种语言添加对应的动态页面文件。

动态页面的 JSON 文件中，metadata 定义了要在浏览器标题栏和搜索引擎中显示的页面标题和描述，合理设置 metadata 中的 title 和 description，可以让搜索引擎更好地理解和收录新创建的页面。

page.sections 字段定义了要在页面展示的区块列表。比如，我们希望在 ai-image-generator 页面展示 hero / faq / cta 三个区块，可以按照下面的方式配置：

访问 /features/ai-image-generator 页面，看到的效果是：

动态页面文件中，通过 page.sections 定义要展示的区块列表，page.sections 的字段类型是 Record<string, Section>，其中 Section 类型定义为：

我们往动态页面文件中 page.sections 字段添加的区块，要按照 Section 类型定义的字段添加内容。根据区块的 key，或者区块内容的 block 定位要展示的区块代码。

比如，我们希望展示一个特性列表区块，可以在 page.sections 中添加：

按照上面的定义，在动态页面渲染时，默认会加载 src/themes/default/blocks/features-list.tsx 文件，渲染特性列表区块。

如果没有指定 block 字段，默认会加载 src/themes/default/blocks/features.tsx 文件，渲染特性列表区块。features 在这里是区块的 key。

features，features-list 是 ShipAny 在 default 主题内置的区块，所以配置了就能直接展示。

ShipAny 在 default 主题内置了以下区块：

你可以在动态页面文件中，通过 block 字段指定要展示的区块，按照 Section 类型定义，传递区块展示的内容。

如果内置的区块不满足你的需求，你可以自定义展示区块。

在 src/themes/default/blocks 目录下，创建自定义区块文件。

比如，创建一个 custom-features.tsx 文件，自定义展示特性列表。

在动态页面文件中，通过 block 字段指定自定义区块。

你可以通过 AI 修改自定义区块的代码，实现更有表现力的 UI 效果。

**Examples:**

Example 1 (json):
```json
{
  "metadata": {
    "title": "AI Image Generator",
    "description": "Generate images with AI models, support text-to-image and image-to-image."
  },
  "page": {
    "sections": {
      "hero": {
        "title": "AI Image Generator",
        "description": "Generate images with AI models, support text-to-image and image-to-image.",
        "image": {
          "src": "/imgs/features/3.png",
          "alt": "hero image"
        },
        "background_image": {
          "src": "/imgs/bg/tree.jpg",
          "alt": "hero background"
        },
        "buttons": [
          {
            "title": "Start Creating",
            "url": "#create",
            "icon": "Sparkles"
          }
        ]
      }
    }
  }
}
```

Example 2 (javascript):
```javascript
export const localeMessagesPaths = [
  // ... 其他动态页面文件列表
  'pages/features/ai-image-generator',
];
```

Example 3 (json):
```json
{
  "metadata": {
    "title": "AI Image Generator",
    "description": "Generate images with AI models, support text-to-image and image-to-image."
  },
  "page": {
    "sections": {
      "hero": {
        "title": "AI Image Generator",
        "description": "Generate images with AI models, support text-to-image and image-to-image.",
        "buttons": [
          {
            "title": "Start Creating",
            "url": "#create",
            "icon": "Sparkles"
          }
        ],
        "show_bg": false
      },
      "faq": {
        "title": "FAQ",
        "description": "Frequently Asked Questions",
        "items": [
          {
            "title": "What is AI Image Generator?",
            "description": "AI Image Generator is a tool that allows you to generate images with AI models, support text-to-image and image-to-image."
          }
        ]
      },
      "cta": {
        "title": "Ready to Create Images?",
        "description": "Start creating images with AI models, support text-to-image and image-to-image.",
        "buttons": [
          {
            "title": "Start Creating",
            "url": "#create",
            "icon": "Sparkles"
          }
        ],
        "className": "bg-muted"
      }
    }
  }
}
```

Example 4 (typescript):
```typescript
export interface Section {
  id?: string;
  block?: string;
  label?: string;
  sr_only_title?: string;
  title?: string;
  description?: string;
  tip?: string;
  buttons?: Button[];
  icon?: string | ReactNode;
  image?: Image;
  image_invert?: Image;
  items?: SectionItem[];
  image_position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  text_align?: 'left' | 'center' | 'right';
  className?: string;
  component?: ReactNode;
  [key: string]: any;
}
```

---

## Neon

**URL:** https://shipany.ai/zh/docs/database/neon

**Contents:**
- Neon
- 快速开始
- 自定义
  - 修改数据表
  - 修改数据库连接
  - 部署到 Cloudflare Workers
- 参考

Neon 是一个开源的 PostgreSQL 数据库，支持云原生、边缘计算、Serverless 等场景。

ShipAny 已集成 Neon，按照下面的步骤快速接入。

注册 Neon 账号，登录 管理后台，点击 New Project 按钮，创建一个项目。

进入上一步创建的数据库，点击 Connect 按钮，复制数据库连接地址。

在终端执行复制的命令，测试数据库连接是否正常。

Neon 数据库的 Database URL 为：

复制上一步设置的数据库 Database URL。

在项目的环境变量文件中，填入 Neon 数据库相关的配置。

使用 Neon 数据库时，数据表结构定义在 ./src/config/db/schema.postgres.ts 文件中，你需要导出这个文件的数据表。

打开 ./src/config/db/schema.ts 文件，修改内容为：

你可以在 Neon 管理后台 管理数据库，也可以在本地执行命令:

如果你需要新增数据表，或者修改数据表字段，可以打开 ./src/config/db/schema.postgres.ts 文件，修改数据表结构。

如果你需要修改数据表连接参数，比如配置自定义选项、连接池等，可以修改 ./src/core/db/postgres.ts 文件中的逻辑。

在进行数据操作时，默认使用的是 ./src/core/db/index.ts 导出的 db() 对象，导出类型是 any，在某些情况下，可能会缺乏类型提示。

如果你希望使用强类型的数据库对象，可以在操作数据时，使用以下方式获取数据库对象：

Neon 数据库支持部署到 Cloudflare Workers，也支持使用 Hyperdrive 加速数据库访问。

使用 Hyperdrive 加速数据库访问的配置参考：配置 Hyperdrive。

在 Cloudflare Workers 部署项目使用 Neon 数据库的 wrangler.toml 部分内容参考：

**Examples:**

Example 1 (python):
```python
psql 'postgresql://neondb_owner:xxxxxx@xxx.neon.tech/neondb?sslmode=require&channel_binding=require'
```

Example 2 (yaml):
```yaml
postgresql://neondb_owner:xxxxxx@xxx.neon.tech/neondb?sslmode=require&channel_binding=require
```

Example 3 (unknown):
```unknown
DATABASE_PROVIDER = "postgresql"
DATABASE_URL = "neon-database-url"
DB_SCHEMA_FILE = "./src/config/db/schema.postgres.ts"
DB_MIGRATIONS_OUT = "./src/config/db/migrations"
```

Example 4 (sql):
```sql
export * from './schema.postgres';
```

---

## 部署到 Vercel

**URL:** https://shipany.ai/zh/docs/deploy/vercel

**Contents:**
- 部署到 Vercel
- 新项目部署流程
- 绑定自定义域名
- 设置环境变量
- 配置访问统计

基于 ShipAny 完成新项目的开发后，你可以参考下面的流程，将你的项目部署到 Vercel，开始上线运营。

在 Github 选择一个组织，或者在你的个人账户下面，创建一个代码仓库，用于托管新项目的代码。

请注意：一定要选择 Private 创建私有类型的代码仓库。不要公开发布基于 ShipAny 开发的项目代码。

进入根据 快速开始 创建的项目，在项目根目录下执行以下命令，设置项目代码托管地址。

把 your-org/your-repo 替换为你在上一步创建的代码仓库地址。

然后执行以下命令把代码推送到你的代码仓库。

在 Vercel 创建一个新项目，连接上你的 Github 账户。选择上一步创建的代码仓库，导入代码开始部署。

你可以在第一次部署的时候，设置线上使用的环境变量。也可以在项目部署之后，再修改环境变量。

在这里，我们先不设置环境变量，导入项目之后直接点击 Deploy 按钮，开始部署。第一次部署大约需要 2 分钟的时间。

等部署完成后，点击 Continue to Dashboard 按钮，进入项目管理页面。

在项目管理页面，可以看到 Vercel 为你的项目分配的访问域名。点击域名，即可访问你的项目。

至此，已通过 Vercel 成功部署你的项目。

接下来，可以通过 绑定自定义域名、设置环境变量、配置访问统计 等操作，让新项目正式上线运营。

点击项目管理页面右上角的 Domains 按钮，进入域名管理页面。

输入你的自定义域名，点击 Save 按钮，添加自定义域名。

添加完域名后，点开刚添加的域名，查看 DNS 解析指引。这里可能提示你设置 CNAME 记录或者是 A 记录。

打开你的域名注册商的 DNS 解析页面，按照上面的指引添加 DNS 解析。

等 DNS 解析生效（一般半小时内生效，最多可能需要 48 小时），Vercel 会为你添加的自定义域名生成 SSL 证书。

访问你的自定义域名，就可以看到线上版本的网站了。

你可以在第一次创建 Vercel 部署时就设置环境变量，也可以在项目部署后，再修改环境变量。

可以在本地项目根目录下创建一个 .env.production 文件，再填入项目的生产环境变量。

记得根据你的项目信息，修改上面的环境变量值。

在 Vercel 项目管理的 Setting -> Environment Variables 页面，粘贴本地 .env.production 文件中的环境变量内容，点击 Save 按钮，设置环境变量。

每次设置完环境变量后，在项目管理的 Deployments 页面，选择最新的一次部署，点击 Redeploy 按钮，重新部署项目。

你可以选择使用 Vercel 内置的访问统计，也可以使用第三方访问统计服务。

可以按以下步骤配置 Vercel 内置的访问统计：

在项目管理的 Analytics 页面，点击 Enable 按钮，开通 Vercel 的 Web Analytics 访问统计功能。

注意：Vercel 内置的访问统计功能，是收费功能。请自行评估是否开通。

进入项目管理后台，在 Settings -> Analytics 页面，划到 Vercel Analytics 面板，点击 Enabled 按钮开启，然后点 Save 按钮，保存配置。

你需要先 配置管理后台访问 ，才能进行上述配置。

部署到 Cloudflare Workers

**Examples:**

Example 1 (powershell):
```powershell
git remote set-url origin git@github.com:your-org/your-repo.git
```

Example 2 (unknown):
```unknown
git add .
git commit -m "first version"
git push origin main
```

Example 3 (markdown):
```markdown
# app
NEXT_PUBLIC_APP_URL = "https://your-domain.com"
NEXT_PUBLIC_APP_NAME = "Your App Name"

# theme
NEXT_PUBLIC_THEME = "default"

# appearance
NEXT_PUBLIC_APPEARANCE = "dark"

# database
DATABASE_URL = "postgresql://user:password@domain:port/database"
DATABASE_PROVIDER = "postgresql"
DB_SINGLETON_ENABLED = "false"

# auth
AUTH_SECRET = "xxx"
```

---

## Creem

**URL:** https://shipany.ai/zh/docs/payment/creem

**Contents:**
- Creem
- 接入 Creem 支付
- 设计价格表
- 配置支付回调
- 配置支付通知
- 本地调试支付通知
- 参考

ShipAny 集成了 Creem 作为支付服务供应商，只需简单配置即可接入使用。

按照以下步骤为你的项目接入 Creem 支付。

在 Creem 控制台，进入 Developers 页面，查看或重新生成你的 API Key。

你可以在 Creem 控制台右上角，Developers 按钮旁边，点击 Test mode 开关，进入测试环境，创建测试用的 API Key。

根据你的价格表配置，为每个价格方案创建对应的支付产品。

比如，价格表配置中的其中一个按月支付的方案为：

在 Creem 控制台，进入 Products 页面，点击 Create Product 按钮，创建支付产品。

Payment Details 里面的 Currency / Pricing / Subscription interval 必须跟价格方案的 currency / amount / interval 对应。

填写完产品信息后，点击 Create Product 按钮，创建支付产品。

在 Products 页面，选择刚创建的支付产品，点击右侧下拉菜单的 Copy Product ID，复制支付产品 ID。

在项目管理后台，进入 Settings -> Payment -> Creem 面板，在 Creem API Key 字段填入第 2 步复制的 API Key。

在 Creem Product IDs Mapping 字段填入第 3 步价格方案的 product_id 与支付产品 ID 的映射关系。

点击 Save 按钮，保存 Creem 支付配置。

在项目管理后台的 Settings -> Payment -> Basic Payment 面板，开启 Select Payment Method Enabled 开关，允许用户选择支付方式。或者把 Default Payment Provider 设置为 Creem，默认使用 Creem 支付。

访问项目的 /pricing 页面，查看默认的价格表，选择一个价格方案，点击 Creem 下单按钮。

如果能正常跳转到 Creem 支付页面，说明支付配置成功。

如果上一步填入的是测试 API 密钥，可以复制一个 Creem 测试卡号 进行支付验证。

默认的价格表配置在 src/config/locale/messages/{locale}/pages/pricing.json 文件中，支持多语言，每个 locale 对应一个独立的价格表配置。

项目价格表跟支付供应商无关。接入 Creem 支付时，价格表设计可参考 Stripe 支付的：设计价格表。

用户在价格表页面选择价格方案下单成功后，会跳转到 Creem 支付页面，支付成功后，会跳转到项目的回调接口：/api/payment/callback。

在回调接口中，会根据订单号更新订单状态，再跳转到配置的 callbackUrl。

这个配置的 callbackUrl 是在下单接口：/api/payment/checkout 中指定的：

按照默认配置，如果是一次性支付，最终会跳转到 /settings/payments 页面；如果是订阅支付，最终会跳转到 /settings/billing 页面。

你可以根据项目需求，自行修改用户支付完成后的跳转地址。

注意：支付回调是同步跳转的，如果用户在 Creem 支付页面确认支付，在页面跳转前关闭了浏览器，未能正常跳转到项目回调接口，订单状态无法更新，用户在个人中心无法看到已支付的订单。此类情况叫做：丢单。

为了避免支付回调的 丢单 情况，建议项目上线运营时，在 Creem 后台配置支付通知。

在 Creem 商户后台，进入 Developers -> Webhooks 页面，点击 Create webhook 按钮，添加支付通知地址。

把 {your-domain.com} 替换为你的项目域名，可以是根域名，也可以是子域名。

或者也可以只勾选其中一部分事件。ShipAny 项目中支持处理的支付通知事件包括：

填写完配置后，点击 Save Webhook 按钮，添加支付通知地址。

创建完支付通知地址后，进入支付通知地址的详情页面，点击 Signing secret 下方的复制图标，复制 whsec_ 开头的支付通知的签名密钥。

在项目管理后台，进入 Settings -> Payment -> Creem 面板，在 Creem Signing Secret 字段填入上一步复制的支付通知签名密钥。

不同的支付供应商，本地调试支付通知的步骤一致。核心思路都是通过 内网穿透，把一个公网地址映射到本地开发机，然后在支付供应商后台配置支付通知地址时，填入这个公网地址。

比如通过 ngrok 实现 内网穿透 后，填入到 Creem 后台的支付通知地址示例：

具体步骤可参考 Stripe 支付的：本地调试支付通知。

**Examples:**

Example 1 (json):
```json
{
  "title": "Standard",
  "description": "Ship Fast with your SaaS Startups.",
  "interval": "month",
  "amount": 16900,
  "currency": "USD",
  "price": "$169",
  "unit": "/ month",
  "product_id": "standard-monthly",
  "product_name": "ShipAny Boilerplate Standard Monthly",
  "group": "monthly"
  // ...
}
```

Example 2 (json):
```json
{
  "standard-monthly": "prod_xxx"
}
```

Example 3 (javascript):
```javascript
const callbackUrl =
  paymentType === PaymentType.SUBSCRIPTION
    ? `${callbackBaseUrl}/settings/billing`
    : `${callbackBaseUrl}/settings/payments`;
```

Example 4 (yaml):
```yaml
https://{your-domain.com}/api/payment/notify/creem
```

---

## 客服

**URL:** https://shipany.ai/zh/docs/customer-service

**Contents:**
- 客服

---

## Github 登录

**URL:** https://shipany.ai/zh/docs/auth/github

**Contents:**
- Github 登录
- 快速开始

按照以下步骤为你的项目配置 Github 登录。

访问 Github Developer Settings 页面，点击 New OAuth App 按钮，创建一个 Github 应用。

点击 Register application 按钮，完成 Github 应用创建。

在 Github 应用详情页，点击 Generate a new client secret 按钮，生成一个新的客户端密钥。

复制 Client ID 和 Client secret。

在项目管理后台，进入 Settings -> Auth -> Github Auth 面板，填入上一步复制的 Client ID 和 Client secret。

打开 Auth Enabled 开关启用 Github 登录功能。

进入项目主页，刷新页面，点击右上角的 登录 按钮，即可看到 Github 登录入口。

**Examples:**

Example 1 (yaml):
```yaml
https://{your-domain}/api/auth/callback/github
```

---

## 邮件

**URL:** https://shipany.ai/zh/docs/email

**Contents:**
- 邮件

---

## Skills

**URL:** https://shipany.ai/zh/docs/vibe-coding/skills

**Contents:**
- Skills
- 快速初始化项目
- 快速创建子页面

ShipAny 支持使用 Agent Skills 来增强 氛围编程。

ShipAny 模板在 .claude/skills 目录下，内置了常用的 Agent Skills，用于驱动 Coding Agent 快速实现相应的功能。

ShipAny 模板内置了一个名为 shipany-quick-start 的技能， 定义在 .claude/skills/shipany-quick-start 目录下。

使用此技能，可以通过一句话描述，快速完成新项目的初始化，实现新项目的第一个版本。

以开发一个 Nano Banana Generator 项目为例，演示使用 shipany-quick-start 技能实现项目第一个版本的流程：

拉取最新版本的 ShipAny 模板代码，创建新项目。

选择一个编辑器打开项目，确认项目根目录下存在 .claude/skills/shipany-quick-start 目录。

打开一个 Coding Agent（Cursor、Claude Code、Codex 等），在 Coding Agent 的对话框输入以下提示词，使用 shipany-quick-start 技能，初始化项目。

你只需要指定项目名称、域名、内容参考链接等信息。

注意：技能的发现和使用，有一定的“抽卡”概率，意味着并不是所有的 Coding Agent，每一次都能准确发现和使用你指定的技能。

比如，Claude Code 默认支持发现 .claude/skills 目录下的技能。Codex 的技能定义路径是 .codex/skills。其他 Coding Agent，也许会支持 .claude/skills，或者使用自定义的技能定义路径。

你可以在提示词中明确指定技能的定义路径，比如：use ".claude/skills/shipany-quick-start" to start my new project.

或者把模板中的技能复制到 Coding Agent 的技能定义目录下，比如：cp -r .claude/skills .codex/skills。

比如，在 Cursor 的 Coding Agent 里面使用 Auto、GPT-5.2、Opus 4.5 等模型，技能的发现和使用概率准确度比较高。

通过提示词触发技能之后，可以看到，Coding Agent 基于 shipany-quick-start 技能内定义的工作流程，规划了项目初始化的具体步骤，按顺序执行完这些步骤后，完成了项目初始化。

通过技能完成项目初始化之后，在浏览器打开项目预览地址，可以看到项目第一个版本的效果。

网页上看到的图片，是通过 Picsum 生成的随机占位图。

页面上展示的项目 Logo 和 Favicon 文件，是通过技能里面定义的脚本生成的。

你可以根据实际需求，继续编辑页面内容，修改 Logo、Favicon、占位图。

通过上述步骤，我们使用 shipany-quick-start 技能，快速完成了项目初始化，实现了项目第一个版本。

ShipAny 模板内置了一个名为 shipany-page-builder 的技能， 定义在 .claude/skills/shipany-page-builder 目录下。

使用此技能，可以通过一句话描述，在项目中快速创建子页面。

以创建一个 /models/nano-banana-pro 页面为例，演示使用 shipany-page-builder 技能创建子页面的流程：

打开一个 Coding Agent（Cursor、Claude Code、Codex 等），在 Coding Agent 的对话框输入以下提示词，使用 shipany-page-builder 技能，创建子页面。

在提示词里面，描述新页面的访问路径、需要覆盖的关键词、内容参考链接等信息。

通过提示词触发技能之后，可以看到，Coding Agent 基于 shipany-page-builder 技能内定义的工作流程，规划了子页面创建的具体步骤，按顺序执行完这些步骤后，完成了子页面创建。

通过技能完成子页面创建之后，在浏览器打开项目预览地址，访问子页面路由：/models/nano-banana-pro，可以看到子页面效果。

子页面内容是通过 Picsum 生成的随机占位图。

你可以根据实际需求，继续编辑页面内容，修改占位图。

通过上述步骤，我们使用 shipany-page-builder 技能，快速创建了子页面。

**Examples:**

Example 1 (python):
```python
git clone git@github.com:shipanyai/shipany-template-two my-shipany-project
```

Example 2 (unknown):
```unknown
use shipany-quick-start skill to start my new project.
Project name is Nano Banana Generator,
domain is: nano-banana-generator.com,
content reference: https://gemini.google/overview/image-generation/
```

Example 3 (yaml):
```yaml
use ".claude/skills/shipany-page-builder" to build a new page.
Page route is: /models/nano-banana-pro,
keywords: Nano Banana, Nano Banana Pro,
content reference: https://blog.google/technology/ai/nano-banana-pro/
```

---

## Crisp

**URL:** https://shipany.ai/zh/docs/customer-service/crisp

**Contents:**
- Crisp
- 快速开始
- 参考

ShipAny 集成了 Crisp 客服系统，简单配置即可在你的网站接入网页客服组件。

参考以下步骤，在你的网站快速接入 Crisp 客服组件。

进入 Crisp 控制台，添加你要接入客服组件的网站域名。

进入 Settings -> Workspace Settings -> Setup & Integrations 页面，复制 Website ID。

在项目管理后台，进入 Settings -> Customer Service -> Crisp 面板，在 Crisp Website ID 字段填入上一步复制的 Website ID。

开启 Crisp Enabled 开关，点击 Save 按钮保存配置。

在项目主页，刷新页面，可以看到右下角有一个客服图标，点击后可以打开 Crisp 客服组件。

在 Crisp 控制台，进入 Inbox 页面，查看用户留言，回复用户留言。

---

## 数据库

**URL:** https://shipany.ai/zh/docs/database

**Contents:**
- 数据库

---

## 配置

**URL:** https://shipany.ai/zh/docs/config

**Contents:**
- 配置

---
