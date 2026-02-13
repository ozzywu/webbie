import { isAuthenticated } from "../actions";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
