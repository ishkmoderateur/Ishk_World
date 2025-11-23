import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // Redirect to home if not an admin
  if (!isAdmin(session.user.role)) {
    redirect("/");
  }

  return <>{children}</>;
}

