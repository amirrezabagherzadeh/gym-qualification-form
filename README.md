<div align="center" dir="rtl">

# فرم ارزیابی هوشمند باشگاه

<p>یک تجربه‌ی کوتاه، شفاف و حرفه‌ای برای تشخیص لیدهای مناسب باشگاه‌ها — از اولین پاسخ تا پیگیری تیم فروش.</p>

<p>
  <a href="https://gym-qualification-form-qjpib59ko-amirrezabagherzadehs-projects.vercel.app"><img alt="نمایش نسخهٔ زنده" src="https://img.shields.io/badge/نسخهٔ_زنده-Vercel-166534?style=for-the-badge&logo=vercel&logoColor=white"></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-111111?style=for-the-badge&logo=next.js&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="PostgreSQL with Neon" src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white">
</p>

</div>

<br>

<div dir="rtl">

## ایدهٔ محصول

این پروژه یک فرم Qualification فارسی برای باشگاه‌ها است؛ به‌جای یک فرم بلند و خسته‌کننده، کاربر در هشت گام کوتاه به سؤال‌ها پاسخ می‌دهد. پاسخ‌ها بلافاصله با قواعد قابل‌مدیریت امتیازدهی می‌شوند و لید برای پیگیری به پنل امن مدیریت وارد می‌شود.

<table>
  <tr>
    <td align="center" width="33%"><b>برای مخاطب</b><br><br>مسیر تک‌سؤالی، سریع و بدون شلوغی<br><sub>تکمیل آسان در موبایل</sub></td>
    <td align="center" width="33%"><b>برای تیم فروش</b><br><br>اولویت‌بندی لیدها با امتیاز و وضعیت<br><sub>تمرکز روی فرصت‌های باکیفیت</sub></td>
    <td align="center" width="33%"><b>برای مدیر</b><br><br>قواعد نسخه‌بندی‌شده و قابل‌انتشار<br><sub>بهبود مدل بدون استقرار مجدد</sub></td>
  </tr>
</table>

## سفر کاربر، به‌شکل تصویری

<table>
  <tr>
    <td align="center">①<br><b>ورود</b><br><sub>عنوان روشن و هدف فرم</sub></td>
    <td align="center">→</td>
    <td align="center">②<br><b>پاسخ کوتاه</b><br><sub>یک تصمیم در هر صفحه</sub></td>
    <td align="center">→</td>
    <td align="center">③<br><b>ارزیابی</b><br><sub>اعتبارسنجی و امتیازدهی</sub></td>
    <td align="center">→</td>
    <td align="center">④<br><b>پیگیری</b><br><sub>لیدِ قابل‌اقدام در پنل</sub></td>
  </tr>
</table>

<br>

### ① تجربهٔ فرم عمومی

<table>
  <tr>
    <td width="58%">
      <b>رویکرد UI</b><br><br>
      رابط راست‌به‌چپ با تایپوگرافی فارسی Kalameh، پس‌زمینهٔ گرم و کارت سفید، حس حرفه‌ای و آرام ایجاد می‌کند. نوار پیشرفت، شمارندهٔ سؤال و برچسب «ضروری/اختیاری» همیشه جای کاربر را در مسیر روشن نگه می‌دارند.
    </td>
    <td width="42%">
      <pre><code>Qualification

بررسی پیاده‌سازی سیستم
هوشمند برای باشگاه شما

━━━━━━●━━━━━━  سؤال ۳ از ۸

مهم‌ترین چالش شما چیست؟

┌──────────────────────────┐
│  جذب عضو جدید           ○ │
├──────────────────────────┤
│  مدیریت باشگاه          ○ │
└──────────────────────────┘</code></pre>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th>تصمیم UX</th>
    <th>دلیل</th>
    <th>اثر</th>
  </tr>
  <tr>
    <td>یک سؤال در هر لحظه</td>
    <td>کاهش بار شناختی</td>
    <td>فرم کوتاه‌تر و قابل‌تمرکزتر حس می‌شود.</td>
  </tr>
  <tr>
    <td>انتخاب‌های بزرگ و قابل لمس</td>
    <td>استفادهٔ راحت روی تلفن</td>
    <td>پاسخ گزینه‌ای با یک لمس ثبت می‌شود.</td>
  </tr>
  <tr>
    <td>حرکت خودکار بعد از انتخاب</td>
    <td>حذف یک کلیک غیرضروری</td>
    <td>ریتم فرم سریع و طبیعی باقی می‌ماند.</td>
  </tr>
  <tr>
    <td>بازخورد نتیجهٔ شفاف</td>
    <td>پایان مشخص برای کاربر</td>
    <td>پس از ثبت، پیام تأیید دریافت می‌کند.</td>
  </tr>
</table>

### ② پنل مدیریت لیدها

پنل `/admin` برای اعضای دارای نقش <code>admin</code> در Clerk محافظت می‌شود. صفحهٔ لیدها، درخواست‌ها را در یک جدول عملیاتی نشان می‌دهد: نام، باشگاه، شماره، امتیاز، وضعیت و زمان ثبت. فیلترهای نام/باشگاه/موبایل، وضعیت، نتیجهٔ صلاحیت، نقش، بازهٔ تاریخ و مرتب‌سازی، رسیدگی روزانه را سریع می‌کنند.

