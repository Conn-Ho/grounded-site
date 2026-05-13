import { Resend } from "resend";
import type { Locale } from "./i18n";

type Mailer = ReturnType<typeof Resend.prototype.emails.send> extends Promise<infer T>
  ? T
  : never;

let client: Resend | null = null;

function getClient(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

const FROM = process.env.EMAIL_FROM ?? "Amagine <hello@amagine.ai>";

const copy = {
  en: {
    subject: "You're on the Amagine waitlist",
    preview: "We'll reach out as soon as your slot opens.",
    greeting: "Welcome,",
    body: [
      "You just joined the Amagine waitlist — the missing tooling layer that lets AI agents design, source, build, and verify real hardware.",
      "We're inviting early builders in waves. When your slot opens we'll email you with an invite code and a starter project from our Gallery.",
      "In the meantime, if you already know what you want to build — just reply to this email and tell us. That helps us shape the first cohort.",
    ],
    footer: "— The Amagine team",
  },
  zh: {
    subject: "你已加入 Amagine 内测名单",
    preview: "名额开放后我们会第一时间联系你。",
    greeting: "你好，",
    body: [
      "你刚刚加入了 Amagine 内测名单 —— 我们正在造一层让 AI Agent 能独立完成硬件设计、采购、制造、验证的工具层。",
      "内测分批开放。轮到你的时候，我们会发邮件给你发邀请码和一个 Gallery 里的入门项目。",
      "如果你已经想好要做什么 —— 直接回信告诉我们。你的想法会帮我们更好地组织首批内测。",
    ],
    footer: "— Amagine 团队",
  },
};

function renderHtml(locale: Locale) {
  const c = copy[locale];
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${c.subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#0a0908;font-family:-apple-system,Segoe UI,sans-serif;">
    <div style="display:none;color:transparent;font-size:1px;">${c.preview}</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0908;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#0f0d0b;border:1px solid #2a241e;">
            <tr><td style="padding:36px 40px 24px;border-bottom:1px solid #2a241e;">
              <div style="color:#F65310;letter-spacing:.2em;font-size:12px;text-transform:uppercase;font-weight:600;">
                ◇ Amagine · Early Access
              </div>
            </td></tr>
            <tr><td style="padding:32px 40px;color:#f5f1ea;font-size:15px;line-height:1.7;">
              <p style="margin:0 0 20px;font-size:18px;color:#f5f1ea;">${c.greeting}</p>
              ${c.body.map((p) => `<p style="margin:0 0 16px;color:#b8b1a5;">${p}</p>`).join("")}
              <p style="margin:32px 0 0;color:#6a6560;font-size:13px;">${c.footer}</p>
            </td></tr>
            <tr><td style="padding:16px 40px 28px;border-top:1px solid #2a241e;color:#6a6560;font-size:11px;letter-spacing:.15em;text-transform:uppercase;">
              amagine.ai
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderText(locale: Locale) {
  const c = copy[locale];
  return [c.greeting, "", ...c.body, "", c.footer, "", "amagine.ai"].join("\n");
}

export async function sendWelcomeEmail(
  to: string,
  locale: Locale
): Promise<{ sent: boolean; error?: string }> {
  const r = getClient();
  if (!r) return { sent: false, error: "no_resend_key" };
  try {
    const { error } = await r.emails.send({
      from: FROM,
      to,
      subject: copy[locale].subject,
      html: renderHtml(locale),
      text: renderText(locale),
      headers: { "X-Amagine-List": "waitlist" },
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

export function mailerConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Silence unused type warning
export type _Mailer = Mailer;
