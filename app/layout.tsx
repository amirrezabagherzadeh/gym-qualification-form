import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "فرم بررسی باشگاه",
  description: "فرم Qualification مرحله‌ای برای تشخیص لید مناسب باشگاه.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <html lang="fa" dir="rtl">
      <body>{hasClerk ? <ClerkProvider>{children}</ClerkProvider> : children}</body>
    </html>
  );
}
