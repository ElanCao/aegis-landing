# Aegis Landing & Docs

Aegis 企业级 Agent 治理与管理平台的**独立 Landing + 文档站点**（Next.js 15 App Router），从主仓库 `apps/web` 提取，可单独部署到 Vercel，不包含任何 SaaS 专有代码（控制台、(auth) 登录注册、数据库、鉴权、邮件等后端能力均留在主仓库）。

- 首页（`/{locale}`）：产品价值、能力、架构、场景、定价、下载与预约演示
- 文档（`/{locale}/docs`）：快速上手、策略、内容安全、限额、AI 护栏、审计、FAQ
- 国际化：`/zh`、`/en`，中间件按 cookie → Accept-Language 自动跳转

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建
npm run typecheck  # TS 检查
```

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_CONSOLE_URL` | 否 | SaaS 控制台地址。Header / Footer 的「登录平台」入口指向这里；未配置时回退 `https://console.aegis.example.com` |
| `NEXT_PUBLIC_DEMO_ENDPOINT` | 否 | 演示申请表单的提交地址（SaaS 公网地址 + `/api/demo-requests`）。**未配置时表单区块降级为「预约演示请联系 aegis@futurelabs.vip」联系卡片，不发起任何请求** |

本地开发可参照 `.env.example`。

## 部署到 Vercel

仓库内置 `.github/workflows/deploy.yml`：push 到 `main` 自动用官方 Vercel CLI 构建并部署到生产环境。首次接入按以下步骤：

1. **Vercel 侧关联项目**
   ```bash
   npm i -g vercel
   vercel login
   vercel link        # 选择/新建项目，生成 .vercel/project.json
   ```
   从 `.vercel/project.json` 读取 `orgId` 与 `projectId`。
   同时在 Vercel 项目 Settings → Environment Variables 配置上表变量。

2. **GitHub 仓库配置 Secrets**
   Settings → Secrets and variables → Actions → New repository secret，添加三个 secret：
   - `VERCEL_TOKEN`：Vercel → Settings → Tokens 创建
   - `VERCEL_ORG_ID`：第 1 步的 `orgId`
   - `VERCEL_PROJECT_ID`：第 1 步的 `projectId`

3. **触发部署**：push 到 `main` 即自动部署；也可在 Actions 页手动 Run workflow。

> CI 不执行 `npm run build`：工作流使用 `vercel build`（读取 Vercel 环境变量），再 `vercel deploy --prebuilt` 发布。

## 目录结构

```
src/
├── middleware.ts            # locale 跳转（cookie → Accept-Language）
├── i18n/                    # zh/en 字典与 locale 工具
├── lib/
│   ├── site.ts              # CONSOLE_URL（NEXT_PUBLIC_CONSOLE_URL 回退占位）
│   └── releases.ts          # 静态版本常量（生产应指向 SaaS 发布接口）
├── components/
│   ├── ui.tsx               # 展示性基础组件
│   └── marketing/           # Landing/Docs 全部区块组件
└── app/
    ├── layout.tsx           # 根布局（lang 跟随 locale cookie）
    ├── globals.css          # Tailwind v4 入口
    └── [locale]/(marketing)/
        ├── page.tsx         # 首页
        └── docs/page.tsx    # 文档页
```

## License

Apache 2.0，见 [LICENSE](./LICENSE)。

<!-- rebuild trigger: console env configured -->
