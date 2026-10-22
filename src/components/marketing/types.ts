import type { getDictionary } from "@/i18n";

// Dictionaries are plain serializable objects, safe to pass from server
// components (page.tsx) down into client components (forms, menus).
export type MarketingDict = ReturnType<typeof getDictionary>;
