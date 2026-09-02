import { z } from "zod";

export const FORM_OPTIONS = {
  relation: ["باشگاه دارم", "مدیر باشگاه هستم", "مربی هستم", "قصد راه‌اندازی باشگاه دارم"],
  role: ["مالک", "مدیر", "مربی", "مسئول فروش", "سایر"],
  members: ["زیر ۵۰", "۵۰–۱۵۰", "۱۵۰–۳۰۰", "۳۰۰–۵۰۰", "بالای ۵۰۰"],
  challenge: ["جذب عضو جدید", "تمدید اعضا", "ریزش اعضا", "برنامه تمرینی", "پیگیری اعضا", "مدیریت مربیان"],
  timeline: ["هرچه سریع‌تر", "تا یک ماه آینده", "۱ تا ۳ ماه آینده", "فعلاً فقط در حال بررسی هستم"],
} as const;

export type OptionField = keyof typeof FORM_OPTIONS;
export type LeadAnswers = {
  relation: (typeof FORM_OPTIONS.relation)[number];
  fullName: string;
  gymName: string;
  role: (typeof FORM_OPTIONS.role)[number];
  members: (typeof FORM_OPTIONS.members)[number];
  challenge: (typeof FORM_OPTIONS.challenge)[number];
  phone: string;
  timeline?: (typeof FORM_OPTIONS.timeline)[number];
};

export const PRIVACY_POLICY_VERSION = "v1";

export const LeadSubmissionSchema = z.object({
  submissionToken: z.uuid(),
  relation: z.enum(FORM_OPTIONS.relation),
  fullName: z.string().trim().min(2, "نام را وارد کنید.").max(120),
  gymName: z.string().trim().min(2, "نام باشگاه را وارد کنید.").max(160),
  role: z.enum(FORM_OPTIONS.role),
  members: z.enum(FORM_OPTIONS.members),
  challenge: z.enum(FORM_OPTIONS.challenge),
  phone: z.string().trim().min(8).max(32),
  timeline: z.enum(FORM_OPTIONS.timeline).optional().or(z.literal("")),
  privacyPolicyVersion: z.literal(PRIVACY_POLICY_VERSION),
  formStartedAt: z.string().datetime(),
  honeypot: z.string().max(0),
});

export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>;
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function normalizeIranianPhone(value: string): string | null {
  const latin = value.trim().replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit))).replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit))).replace(/[\s()-]/g, "");
  const normalized = latin.startsWith("0098") ? `+${latin.slice(2)}` : latin.startsWith("98") ? `+${latin}` : latin;
  const e164 = normalized.startsWith("09") ? `+98${normalized.slice(1)}` : normalized;
  return /^\+989\d{9}$/.test(e164) ? e164 : null;
}

export function isPlausibleCompletion(startedAt: string, now = Date.now()): boolean {
  const started = Date.parse(startedAt);
  return Number.isFinite(started) && now - started >= 2_000 && now - started < 86_400_000;
}
