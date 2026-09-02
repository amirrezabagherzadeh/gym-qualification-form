"use server";

import { revalidatePath } from "next/cache";
import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { leadNotes, leads, scoringRuleSets } from "@/db/schema";
import { getAdminIdentity } from "@/lib/admin";
import { retentionDueDate } from "@/lib/dates";
import { parseScoringRules } from "@/lib/scoring";

async function adminOrThrow() {
  const admin = await getAdminIdentity();
  if (!admin) throw new Error("دسترسی غیرمجاز است.");
  return admin;
}

export async function updateLeadStatus(formData: FormData) {
  const admin = await adminOrThrow();
  const id = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "meeting_booked", "unsuitable", "closed"].includes(status)) throw new Error("وضعیت نامعتبر است.");
  const inactive = status === "unsuitable" || status === "closed";
  await getDb().update(leads).set({ status: status as typeof leads.$inferInsert.status, statusChangedBy: admin.userId, statusChangedAt: new Date(), retentionDueAt: inactive ? retentionDueDate() : null, updatedAt: new Date() }).where(eq(leads.id, id));
  revalidatePath(`/admin/leads/${id}`); revalidatePath("/admin/leads");
}

export async function addLeadNote(formData: FormData) {
  const admin = await adminOrThrow();
  const leadId = String(formData.get("leadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!leadId || body.length < 1 || body.length > 4_000) throw new Error("متن یادداشت معتبر نیست.");
  await getDb().insert(leadNotes).values({ leadId, body, authorId: admin.userId, authorName: admin.displayName });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(formData: FormData) {
  await adminOrThrow();
  const id = String(formData.get("leadId") ?? "");
  if (!id || String(formData.get("confirm") ?? "").trim() !== "حذف") throw new Error("برای حذف، عبارت «حذف» را وارد کنید.");
  await getDb().delete(leads).where(eq(leads.id, id));
  revalidatePath("/admin/leads");
}

export async function createRuleDraft() {
  const admin = await adminOrThrow();
  const db = getDb();
  const [source] = await db.select().from(scoringRuleSets).where(eq(scoringRuleSets.state, "active")).orderBy(desc(scoringRuleSets.version)).limit(1);
  if (!source) throw new Error("نسخه فعال قواعد پیدا نشد.");
  const [lastVersion] = await db.select({ version: sql<number>`max(${scoringRuleSets.version})::int` }).from(scoringRuleSets);
  await db.insert(scoringRuleSets).values({ version: (lastVersion?.version ?? 0) + 1, state: "draft", config: source.config, createdBy: admin.userId });
  revalidatePath("/admin/rules");
}

export async function saveRuleDraft(formData: FormData) {
  await adminOrThrow();
  const id = String(formData.get("ruleId") ?? "");
  const config = parseScoringRules(JSON.parse(String(formData.get("config") ?? "{}")));
  const [draft] = await getDb().select({ id: scoringRuleSets.id }).from(scoringRuleSets).where(and(eq(scoringRuleSets.id, id), eq(scoringRuleSets.state, "draft"))).limit(1);
  if (!draft) throw new Error("فقط draft قابل ویرایش است.");
  await getDb().update(scoringRuleSets).set({ config }).where(eq(scoringRuleSets.id, id));
  revalidatePath("/admin/rules");
}

export async function publishRuleDraft(formData: FormData) {
  const admin = await adminOrThrow();
  const id = String(formData.get("ruleId") ?? "");
  const db = getDb();
  const [draft] = await db.select().from(scoringRuleSets).where(and(eq(scoringRuleSets.id, id), eq(scoringRuleSets.state, "draft"))).limit(1);
  if (!draft) throw new Error("draft معتبر نیست.");
  parseScoringRules(draft.config);
  await db.transaction(async (tx) => {
    await tx.update(scoringRuleSets).set({ state: "archived" }).where(eq(scoringRuleSets.state, "active"));
    await tx.update(scoringRuleSets).set({ state: "active", publishedBy: admin.userId, publishedAt: new Date() }).where(eq(scoringRuleSets.id, id));
  });
  revalidatePath("/admin/rules");
}
