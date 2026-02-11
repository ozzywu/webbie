import { isAuthenticated, logoutAction } from "../actions";
import { redirect } from "next/navigation";
import { AllowScroll } from "@/components/AllowScroll";
import Link from "next/link";

export default async function AdminArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  return (
    <>
      <AllowScroll />
      <div className="min-h-screen" style={{ background: "#fafafa" }}>
        <header
          className="border-b"
          style={{ borderColor: "#e5e5e5" }}
        >
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span
                className="text-lg"
                style={{
                  color: "#1a1a1a",
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                }}
              >
                Admin
              </span>
              <Link
                href="/admin/articles"
                className="text-sm hover:opacity-70"
                style={{
                  color: "#666",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                Articles
              </Link>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm hover:opacity-70"
                style={{
                  color: "#666",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                Logout
              </button>
            </form>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      </div>
    </>
  );
}
