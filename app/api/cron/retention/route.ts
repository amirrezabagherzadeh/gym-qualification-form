import { and, eq, lte, or } from "drizzle-orm";
import { getDb } from "@/db";
import { leads } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new Response("Unauthorized", { status: 401 });
  const deleted = await getDb().delete(leads).where(and(or(eq(leads.status, "closed"), eq(leads.status, "unsuitable")), lte(leads.retentionDueAt, new Date()))).returning({ id: leads.id });
  return Response.json({ deleted: deleted.length });
}
