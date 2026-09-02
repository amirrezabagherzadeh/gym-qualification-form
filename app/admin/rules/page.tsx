import { desc, eq } from "drizzle-orm";
import { createRuleDraft, publishRuleDraft, saveRuleDraft } from "@/app/admin/actions";
import { getDb } from "@/db";
import { scoringRuleSets } from "@/db/schema";
import { formatDate } from "@/lib/dates";
import { RuleEditor } from "./RuleEditor";

export default async function RulesPage() {
  const db = getDb();
  const [active, draft, history] = await Promise.all([
    db.select().from(scoringRuleSets).where(eq(scoringRuleSets.state, "active")).limit(1),
    db.select().from(scoringRuleSets).where(eq(scoringRuleSets.state, "draft")).orderBy(desc(scoringRuleSets.version)).limit(1),
    db.select().from(scoringRuleSets).orderBy(desc(scoringRuleSets.version)).limit(12),
  ]);
  const editable = draft[0];
  return <><header className="admin-heading"><div><p className="eyebrow">نسخه‌بندی تصمیم‌ها</p><h1>قواعد امتیازدهی</h1></div>{!editable ? <form action={createRuleDraft}><button className="primary-button">ساخت draft از نسخه فعال</button></form> : null}</header>{active[0] ? <p className="notice">نسخه فعال: {active[0].version} · منتشرشده در {formatDate(active[0].publishedAt)}</p> : <p className="form-error">نسخه فعال وجود ندارد؛ migration اولیه را اجرا کنید.</p>}{editable ? <RuleEditor ruleId={editable.id} initialConfig={editable.config} saveAction={saveRuleDraft} publishAction={publishRuleDraft} /> : null}<section className="admin-card"><h2>تاریخچه نسخه‌ها</h2><table className="lead-table"><thead><tr><th>نسخه</th><th>وضعیت</th><th>ایجاد</th><th>انتشار</th></tr></thead><tbody>{history.map((rule) => <tr key={rule.id}><td>{rule.version}</td><td>{rule.state}</td><td>{formatDate(rule.createdAt)}</td><td>{formatDate(rule.publishedAt)}</td></tr>)}</tbody></table></section></>;
}
