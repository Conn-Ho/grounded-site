import type { Locale } from "@/lib/i18n";

export type HuntTabKey = "match" | "trending" | "insight";

export type HuntItem = {
  id: string;
  tab: HuntTabKey;
  type: "project" | "insight";
  title: string;
  source: string;
  meta: string;
  summary: string;
  cta: string;
  href: string;
};

const huntItems: Record<Locale, HuntItem[]> = {
  en: [
    {
      id: "match-1",
      tab: "match",
      type: "project",
      title: "ESP32 E-Ink Desk Companion",
      source: "GitHub",
      meta: "ESP32-S3 · low power · weekend build",
      summary:
        "A compact e-ink side display for tasks, timers, and agent status. Good starter build with a clear enclosure path.",
      cta: "Start from this",
      href: "#waitlist",
    },
    {
      id: "match-2",
      tab: "match",
      type: "project",
      title: "RP2040 Macro Pad",
      source: "GitHub",
      meta: "RP2040 · USB HID · beginner PCB",
      summary:
        "Small enough to finish, rich enough to exercise sourcing, flashing, and enclosure fit checks inside Amagine.",
      cta: "Start from this",
      href: "#waitlist",
    },
    {
      id: "trending-1",
      tab: "trending",
      type: "project",
      title: "Open Sensor Tile",
      source: "Hackaday",
      meta: "sensor node · battery · modular",
      summary:
        "A reusable environmental sensor tile showing the kind of projects that fit the copy-and-remix workflow well.",
      cta: "Track this build",
      href: "#waitlist",
    },
    {
      id: "trending-2",
      tab: "trending",
      type: "insight",
      title: "What makers still do by hand",
      source: "Hacker News",
      meta: "discussion · tooling · workflow",
      summary:
        "Discussion threads like this are useful signal. They help explain where Amagine should automate and where humans still want control.",
      cta: "Open discussion",
      href: "https://news.ycombinator.com/",
    },
    {
      id: "insight-1",
      tab: "insight",
      type: "insight",
      title: "ESP32 builders comparing enclosure workflows",
      source: "Reddit",
      meta: "community thread · enclosure fit",
      summary:
        "A placeholder for the kind of community content we want to surface alongside buildable projects, without turning the homepage into a forum.",
      cta: "Open thread",
      href: "https://www.reddit.com/r/esp32/",
    },
    {
      id: "insight-2",
      tab: "insight",
      type: "insight",
      title: "Open hardware notes from China supply-chain builders",
      source: "Bilibili / blogs",
      meta: "CN maker ecosystem · sourcing",
      summary:
        "Another placeholder lane: bilingual sourcing and replication notes that are valuable even when they are not directly buildable.",
      cta: "Read notes",
      href: "#waitlist",
    },
  ],
  zh: [
    {
      id: "match-1",
      tab: "match",
      type: "project",
      title: "ESP32 电子墨水桌面终端",
      source: "GitHub",
      meta: "ESP32-S3 · 低功耗 · 周末可做",
      summary:
        "一个显示待办、计时器和 Agent 状态的小型电子墨水屏设备。适合作为第一批可复刻项目。",
      cta: "从这个开始",
      href: "#waitlist",
    },
    {
      id: "match-2",
      tab: "match",
      type: "project",
      title: "RP2040 宏键盘",
      source: "GitHub",
      meta: "RP2040 · USB HID · 入门 PCB",
      summary:
        "体量小、完成快，但足够覆盖采购、烧录和外壳适配这些 Amagine 核心环节。",
      cta: "从这个开始",
      href: "#waitlist",
    },
    {
      id: "trending-1",
      tab: "trending",
      type: "project",
      title: "开放式传感器 Tile",
      source: "Hackaday",
      meta: "传感器节点 · 电池供电 · 模块化",
      summary:
        "这类项目很适合 copy-and-remix 工作流：结构清晰，能快速看出 Amagine 在哪里真正省时间。",
      cta: "跟进这个项目",
      href: "#waitlist",
    },
    {
      id: "trending-2",
      tab: "trending",
      type: "insight",
      title: "Maker 们现在还在手工做哪些步骤",
      source: "Hacker News",
      meta: "讨论串 · 工具链 · 工作流",
      summary:
        "这类讨论是很有价值的信号，能帮助我们判断哪些环节该自动化，哪些环节用户仍希望自己掌控。",
      cta: "打开讨论",
      href: "https://news.ycombinator.com/",
    },
    {
      id: "insight-1",
      tab: "insight",
      type: "insight",
      title: "ESP32 玩家在讨论外壳工作流",
      source: "Reddit",
      meta: "社区讨论 · 外壳适配",
      summary:
        "这是我们想并排展示的内容类型：它本身不一定能直接做，但能补足项目上下文，而不是把首页做成论坛。",
      cta: "打开帖子",
      href: "https://www.reddit.com/r/esp32/",
    },
    {
      id: "insight-2",
      tab: "insight",
      type: "insight",
      title: "中文供应链玩家的开源硬件笔记",
      source: "Bilibili / 博客",
      meta: "中文 maker 生态 · 采购经验",
      summary:
        "另一条后续会补强的线：双语 sourcing / replication 笔记，即使暂时不能直接 bootstrap，也很值得收进 feed。",
      cta: "查看笔记",
      href: "#waitlist",
    },
  ],
};

export function getHuntItems(locale: Locale): HuntItem[] {
  return huntItems[locale] ?? huntItems.en;
}
