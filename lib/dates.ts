export const RETENTION_MONTHS = 24;

export function retentionDueDate(from = new Date()) {
  const result = new Date(from);
  result.setUTCMonth(result.getUTCMonth() + RETENTION_MONTHS);
  return result;
}

export function formatDate(value: Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tehran" }).format(value);
}
