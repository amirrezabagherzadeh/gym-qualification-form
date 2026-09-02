import Link from "next/link";

export const metadata = { title: "حریم خصوصی | فرم بررسی باشگاه" };

export default function PrivacyPage() {
  const contact = process.env.NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL || "ایمیل تماس پیش از انتشار تعیین می‌شود";
  return <main className="legal-page" dir="rtl"><article><Link href="/" className="back-link">بازگشت به فرم</Link><p className="eyebrow">نسخه ۱</p><h1>سیاست حریم خصوصی</h1><p>برای بررسی درخواست، نام، نام باشگاه، شماره تماس، نقش، تعداد اعضا و پاسخ‌های فرم شما را دریافت می‌کنیم.</p><h2>هدف استفاده</h2><p>این اطلاعات فقط برای ارزیابی اولیه، ارتباط درباره درخواست و پیگیری فروش استفاده می‌شود.</p><h2>نگه‌داری و دسترسی</h2><p>اطلاعات در Neon Postgres نگه‌داری می‌شود و فقط ادمین‌های مجاز با Clerk به آن دسترسی دارند. درخواست‌های بسته‌شده یا نامناسب، ۲۴ ماه پس از غیرفعال‌شدن حذف می‌شوند.</p><h2>درخواست حذف یا پرسش</h2><p>برای درخواست حذف یا پرسش درباره داده‌های خود با <a href={`mailto:${contact}`}>{contact}</a> تماس بگیرید.</p></article></main>;
}
