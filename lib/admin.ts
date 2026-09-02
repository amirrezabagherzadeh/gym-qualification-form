import { auth, currentUser } from "@clerk/nextjs/server";

type AdminIdentity = { userId: string; displayName: string };

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const metadata = user?.publicMetadata as { role?: unknown } | undefined;
  if (metadata?.role !== "admin") return null;

  return { userId, displayName: user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "ادمین" };
}
