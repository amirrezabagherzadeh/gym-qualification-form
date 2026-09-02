import ExcelJS from "exceljs";
import { getAdminIdentity } from "@/lib/admin";
import { formatDate } from "@/lib/dates";
import { exportLeads, type LeadFilters } from "@/lib/leads";

const headers = ["نام", "باشگاه", "موبایل", "نسبت", "سمت", "اعضا", "چالش", "زمان‌بندی", "امتیاز", "نتیجه", "وضعیت", "نسخه قواعد", "ثبت", "یادداشت‌ها"];
const clean = (value: unknown) => { const text = String(value ?? ""); return /^[=+\-@]/.test(text) ? `'${text}` : text; };

export async function GET(request: Request) {
  if (!(await getAdminIdentity())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  if (format !== "csv" && format !== "xlsx") return Response.json({ error: "فرمت خروجی معتبر نیست." }, { status: 400 });
  const filters: LeadFilters = Object.fromEntries(["query", "status", "qualified", "role", "from", "to"].flatMap((key) => searchParams.get(key) ? [[key, searchParams.get(key)!]] : []));
  const rows = await exportLeads(filters);
  const values = rows.map((item) => [item.fullName, item.gymName, item.phone, item.relation, item.role, item.members, item.challenge, item.timeline, item.score, item.qualified ? "واجد شرایط" : "نیازمند پیگیری", item.status, item.ruleVersion, formatDate(item.createdAt), item.notes.map((note) => `${formatDate(note.createdAt)} — ${note.authorName}: ${note.body}`).join("\n")].map(clean));
  if (format === "csv") {
    const csv = [headers, ...values].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    return new Response(`\uFEFF${csv}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=leads.csv" } });
  }
  const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet("Leads"); sheet.addRow(headers); values.forEach((row) => sheet.addRow(row)); sheet.getRow(1).font = { bold: true }; sheet.columns.forEach((column) => { column.width = 20; });
  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(buffer, { headers: { "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "content-disposition": "attachment; filename=leads.xlsx" } });
}
