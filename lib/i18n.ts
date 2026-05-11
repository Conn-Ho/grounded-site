export type Locale = "en" | "zh";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "zh"];

export type Dict = {
  nav: {
    loop: string;
    hunt: string;
    projects: string;
    packages: string;
    faq: string;
    joinWaitlist: string;
  };
  hero: {
    eyebrow: string;
    line1: string;
    between: string;
    strike: string;
    accent: string;
    line3: string;
    description: (emphasize: (w: string) => string) => string;
    joinWaitlist: string;
    browseProjects: string;
    scroll: string;
    stats: {
      packagesValue: string;
      packagesLabel: string;
      buildsValue: string;
      buildsLabel: string;
      savedValue: string;
      savedLabel: string;
    };
  };
  problem: {
    eyebrow: string;
    title: string;
    desc: string;
    today: { label: string; chip: string; lines: string[] };
    closed: { label: string; chip: string; lines: string[] };
  };
  loop: {
    eyebrow: string;
    title: string;
    desc: string;
    items: { n: string; title: string; body: string; tags: string[] }[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    desc: string;
    browseAll: string;
    copyToWorkspace: string;
    projects: {
      slug: string;
      title: string;
      category: string;
      difficulty: string;
      hours: string;
      cost: string;
      description: string;
    }[];
  };
  hunt: {
    eyebrow: string;
    title: string;
    desc: string;
    tabs: { key: string; label: string }[];
    viewAll: string;
    pageEyebrow: string;
    pageTitle: string;
    pageDesc: string;
    pageNote: string;
    pageStatus: string;
    primaryCta: string;
    secondaryCta: string;
    empty: string;
  };
  packages: {
    eyebrow: string;
    title: string;
    desc: string;
    items: { name: string; type: string; desc: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  waitlist: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    desc: string;
    placeholder: string;
    submit: string;
    submitting: string;
    submittedA: string;
    submittedB: string;
    position: string; // contains `{n}` placeholder
    errorInvalidEmail: string;
    errorGeneric: string;
    privacy: string;
  };
  footer: {
    tagline: string;
    github: string;
    twitter: string;
    faq: string;
  };
  localeSwitch: { en: string; zh: string; ariaLabel: string };
};

const en: Dict = {
  nav: {
    loop: "The Loop",
    hunt: "Hunt",
    projects: "Projects",
    packages: "Packages",
    faq: "FAQ",
    joinWaitlist: "Join Waitlist",
  },
  hero: {
    eyebrow: "Vibe Hardware · Early Access",
    line1: "Close the loop",
    between: "between",
    strike: "humans",
    accent: "agents",
    line3: "and the physical world.",
    description: (em) =>
      `Grounded gives AI agents the perception, reasoning, and action capabilities to ${em(
        "design"
      )}, ${em("source")}, ${em("build")}, and ${em(
        "verify"
      )} real hardware. Pick a project. Agent runs the loop. You assemble.`,
    joinWaitlist: "Join Waitlist",
    browseProjects: "Browse Projects",
    scroll: "Scroll",
    stats: {
      packagesValue: "6",
      packagesLabel: "Open-source packages",
      buildsValue: "8+",
      buildsLabel: "Reference builds",
      savedValue: "∞",
      savedLabel: "Human waiting saved",
    },
  },
  problem: {
    eyebrow: "The Gap",
    title: "Agents can reason about hardware. They just can't see it.",
    desc: "Every stage of hardware development produces a feedback signal. The problem is that none of those signals are wired to the agent. Grounded wires them.",
    today: {
      label: "Today",
      chip: "Open loop",
      lines: [
        "Human: 'Design a robot enclosure'",
        "Agent: generates STL code",
        "Human: opens FreeCAD, check fits…",
        "Human: searches LCSC, compares prices",
        "Human: debug firmware by hand",
        "⟲ 5-10 iterations, 2+ hours",
      ],
    },
    closed: {
      label: "With Grounded",
      chip: "Closed loop",
      lines: [
        "Human: 'Design a robot enclosure'",
        "Agent: generates Build123d code",
        "  → renders, verifies PCB fit",
        "  → finds cheapest BOM across suppliers",
        "  → simulates firmware, checks display",
        "✓ 3 automated iterations, agent time",
      ],
    },
  },
  loop: {
    eyebrow: "The Loop",
    title: "Three feedback loops. One continuous pipeline.",
    desc: "Every action has a feedback signal. Every signal reaches the agent. The human enters only where they have to.",
    items: [
      {
        n: "01",
        title: "Design Loop",
        body: "Your KiCad PCB becomes typed constraints. Natural language + PCB → OpenSCAD / Build123d code → rendered PNG → vision check → iterate until spec met. Firmware compiled in Wokwi, serial logs fed back to agent.",
        tags: ["grounded-cad", "grounded-pcb", "grounded-firmware"],
      },
      {
        n: "02",
        title: "Sourcing Loop",
        body: "BOM from design → search Waveshare / LCSC / JD / 1688 → price compare → order via API + virtual card. Human sets policy once; agent operates within it.",
        tags: ["grounded-parts"],
      },
      {
        n: "03",
        title: "Physical Loop",
        body: "3D print → camera verifies fit → flash firmware → camera + serial test → Three.js assembly guide that you follow step by step.",
        tags: ["grounded-vision", "assembly-viewer"],
      },
    ],
  },
  gallery: {
    eyebrow: "Build Library",
    title: "Don't start from scratch. Copy a project.",
    desc: "Curated open-source builds you can clone into your workspace. Agent evaluates what you have, what you need, and starts the loop.",
    browseAll: "Browse all →",
    copyToWorkspace: "Copy to Workspace",
    projects: [
      {
        slug: "elato-ai",
        title: "ElatoAI",
        category: "AI Companion Toy",
        difficulty: "Medium",
        hours: "~6h",
        cost: "¥180",
        description:
          "An ESP32-S3 talking AI toy with voice interaction. Open source, easy to source, great first build.",
      },
      {
        slug: "eink-dashboard",
        title: "E-Ink Dashboard",
        category: "Ambient Display",
        difficulty: "Medium",
        hours: "~4h",
        cost: "¥240",
        description:
          "Wall-mounted 7.5\" e-ink panel showing calendar, weather, and tasks. Low power, always on.",
      },
      {
        slug: "plant-monitor",
        title: "Smart Plant Monitor",
        category: "IoT · Beginner",
        difficulty: "Beginner",
        hours: "~2h",
        cost: "¥90",
        description:
          "Soil moisture + temperature + light, battery-powered, sends to your phone. The hello-world of hardware.",
      },
    ],
  },
  hunt: {
    eyebrow: "Hardware Hunt",
    title: "See what builders are reading, cloning, and discussing.",
    desc: "A lightweight preview of the discovery layer. For now we hand-pick a few project cards and discussion links. Later this becomes a live feed.",
    tabs: [
      { key: "match", label: "Match" },
      { key: "trending", label: "Trending" },
      { key: "insight", label: "Insight" },
    ],
    viewAll: "Browse Hunt →",
    pageEyebrow: "Discovery Layer",
    pageTitle: "A staged feed for projects first, discussion second.",
    pageDesc: "This page is still using static sample cards, but its structure is closer to the eventual product: a public feed that mixes buildable projects with useful discussion context.",
    pageNote: "Later this becomes a real source-fed stream from GitHub, Hacker News, Reddit, Hackaday, and selected CN ecosystem links.",
    pageStatus: "Static preview · live ingestion comes next",
    primaryCta: "Start from a project",
    secondaryCta: "Open discussion",
    empty: "No cards in this lane yet.",
  },
  packages: {
    eyebrow: "The SDK",
    title: "Six composable packages. One agent loop.",
    desc: "Install what you need. Ignore what you don't. Every package speaks Claude Code / MCP / CLI — no custom runtime.",
    items: [
      {
        name: "grounded-cad",
        type: "Claude Code Skill",
        desc: "LLM → OpenSCAD / Build123d code → render → vision check → printability verify.",
      },
      {
        name: "grounded-pcb",
        type: "CLI",
        desc: "KiCad → typed constraints + STEP. Makes enclosures actually fit the board.",
      },
      {
        name: "grounded-parts",
        type: "CLI",
        desc: "Search, compare, and purchase across Waveshare / LCSC / JD / 1688.",
      },
      {
        name: "grounded-vision",
        type: "MCP Server",
        desc: "USB/IP camera → photograph, measure, verify physical objects.",
      },
      {
        name: "assembly-viewer",
        type: "Web App",
        desc: "Three.js step-by-step assembly guide from STL + BOM.",
      },
      {
        name: "grounded-firmware",
        type: "CLI + MCP",
        desc: "Wokwi sim → arduino-cli compile → flash → serial monitor.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered straight.",
    items: [
      {
        q: "Is Grounded a product or a framework?",
        a: "A framework. It's a set of Claude Code Skills, MCP servers, and CLI tools. You install the pieces you need into your own agent setup.",
      },
      {
        q: "Do I need a 3D printer?",
        a: "Not to start. Many projects can be sourced pre-assembled or laser-cut. The gallery shows what each build requires up front.",
      },
      {
        q: "What about PCB fabrication?",
        a: "Grounded generates the Gerbers; fabrication routes through JLCPCB or PCBWay. Order automation is on the roadmap.",
      },
      {
        q: "When does it launch?",
        a: "Private beta with first cohort mid-2026. Public SDK shortly after. Waitlist order is preserved.",
      },
      {
        q: "Can agents spend my money?",
        a: "Only within policy you set. We use per-order limits and virtual cards. You approve rules once, not every purchase.",
      },
    ],
  },
  waitlist: {
    eyebrow: "Invite-only Beta",
    titleLine1: "Build your first device",
    titleLine2: "with an agent by your side.",
    desc: "We're inviting early builders in waves. Drop your email and tell us what you want to make — we'll reach out when your slot opens.",
    placeholder: "you@domain.com",
    submit: "Join Waitlist",
    submitting: "Submitting…",
    submittedA: "✓ You're on the list",
    submittedB: "We'll be in touch",
    position: "You're #{n} in line",
    errorInvalidEmail: "Please enter a valid email.",
    errorGeneric: "Something went wrong. Try again in a moment.",
    privacy: "No password. No account. Just your email.",
  },
  footer: {
    tagline: "Grounded · Close the loop",
    github: "GitHub",
    twitter: "X / Twitter",
    faq: "FAQ",
  },
  localeSwitch: { en: "EN", zh: "中", ariaLabel: "Switch language" },
};

const zh: Dict = {
  nav: {
    loop: "闭环",
    hunt: "发现",
    projects: "项目库",
    packages: "模块",
    faq: "常见问题",
    joinWaitlist: "加入内测",
  },
  hero: {
    eyebrow: "Vibe Hardware · 抢先体验",
    line1: "硬件开发的未来",
    between: "从",
    strike: "人力",
    accent: "智能体",
    line3: "完成整个闭环。",
    description: (em) =>
      `Grounded 给 AI Agent 装上感知、推理和执行硬件的能力 —— 让它能${em(
        "设计"
      )}、${em("采购")}、${em("制造")}并${em(
        "验证"
      )}真实设备。你只需挑一个项目，Agent 跑完整个闭环，你负责最后的组装。`,
    joinWaitlist: "加入内测",
    browseProjects: "浏览项目",
    scroll: "下滑",
    stats: {
      packagesValue: "6",
      packagesLabel: "开源模块",
      buildsValue: "8+",
      buildsLabel: "参考项目",
      savedValue: "∞",
      savedLabel: "节省的人工时间",
    },
  },
  problem: {
    eyebrow: "现状",
    title: "Agent 能推理硬件。它只是看不见硬件。",
    desc: "硬件开发的每个环节都会产生反馈信号 —— 问题是这些信号没有一个连到 Agent。Grounded 把它们全接上。",
    today: {
      label: "现在",
      chip: "开环",
      lines: [
        "人类：帮我设计一个机器人外壳",
        "Agent：生成一段 STL 代码",
        "人类：打开 FreeCAD 检查是否合适…",
        "人类：上立创对比元件价格",
        "人类：手动调试固件",
        "⟲ 5-10 次迭代，2 小时起",
      ],
    },
    closed: {
      label: "接入 Grounded",
      chip: "闭环",
      lines: [
        "人类：帮我设计一个机器人外壳",
        "Agent：生成 Build123d 代码",
        "  → 渲染，自动验证 PCB 适配",
        "  → 跨平台搜索最便宜的 BOM",
        "  → 仿真固件，检查显示输出",
        "✓ 3 次自动迭代，Agent 独立完成",
      ],
    },
  },
  loop: {
    eyebrow: "闭环",
    title: "三个反馈闭环，一条完整流水线。",
    desc: "每个动作都有反馈信号，每个信号都能到达 Agent。人类只在真正需要的时候介入。",
    items: [
      {
        n: "01",
        title: "设计闭环",
        body: "你的 KiCad PCB 先被解析成结构化约束。自然语言 + PCB → OpenSCAD / Build123d 代码 → 渲染 PNG → 视觉检查 → 迭代至符合规格。固件在 Wokwi 里仿真，串口日志直接回传 Agent。",
        tags: ["grounded-cad", "grounded-pcb", "grounded-firmware"],
      },
      {
        n: "02",
        title: "采购闭环",
        body: "从设计中生成 BOM → 搜索微雪 / 立创 / 京东 / 1688 → 跨源比价 → 通过 API + 虚拟卡下单。人类设定一次预算策略，Agent 自主运作。",
        tags: ["grounded-parts"],
      },
      {
        n: "03",
        title: "实物闭环",
        body: "3D 打印 → 摄像头核对尺寸 → 烧录固件 → 摄像头 + 串口测试 → Three.js 生成分步组装引导，你照着做就行。",
        tags: ["grounded-vision", "assembly-viewer"],
      },
    ],
  },
  gallery: {
    eyebrow: "项目库",
    title: "别从零开始 —— 直接复刻一个。",
    desc: "精选的开源硬件项目，一键同步到你的工作区。Agent 评估你已有什么、还缺什么，然后启动闭环。",
    browseAll: "查看全部 →",
    copyToWorkspace: "复制到工作区",
    projects: [
      {
        slug: "elato-ai",
        title: "ElatoAI",
        category: "AI 陪伴玩具",
        difficulty: "中等",
        hours: "约 6 小时",
        cost: "¥180",
        description:
          "基于 ESP32-S3 的 AI 语音交互玩具。开源、易采购，新手友好的第一个项目。",
      },
      {
        slug: "eink-dashboard",
        title: "电子墨水屏面板",
        category: "环境显示",
        difficulty: "中等",
        hours: "约 4 小时",
        cost: "¥240",
        description:
          "7.5 寸电子墨水屏挂墙面板，显示日历、天气、待办。低功耗常亮。",
      },
      {
        slug: "plant-monitor",
        title: "智能植物监测器",
        category: "IoT · 入门",
        difficulty: "入门",
        hours: "约 2 小时",
        cost: "¥90",
        description:
          "土壤湿度 + 温度 + 光照，电池供电，数据推送到手机。硬件界的 Hello World。",
      },
    ],
  },
  hunt: {
    eyebrow: "Hardware Hunt",
    title: "看看大家最近在读什么、做什么、讨论什么。",
    desc: "这里先放一个轻量预览版。当前用手工挑选的项目卡片和讨论链接站位，后面再接成实时发现流。",
    tabs: [
      { key: "match", label: "适合上手" },
      { key: "trending", label: "最近热门" },
      { key: "insight", label: "讨论内容" },
    ],
    viewAll: "查看 Hunt →",
    pageEyebrow: "发现层",
    pageTitle: "先看项目，再看讨论，再决定要不要开做。",
    pageDesc: "这个页面暂时还是静态示例卡片，但结构已经更接近后续产品：公开 feed 里同时展示可做项目和有价值的讨论上下文。",
    pageNote: "后面这里会接 GitHub、Hacker News、Reddit、Hackaday，以及精选中文 maker 生态链接。",
    pageStatus: "静态预览 · 常态化抓取后接入",
    primaryCta: "从项目开始",
    secondaryCta: "打开讨论",
    empty: "这一栏暂时还没有卡片。",
  },
  packages: {
    eyebrow: "SDK",
    title: "六个可组合的模块，一个 Agent 闭环。",
    desc: "按需安装，不用的不装。每个模块都讲 Claude Code / MCP / CLI —— 没有自定义运行时。",
    items: [
      {
        name: "grounded-cad",
        type: "Claude Code Skill",
        desc: "LLM → OpenSCAD / Build123d 代码 → 渲染 → 视觉检查 → 可打印性验证。",
      },
      {
        name: "grounded-pcb",
        type: "命令行",
        desc: "KiCad 板 → 结构化约束 + STEP 模型。让外壳和真实 PCB 对得上。",
      },
      {
        name: "grounded-parts",
        type: "命令行",
        desc: "跨 微雪 / 立创 / 京东 / 1688 搜索、比价、下单。",
      },
      {
        name: "grounded-vision",
        type: "MCP 服务",
        desc: "USB / IP 摄像头 → 拍照、测量、验证实物。",
      },
      {
        name: "assembly-viewer",
        type: "Web 应用",
        desc: "基于 STL + BOM 的 Three.js 分步组装引导。",
      },
      {
        name: "grounded-firmware",
        type: "CLI + MCP",
        desc: "Wokwi 仿真 → arduino-cli 编译 → 烧录 → 串口监控。",
      },
    ],
  },
  faq: {
    eyebrow: "常见问题",
    title: "直接回答。",
    items: [
      {
        q: "Grounded 是产品还是框架？",
        a: "是框架。它是一组 Claude Code Skill、MCP 服务和 CLI 工具。按需装到你自己的 Agent 环境里。",
      },
      {
        q: "必须有 3D 打印机吗？",
        a: "入门不需要。很多项目可以买现成的外壳或者激光切割。项目页会提前标明每个 build 需要什么。",
      },
      {
        q: "PCB 打样怎么办？",
        a: "Grounded 生成 Gerber 文件，打样走嘉立创或 PCBWay。自动下单功能在 roadmap 上。",
      },
      {
        q: "什么时候发布？",
        a: "首批内测 2026 年中开放。SDK 公开发布紧随其后。Waitlist 的顺序会保留。",
      },
      {
        q: "Agent 能自己花钱吗？",
        a: "只能在你设定的规则内花。我们用单笔限额 + 虚拟卡。你设定一次规则，不用每次都审批。",
      },
    ],
  },
  waitlist: {
    eyebrow: "邀请制内测",
    titleLine1: "造出你的第一台设备",
    titleLine2: "身边有个 AI 搭档。",
    desc: "我们正分批邀请早期用户。留下邮箱，告诉我们你想做什么 —— 轮到你时我们会联系。",
    placeholder: "your@domain.com",
    submit: "加入内测",
    submitting: "提交中…",
    submittedA: "✓ 已加入名单",
    submittedB: "我们会尽快联系你",
    position: "你是第 {n} 位",
    errorInvalidEmail: "请输入有效的邮箱地址。",
    errorGeneric: "出了点问题，稍后再试一次。",
    privacy: "无需密码，无需注册，只需一个邮箱。",
  },
  footer: {
    tagline: "Grounded · 闭环硬件开发",
    github: "GitHub",
    twitter: "X / Twitter",
    faq: "常见问题",
  },
  localeSwitch: { en: "EN", zh: "中", ariaLabel: "切换语言" },
};

export const dictionaries: Record<Locale, Dict> = { en, zh };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function parseLocale(value: string | undefined): Locale {
  return value === "zh" ? "zh" : "en";
}
