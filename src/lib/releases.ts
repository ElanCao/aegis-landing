// 静态发布信息：本站点为独立部署的 Landing/Docs，不连接 SaaS 数据库，
// 客户端版本号在此手动维护，发版时同步更新。
// 生产环境如需自动发布渠道，应改为请求 SaaS 控制面的 /api/releases/latest 接口。
export const LATEST_RELEASE: {
  version: string;
  downloadUrl: string;
  notes: string;
} = {
  version: "0.1.0",
  // 占位：正式发布物就绪前指向控制台首页；若未配置则前端隐藏下载按钮。
  downloadUrl: process.env.NEXT_PUBLIC_CONSOLE_URL ?? "",
  notes: "首个公开预览版：Agent 治理控制面、模型网关、MCP / Skill 权限管理与审计闭环。",
};
