import type { Locale } from "@/i18n";
import type { MarketingDict } from "./types";
import { Section } from "./section";
import { DemoForm } from "./demo-form";

// 未配置 NEXT_PUBLIC_DEMO_ENDPOINT 时的降级内容：不发起任何请求，引导邮件联系。
function DemoFallback() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-sm font-semibold text-slate-900">预约演示</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        预约演示请联系{" "}
        <a href="mailto:aegis@futurelabs.vip" className="font-medium text-blue-700 hover:underline">
          aegis@futurelabs.vip
        </a>
        ，我们将在 1-2 个工作日内回复。
      </p>
    </div>
  );
}

// PRD 12.6 Demo request: intro copy on the left, form on the right.
// 表单提交到 SaaS 公网地址的 /api/demo-requests（NEXT_PUBLIC_DEMO_ENDPOINT）；
// 未配置该环境变量时渲染降级联系方式，不发起请求。
export function DemoSection({ t, locale }: { t: MarketingDict; locale: Locale }) {
  const endpoint = process.env.NEXT_PUBLIC_DEMO_ENDPOINT;
  return (
    <Section id="demo" tone="slate">
      <div className="mt-0 grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t.demo.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{t.demo.description}</p>
        </div>
        {endpoint ? <DemoForm t={t} locale={locale} endpoint={endpoint} /> : <DemoFallback />}
      </div>
    </Section>
  );
}
