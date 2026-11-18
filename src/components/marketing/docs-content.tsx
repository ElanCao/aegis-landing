import type { ReactNode } from "react";

// Public documentation body — Chinese (route /zh/docs). Mirrors the CURRENT
// enforcement code (post v0.3/v0.4): grant-matrix admission owns access,
// policies are DENY-only, budgets are centralized, loopback anonymity is gone.
// The English twin lives in docs-content-en.tsx — keep the two in sync.

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
          指向任一模式端点即可接入，策略、授权矩阵与计量在三种模式下完全一致。
        </P>
        <H3>三种模式的网关端点</H3>
        <Table
          head={["模式", "端点", "适用场景", "认证"]}
          rows={[
            [
              <strong key="m">桌面代理（模式一）</strong>,
              <Code key="u">http://127.0.0.1:8931/v1</Code>,
              "每位用户在自己电脑运行企业代理，同机 Agent（Claude Code、WorkBuddy 等）直连本机网关；密钥与提示词不出本机。",
              <>本机调用也必须携带 ak_；首次启动自动签发「本机默认 Agent」密钥（见代理欢迎向导）。</>,
            ],
            [
              <strong key="m">集中式网关（模式二）</strong>,
              <Code key="u">http://&lt;代理IP&gt;:8931/v1</Code>,
              "企业代理部署在服务器并监听局域网地址，全公司统一入口，可挂负载均衡 / VIP；多台代理无状态对等。",
              "远程调用必须携带 Agent 的 ak_ 密钥（Ed25519 签名，代理本地离线校验）",
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
          集中式端点的确切地址以控制台「治理域管理」中各企业代理上报的地址为准；默认端口 8931，可在代理设置中修改。
        </P>
        <H3>ak_ 密钥</H3>
        <Ul
          items={[
            <>在控制台「Agent 管理」中对具体 Agent 点击「轮换令牌」获得；<Code>ak_</Code> 为 Ed25519 签名凭证，含 agentId、治理域、24 小时有效期与唯一 jti，仅显示一次，请立即保存。</>,
            <>以 HTTP Bearer 方式携带；每个 Agent 一把密钥，可轮换、吊销（吊销随 bootstrap 下发，代理离线也生效）。</>,
            <>代理内置控制面公钥，<strong>完全离线也能验签</strong>；控制面宕机不影响鉴权——过期凭证在 72 小时宽限内继续放行（伪造/吊销/域停用无宽限）。</>,
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
          换成桌面或集中式端点时，仅需替换 URL。模型名以「模型秘钥」中凭证的承接模型为准。
        </P>
      </section>

      {/* ------------------------------ 授权矩阵与策略 ------------------------------ */}
      <section className="mt-20">
        <H2 id="policy">授权矩阵与策略引擎</H2>
        <P>
          准入的唯一真相是<strong>授权矩阵</strong>：为每个 Agent 显式授予模型、MCP Server、工具与 Skill
          （Agent 详情页的矩阵编辑器；高风险工具必须逐一枚举授权，不得从服务继承）。策略引擎在准入之后做<strong>条件收窄与
          DENY 拦截</strong>——不再承担放行职责。
        </P>
        <P>每次调用的执行顺序（铁律）：</P>
        <Block
          lang="text"
          code={`1. 身份校验   ak_ 验签 → agentId + 治理域
2. 矩阵准入   该 agent 对该资源有无 grant → 无则 403 not_granted
3. 策略求值   仅 DENY 与条件收窄 → 命中 403 explicit_deny
4. 内容安全 / 限流 / 预算（按配置）`}
        />
        <H3>8 个策略动作与执行位置</H3>
        <Table
          head={["动作", "含义", "求值位置 / 语义"]}
          rows={[
            [<Code key="a">model:invoke</Code>, "调用模型", "网关每次调用前（云端中继 + 企业代理本地离线）；DENY-only"],
            [<Code key="a">mcp:invoke</Code>, "调用 MCP", "网关 / 企业代理的 MCP 路由（tools/call）；与 tool:execute 同时校验"],
            [<Code key="a">tool:execute</Code>, "执行工具", "网关 / 企业代理；资源为聚合工具名（服务器名__工具名）"],
            [<Code key="a">skill:use</Code>, "使用 Skill", "企业代理本地网关（skill 端点）；资源为 Skill ID"],
            [<Code key="a">mcp:discover</Code>, "发现 MCP", "企业代理（tools/list 发现阶段）"],
            [<Code key="a">agent:register</Code>, "注册 Agent", "控制台；仅 DENY 生效"],
            [<Code key="a">audit:export</Code>, "导出审计", "控制台；仅 DENY 生效"],
            [<Code key="a">policy:override</Code>, "变更策略", "控制台；仅 DENY 生效"],
          ]}
        />
        <Callout tone="info">
          企业代理上没有控制台登录身份，只有 EVERYONE 与 AGENT 两类主体的规则在代理生效（AGENT 规则在调用方由签名令牌
          绑定或携带 x-aegis-agent 头时匹配）；ROLE / USER 主体规则只在控制台生效。
        </Callout>
        <H3>策略语义：仅 DENY 生效</H3>
        <Ul
          items={[
            <><strong>放行靠矩阵，不靠策略。</strong>只配置矩阵、不写任何策略 → 调用正常；矩阵未授权 → 403 <Code>not_granted</Code>（与策略无关）。</>,
            <><strong>策略只有 DENY 有牙齿。</strong>命中 DENY → 403 <Code>explicit_deny</Code>；ALLOW 规则在网关路径上不产生放行效果。同一请求 DENY 优先。</>,
            <><strong>表达式错误 = fail-closed。</strong>条件求值出错（语法错、未知顶层标识符、类型错误）→ DENY 规则<strong>按命中处理</strong>、ALLOW 规则按不命中处理，错误文本记入审计 <Code>conditionError</Code>——写错的"禁止 GPT"不会静默失效。</>,
            <><strong>无策略缓存 = 拒绝。</strong>代理拿不到策略缓存时按 default-deny 处理并记 <Code>no_policy_cache</Code>（灰度期除外，见下）。</>,
            <><strong>灰度（warn）模式</strong>下 DENY 命中只记录不拦截：审计标 <Code>governed:false + wouldDeny:true</Code>，不计入治理覆盖率；灰度需填原因、14 天到期自动切回 enforce。</>,
          ]}
        />
        <H3>条件表达式完整参考</H3>
        <P>
          条件表达式写在规则的「条件」中（JSON <Code>{"{ expr: \"...\" }"}</Code> 的 expr 字段），每次调用时对本次请求的属性求值。
          表达式为无副作用沙箱语言：支持字符串 / 数字 / 布尔 / null 字面量、点路径变量、运算符、内置函数与括号；
          没有赋值、三元、逗号序列等语法。保存时服务端强制编译校验，不通过即 400。
        </P>
        <H3>可用变量（按动作与时机）</H3>
        <Table
          head={["变量", "含义", "model:invoke", "mcp / skill / discover", "控制台动作"]}
          rows={[
            [<Code key="v">model</Code>, "请求的模型名", "有值", '空串 ""', '空串 ""'],
            [<Code key="v">agent.id</Code>, "Agent ID", "有值（令牌绑定或带 x-aegis-agent 头时）", "有值", "无"],
            [<Code key="v">agent.type</Code>, "Agent 类型 SHARED / USER_SIDE / CLOUD", "有值", "有值", "无"],
            [<Code key="v">tenant.plan</Code>, "租户生效套餐（含试用期的 CLOUD_PRO 口径）", "有值", "有值", "有值"],
            [<Code key="v">usage.inputTokens</Code>, "输入 token 计数（调用前为估算值）", <strong key="v">估算值</strong>, "估算值", "—"],
            [<Code key="v">usage.outputTokens</Code>, "输出 token 计数（调用前恒为 0）", <strong key="v">0</strong>, "0", "—"],
            [<Code key="v">hour</Code>, "服务器本地小时（0–23，用于时段策略）", "有值", "有值", "有值"],
            [<Code key="v">subject</Code>, "主体标识", "agentId，未识别时为 anonymous", "同左", "当前用户邮箱"],
          ]}
        />
        <Callout tone="info">
          策略在调用上游模型<strong>之前</strong>求值：此时 <Code>usage.inputTokens</Code> 为<strong>估算值</strong>（字符法：CJK
          约 1 token/字，其余约 4 字符/token），适合做「prompt 不超过 10 万 tokens」这类粗粒度阈值。需要<strong>精确</strong>的
          token 预算与熔断，请使用「限流与预算」（按调用后真实用量、控制面统一计数）。未知顶层标识符按错误处理（fail-closed）；
          已声明对象内的缺失字段求值为 undefined（安全降级，不会抛错）。
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
            <><Code>model.startsWith('gpt') &amp;&amp; tenant.plan == 'ENTERPRISE'</Code> —— 组合：仅企业版租户拦 gpt 系（DENY）。</>,
            <><Code>agent.type == 'CLOUD' &amp;&amp; !model.startsWith('glm')</Code> —— 云 Agent 禁非 glm 模型（DENY 条件）。</>,
            <><Code>matches(model, '^gpt-4o(-[0-9]{4})?$')</Code> —— 正则精确圈定 gpt-4o 及其日期变体。</>,
            <><Code>hour &gt;= 22 || hour &lt; 8</Code> —— 时段策略：仅夜间命中（配合 DENY 即"夜间禁调"）。</>,
            <><Code>contains(lower(model), 'gpt') || contains(lower(model), 'glm')</Code> —— 函数组合，大小写不敏感地匹配多个关键字。</>,
            <><Code>subject == 'anonymous'</Code> —— 识别未携带 Agent 身份的匿名调用（常作 DENY 条件拒绝匿名）。</>,
            <><Code>subject == 'zhangsan@corp.com'</Code> —— 控制台动作按用户邮箱限制（如仅拒绝某人导出审计）。</>,
          ]}
        />
        <H3>AI 生成策略</H3>
        <P>
          策略页「AI 生成策略」把模糊意图（如"仅允许国产模型""夜间禁止调用 gpt"）翻译为结构化建议（效果 + 条件表达式 + 解释），
          支持「预览影响」（dry-run：按资源名统计近 7 天匹配调用数，不落库）与「重新生成」。确认创建即走四眼审批流程。
        </P>
        <H3>四眼审批</H3>
        <P>
          多管理员租户中，策略创建与内容变更进入「待批准」状态（不生效、不下发），必须<strong>另一名</strong>管理员在列表中点「批准」
          才转为生效；申请人不能自批（服务端强制）。批准动作写入审计。单管理员租户自动生效。
        </P>
      </section>

      {/* ------------------------------ 内容安全 ------------------------------ */}
      <section className="mt-20">
        <H2 id="content-safety">内容安全</H2>
        <P>
          内容安全是<strong>辅助发现</strong>机制，对模型请求 messages 文本、MCP 工具参数与返回值、非流式模型响应做敏感内容检查。
          定位是概率性发现，不承诺召回率，<strong>不作为数据不出域的支撑论据</strong>；SSE 流式响应不检查。
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
              <strong>BLOCK（阻断）</strong>：模型请求命中返回 403 <Code>content_blocked</Code>；MCP 参数/响应命中返回 JSON-RPC
              <Code>-32005 content_blocked</Code>（不返回部分结果）。响应中仅说明命中的检查类别，不回显敏感内容本身。
            </>,
            <>
              <strong>AUDIT_ONLY（仅审计）</strong>：放行并在审计中记录命中类别（side 标记 mcp_arguments / mcp_result / model_response），适合灰度观察自定义规则的误报率。
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
              "每个 API key（ak_）每分钟允许的请求数。超限返回 429 rate_limited，错误信息含建议重试间隔，客户端应退避重试。按代理实例各自计数（文档口径：限流是每实例的近似值）。",
            ],
            [
              <Code key="c">dailyTokenBudget</Code>,
              "租户每日 token 预算（输入 + 输出合计），UTC 日界统一重置。控制面统一计数：云端中继按数据库聚合判定；企业代理用 max(本地计数, 控制面上报值) 校准，多实例不会 N 倍绕过。",
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
            <>收到 <Code>rate_limited</Code> 应等待后重试；收到 <Code>budget_exceeded</Code> 说明当日预算已用尽，应联系管理员调整预算或等待 UTC 零点重置。</>,
            <>80% 告警只触发一次（按"首次跨过"判定），用于提前介入，不影响调用。</>,
          ]}
        />
      </section>

      {/* ------------------------------ AI 策略评估 ------------------------------ */}
      <section className="mt-20">
        <H2 id="ai-guard">AI 策略评估</H2>
        <P>
          AI 策略评估在每次模型调用前，用所选「判定模型」对 system 提示词 + 最后一条用户消息做结构化判定，
          让大模型自身参与治理决策（结构化判定 + 置信度）。云端中继即时生效；企业代理在下次心跳后自动生效。
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
          <strong>review 为什么不拦截：</strong>review 是设计上的"观察档"——只打标、不阻断，避免对正常办公的误伤。
          需要拦截时，判定模型应输出 block，且模式为 BLOCK。
        </Callout>
        <H3>超时与失败行为</H3>
        <Ul
          items={[
            <>判定超时、上游报错或输出无法解析为 JSON 时，按 failOpen 配置处理：开=放行并记录审计（含 error 与 failOpen 标记）；关=阻断。</>,
            <>治理路径（矩阵/策略/内容安全/限流）与模型调用相互独立：判定服务宕机不影响其他治理层生效。</>,
          ]}
        />
      </section>

      {/* ------------------------------ 审计与来源 ------------------------------ */}
      <section className="mt-20">
        <H2 id="audit">审计与来源</H2>
        <P>
          每次矩阵准入与策略求值都会留下 <Code>policy_evaluated</Code> 审计事件（含 reason、命中策略名、conditionError、
          tokenMode、coverage 标记）；模型调用、内容命中、限流、预算、漂移、脱离治理等事件同样入链，形成不可变哈希链
          （明细与链分表），可在控制台「治理 → 审计」页一键校验链完整性。
        </P>
        <H3>三种事件来源</H3>
        <Table
          head={["来源", "含义", "来源标识"]}
          rows={[
            ["云端网关", "SaaS 中继处理的调用与判定", <Code key="s">source_relay</Code>],
            ["企业代理", "连接模式的企业代理（治理域）同步的事件", <Code key="s">source_edge</Code>],
            ["独立代理", "社区版独立模式代理本地产生的事件", <Code key="s">source_standalone</Code>],
          ]}
        />
        <P>控制台审计页可按来源筛选；独立模式的事件标记 <Code>governed:false</Code>（无治理模式，明示而非默示）。</P>
        <H3>治理覆盖率</H3>
        <P>
          仪表盘首屏的覆盖率是事实指标：调用维度 = 带 <Code>coverage:true</Code> 标记且 <Code>governed:true</Code> 的调用 /
          到达网关的调用总数；灰度放行（wouldDeny）与凭证降级（graceReason）单列、不计入分子。代理维度 =
          心跳健康设备 / 已纳管设备（桌面代理休眠单独计 SLEEPING，不算脱离治理）。
        </P>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section className="mt-20">
        <H2 id="faq">常见问题（FAQ）</H2>

        <H3>1. MCP 调用 403 / 工具"不存在"，怎么办？</H3>
        <P>
          先分清两种拒绝：<Code>403 not_granted</Code> = 授权矩阵未放行（到 MCP 详情给该 Agent 授权；HIGH/CRITICAL
          工具必须逐一枚举授权）；JSON-RPC <Code>-32601 Unknown tool</Code> = 工具存在但对该 Agent 不可见（设计如此，
          不泄露存在性）。仅配策略 ALLOW 不会放行——放行只由矩阵决定。
        </P>

        <H3>2. 为什么我的 DENY 策略没有拦到调用？</H3>
        <Ul
          items={[
            <>执行顺序：矩阵先、策略后。若调用在矩阵层就被 <Code>not_granted</Code> 拒绝，根本走不到策略。</>,
            <>生效时延：云端中继即时；企业代理等下次心跳（约 60 秒）；多管理员租户的策略可能还在「待批准」。</>,
            <>资源名不匹配：大小写敏感，MCP 工具要用聚合名（服务器名__工具名）。</>,
            <>条件不命中或表达式报错：看审计 <Code>policy_evaluated</Code> 的 reason / conditionError（报错按命中处理，会拦截而非放行）。</>,
          ]}
        />

        <H3>3. 表达式报错了怎么排查？</H3>
        <Ul
          items={[
            <>先看「审计」中对应请求的 <Code>policy_evaluated</Code> 事件，<Code>conditionError</Code> 会给出解析错误与位置。</>,
            <>常见错误：括号不闭合、引号不配、把 <Code>&amp;&amp;</Code> 写成 and、引用白名单外的顶层标识符（保存时即 400）。</>,
            <><Code>matches()</Code> 的正则非法<strong>不会报错</strong>，只是恒为 false——正则规则不命中时先检查正则本身。</>,
          ]}
        />

        <H3>4. 判定结果是 review，为什么没有拦截？</H3>
        <P>
          这是设计行为：review 只标记、不拦截，避免误伤正常办公。需要拦截时，判定模型应输出 block，
          且「AI 策略评估」的模式为 BLOCK（AUDIT_ONLY 模式下 block 也只记录不拦截）。
        </P>

        <H3>5. 如何只给某个 Agent 放开某个模型？</H3>
        <P>
          不需要写策略：到「Agent 管理 → 该 Agent → 模型授权」勾选该模型即可（写授权矩阵）。策略只负责在这之后再做 DENY 收窄。
        </P>

        <H3>6. 响应缓存与内容安全是什么关系？会不会绕过检查？</H3>
        <P>
          不会。每个请求都先经过矩阵、策略、内容安全与 AI 判定，之后才查响应缓存；命中缓存只跳过上游模型调用
          （按 0 token、0 成本计量），所有治理检查照常执行。客户端也可用请求头 <Code>x-aegis-no-cache: 1</Code> 跳过缓存强制回源。
        </P>

        <H3>7. 收到 429，是限流还是预算用完了？</H3>
        <P>
          看响应体 <Code>error.type</Code>：<Code>rate_limited</Code> 是每 key 每分钟超限，等待错误信息中的间隔后重试即可；
          <Code>budget_exceeded</Code> 是租户当日 token 预算用尽（需开启 budgetHardStop 才会硬断），需管理员调高预算或等 UTC 零点重置。
        </P>

        <H3>8. usage.inputTokens 在调用前是什么值？</H3>
        <P>
          策略在调用上游前求值，此时真实 token 计数尚未产生，<Code>usage.inputTokens</Code> 为<strong>估算值</strong>（字符法：CJK
          约 1 token/字，其余约 4 字符/token），因此「prompt 不超过 N tokens」这类粗粒度阈值是有效且真实生效的。如果需要
          <strong>精确</strong>的 token 预算与熔断，请使用「限流与预算」的 dailyTokenBudget——它按调用后真实用量、控制面统一计数。
        </P>

        <H3>9. 桌面模式和集中式模式的认证有什么差别？</H3>
        <P>
          两种模式的网关都<strong>要求 ak_</strong>（早期版本的回环免认证已下线）。差别在签发方式：桌面代理首次启动自动创建
          「本机默认 Agent」并签发密钥（欢迎向导展示 endpoint + 密钥 + 客户端配置片段）；集中式模式的 Agent 由控制面注册并签发。
          无论哪种，验签都在代理本地离线完成。
        </P>

        <H3>10. 策略修改后多久生效？</H3>
        <P>
          云端中继立即生效；企业代理在下次心跳（约 60 秒）后生效；独立模式在代理本地配置，保存即生效。策略缓存缺失时代理按
          <Code>no_policy_cache</Code> 拒绝（fail-closed），连接恢复后自动收敛。
        </P>
      </section>
    </div>
  );
}
