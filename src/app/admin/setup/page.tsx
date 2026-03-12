import { SetupContent } from "@/components/admin/SetupContent";

export const dynamic = "force-dynamic";

export default function AdminSetupPage() {
  const token = process.env.BOOKMARK_TOKEN || "";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  return <SetupContent token={token} siteUrl={siteUrl} />;
}
