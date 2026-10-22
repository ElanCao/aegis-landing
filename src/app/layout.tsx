import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aegis — 企业 AI 的治理控制面",
    template: "%s | Aegis",
  },
  description:
    "Aegis 是企业 AI 的治理控制面：统一管理 Agent 身份、模型密钥、MCP 服务与 Skill 权限；企业代理持续评估公共 AI 可达性，业务数据默认不出域。",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // lang follows the locale cookie set by middleware / the locale switcher
  // (PRD V1.3). Defaults to zh for first-time visitors.
  const jar = await cookies();
  const lang = jar.get("aegis_locale")?.value === "en" ? "en" : "zh";
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
