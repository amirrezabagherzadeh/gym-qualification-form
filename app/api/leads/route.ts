import { checkBotId } from "botid/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { leads, scoringRuleSets } from "@/db/schema";
import { isPlausibleCompletion, LeadSubmissionSchema, normalizeIranianPhone } from "@/lib/form";
import { parseScoringRules, scoreLead } from "@/lib/scoring";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) return Response.json({ error: "حجم درخواست مجاز نیست." }, { status: 400 });

  if (process.env.VERCEL === "1") {
    const verification = await checkBotId();
    if (verification.isBot) return Response.json({ error: "درخواست پذیرفته نشد." }, { status: 403 });
  }

  let input: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return Response.json({ error: "حجم درخواست مجاز نیست." }, { status: 400 });
    input = JSON.parse(rawBody);
  } catch { return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 }); }
  const parsed = LeadSubmissionSchema.safeParse(input);
  if (!parsed.success) return Response.json({ error: "برخی اطلاعات فرم معتبر نیستند.", details: parsed.error.issues.map((issue) => issue.path.join(".")) }, { status: 400 });
  if (!isPlausibleCompletion(parsed.data.formStartedAt)) return Response.json({ error: "فرم بسیار سریع ارسال شد؛ لطفاً دوباره تلاش کنید." }, { status: 400 });
  const phone = normalizeIranianPhone(parsed.data.phone);
  if (!phone) return Response.json({ error: "شماره موبایل معتبر نیست." }, { status: 400 });

  const db = getDb();
  const [existing] = await db.select({ id: leads.id, score: leads.score, qualified: leads.qualified }).from(leads).where(eq(leads.submissionToken, parsed.data.submissionToken)).limit(1);
  if (existing) return Response.json(existing);

  const dayAgo = new Date(Date.now() - 86_400_000);
  const [phoneAttempts] = await db.select({ count: sql<number>`count(*)::int` }).from(leads).where(and(eq(leads.phone, phone), gte(leads.createdAt, dayAgo)));
  if ((phoneAttempts?.count ?? 0) >= 3) return Response.json({ error: "برای این شماره در ۲۴ ساعت گذشته ثبت کافی انجام شده است." }, { status: 429 });

  const [activeRules] = await db.select().from(scoringRuleSets).where(eq(scoringRuleSets.state, "active")).orderBy(desc(scoringRuleSets.publishedAt)).limit(1);
  if (!activeRules) return Response.json({ error: "قواعد ارزیابی در دسترس نیستند." }, { status: 503 });

  let evaluation;
  try { evaluation = scoreLead({ ...parsed.data, phone, timeline: parsed.data.timeline || undefined }, parseScoringRules(activeRules.config)); }
  catch { return Response.json({ error: "قواعد ارزیابی معتبر نیستند." }, { status: 503 }); }

  try {
    const [lead] = await db.insert(leads).values({
      submissionToken: parsed.data.submissionToken, relation: parsed.data.relation, fullName: parsed.data.fullName, gymName: parsed.data.gymName,
      role: parsed.data.role, members: parsed.data.members, challenge: parsed.data.challenge, phone, timeline: parsed.data.timeline || null,
      score: evaluation.score, qualified: evaluation.qualified, scoringRuleSetId: activeRules.id,
      privacyPolicyVersion: parsed.data.privacyPolicyVersion, consentAcceptedAt: new Date(),
    }).returning({ id: leads.id, score: leads.score, qualified: leads.qualified });
    return Response.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("leads_submission_token_unique")) {
      const [retry] = await db.select({ id: leads.id, score: leads.score, qualified: leads.qualified }).from(leads).where(eq(leads.submissionToken, parsed.data.submissionToken)).limit(1);
      if (retry) return Response.json(retry);
    }
    return Response.json({ error: "ثبت فرم انجام نشد؛ لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
