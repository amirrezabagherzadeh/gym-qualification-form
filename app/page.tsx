"use client";

import Link from "next/link";
import { useState } from "react";
import { FORM_OPTIONS, PRIVACY_POLICY_VERSION } from "@/lib/form";

type FormState = { relation: string; fullName: string; gymName: string; role: string; members: string; challenge: string; phone: string; timeline: string };
const initialData: FormState = { relation: "", fullName: "", gymName: "", role: "", members: "", challenge: "", phone: "", timeline: "" };
const fields = [
  { key: "relation", label: "نسبت شما با باشگاه چیست؟", description: "کمک می‌کند افراد صرفاً کنجکاو از لیدهای جدی جدا شوند.", options: FORM_OPTIONS.relation, required: true },
  { key: "fullName", label: "نام و نام خانوادگی", description: "برای ثبت بررسی با نام خودتان.", placeholder: "مثلاً علی رضایی", required: true },
  { key: "gymName", label: "نام باشگاه", description: "نام مجموعه یا برندی که سیستم برای آن بررسی می‌شود.", placeholder: "مثلاً باشگاه اسپارتا", required: true },
  { key: "role", label: "سمت شما در مجموعه چیست؟", description: "برای تشخیص نقش شما در تصمیم‌گیری.", options: FORM_OPTIONS.role, required: true },
  { key: "members", label: "حدوداً چند عضو فعال دارید؟", description: "اندازه باشگاه روی پیشنهاد مناسب اثر می‌گذارد.", options: FORM_OPTIONS.members, required: true },
  { key: "challenge", label: "مهم‌ترین چالش فعلی باشگاه چیست؟", description: "مسیر بررسی را شخصی‌سازی می‌کند.", options: FORM_OPTIONS.challenge, required: true },
  { key: "phone", label: "شماره موبایل", description: "فقط برای هماهنگی نتیجه بررسی و پیگیری بعدی.", placeholder: "09xxxxxxxxx", required: true, type: "tel" },
  { key: "timeline", label: "اگر مناسب باشد، چه زمانی راه‌اندازی شود؟", description: "این سؤال اختیاری است، اما Intent خرید را دقیق‌تر می‌کند.", options: FORM_OPTIONS.timeline, required: false },
] as const;

function newToken() { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`; }

export default function Home() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialData);
  const [submissionToken] = useState(newToken);
  const [startedAt] = useState(() => new Date().toISOString());
  const [honeypot, setHoneypot] = useState("");
  const [result, setResult] = useState<{ score: number; qualified: boolean } | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const field = fields[step];
  const lastStep = step === fields.length - 1;
  const value = data[field.key];
  const canContinue = !field.required || value.trim().length > 0;
  const setValue = (key: keyof FormState, nextValue: string) => setData((current) => ({ ...current, [key]: nextValue }));
  async function submit() {
    if (!canContinue || submitting) return;
    setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, submissionToken, privacyPolicyVersion: PRIVACY_POLICY_VERSION, formStartedAt: startedAt, honeypot }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "ثبت فرم انجام نشد.");
      setResult(body);
    } catch (submissionError) { setError(submissionError instanceof Error ? submissionError.message : "خطای غیرمنتظره رخ داد."); }
    finally { setSubmitting(false); }
  }

  function next() { if (!canContinue) return; if (lastStep) void submit(); else setStep((current) => current + 1); }
  function choose(option: string) { setValue(field.key, option); if (!lastStep) window.setTimeout(() => setStep((current) => current + 1), 110); }

  return <main className="form-page" dir="rtl"><section className="form-shell" aria-label="فرم بررسی باشگاه"><header className="form-header"><span className="form-mark">Qualification</span><h1>بررسی پیاده‌سازی سیستم هوشمند برای باشگاه شما</h1><p>چند سؤال کوتاه برای ارزیابی اولیه پاسخ دهید.</p></header><section className="form-card">{!result ? <><div className="form-progress" aria-label={`پیشرفت ${Math.round(((step + 1) / fields.length) * 100)} درصد`}><span style={{ width: `${((step + 1) / fields.length) * 100}%` }} /></div><div className="question-meta"><span>سؤال {step + 1} از {fields.length}</span><strong className={field.required ? "" : "optional"}>{field.required ? "ضروری" : "اختیاری"}</strong></div><div className="question-block"><h2>{field.label}</h2><p>{field.description}</p></div>{"options" in field ? <div className="choice-list">{field.options.map((option) => <button className={value === option ? "choice selected" : "choice"} key={option} type="button" onClick={() => choose(option)}><span>{option}</span><b /></button>)}</div> : <label className="input-wrap"><span>{field.label}</span><input inputMode={("type" in field && field.type === "tel") ? "tel" : "text"} placeholder={field.placeholder} type={("type" in field && field.type) ? field.type : "text"} value={value} onChange={(event) => setValue(field.key, event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") next(); }} /></label>}{lastStep ? <label className="honeypot" aria-hidden="true">وب‌سایت<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label> : null}{error ? <p className="form-error" role="alert">{error}</p> : null}<footer className="form-actions"><button className="back-button" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || submitting}>قبلی</button><button className="next-button" type="button" onClick={next} disabled={!canContinue || submitting}>{submitting ? "در حال ثبت…" : lastStep ? "ثبت فرم" : "ادامه"}</button></footer></> : <section className="result-panel"><h2>از ثبت درخواست شما سپاسگزاریم.</h2><p>تیم ما به‌زودی با شما تماس خواهد گرفت.</p></section>}</section><Link className="privacy-link" href="/privacy">حریم خصوصی</Link></section></main>;
}
