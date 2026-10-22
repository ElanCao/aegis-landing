"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n";
import type { MarketingDict } from "./types";
import { IconCheck } from "./icons";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

// PRD 12.6 demo request form. 独立站点不内置提交接口：表单 POST 到 SaaS
// 控制面对外的 /api/demo-requests（由 demo-section 注入 endpoint）。
export function DemoForm({ t, locale, endpoint }: { t: MarketingDict; locale: Locale; endpoint: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [failed, setFailed] = useState(false);
  const f = t.demo.fields;

  const fields: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    textarea?: boolean;
    full?: boolean;
    autoComplete?: string;
  }[] = [
    { name: "name", label: f.name, required: true, autoComplete: "name" },
    { name: "email", label: f.email, type: "email", required: true, autoComplete: "email" },
    { name: "company", label: f.company, required: true, autoComplete: "organization" },
    { name: "industry", label: f.industry },
    { name: "companySize", label: f.companySize },
    { name: "agentCount", label: f.agentCount },
    { name: "goals", label: f.goals },
    { name: "timeframe", label: f.timeframe },
    { name: "notes", label: f.notes, textarea: true, full: true },
  ];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSubmitting(true);
    setFailed(false);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const json: unknown = await res.json().catch(() => null);
      if (res.ok && json && typeof json === "object" && (json as { ok?: boolean }).ok === true) {
        setSucceeded(true);
        form.reset();
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (succeeded) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
          <IconCheck className="h-6 w-6" />
        </div>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-emerald-900">
          {t.demo.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {failed ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {t.demo.error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
            <label htmlFor={`demo-${field.name}`} className="mb-1.5 block text-sm font-medium text-slate-700">
              {field.label}
              {field.required ? <span className="ml-0.5 text-red-600">*</span> : null}
            </label>
            {field.textarea ? (
              <textarea
                id={`demo-${field.name}`}
                name={field.name}
                rows={4}
                className={inputClass}
              />
            ) : (
              <input
                id={`demo-${field.name}`}
                name={field.name}
                type={field.type ?? "text"}
                required={field.required}
                autoComplete={field.autoComplete}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
      >
        {submitting ? t.common.loading : t.common.submit}
      </button>
    </form>
  );
}
