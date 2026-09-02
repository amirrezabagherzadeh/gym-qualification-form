import { z } from "zod";
import { FORM_OPTIONS, type LeadAnswers, type OptionField } from "./form";

const pointMap = <T extends readonly [string, ...string[]]>(values: T) => z.record(z.enum(values), z.number().int().min(0).max(100));
export const ScoringRuleConfigSchema = z.object({
  points: z.object({ relation: pointMap(FORM_OPTIONS.relation), role: pointMap(FORM_OPTIONS.role), members: pointMap(FORM_OPTIONS.members), challenge: pointMap(FORM_OPTIONS.challenge), timeline: pointMap(FORM_OPTIONS.timeline) }),
  minimumScore: z.number().int().min(0).max(100),
  requiredAnswers: z.object({ role: z.array(z.enum(FORM_OPTIONS.role)).min(1), members: z.array(z.enum(FORM_OPTIONS.members)).min(1), timeline: z.array(z.enum(FORM_OPTIONS.timeline)).min(1) }),
});
export type ScoringRuleConfig = z.infer<typeof ScoringRuleConfigSchema>;
export const INITIAL_SCORING_RULES: ScoringRuleConfig = {
  points: {
    relation: { "باشگاه دارم": 20, "مدیر باشگاه هستم": 20, "مربی هستم": 0, "قصد راه‌اندازی باشگاه دارم": 0 },
    role: { مالک: 30, مدیر: 30, مربی: 0, "مسئول فروش": 0, سایر: 0 },
    members: { "زیر ۵۰": 0, "۵۰–۱۵۰": 25, "۱۵۰–۳۰۰": 25, "۳۰۰–۵۰۰": 25, "بالای ۵۰۰": 25 },
    challenge: { "جذب عضو جدید": 0, "تمدید اعضا": 5, "ریزش اعضا": 5, "برنامه تمرینی": 5, "پیگیری اعضا": 5, "مدیریت مربیان": 0 },
    timeline: { "هرچه سریع‌تر": 20, "تا یک ماه آینده": 20, "۱ تا ۳ ماه آینده": 20, "فعلاً فقط در حال بررسی هستم": 0 },
  },
  minimumScore: 75,
  requiredAnswers: { role: ["مالک", "مدیر"], members: ["۵۰–۱۵۰", "۱۵۰–۳۰۰", "۳۰۰–۵۰۰", "بالای ۵۰۰"], timeline: ["هرچه سریع‌تر", "تا یک ماه آینده", "۱ تا ۳ ماه آینده"] },
};

export function scoreLead(answers: LeadAnswers, rules: ScoringRuleConfig) {
  const score = rules.points.relation[answers.relation] + rules.points.role[answers.role] + rules.points.members[answers.members] + rules.points.challenge[answers.challenge] + (answers.timeline ? rules.points.timeline[answers.timeline] : 0);
  const required = rules.requiredAnswers.role.includes(answers.role) && rules.requiredAnswers.members.includes(answers.members) && Boolean(answers.timeline && rules.requiredAnswers.timeline.includes(answers.timeline));
  return { score, qualified: score >= rules.minimumScore && required };
}

export function maxPossibleScore(rules: ScoringRuleConfig) {
  return (Object.keys(rules.points) as OptionField[]).reduce((total, field) => total + Math.max(...Object.values(rules.points[field])), 0);
}

export function parseScoringRules(value: unknown): ScoringRuleConfig {
  const rules = ScoringRuleConfigSchema.parse(value);
  if (rules.minimumScore > maxPossibleScore(rules)) throw new Error("حداقل امتیاز نمی‌تواند از بیشینه امتیاز قابل کسب بیشتر باشد.");
  return rules;
}
