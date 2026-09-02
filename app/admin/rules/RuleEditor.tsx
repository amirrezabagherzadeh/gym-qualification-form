"use client";

import { useMemo, useState } from "react";
import { FORM_OPTIONS, type OptionField } from "@/lib/form";
import { maxPossibleScore, type ScoringRuleConfig } from "@/lib/scoring";

export function RuleEditor({ ruleId, initialConfig, saveAction, publishAction }: { ruleId: string; initialConfig: ScoringRuleConfig; saveAction: (formData: FormData) => Promise<void>; publishAction: (formData: FormData) => Promise<void> }) {
  const [config, setConfig] = useState(initialConfig);
  const maximum = useMemo(() => maxPossibleScore(config), [config]);
  const updatePoint = (field: OptionField, option: string, value: number) => setConfig((current) => ({ ...current, points: { ...current.points, [field]: { ...(current.points[field] as Record<string, number>), [option]: value } } }));
  const toggleRequired = (field: "role" | "members" | "timeline", option: string) => setConfig((current) => ({ ...current, requiredAnswers: { ...current.requiredAnswers, [field]: current.requiredAnswers[field].includes(option as never) ? current.requiredAnswers[field].filter((entry) => entry !== option) : [...current.requiredAnswers[field], option] } }));
  return <form className="rule-editor"><input type="hidden" name="ruleId" value={ruleId} /><input type="hidden" name="config" value={JSON.stringify(config)} /><div className="rule-summary"><label>حداقل امتیاز<input type="number" min={0} max={maximum} value={config.minimumScore} onChange={(event) => setConfig((current) => ({ ...current, minimumScore: Number(event.target.value) }))} /></label><span>بیشینه قابل کسب: {maximum}</span></div>{(Object.keys(FORM_OPTIONS) as OptionField[]).map((field) => <section className="rule-group" key={field}><h3>{field === "relation" ? "نسبت" : field === "role" ? "سمت" : field === "members" ? "اعضا" : field === "challenge" ? "چالش" : "زمان‌بندی"}</h3>{FORM_OPTIONS[field].map((option) => <label key={option} className="rule-option"><span>{option}</span><input type="number" min={0} max={100} value={(config.points[field] as Record<string, number>)[option]} onChange={(event) => updatePoint(field, option, Number(event.target.value))} />{field === "role" || field === "members" || field === "timeline" ? <span className="required-toggle"><input type="checkbox" checked={config.requiredAnswers[field].includes(option as never)} onChange={() => toggleRequired(field, option)} /> لازم برای صلاحیت</span> : null}</label>)}</section>)}<div className="rule-actions"><button formAction={saveAction}>ذخیره draft</button><button className="publish" formAction={publishAction}>انتشار این نسخه</button></div></form>;
}
