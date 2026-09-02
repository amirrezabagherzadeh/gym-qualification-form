import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminIdentity } from "@/lib/admin";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/admin");

  const admin = await getAdminIdentity();
  if (!admin) redirect("/");
  return <main className="admin-shell" dir="rtl"><aside className="admin-sidebar"><Link className="admin-brand" href="/admin/leads">Leads <span>OS</span></Link><nav><Link href="/admin/leads">لیدها</Link><Link href="/admin/rules">قواعد امتیازدهی</Link><Link href="/">مشاهده فرم</Link></nav><div className="admin-user"><UserButton /><span>{admin.displayName}</span></div></aside><section className="admin-content">{children}</section></main>;
}