<table>
  <tr>
    <td align="center" width="25%">🧭<br><b>ناوبری ساده</b><br><sub>لیدها و قوانین در یک سایدبار</sub></td>
    <td align="center" width="25%">🔎<br><b>فیلتر دقیق</b><br><sub>رسیدن به لید مناسب در چند ثانیه</sub></td>
    <td align="center" width="25%">🏷️<br><b>وضعیت قابل‌پیگیری</b><br><sub>جدید تا جلسهٔ رزرو‌شده و بسته‌شده</sub></td>
    <td align="center" width="25%">⬇️<br><b>خروجی آماده</b><br><sub>CSV و Excel با همان فیلترها</sub></td>
  </tr>
</table>

### ③ قواعد امتیازدهی

امتیازدهی از رابط کاربری جداست. مدیر ابتدا یک Draft از نسخهٔ فعال می‌سازد، وزن و حدنصاب را ویرایش می‌کند و سپس نسخه را منتشر می‌کند. هر ثبت جدید، به همان نسخهٔ فعال متصل می‌شود؛ بنابراین تصمیم‌های فروش قابل‌ردیابی و قابل‌بهبود باقی می‌مانند.

<pre><code>قواعد فعال v3 ──→ اعتبارسنجی پاسخ‌ها ──→ امتیاز + qualified ──→ لید قابل‌پیگیری
       │
       └──→ ساخت Draft جدید ──→ ویرایش وزن‌ها ──→ انتشار v4</code></pre>

## معماری

<table>
  <tr>
    <td align="center">👤<br><b>کاربر</b><br><sub>فرم Next.js</sub></td>
    <td align="center">→</td>
    <td align="center">🛡️<br><b>API</b><br><sub>Zod · BotID · محدودیت حجم</sub></td>
    <td align="center">→</td>
    <td align="center">🧮<br><b>موتور امتیاز</b><br><sub>قواعد فعال</sub></td>
    <td align="center">→</td>
    <td align="center">🗄️<br><b>Neon Postgres</b><br><sub>Drizzle ORM</sub></td>
    <td align="center">→</td>
    <td align="center">🧑‍💼<br><b>ادمین</b><br><sub>Clerk-protected</sub></td>
  </tr>
</table>

<ul>
  <li><b>Next.js 16 + React 19:</b> رابط و Route Handlerهای یکپارچه.</li>
  <li><b>Neon + Drizzle:</b> داده‌های لید، یادداشت‌ها و نسخه‌های قواعد.</li>
  <li><b>Clerk:</b> احراز هویت و کنترل نقش برای پنل مدیریت.</li>
  <li><b>Vercel BotID:</b> تشخیص درخواست‌های ربات در محیط Vercel.</li>
  <li><b>Vercel Cron:</b> پاک‌سازی روزانهٔ لیدهای بسته/نامناسب پس از دورهٔ نگهداری.</li>
</ul>

## حریم خصوصی و تاب‌آوری

<table>
  <tr><th>مکانیزم</th><th>نقش آن</th></tr>
  <tr><td>اعتبارسنجی Zod و نرمال‌سازی موبایل ایران</td><td>ذخیرهٔ دادهٔ سازگار و جلوگیری از ورودی نامعتبر</td></tr>
  <tr><td>توکن یکتای ثبت</td><td>ثبت idempotent؛ کلیک یا ارسال تکراری لید جدید نمی‌سازد</td></tr>
  <tr><td>محدودسازی تعداد ثبت برای هر شماره</td><td>حداکثر سه تلاش در ۲۴ ساعت</td></tr>
  <tr><td>Honeypot، حد زمان تکمیل و BotID</td><td>کاهش ارسال خودکار و رفتار مشکوک</td></tr>
  <tr><td>نسخهٔ سیاست حریم خصوصی و زمان رضایت</td><td>ثبت زمینهٔ رضایت برای هر لید</td></tr>
</table>

## اجرای محلی

<ol>
  <li>Node.js 24 و Vercel CLI را نصب کنید.</li>
  <li>متغیرهای محیطی را از پروژهٔ Vercel دریافت کنید:
    <pre><code>vercel env pull .env.local --yes</code></pre>
  </li>
  <li>مقادیر <code>NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL</code> و <code>CRON_SECRET</code> را تنظیم کنید؛ در صورت وجود صفحهٔ رزرو، <code>NEXT_PUBLIC_BOOKING_URL</code> را هم بیفزایید.</li>
  <li>migration اولیه را اجرا کنید:
    <pre><code>npm run db:migrate:local</code></pre>
  </li>
  <li>سرور توسعه را بالا بیاورید:
    <pre><code>npm run dev</code></pre>
  </li>
</ol>

## بررسی کیفیت و انتشار

<pre><code>npm run lint
npm run typecheck
npm test
npm run build</code></pre>

پیش از انتشار واقعی، اتصال Neon در محیط Production، حساب Clerk Production، کاربر ادمین اولیه، ایمیل حریم خصوصی، دامنهٔ اختصاصی و <code>CRON_SECRET</code> را بررسی کنید. Preview و Development باید به دیتابیس جدا از دادهٔ واقعی وصل باشند.

<hr>

<p align="center"><sub>ساخته‌شده برای تبدیل گفت‌وگوهای اولیه به فرصت‌های فروش قابل‌پیگیری.</sub></p>

</div>
