import type { ReactNode } from "react";

// Public documentation body (route /{locale}/docs). Copy is Chinese-first per
// product requirement ("中文文案为主"); section/nav chrome is localized via
// the dictionaries. Content mirrors the actual enforcement code:
// packages/shared/src/policy-expr.ts, apps/web/src/lib/policies.ts,
// apps/web/src/app/api/gateway/v1/core.ts, packages/shared/src/limits.ts,
// packages/shared/src/ai-guard.ts, packages/shared/src/content-safety.ts.

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-32 text-2xl font-semibold tracking-tight text-slate-900">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-base font-semibold text-slate-900">{children}</h3>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-7 text-slate-600">{children}</p>;
}

function Ul({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-7 text-slate-600">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">{children}</code>;
}

function Block({ code, lang = "bash" }: { code: string; lang?: "bash" | "json" | "expr" | "text" }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {lang}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200">{code}</pre>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-left">
            {head.map((h) => (
              <th key={h} className="border-b border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="align-top">
              {cells.map((c, j) => (
                <td key={j} className="border-b border-slate-100 px-3 py-2 leading-6 text-slate-700 last:border-b-0">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ tone, children }: { tone: "info" | "warn"; children: ReactNode }) {
  const tones = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
  } as const;
  return <div className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${tones[tone]}`}>{children}</div>;
}

export function DocsBody() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24">
      {/* ------------------------------ 快速开始 ------------------------------ */}
      <section className="mt-16">
        <H2 id="quickstart">快速开始</H2>
        <P>
          Aegis 模型网关提供三种接入模式，协议均为 OpenAI 兼容（<Code>/v1/chat/completions</Code>）与 Anthropic 兼容（
          <Code>/v1/messages</Code>，含流式）；本地网关另有 <Code>/v1/models</Code> 模型列表端点。把客户端的 baseURL
          指向任一模式端点即可接入，策略、密钥托管与计量在三种模式下完全一致。
        </P>
        <H3>三种模式的网关端点</H3>
        <Table
          head={["模式", "端点", "适用场景", "认证"]}
          rows={[
            [
              <strong key="m">桌面拦截（模式一）</strong>,
              <Code key="u">http://127.0.0.1:8931/v1</Code>,
              "每位用户在自己电脑运行企业代理，同机 Agent（Claude Code、WorkBuddy 等）直连本机网关；密钥与提示词不出本机。",
              "免认证（仅本机可达）",
            ],
            [
              <strong key="m">集中式网关（模式二）</strong>,
              <Code key="u">http://&lt;代理IP&gt;:8931/v1</Code>,
              "企业代理部署在服务器并监听局域网地址，全公司统一入口，可挂负载均衡 / VIP；多台代理无状态对等。",
              "远程调用必须携带 Agent 的 ak_ 密钥（代理本地离线校验）",
            ],
            [
              <strong key="m">SaaS 中继（云 Agent）</strong>,
              <Code key="u">https://&lt;控制面域名&gt;/api/gateway/v1</Code>,
              "飞书、n8n Cloud 等无代理环境的云 Agent 直接调用云端网关。",
              "HTTP Bearer + ak_ 密钥",
            ],
          ]}
        />
        <P>
          集中式端点的确切地址以控制台「网关 → 接入端点」中各企业代理上报的地址为准；默认端口 8931，可在代理设置中修改。
        </P>
        <H3>ak_ 密钥</H3>
        <Ul
          items={[
            <>在控制台「Agent 管理」中对具体 Agent 点击「签发 API 令牌」获得，前缀 <Code>ak_</Code>，仅显示一次，请立即保存。</>,
            <>以 HTTP Bearer 方式携带；每个 Agent 一把密钥，可按 Agent 轮换、吊销。</>,
            <>桌面模式（127.0.0.1）无需密钥；集中式与中继模式必须携带，密钥在代理本地离线校验，控制面宕机不影响鉴权。</>,
          ]}
        />
        <H3>curl 示例（SaaS 中继）</H3>
        <Block
          lang="bash"
          code={`curl -X POST "https://<控制面域名>/api/gateway/v1/chat/completions" \\
  -H "Authorization: Bearer ak_xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [{ "role": "user", "content": "你好，介绍一下你自己" }]
  }'`}
        />
        <P>
          换成桌面或集中式端点时，仅需替换 URL 并按模式决定是否携带 <Code>Authorization</Code> 头。模型名以「模型秘钥」中凭证的承接模型为准。
        </P>
      </section>

      {/* ------------------------------ 策略引擎 ------------------------------ */}
      <section className="mt-20">
        <H2 id="policy">策略引擎</H2>
        <P>
          策略由「动作 + 资源 + 主体 + 效果（ALLOW/DENY）+ 可选条件表达式」组成。RBAC 定义“谁可能做什么”，条件表达式（ABAC）
          在每次调用时基于实时属性进一步收窄。
        </P>
        <H3>9 个动作与执行位置</H3>
        <Table
          head={["动作", "含义", "求值位置 / 语义"]}
          rows={[
            [<Code key="a">model:invoke</Code>, "调用模型", "网关每次调用前实时求值（云端中继 + 企业代理本地离线执行）；default-deny"],
            [<Code key="a">mcp:invoke</Code>, "调用 MCP", "网关 / 企业代理的 MCP 路由（tools/call）；与 tool:execute 同时校验"],
            [<Code key="a">tool:execute</Code>, "执行工具", "网关 / 企业代理；资源为聚合工具名（服务器名__工具名）"],
            [<Code key="a">skill:use</Code>, "使用 Skill", "企业代理本地网关（skill 端点）；资源为 Skill ID"],
            [<Code key="a">mcp:discover</Code>, "发现 MCP", "企业代理（tools/list 发现阶段）"],
            [<Code key="a">agent:register</Code>, "注册 Agent", "控制台；仅 DENY 生效"],
            [<Code key="a">agent_version:publish</Code>, "发布 Agent 版本", "控制台；仅 DENY 生效"],
            [<Code key="a">audit:export</Code>, "导出审计", "控制台；仅 DENY 生效"],
            [<Code key="a">policy:override</Code>, "变更策略", "控制台；仅 DENY 生效"],
          ]}
        />
        <Callout tone="info">
          企业代理上没有控制台登录身份，因此只有 EVERYONE 与 AGENT 两类主体的规则在代理生效（AGENT 规则在调用方携带
          x-aegis-agent 头或由令牌绑定时匹配）；ROLE / USER 主体规则只在控制台生效。
        </Callout>
        <H3>默认拒绝语义</H3>
        <Ul
          items={[
            <>
              <strong>网关：default-deny。</strong>没有命中任何 ALLOW 即拒绝（403 <Code>policy_denied</Code>，reason=
              <Code>default_deny</Code>）；同一请求命中 DENY 与 ALLOW 时 <strong>DENY 优先</strong>。
            </>,
            <>
              <strong>控制台：仅 DENY 生效。</strong>管理动作（注册 / 发布 / 导出 / 改策略）默认放行，只有显式 DENY
              命中才拦截；ALLOW 规则在控制台不授予任何权限。
            </>,
          ]}
        />
        <P>
          <strong>放行示例：</strong>要让所有 Agent 都能调用 gpt-4o，需要在策略页新建一条规则：动作 <Code>model:invoke</Code>、
          资源 <Code>gpt-4o</Code>（或 <Code>*</Code> 表示全部模型）、主体 <Code>EVERYONE</Code>、效果 <Code>ALLOW</Code>。
          只建 DENY 规则不会放行任何调用——网关默认拒绝，必须显式 ALLOW。
        </P>
        <H3>条件表达式完整参考</H3>
        <P>
          条件表达式写在规则的「条件」中（JSON <Code>{"{ expr: \"...\" }"}</Code> 的 expr 字段），每次调用时对本次请求的属性求值。
          表达式为无副作用沙箱语言：支持字符串 / 数字 / 布尔 / null 字面量、点路径变量、运算符、内置函数与括号；
          没有赋值、三元、逗号序列等语法。
        </P>
        <H3>可用变量（按动作与时机）</H3>
        <Table
          head={["变量", "含义", "model:invoke", "mcp / skill / discover", "控制台动作"]}
          rows={[
            [<Code key="v">model</Code>, "请求的模型名", "有值", '空串 ""', '空串 ""'],
            [<Code key="v">agent.id</Code>, "Agent ID", "有值（带 x-aegis-agent 头或令牌绑定时）", "有值", "无"],
            [<Code key="v">agent.type</Code>, "Agent 类型 SHARED / USER_SIDE / CLOUD", "有值", "有值", "无"],
            [<Code key="v">tenant.plan</Code>, "租户套餐（COMMUNITY / CLOUD_PRO / ENTERPRISE / HOSTED）", "有值", "有值", "有值"],
            [<Code key="v">usage.inputTokens</Code>, "输入 token 计数", <strong key="v">调用前求值，恒为 0</strong>, "恒为 0", "恒为 0"],
            [<Code key="v">usage.outputTokens</Code>, "输出 token 计数", <strong key="v">调用前求值，恒为 0</strong>, "恒为 0", "恒为 0"],
            [<Code key="v">hour</Code>, "服务器本地小时（0–23，用于时段策略）", "有值", "有值", "有值"],
            [<Code key="v">subject</Code>, "主体标识", "agentId，未识别时为 anonymous", "同左", "当前用户邮箱"],
          ]}
        />
        <Callout tone="warn">
          策略在调用上游模型<strong>之前</strong>求值，此时 token 用量尚未产生，因此 <Code>usage.*</Code> 恒为 0——不要用
          usage 变量做放行判断，token 预算请使用「限流与预算」。未知变量或缺失字段求值为 undefined（安全降级，不会抛错）。
        </Callout>
        <H3>运算符</H3>
        <Ul
          items={[
            <><strong>比较：</strong><Code>==</Code> <Code>!=</Code> <Code>&lt;</Code> <Code>&lt;=</Code> <Code>&gt;</Code> <Code>&gt;=</Code>（数字与字符串均可比较；<Code>==</Code> 为宽松比较，数字与数字字符串可相等，null 与 undefined 互等）</>,
            <><strong>逻辑：</strong><Code>&amp;&amp;</Code> <Code>||</Code> <Code>!</Code>（短路求值）</>,
            <><strong>算术：</strong><Code>+</Code> <Code>-</Code> <Code>*</Code> <Code>/</Code> <Code>%</Code>（<Code>+</Code> 可用于字符串拼接）</>,
            <><strong>括号：</strong>用 <Code>( )</Code> 分组控制优先级。</>,
          ]}
        />
        <H3>内置函数</H3>
        <Table
          head={["函数", "说明"]}
          rows={[
            [<Code key="f">startsWith(a, b)</Code>, "字符串 a 是否以 b 开头"],
            [<Code key="f">endsWith(a, b)</Code>, "字符串 a 是否以 b 结尾"],
            [<Code key="f">contains(a, b)</Code>, "字符串包含子串；a 为数组时判断元素存在"],
            [<Code key="f">matches(a, regex)</Code>, "JavaScript 正则匹配；正则非法时返回 false（不报错）"],
            [<Code key="f">len(a)</Code>, "字符串 / 数组长度，或对象键数量"],
            [<Code key="f">lower(a) / upper(a)</Code>, "大小写转换"],
          ]}
        />
        <P>
          <strong>两种写法完全等价</strong>——方法式只是语法糖，接收者路径会成为第一个参数：
        </P>
        <Block lang="expr" code={`startsWith(model, 'gpt')   // 函数式\nmodel.startsWith('gpt')    // 方法式，等价`} />
        <H3>示例（由浅入深）</H3>
        <Ul
          items={[
            <><Code>model == 'gpt-4o'</Code> —— 精确匹配某个模型。</>,
            <><Code>model.startsWith('gpt')</Code> —— 前缀匹配一族模型。</>,
            <><Code>model.startsWith('gpt') &amp;&amp; tenant.plan == 'ENTERPRISE'</Code> —— 组合：仅企业版租户可用 gpt 系。</>,
            <><Code>agent.type == 'CLOUD' &amp;&amp; !model.startsWith('glm')</Code> —— 云 Agent 只允许 glm 系（作 DENY 条件即“云 Agent 禁其他模型”）。</>,
            <><Code>matches(model, '^gpt-4o(-[0-9]{4})?$')</Code> —— 正则精确圈定 gpt-4o 及其日期变体。</>,
            <><Code>hour &gt;= 22 || hour &lt; 8</Code> —— 时段策略：仅夜间命中（配合 DENY 即“夜间禁调”，配合 ALLOW 即“仅夜间放行”）。</>,
            <><Code>contains(lower(model), 'gpt') || contains(lower(model), 'glm')</Code> —— 函数组合，大小写不敏感地匹配多个关键字。</>,
            <><Code>len(model) &gt; 0 &amp;&amp; model != 'internal-only'</Code> —— 排除特定模型。</>,
            <><Code>subject == 'anonymous'</Code> —— 识别未携带 Agent 身份的匿名调用（常作 DENY 条件拒绝匿名）。</>,
            <><Code>subject == 'zhangsan@corp.com'</Code> —— 控制台动作按用户邮箱限制（如仅拒绝某人导出审计）。</>,
          ]}
        />
        <H3>DENY 规则：条件不命中即不拦截</H3>
        <P>
          条件表达式结果为 false、或变量缺失导致比较不成立时，该规则<strong>不命中</strong>：DENY 规则不会拦截。
          例如 DENY + <Code>model:invoke</Code> + <Code>agent.id == 'agt_xxx'</Code> 只拒绝这一个 Agent，其他 Agent 不受此规则影响
          （但网关语义下仍需 ALLOW 才放行；控制台语义下无 DENY 命中即放行）。
        </P>
        <H3>表达式语法错误：DENY 规则不生效（fail-closed）</H3>
        <P>
          表达式解析或求值出错（括号不配、未知函数、运算符写错等）时，该规则按<strong>不命中</strong>处理——
          也就是说，<strong>写错了的 DENY 规则不会拦截任何请求</strong>（fail-closed 指的是规则自身被关闭，而不是请求被关闭）。
          错误文本会记录在审计 <Code>policy_evaluated</Code> 事件的 <Code>conditionError</Code> 字段中，便于排查。
          网关语义下请求最终仍因 default-deny 需要 ALLOW 才放行；控制台语义下则直接放行。
        </P>
        <Block
          lang="expr"
          code={`model.startsWith('gpt'      // 括号未闭合 → 语法错误\n                                  // 该 DENY 规则不生效，conditionError 记入审计\nusage.outputTokens > 0          // 合法但恒为 false（调用前求值）→ 规则永不命中`}
        />
      </section>

      {/* ------------------------------ 内容安全 ------------------------------ */}
      <section className="mt-20">
        <H2 id="content-safety">内容安全</H2>
        <P>
          内容安全对<strong>每次请求的 messages 文本</strong>做敏感内容检查（当前仅检查请求内容，不扫描响应）。
          云端中继即时生效；企业代理在下次心跳后自动生效；独立模式在代理本地设置中配置。
        </P>
        <H3>检查项</H3>
        <Ul
          items={[
            <><strong>手机号</strong>（中国大陆号段）</>,
            <><strong>身份证号</strong>（18 位，含校验位）</>,
            <><strong>银行卡号</strong></>,
            <><strong>IP 地址</strong>（IPv4）</>,
            <><strong>敏感词</strong>：内置种子词库 + 自定义敏感词（每行一个，匹配不区分大小写）</>,
            <><strong>自定义正则</strong>：每行一个 JavaScript 正则表达式，可匹配工号、项目代号等私有模式</>,
          ]}
        />
        <H3>两种处理模式</H3>
        <Ul
          items={[
            <>
              <strong>BLOCK（阻断）</strong>：命中即返回 403 <Code>content_blocked</Code>，响应中仅说明命中的检查类别，不回显敏感内容本身。
            </>,
            <>
              <strong>AUDIT_ONLY（仅审计）</strong>：放行并在审计中记录命中类别，适合灰度观察自定义规则的误报率。
            </>,
          ]}
        />
      </section>

      {/* ------------------------------ 限流与预算 ------------------------------ */}
      <section className="mt-20">
        <H2 id="limits">限流与预算</H2>
        <P>控制台「设置 → 限流与预算」提供两道闸口，0 表示不限。</P>
        <H3>配置项语义</H3>
        <Table
          head={["配置项", "语义"]}
          rows={[
            [
              <Code key="c">rpmPerKey</Code>,
              "每个 API key（ak_）每分钟允许的请求数。超限返回 429 rate_limited，错误信息含建议重试间隔，客户端应退避重试。",
            ],
            [
              <Code key="c">dailyTokenBudget</Code>,
              "租户每日 token 预算（输入 + 输出合计）。每日零点重置；计数为各网关进程内存实现（非分布式），云端中继与各企业代理分别计数。",
            ],
            [
              <Code key="c">budgetHardStop</Code>,
              "开：预算用尽即 429 budget_exceeded 硬断，当日不再放行；关：不拦截，但首次跨过 80% 时告警一次（审计 budget_threshold 事件）。",
            ],
          ]}
        />
        <H3>429 行为与区分</H3>
        <Ul
          items={[
            <>限流与预算硬断都返回 HTTP 429，但 <Code>error.type</Code> 不同：<Code>rate_limited</Code>（每 key 每分钟）与 <Code>budget_exceeded</Code>（每日预算）。</>,
            <>收到 <Code>rate_limited</Code> 应等待后重试；收到 <Code>budget_exceeded</Code> 说明当日预算已用尽，应联系管理员调整预算或等待零点重置。</>,
            <>80% 告警只触发一次（按“首次跨过”判定），用于提前介入，不影响调用。</>,
          ]}
        />
      </section>

      {/* ------------------------------ AI 策略评估 ------------------------------ */}
      <section className="mt-20">
        <H2 id="ai-guard">AI 策略评估</H2>
        <P>
          AI 策略评估在每次模型调用前，用所选「判定模型」对 system 提示词 + 最后一条用户消息做结构化判定，
          让大模型自身参与治理决策（Jev 式结构化判定）。云端中继即时生效；企业代理在下次心跳后自动生效。
        </P>
        <H3>原理：结构化的判定输出</H3>
        <P>判定 Prompt 要求决策模型只输出一个 JSON 对象：</P>
        <Block
          lang="json"
          code={`{
  "decision": "allow | block | review",
  "categories": ["类别英文名"],
  "confidence": 0.93,
  "reason": "中文理由，不超过 120 字"
}`}
        />
        <Ul
          items={[
            <><Code>decision</Code>：allow 放行 / block 阻断 / review 仅标记。</>,
            <><Code>categories</Code>：类别列表，如 <Code>none</Code>、<Code>password_leak</Code>、<Code>credential_leak</Code>、<Code>sensitive_data</Code>、<Code>policy_violation</Code>。</>,
            <><Code>confidence</Code>：0 到 1 的置信度；<Code>reason</Code>：可读的判定依据。</>,
            <>解析容错：缺失字段给默认值、未知 decision 值按 allow 处理、完全无法解析视为判定失败（见「超时与失败行为」）。</>,
          ]}
        />
        <H3>配置项</H3>
        <Table
          head={["配置项", "说明"]}
          rows={[
            ["启用 + 模式", "BLOCK：decision=block 返回 403（含类别与理由）；AUDIT_ONLY：全部放行、只留审计记录。"],
            ["判定凭证与模型", "从「模型秘钥」中已测试连接、勾选了可用模型的凭证里选择。"],
            ["判定 Prompt 模板", "留空使用内置默认；支持变量 {{system}} {{user}} {{model}} {{agent}} {{plan}}。"],
            ["判定超时（毫秒）", "默认 8000ms；超时按失败处理。"],
            ["failOpen", "开：超时 / 错误 / 无法解析时放行并记录；关：失败即阻断。"],
          ]}
        />
        <H3>判定计费</H3>
        <P>
          每次判定都是一次真实的模型调用，<strong>按所选判定模型的价格正常计费</strong>（与业务调用同价，计入成本归因）。
          请求越频繁、判定模型越贵，治理成本越高——建议为判定选择轻量低价模型。
        </P>
        <Callout tone="info">
          <strong>review 为什么不拦截：</strong>review 是设计上的“观察档”——只打标、不阻断，避免对正常办公的误伤。
          需要拦截时，判定模型应输出 block，且模式为 BLOCK。
        </Callout>
        <H3>接入任意 OpenAI 兼容决策端点</H3>
        <P>
          判定服务不限于内置供应商目录：模型秘钥支持指向<strong>任意 OpenAI 兼容端点</strong>（如 Jev 等决策服务），
          网关会按凭证上保存的 Base URL 直连该端点。接入步骤：
        </P>
        <Ul
          items={[
            <>控制台「模型秘钥 → 添加密钥」，服务商选择「<strong>自定义（OpenAI 兼容）</strong>」；</>,
            <>填入该决策服务的 Base URL 与 API Key（例如 <Code>https://jev.example.com/v1</Code>）；</>,
            <>点击「测试连接」，从上游可用列表中勾选判定要用的模型；</>,
            <>回到「设置 → AI 策略评估」，在「判定模型」下拉中选择该凭证的模型即可。</>,
          ]}
        />
        <H3>超时与失败行为</H3>
        <Ul
          items={[
            <>判定超时、上游报错或输出无法解析为 JSON 时，按 failOpen 配置处理：开=放行并记录审计（含 error 与 failOpen 标记）；关=阻断。</>,
            <>治理路径（策略/内容安全/限流）与模型调用相互独立：判定服务宕机不影响其他治理层生效。</>,
          ]}
        />
      </section>

      {/* ------------------------------ 审计与来源 ------------------------------ */}
      <section className="mt-20">
        <H2 id="audit">审计与来源</H2>
        <P>
          每一次策略求值都会留下 <Code>policy_evaluated</Code> 审计事件（含 reason、命中策略名、conditionError）；
          模型调用、内容命中、限流、预算事件同样入链，形成不可变哈希链，可在控制台「审计」页校验链完整性。
        </P>
        <H3>三种事件来源</H3>
        <Table
          head={["来源", "含义", "来源标识"]}
          rows={[
            ["云端网关", "SaaS 中继处理的调用与判定", <Code key="s">source_relay</Code>],
            ["企业代理", "连接模式的企业代理（数据面）同步的事件", <Code key="s">source_edge</Code>],
            ["独立代理", "社区版独立模式代理本地产生的事件", <Code key="s">source_standalone</Code>],
          ]}
        />
        <P>控制台审计页可按来源筛选，便于区分“云端直接发生”与“边缘同步上报”的事件。</P>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section className="mt-20">
        <H2 id="faq">常见问题（FAQ）</H2>

        <H3>1. MCP 调用返回 403 policy_denied，怎么办？</H3>
        <P>
          网关与代理对 MCP 采用默认拒绝：<Code>mcp:invoke</Code> 与 <Code>tool:execute</Code> 两个动作都需要显式 ALLOW。
          到「策略」页为该 Agent（或 EVERYONE）新建 ALLOW 规则，动作选 mcp:invoke 与 tool:execute，资源填聚合工具名
          （形如 <Code>服务器名__工具名</Code>）或 <Code>*</Code>。仅添加 DENY 规则不会放行任何调用。
        </P>

        <H3>2. 为什么我的策略没有生效？</H3>
        <Ul
          items={[
            <>生效时延：云端中继即时生效；企业代理要等下次心跳（默认约 60 秒）同步策略缓存。</>,
            <>语义错位：把 ALLOW 规则当成“只读不动”——网关是 default-deny，没有匹配的 ALLOW 一律 403。</>,
            <>资源名不匹配：大小写敏感，且 MCP 工具要用聚合名（服务器名__工具名）。</>,
            <>条件表达式结果为 false：用审计里的 conditionError 与 reason 定位。</>,
          ]}
        />

        <H3>3. 表达式报错了怎么排查？</H3>
        <Ul
          items={[
            <>先看「审计」中对应请求的 <Code>policy_evaluated</Code> 事件，<Code>conditionError</Code> 会给出解析错误与位置。</>,
            <>常见错误：括号不闭合、引号不配、把 <Code>&amp;&amp;</Code> 写成 and、调用不存在的函数。</>,
            <><Code>matches()</Code> 的正则非法<strong>不会报错</strong>，只是恒为 false——正则规则不命中时先检查正则本身。</>,
            <>注意 fail-closed 语义：表达式报错的 DENY 规则不生效（规则被关闭），修好后才会真正拦截。</>,
          ]}
        />

        <H3>4. 判定结果是 review，为什么没有拦截？</H3>
        <P>
          这是设计行为：review 只标记、不拦截，避免误伤正常办公。需要拦截时，判定模型应输出 block，
          且「AI 策略评估」的模式为 BLOCK（AUDIT_ONLY 模式下 block 也只记录不拦截）。
        </P>

        <H3>5. 如何只给某个 Agent 放开某个模型？</H3>
        <P>
          新建 ALLOW 规则：动作 <Code>model:invoke</Code>、资源 <Code>该模型名</Code>、主体类型选 AGENT、主体填该 Agent 的 ID。
          其他 Agent 不受影响（它们仍需自己的 ALLOW）。也可用资源 <Code>*</Code> + 条件 <Code>agent.id == '...'</Code> 达到同样效果。
        </P>

        <H3>6. 响应缓存与内容安全是什么关系？会不会绕过检查？</H3>
        <P>
          不会。每个请求都先经过策略、内容安全与 AI 判定，之后才查响应缓存；命中缓存只跳过上游模型调用
          （按 0 token、0 成本计量），所有治理检查照常执行。客户端也可用请求头 <Code>x-aegis-no-cache: 1</Code> 跳过缓存强制回源。
        </P>

        <H3>7. 收到 429，是限流还是预算用完了？</H3>
        <P>
          看响应体 <Code>error.type</Code>：<Code>rate_limited</Code> 是每 key 每分钟超限，等待错误信息中的间隔后重试即可；
          <Code>budget_exceeded</Code> 是租户当日 token 预算用尽（需开启 budgetHardStop 才会硬断），需管理员调高预算或等零点重置。
        </P>

        <H3>8. usage.inputTokens 写的条件为什么不命中？</H3>
        <P>
          策略在调用上游前求值，此时 token 计数尚未产生，usage 变量恒为 0。想用 token 做预算控制，请使用「限流与预算」的
          dailyTokenBudget；想在表达式里限制调用规模，可以用其他变量（如 tenant.plan、model）组合。
        </P>

        <H3>9. 桌面模式和集中式模式的认证有什么差别？</H3>
        <P>
          桌面模式监听 127.0.0.1，只接受本机连接、免认证，适合个人拦截；集中式模式监听局域网地址，远程调用必须携带
          ak_ 密钥，由代理本地离线校验——控制面短时不可用也不影响鉴权与策略执行。
        </P>

        <H3>10. 策略修改后多久生效？</H3>
        <P>
          云端中继立即生效；企业代理在下次心跳（默认约 60 秒）后生效；独立模式在代理本地配置，保存即生效。
          下发到代理的策略缓存为空时（从未同步成功）本地请求会放行并标记 cached_empty，连接恢复后自动收敛。
        </P>
      </section>
    </div>
  );
}
