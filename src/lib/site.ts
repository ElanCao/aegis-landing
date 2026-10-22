// 独立 Landing/Docs 站点与 SaaS 控制面（console）之间的桥接配置。
// 生产环境请在部署平台配置 NEXT_PUBLIC_CONSOLE_URL。

export const CONSOLE_URL =
  process.env.NEXT_PUBLIC_CONSOLE_URL ?? "https://console.aegis.example.com";
