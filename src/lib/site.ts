// 独立 Landing/Docs 站点与 SaaS 控制面（console）之间的桥接配置。
// 生产环境请在部署平台配置 NEXT_PUBLIC_CONSOLE_URL。

export const CONSOLE_URL =
  process.env.NEXT_PUBLIC_CONSOLE_URL ?? "https://console.aegis.example.com";

// 线上营销站公网地址：「预约产品演示」等锚点跳转复用（首页 #demo 区块）。
export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL ?? "https://aegis.futurelabs.vip";
