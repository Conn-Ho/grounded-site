import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { parseLocale } from "@/lib/i18n";
import "./globals.css";

const meta = {
  en: {
    title: "Grounded — Vibe Hardware for AI Agents",
    description:
      "Close the loop between AI agents and the physical world. Pick a project. Agent designs, sources, and verifies it. You assemble.",
    ogDesc:
      "The missing tooling layer that lets AI agents design, source, build, and verify real hardware.",
  },
  zh: {
    title: "Grounded — 让 AI 闭环硬件开发",
    description:
      "让 AI Agent 打通硬件开发全流程：选一个项目，Agent 自己设计、采购、验证，你只需组装。",
    ogDesc:
      "Grounded 是让 AI 接上物理世界的工具层：感知、推理、采购、装配，Agent 全都能做。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const store = await cookies();
  const locale = parseLocale(store.get("locale")?.value);
  const m = meta[locale];
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.ogDesc,
      type: "website",
      url: "https://grounded.dev",
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
    alternates: {
      languages: {
        en: "/",
        "zh-CN": "/",
      },
    },
    metadataBase: new URL(process.env.SITE_URL ?? "https://lingine.tech"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const locale = parseLocale(store.get("locale")?.value);

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
