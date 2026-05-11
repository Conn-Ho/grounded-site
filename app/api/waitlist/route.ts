import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { hasDatabase, query } from "@/lib/db";
import { mailerConfigured, sendWelcomeEmail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitBody = {
  email?: string;
  interest?: string;
  projectSlug?: string;
  experience?: string;
  locale?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_EXPERIENCE = new Set(["beginner", "maker", "engineer"]);

function hashIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const interest = body.interest?.slice(0, 500) ?? null;
  const projectSlug = body.projectSlug?.slice(0, 100) ?? null;
  const experience =
    body.experience && VALID_EXPERIENCE.has(body.experience)
      ? body.experience
      : null;
  const locale = body.locale === "zh" ? "zh" : "en";
  const referrer = req.headers.get("referer")?.slice(0, 500) ?? null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
  const ipHash = hashIp(req);

  if (!hasDatabase()) {
    console.log("[waitlist:no-db]", {
      email,
      interest,
      projectSlug,
      experience,
      locale,
    });
    if (mailerConfigured()) {
      void sendWelcomeEmail(email, locale);
    }
    return NextResponse.json({ ok: true, position: null, dev: true });
  }

  try {
    const rows = await query<{ id: number }>(
      `
      insert into waitlist
        (email, interest, project_slug, experience, locale, referrer, user_agent, ip_hash)
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      on conflict (email) do update
        set interest     = coalesce(excluded.interest, waitlist.interest),
            project_slug = coalesce(excluded.project_slug, waitlist.project_slug),
            experience   = coalesce(excluded.experience, waitlist.experience),
            locale       = excluded.locale
      returning id
      `,
      [email, interest, projectSlug, experience, locale, referrer, userAgent, ipHash]
    );

    const id = rows[0]?.id;

    if (projectSlug && id) {
      await query(
        `insert into waitlist_interests (waitlist_id, project_slug)
         values ($1, $2)
         on conflict do nothing`,
        [id, projectSlug]
      );
    }

    const posRows = await query<{ position: string }>(
      `select count(*)::text as position from waitlist where id <= $1`,
      [id]
    );
    const position = Number(posRows[0]?.position ?? 0);

    if (mailerConfigured()) {
      // Fire-and-forget; don't block the response on SMTP latency.
      void sendWelcomeEmail(email, locale);
    }

    return NextResponse.json({ ok: true, position });
  } catch (err) {
    console.error("[waitlist:error]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ count: 0, dev: true });
  }
  try {
    const rows = await query<{ count: string }>(
      `select count(*)::text as count from waitlist`
    );
    return NextResponse.json({ count: Number(rows[0]?.count ?? 0) });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
