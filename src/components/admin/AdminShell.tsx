import { logoutAction } from "@/app/admin/actions";
import { AllowScroll } from "@/components/AllowScroll";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/notes", label: "Notes" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/city-logs", label: "Cities" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AllowScroll />
      <div className="min-h-screen" style={{ background: "#fafafa" }}>
        <header className="border-b" style={{ borderColor: "#e5e5e5" }}>
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm hover:opacity-70"
                  style={{
                    color: "#666",
                    fontFamily: "var(--font-geist-sans)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
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
