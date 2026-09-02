import { and, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { leadNotes, leads, scoringRuleSets, type leadStatus } from "@/db/schema";

export type LeadFilters = {
  query?: string;
  status?: string;
  qualified?: string;
  role?: string;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
};
const PAGE_SIZE = 25;

function conditionsFor(filters: LeadFilters) {
  const conditions = [];
  const query = filters.query?.trim();
  if (query) conditions.push(or(ilike(leads.fullName, `%${query}%`), ilike(leads.gymName, `%${query}%`), ilike(leads.phone, `%${query}%`)));
  if (["new", "contacted", "meeting_booked", "unsuitable", "closed"].includes(filters.status ?? "")) conditions.push(eq(leads.status, filters.status as (typeof leadStatus.enumValues)[number]));
  if (filters.qualified === "true" || filters.qualified === "false") conditions.push(eq(leads.qualified, filters.qualified === "true"));
  if (filters.role) conditions.push(eq(leads.role, filters.role));
  if (filters.from) {
    const from = new Date(`${filters.from}T00:00:00.000Z`);
    if (!Number.isNaN(from.valueOf())) conditions.push(gte(leads.createdAt, from));
  }
  if (filters.to) {
    const to = new Date(`${filters.to}T23:59:59.999Z`);
    if (!Number.isNaN(to.valueOf())) conditions.push(lte(leads.createdAt, to));
  }
  return conditions;
}

export async function listLeads(filters: LeadFilters) {
  const db = getDb();
  const conditions = conditionsFor(filters);
  const where = conditions.length ? and(...conditions) : undefined;
  const page = Math.max(1, Number(filters.page) || 1);
  const sortOrder = {
    oldest: [leads.createdAt],
    score_high: [desc(leads.score), desc(leads.createdAt)],
    score_low: [leads.score, desc(leads.createdAt)],
    newest: [desc(leads.createdAt)],
  }[filters.sort ?? "newest"] ?? [desc(leads.createdAt)];
  const [rows, totalResult] = await Promise.all([
    db.select({
      id: leads.id, fullName: leads.fullName, gymName: leads.gymName, phone: leads.phone, role: leads.role, members: leads.members,
      score: leads.score, qualified: leads.qualified, status: leads.status, createdAt: leads.createdAt,
      duplicateCount: sql<number>`count(*) over (partition by ${leads.phone})`.as("duplicate_count"),
    }).from(leads).where(where).orderBy(...sortOrder).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ count: sql<number>`count(*)::int` }).from(leads).where(where),
  ]);
  return { rows, page, total: totalResult[0]?.count ?? 0, pageSize: PAGE_SIZE };
}

export async function getLeadDetail(id: string) {
  const db = getDb();
  const [result] = await db.select({ lead: leads, ruleVersion: scoringRuleSets.version }).from(leads).innerJoin(scoringRuleSets, eq(leads.scoringRuleSetId, scoringRuleSets.id)).where(eq(leads.id, id)).limit(1);
  if (!result) return null;
  const [notes, related] = await Promise.all([
    db.select().from(leadNotes).where(eq(leadNotes.leadId, id)).orderBy(desc(leadNotes.createdAt)),
    db.select({ id: leads.id, createdAt: leads.createdAt, status: leads.status, score: leads.score }).from(leads).where(and(eq(leads.phone, result.lead.phone), sql`${leads.id} <> ${id}`)).orderBy(desc(leads.createdAt)),
  ]);
  return { ...result, notes, related };
}

export async function exportLeads(filters: LeadFilters) {
  const db = getDb();
  const conditions = conditionsFor(filters);
  const rows = await db.select({ lead: leads, ruleVersion: scoringRuleSets.version }).from(leads).innerJoin(scoringRuleSets, eq(leads.scoringRuleSetId, scoringRuleSets.id)).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(leads.createdAt)).limit(10_000);
  const ids = rows.map(({ lead }) => lead.id);
  const notes = ids.length ? await db.select().from(leadNotes).where(inArray(leadNotes.leadId, ids)).orderBy(leadNotes.createdAt) : [];
  const notesByLead = new Map<string, typeof notes>();
  for (const note of notes) notesByLead.set(note.leadId, [...(notesByLead.get(note.leadId) ?? []), note]);
  return rows.map(({ lead, ruleVersion }) => ({ ...lead, ruleVersion, notes: notesByLead.get(lead.id) ?? [] }));
}
