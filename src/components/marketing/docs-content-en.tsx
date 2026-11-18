import type { ReactNode } from "react";

// Public documentation body — English (route /en/docs). Mirrors the CURRENT
// enforcement code and stays in lockstep with the Chinese twin
// (docs-content.tsx). Update both in the same commit.

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

export function DocsBodyEn() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24">
      {/* ------------------------------ Quick start ------------------------------ */}
      <section className="mt-16">
        <H2 id="quickstart">Quick start</H2>
        <P>
          The Aegis model gateway ships in three deployment modes. All speak the OpenAI-compatible API (
          <Code>/v1/chat/completions</Code>) and the Anthropic-compatible API (<Code>/v1/messages</Code>, streaming
          included); the local gateway additionally exposes <Code>/v1/models</Code>. Point your client&apos;s baseURL at
          any mode — credentials, the grant matrix, policies and metering behave identically across all three.
        </P>
        <H3>Gateway endpoints by mode</H3>
        <Table
          head={["Mode", "Endpoint", "Best for", "Auth"]}
          rows={[
            [
              <strong key="m">Desktop proxy (Mode 1)</strong>,
              <Code key="u">http://127.0.0.1:8931/v1</Code>,
              "Each user runs the enterprise proxy on their own machine; on-machine agents (Claude Code, WorkBuddy…) hit the local gateway. Keys and prompts never leave the machine.",
              <>Local calls still require an ak_; first launch auto-issues a "default local agent" key (welcome wizard).</>,
            ],
            [
              <strong key="m">Centralized gateway (Mode 2)</strong>,
              <Code key="u">http://&lt;proxy-ip&gt;:8931/v1</Code>,
              "Proxy on a server listening on a LAN address — one company-wide endpoint, frontable by a load balancer; peer proxies are stateless.",
              "Remote calls must present an agent ak_ (Ed25519-signed, verified offline by the proxy)",
            ],
            [
              <strong key="m">SaaS relay (cloud agents)</strong>,
              <Code key="u">https://&lt;control-plane-domain&gt;/api/gateway/v1</Code>,
              "Cloud agents without a proxy (Lark, n8n Cloud, …) call the hosted gateway directly.",
              "HTTP Bearer + ak_ key",
            ],
          ]}
        />
        <P>
          The exact centralized endpoints are reported by each proxy under Governance domains; the default port is 8931
          and can be changed in proxy settings.
        </P>
        <H3>The ak_ key</H3>
        <Ul
          items={[
            <>Issued per agent from Agent management («Rotate key»). <Code>ak_</Code> is an Ed25519-signed credential carrying agentId, governance domain, a 24-hour expiry and a unique jti — shown once, save it immediately.</>,
            <>Sent as an HTTP Bearer token. Rotate or revoke per agent; revocations ride the bootstrap payload and apply offline.</>,
            <>The proxy embeds the control-plane public key, so <strong>verification works fully offline</strong>. If the control plane is down, expired credentials keep working for 72h (grace) — forgery, revocation and domain suspension never get grace.</>,
          ]}
        />
        <H3>curl example (SaaS relay)</H3>
        <Block
          lang="bash"
          code={`curl -X POST "https://<control-plane-domain>/api/gateway/v1/chat/completions" \\
  -H "Authorization: Bearer ak_xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [{ "role": "user", "content": "Hello, introduce yourself" }]
  }'`}
        />
        <P>Swap the URL for desktop or centralized modes. Model names follow the credentials configured under Model keys.</P>
      </section>

      {/* ------------------------------ Grant matrix & policies ------------------------------ */}
      <section className="mt-20">
        <H2 id="policy">Grant matrix &amp; policy engine</H2>
        <P>
          The single source of admission truth is the <strong>grant matrix</strong>: each agent is explicitly granted
          models, MCP servers, tools and skills (matrix editor on the agent detail page; HIGH/CRITICAL tools require
          per-tool grants and never inherit from the server). Policies run <em>after</em> admission and only
          <strong> narrow conditions and DENY</strong> — they no longer grant access.
        </P>
        <P>The per-call pipeline (in this exact order):</P>
        <Block
          lang="text"
          code={`1. Identity     ak_ signature verified -> agentId + governance domain
2. Admission   matrix grant for this agent+resource? -> else 403 not_granted
3. Policy      DENY-only evaluation -> hit = 403 explicit_deny
4. Content safety / rate limits / budget (as configured)`}
        />
        <H3>The 8 policy actions and where they evaluate</H3>
        <Table
          head={["Action", "Meaning", "Where / semantics"]}
          rows={[
            [<Code key="a">model:invoke</Code>, "Call a model", "Every call (cloud relay + offline on proxies); DENY-only"],
            [<Code key="a">mcp:invoke</Code>, "Invoke MCP", "MCP route (tools/call) on gateway/proxy; checked together with tool:execute"],
            [<Code key="a">tool:execute</Code>, "Run a tool", "Gateway/proxy; resource = aggregated tool name (server__tool)"],
            [<Code key="a">skill:use</Code>, "Use a skill", "Local proxy skill endpoint; resource = Skill ID"],
            [<Code key="a">mcp:discover</Code>, "Discover MCP", "Proxy (tools/list discovery phase)"],
            [<Code key="a">agent:register</Code>, "Register an agent", "Console; DENY-only"],
            [<Code key="a">audit:export</Code>, "Export audit", "Console; DENY-only"],
            [<Code key="a">policy:override</Code>, "Change policies", "Console; DENY-only"],
          ]}
        />
        <Callout tone="info">
          Proxies have no console identity, so only EVERYONE and AGENT subject rules take effect there (AGENT matches the
          signed-token binding or an x-aegis-agent header); ROLE / USER rules apply on the console only.
        </Callout>
        <H3>Policy semantics: DENY-only</H3>
        <Ul
          items={[
            <><strong>Admission comes from the matrix, not policies.</strong> Matrix alone with no policies → calls flow; no matrix grant → 403 <Code>not_granted</Code> (policy never consulted).</>,
            <><strong>Only DENY bites.</strong> A DENY hit → 403 <Code>explicit_deny</Code>; ALLOW rules have no granting effect on the gateway path. DENY wins ties.</>,
            <><strong>Expression errors are fail-closed.</strong> A condition that throws (syntax error, unknown top-level identifier, type error) counts as a DENY <strong>hit</strong> (and as an ALLOW miss) — a mistyped "ban GPT" rule cannot silently stop working. The error text lands in the audit <Code>conditionError</Code> field.</>,
            <><strong>No policy cache → deny.</strong> A proxy without a policy cache treats calls as default-deny and records <Code>no_policy_cache</Code> (except during the gray window, below).</>,
            <><strong>Gray (warn) mode</strong> logs DENY hits without blocking: the audit carries <Code>governed:false + wouldDeny:true</Code> and the call never counts as governed. Gray mode requires a reason and auto-reverts to enforce after 14 days.</>,
          ]}
        />
        <H3>Condition expressions — full reference</H3>
        <P>
          Conditions live in a rule&apos;s <Code>{"{ expr: \"...\" }"}</Code> field and are evaluated per call against that
          call&apos;s attributes. The language is a side-effect-free sandbox: string / number / boolean / null literals,
          dotted-path variables, operators, built-in functions and parentheses — no assignment, ternary or comma
          sequences. The server re-validates compilation on save and rejects broken expressions with 400.
        </P>
        <H3>Variables by action and timing</H3>
        <Table
          head={["Variable", "Meaning", "model:invoke", "mcp / skill / discover", "Console actions"]}
          rows={[
            [<Code key="v">model</Code>, "Requested model name", "set", '""', '""'],
            [<Code key="v">agent.id</Code>, "Agent ID", "set (token binding or x-aegis-agent header)", "set", "n/a"],
            [<Code key="v">agent.type</Code>, "Agent type: SHARED / USER_SIDE / CLOUD", "set", "set", "n/a"],
            [<Code key="v">tenant.plan</Code>, "Effective plan (CLOUD_PRO during trials)", "set", "set", "set"],
            [<Code key="v">usage.inputTokens</Code>, "Input token count (pre-dispatch estimate)", <strong key="v">estimate</strong>, "estimate", "—"],
            [<Code key="v">usage.outputTokens</Code>, "Output token count (always 0 pre-dispatch)", <strong key="v">0</strong>, "0", "—"],
            [<Code key="v">hour</Code>, "Server-local hour (0–23) for time windows", "set", "set", "set"],
            [<Code key="v">subject</Code>, "Subject identifier", "agentId, or anonymous", "same", "user email"],
          ]}
        />
        <Callout tone="info">
          Policies evaluate <strong>before</strong> the upstream call, so <Code>usage.inputTokens</Code> is an{" "}
          <strong>estimate</strong> (character-based: ~1 token per CJK char, ~4 chars per token elsewhere) — good enough
          for coarse thresholds like "prompt under 100k tokens". For <strong>exact</strong> budgets use Limits &amp;
          budget (metered post-call, centralized counting). Unknown top-level identifiers are errors (fail-closed);
          missing fields inside known objects evaluate to undefined (safe degradation, no throw).
        </Callout>
        <H3>Operators</H3>
        <Ul
          items={[
            <><strong>Comparison:</strong> <Code>==</Code> <Code>!=</Code> <Code>&lt;</Code> <Code>&lt;=</Code> <Code>&gt;</Code> <Code>&gt;=</Code> (numbers and strings; <Code>==</Code> is loose — number equals its string form, null equals undefined)</>,
            <><strong>Logic:</strong> <Code>&amp;&amp;</Code> <Code>||</Code> <Code>!</Code> (short-circuit)</>,
            <><strong>Arithmetic:</strong> <Code>+</Code> <Code>-</Code> <Code>*</Code> <Code>/</Code> <Code>%</Code> (<Code>+</Code> concatenates strings)</>,
            <><strong>Parens:</strong> group with <Code>( )</Code>.</>,
          ]}
        />
        <H3>Built-in functions</H3>
        <Table
          head={["Function", "Description"]}
          rows={[
            [<Code key="f">startsWith(a, b)</Code>, "Does string a start with b"],
            [<Code key="f">endsWith(a, b)</Code>, "Does string a end with b"],
            [<Code key="f">contains(a, b)</Code>, "Substring test; for arrays, membership test"],
            [<Code key="f">matches(a, regex)</Code>, "JavaScript regex test; an invalid regex returns false (no throw)"],
            [<Code key="f">len(a)</Code>, "String / array length, or object key count"],
            [<Code key="f">lower(a) / upper(a)</Code>, "Case conversion"],
          ]}
        />
        <P>
          <strong>Both styles are equivalent</strong> — method style is sugar; the receiver becomes the first argument:
        </P>
        <Block lang="expr" code={`startsWith(model, 'gpt')   // function style\nmodel.startsWith('gpt')    // method style, identical`} />
        <H3>Examples (simple to advanced)</H3>
        <Ul
          items={[
            <><Code>model == 'gpt-4o'</Code> — exact match.</>,
            <><Code>model.startsWith('gpt')</Code> — prefix match a model family.</>,
            <><Code>model.startsWith('gpt') &amp;&amp; tenant.plan == 'ENTERPRISE'</Code> — deny GPT-family unless enterprise (DENY).</>,
            <><Code>agent.type == 'CLOUD' &amp;&amp; !model.startsWith('glm')</Code> — cloud agents may only use glm models (DENY).</>,
            <><Code>matches(model, '^gpt-4o(-[0-9]{4})?$')</Code> — regex pinning gpt-4o and its dated variants.</>,
            <><Code>hour &gt;= 22 || hour &lt; 8</Code> — time window: matches only at night (DENY = "no calls at night").</>,
            <><Code>contains(lower(model), 'gpt') || contains(lower(model), 'glm')</Code> — case-insensitive multi-keyword match.</>,
            <><Code>subject == 'anonymous'</Code> — flag unidentified callers (common DENY condition).</>,
            <><Code>subject == 'zhangsan@corp.com'</Code> — console actions restricted by user email.</>,
          ]}
        />
        <H3>AI-assisted policy authoring</H3>
        <P>
          «AI 生成策略» translates fuzzy intent ("only allow domestic models", "no GPT at night") into a structured
          suggestion (effect + expression + explanation) with «Preview impact» (dry-run: counts resource-matched calls
          from the last 7 days without writing) and «Regenerate». Confirming runs the four-eyes flow.
        </P>
        <H3>Four-eyes approval</H3>
        <P>
          In tenants with more than one administrator, policy creation and content changes enter PENDING_APPROVAL (not
          enforced, not pushed) until a <strong>different</strong> administrator clicks «Approve» in the list. Self-approval
          is refused server-side. The approval is audit-logged. Single-administrator tenants auto-approve.
        </P>
      </section>

      {/* ------------------------------ Content safety ------------------------------ */}
      <section className="mt-20">
        <H2 id="content-safety">Content safety</H2>
        <P>
          Content safety is an <strong>auxiliary detection</strong> layer scanning model request messages, MCP tool
          arguments and return values, and non-streaming model responses. It is probabilistic (regex/rule based), makes no
          recall-rate claim and <strong>must not be cited as evidence for the data-boundary promise</strong>. SSE streaming
          responses are not scanned. Effective immediately on the cloud relay; on the next heartbeat for proxies; locally
          in standalone mode.
        </P>
        <H3>Detectors</H3>
        <Ul
          items={[
            <><strong>Phone numbers</strong> (mainland China ranges)</>,
            <><strong>National ID numbers</strong> (18 digits with check digit)</>,
            <><strong>Bank card numbers</strong></>,
            <><strong>IP addresses</strong> (IPv4)</>,
            <><strong>Keywords</strong>: built-in seed list + custom keywords (one per line, case-insensitive)</>,
            <><strong>Custom regexes</strong>: one JavaScript regex per line — employee IDs, project codes, private patterns</>,
          ]}
        />
        <H3>The two modes</H3>
        <Ul
          items={[
            <>
              <strong>BLOCK</strong>: model requests return 403 <Code>content_blocked</Code>; MCP arguments/results return
              JSON-RPC <Code>-32005 content_blocked</Code> (never a partial result). Responses name only the detector
              category — never the matched content.
            </>,
            <>
              <strong>AUDIT_ONLY</strong>: pass through and record the category in audit (side tag: mcp_arguments / mcp_result /
              model_response) — ideal for measuring false-positive rates on custom rules before blocking.
            </>,
          ]}
        />
      </section>

      {/* ------------------------------ Limits & budget ------------------------------ */}
      <section className="mt-20">
        <H2 id="limits">Limits &amp; budget</H2>
        <P>Settings → Limits &amp; budget provides two gates; 0 means unlimited.</P>
        <H3>Configuration semantics</H3>
        <Table
          head={["Setting", "Semantics"]}
          rows={[
            [
              <Code key="c">rpmPerKey</Code>,
              "Requests per minute per ak_. Over the limit → 429 rate_limited with a suggested retry delay; clients should back off. Counted per proxy instance (documented approximation).",
            ],
            [
              <Code key="c">dailyTokenBudget</Code>,
              "Tenant daily token budget (input + output), UTC day boundary. Centralized counting: the cloud relay enforces from the database aggregate; proxies calibrate with max(local, reported) so N instances cannot multiply the budget.",
            ],
            [
              <Code key="c">budgetHardStop</Code>,
              "On: hard 429 budget_exceeded once exhausted for the day. Off: no blocking, but a one-time alert fires at 80% (audit budget_threshold event).",
            ],
          ]}
        />
        <H3>Reading the 429s</H3>
        <Ul
          items={[
            <>Both gates return HTTP 429 but with different <Code>error.type</Code>: <Code>rate_limited</Code> (per key, per minute) vs <Code>budget_exceeded</Code> (daily budget).</>,
            <>On <Code>rate_limited</Code> wait and retry; on <Code>budget_exceeded</Code> the daily budget is spent — ask an admin to raise it or wait for the UTC reset.</>,
            <>The 80% alert fires once (first crossing) — early warning only, never blocks.</>,
          ]}
        />
      </section>

      {/* ------------------------------ AI policy evaluation ------------------------------ */}
      <section className="mt-20">
        <H2 id="ai-guard">AI policy evaluation</H2>
        <P>
          Before each model call, a configured judge model renders a structured decision over the system prompt plus the
          last user message — letting an LLM participate in governance (structured decision + confidence). Effective
          immediately on the relay; next heartbeat for proxies.
        </P>
        <H3>The structured decision</H3>
        <P>The judge prompt demands a single JSON object:</P>
        <Block
          lang="json"
          code={`{
  "decision": "allow | block | review",
  "categories": ["category names"],
  "confidence": 0.93,
  "reason": "human-readable reason, ≤120 chars"
}`}
        />
        <Ul
          items={[
            <><Code>decision</Code>: allow passes / block intercepts / review tags only.</>,
            <><Code>categories</Code>: e.g. <Code>none</Code>, <Code>password_leak</Code>, <Code>credential_leak</Code>, <Code>sensitive_data</Code>, <Code>policy_violation</Code>.</>,
            <><Code>confidence</Code>: 0–1; <Code>reason</Code>: readable basis.</>,
            <>Tolerated drift: missing fields default, unknown decision values count as allow, unparseable output counts as a judge failure (see below).</>,
          ]}
        />
        <H3>Configuration</H3>
        <Table
          head={["Setting", "Description"]}
          rows={[
            ["Enable + mode", "BLOCK: decision=block → 403 (category + reason). AUDIT_ONLY: everything passes, audit only."],
            ["Judge credential & model", "Pick from tested credentials with selected models under Model keys."],
            ["Judge prompt template", "Blank = built-in default. Variables: {{system}} {{user}} {{model}} {{agent}} {{plan}}."],
            ["Judge timeout (ms)", "Default 8000ms; timeouts count as failure."],
            ["failOpen", "On: timeout / error / unparseable → allow with audit. Off: failure → block."],
          ]}
        />
        <H3>Judge billing</H3>
        <P>
          Every judgment is a real model call billed at the judge model&apos;s normal rate (same metering and cost
          attribution as business calls). Frequent calls + an expensive judge = higher governance cost — pick a small,
          cheap judge model.
        </P>
        <Callout tone="info">
          <strong>Why review never blocks:</strong> review is a designed observe-only tier — it tags without intercepting,
          avoiding false positives on normal work. To intercept, the judge must output block and the mode must be BLOCK.
        </Callout>
        <H3>Timeouts &amp; failure behavior</H3>
        <Ul
          items={[
            <>On timeout, upstream error or unparseable output: failOpen on → allow + audit (error + failOpen tags); off → block.</>,
            <>Governance planes are independent of the judge: matrix / policies / content safety / limits keep working even if the judge service is down.</>,
          ]}
        />
      </section>

      {/* ------------------------------ Audit & sources ------------------------------ */}
      <section className="mt-20">
        <H2 id="audit">Audit &amp; sources</H2>
        <P>
          Every matrix admission and policy evaluation writes a <Code>policy_evaluated</Code> audit event (reason, policy
          name, conditionError, tokenMode, coverage flag). Model calls, content hits, rate limits, budget events, tool
          drift and detachments join the same append-only hash chain (details and chain stored in separate tables) —
          verify integrity from Governance → Audit in one click.
        </P>
        <H3>Three event sources</H3>
        <Table
          head={["Source", "Meaning", "Marker"]}
          rows={[
            ["Cloud gateway", "Calls and evaluations handled by the SaaS relay", <Code key="s">source_relay</Code>],
            ["Enterprise proxy", "Events synced from connected proxies (governance domains)", <Code key="s">source_edge</Code>],
            ["Standalone proxy", "Events produced locally by community standalone proxies", <Code key="s">source_standalone</Code>],
          ]}
        />
        <P>Filter by source in the audit console; standalone events carry <Code>governed:false</Code> (ungoverned mode, stated explicitly).</P>
        <H3>Governance coverage</H3>
        <P>
          The dashboard&apos;s coverage metrics are fact-based. Call dimension: calls with <Code>coverage:true</Code> and{" "}
          <Code>governed:true</Code> over all calls reaching the gateway; gray let-throughs (wouldDeny) and degraded
          credentials (graceReason) are reported separately and never count as governed. Proxy dimension: heartbeats-healthy
          devices over managed devices (sleeping desktops count as SLEEPING, not detached).
        </P>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section className="mt-20">
        <H2 id="faq">FAQ</H2>

        <H3>1. My MCP call returns 403 / "Unknown tool" — what now?</H3>
        <P>
          Two distinct refusals: <Code>403 not_granted</Code> = the grant matrix has no grant (open the MCP detail page and
          grant the agent; HIGH/CRITICAL tools need per-tool grants); JSON-RPC <Code>-32601 Unknown tool</Code> = the tool
          exists but is invisible to this agent (by design — existence is not leaked). Adding an ALLOW policy never admits
          anything — only the matrix does.
        </P>

        <H3>2. My DENY policy didn&apos;t intercept a call — why?</H3>
        <Ul
          items={[
            <>Order matters: matrix first, policy second. A call refused at the matrix (<Code>not_granted</Code>) never reaches policy.</>,
            <>Propagation: instant on the relay; next heartbeat (~60s) for proxies; in multi-admin tenants the policy may still be PENDING_APPROVAL.</>,
            <>Resource mismatch: matching is case-sensitive; MCP tools use the aggregated name (server__tool).</>,
            <>Condition miss or expression error: check the reason / conditionError on the audit <Code>policy_evaluated</Code> event (errors count as hits — they intercept, not pass).</>,
          ]}
        />

        <H3>3. How do I debug an expression error?</H3>
        <Ul
          items={[
            <>Open the audit <Code>policy_evaluated</Code> event for the request — <Code>conditionError</Code> carries the parse error and position.</>,
            <>Common mistakes: unclosed parens, mismatched quotes, writing `and` instead of <Code>&amp;&amp;</Code>, top-level identifiers outside the whitelist (rejected with 400 at save time).</>,
            <>An invalid regex inside <Code>matches()</Code> does <strong>not</strong> throw — it just always returns false.</>,
          ]}
        />

        <H3>4. The judge returned review — why wasn&apos;t anything blocked?</H3>
        <P>
          By design: review tags without blocking. To intercept, the judge must output block and the mode must be BLOCK
          (under AUDIT_ONLY even block is logged only).
        </P>

        <H3>5. How do I give one agent access to one model only?</H3>
        <P>
          No policy needed: Agent management → the agent → model grants, check that model (this writes the grant matrix).
          Policies only narrow further via DENY afterwards.
        </P>

        <H3>6. Does the response cache bypass content safety?</H3>
        <P>
          No. Every request passes the matrix, policies, content safety and the judge <em>before</em> the cache is consulted;
          a cache hit only skips the upstream model call (metered at 0 tokens / 0 cost). Clients can force a refresh with the
          <Code>x-aegis-no-cache: 1</Code> header.
        </P>

        <H3>7. I got a 429 — rate limit or budget?</H3>
        <P>
          Read <Code>error.type</Code>: <Code>rate_limited</Code> = per-key per-minute limit, retry after the suggested delay;
          <Code>budget_exceeded</Code> = the tenant&apos;s daily token budget is spent (requires budgetHardStop to actually block) —
          ask an admin to raise it or wait for the UTC reset.
        </P>

        <H3>8. What is usage.inputTokens before the call?</H3>
        <P>
          Policies evaluate before the upstream call, so <Code>usage.inputTokens</Code> is an <strong>estimate</strong>
          (~1 token per CJK char, ~4 chars per token elsewhere) — coarse thresholds like "prompt under N tokens" work
          for real. For <strong>exact</strong> budgets use dailyTokenBudget, metered post-call with centralized counting.
        </P>

        <H3>9. How do desktop and centralized auth differ?</H3>
        <P>
          Both gateway modes <strong>require an ak_</strong> (early loopback anonymity was removed). The difference is
          issuance: the desktop proxy auto-creates a default local agent and key on first launch (welcome wizard shows the
          endpoint, key and client snippets); centralized agents are registered and issued from the console. Verification
          is local and offline in both cases.
        </P>

        <H3>10. How fast do policy changes propagate?</H3>
        <P>
          Instant on the relay; next heartbeat (~60s) on proxies; instant in standalone local config. When a proxy has no
          policy cache it refuses calls as <Code>no_policy_cache</Code> (fail-closed) and converges once connectivity returns.
        </P>
      </section>
    </div>
  );
}
