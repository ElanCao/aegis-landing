"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n";
import type { InterviewStep } from "@/i18n/dictionaries/zh";
import { CONSOLE_URL, DEMO_URL } from "@/lib/site";
import { Card } from "@/components/ui";
import type { MarketingDict } from "@/components/marketing/types";
import { IconArrowRight, IconCheck } from "@/components/marketing/icons";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

type Phase = "questions" | "thanks" | "success";

type Contact = { name: string; email: string; company: string; title: string };

function isAnswered(step: InterviewStep, answers: Record<string, string | string[]>) {
  // 开放选填题（text）无作答也允许继续。
  if (step.kind === "text") return true;
  const value = answers[step.id];
  if (step.kind === "multi" || step.kind === "ranked")
    return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.length > 0;
}

// 引导式 ITD/CIO 治理访谈：一屏一题，最后一步为致谢 / 转化页。
// 提交到 SaaS 控制面公开端点 POST {CONSOLE_URL}/api/interviews，
// 试用开通与通知邮件均由 SaaS 侧负责，这里只提交。
export function InterviewFlow({ t, locale }: { t: MarketingDict; locale: Locale }) {
  const it = t.interview;
  const steps = it.steps as InterviewStep[];
  const total = steps.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [contact, setContact] = useState<Contact>({ name: "", email: "", company: "", title: "" });
  const [phase, setPhase] = useState<Phase>("questions");
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [trialCreated, setTrialCreated] = useState(false);

  const step = steps[index];
  if (!step) return null;
  const answered = isAnswered(step, answers);
  const isLast = index === total - 1;

  function setSingle(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMulti(stepDef: InterviewStep, value: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[stepDef.id]) ? (prev[stepDef.id] as string[]) : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : stepDef.max && current.length >= stepDef.max
          ? current
          : [...current, value];
      return { ...prev, [stepDef.id]: next };
    });
  }

  function goNext() {
    if (isLast) setPhase("thanks");
    else setIndex((i) => Math.min(i + 1, total - 1));
  }

  async function submit() {
    setSubmitting(true);
    setFailed(false);
    const name = contact.name.trim();
    const email = contact.email.trim();
    const company = contact.company.trim();
    const title = contact.title.trim();
    const body: Record<string, unknown> = { locale, answers };
    if (name) body.name = name;
    if (email) body.email = email;
    if (company) body.company = company;
    if (title) body.title = title;
    try {
      const res = await fetch(`${CONSOLE_URL}/api/interviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json: unknown = await res.json().catch(() => null);
      if (res.ok && json && typeof json === "object" && (json as { ok?: boolean }).ok === true) {
        const data = (json as { data?: { trialCreated?: boolean } }).data;
        setTrialCreated(Boolean(data?.trialCreated));
        setPhase("success");
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  // ---- 致谢 / 转化页 ----------------------------------------------------
  if (phase === "thanks") {
    const hasEmail = contact.email.trim().length > 0;
    const contactFields: { key: keyof Contact; label: string; type?: string; autoComplete?: string }[] = [
      { key: "name", label: it.thanks.name, autoComplete: "name" },
      { key: "email", label: it.thanks.email, type: "email", autoComplete: "email" },
      { key: "company", label: it.thanks.company, autoComplete: "organization" },
      { key: "title", label: it.thanks.jobTitle, autoComplete: "organization-title" },
    ];
    return (
      <Card className="p-6 sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{it.thanks.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{it.thanks.subtitle}</p>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-sm font-medium text-slate-700">{it.thanks.formTitle}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {contactFields.map((field) => (
              <div key={field.key}>
                <label htmlFor={`interview-${field.key}`} className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}
                </label>
                <input
                  id={`interview-${field.key}`}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  value={contact[field.key]}
                  onChange={(e) => setContact((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className={inputClass}
                />
                {field.key === "email" ? (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{it.thanks.emailHint}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {failed ? (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {it.thanks.error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="flex-1 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
          >
            {submitting
              ? t.common.loading
              : failed
                ? it.thanks.retry
                : hasEmail
                  ? it.thanks.submitWithEmail
                  : it.thanks.submitWithoutEmail}
          </button>
          <a
            href={`${DEMO_URL}/${locale}#demo`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {it.thanks.bookDemo}
            <IconArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Card>
    );
  }

  // ---- 提交成功 ----------------------------------------------------------
  if (phase === "success") {
    return (
      <Card className="p-8 text-center sm:p-12">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
          <IconCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">{it.success.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">{it.success.message}</p>
        {trialCreated ? (
          <p className="mx-auto mt-4 max-w-md rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
            {it.success.trialSent}
          </p>
        ) : null}
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          {it.success.backHome}
        </Link>
      </Card>
    );
  }

  // ---- 题目（一屏一题） ---------------------------------------------------
  const singleValue = typeof answers[step.id] === "string" ? (answers[step.id] as string) : "";
  const multiValue = Array.isArray(answers[step.id]) ? (answers[step.id] as string[]) : [];
  const followup = step.followup;
  // 单选题按选中值命中；多选/排序题按已选项与 when 的交集命中。
  const followupVisible = followup
    ? step.kind === "single"
      ? singleValue.length > 0 && followup.when.includes(singleValue)
        ? followup
        : undefined
      : multiValue.some((v) => followup.when.includes(v))
        ? followup
        : undefined
    : undefined;

  return (
    <Card className="p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">
          {it.progress.replace("{x}", String(index + 1)).replace("{n}", String(total))}
        </p>
        <p className="font-mono text-xs text-slate-400">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden>
        <div
          className="h-full rounded-full bg-blue-700 transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <h1 className="mt-6 text-xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-2xl">
        {step.question}
      </h1>
      {step.hint ? (
        <p className="mt-2 text-sm text-slate-500">{step.hint.replace("{n}", String(step.max ?? ""))}</p>
      ) : null}

      <div className="mt-6">
        {step.kind === "single" ? (
          <ul className="space-y-2.5">
            {(step.options ?? []).map((opt) => {
              const selected = singleValue === opt.value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => setSingle(step.id, opt.value)}
                    aria-pressed={selected}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {opt.label}
                      {selected ? <IconCheck className="h-4 w-4 shrink-0 text-blue-700" /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {step.kind === "multi" || step.kind === "ranked" ? (
          <div className="flex flex-wrap gap-2">
            {(step.options ?? []).map((opt) => {
              const selected = multiValue.includes(opt.value);
              // 排序题：点选顺序即优先级，chip 上显示序号徽章。
              const rank = step.kind === "ranked" ? multiValue.indexOf(opt.value) + 1 : 0;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleMulti(step, opt.value)}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-800"
                  }`}
                >
                  {rank > 0 ? (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25 text-[11px] font-semibold">
                      {rank}
                    </span>
                  ) : null}
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {step.kind === "text" ? (
          <textarea
            value={singleValue}
            onChange={(e) => setSingle(step.id, e.target.value)}
            rows={4}
            placeholder={step.placeholder}
            className={inputClass}
          />
        ) : null}

        {step.extra ? (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">
              {step.extra.label}
              {step.extra.hint ? <span className="ml-1 text-xs font-normal text-slate-400">{step.extra.hint}</span> : null}
            </p>
            <textarea
              value={typeof answers[step.extra.key] === "string" ? (answers[step.extra.key] as string) : ""}
              onChange={(e) => setSingle(step.extra!.key, e.target.value)}
              rows={3}
              placeholder={step.extra.placeholder}
              className={`${inputClass} mt-2`}
            />
          </div>
        ) : null}

        {followupVisible ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">{followupVisible.question}</p>
            {followupVisible.options ? (
              <ul className="mt-3 space-y-2">
                {followupVisible.options.map((opt) => {
                  const selected = answers[followupVisible.key] === opt.value;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => setSingle(followupVisible.key, opt.value)}
                        aria-pressed={selected}
                        className={`w-full rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                          selected
                            ? "border-blue-600 bg-white text-blue-900 ring-1 ring-blue-600"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          {opt.label}
                          {selected ? <IconCheck className="h-4 w-4 shrink-0 text-blue-700" /> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <textarea
                value={typeof answers[followupVisible.key] === "string" ? (answers[followupVisible.key] as string) : ""}
                onChange={(e) => setSingle(followupVisible.key, e.target.value)}
                rows={3}
                placeholder={followupVisible.placeholder}
                className={`${inputClass} mt-3`}
              />
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        {index > 0 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            {it.prev}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={!answered}
          className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLast ? it.finish : it.next}
        </button>
      </div>
    </Card>
  );
}
