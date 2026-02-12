import { getAllCityLogs } from "@/lib/city-logs";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCityLogsPage() {
  const cityLogs = await getAllCityLogs();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-xl"
          style={{
            color: "#1a1a1a",
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
          }}
        >
          City Logs
        </h1>
        <Link
          href="/admin/city-logs/new"
          className="px-4 py-2 rounded text-sm hover:opacity-80 transition-opacity"
          style={{
            background: "#670000",
            color: "#fff",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          New City Log
        </Link>
      </div>

      {cityLogs.length === 0 ? (
        <p
          className="text-sm"
          style={{
            color: "#666",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          No city logs yet. Create your first one.
        </p>
      ) : (
        <div
          className="border rounded-lg overflow-hidden"
          style={{ borderColor: "#e5e5e5" }}
        >
          <table className="w-full">
            <thead>
              <tr
                className="border-b text-left text-sm"
                style={{
                  borderColor: "#e5e5e5",
                  color: "#666",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Native Name</th>
                <th className="px-4 py-3 font-medium">Images</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cityLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "#e5e5e5" }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="text-sm"
                      style={{
                        color: "#1a1a1a",
                        fontFamily: "var(--font-geist-sans)",
                      }}
                    >
                      {log.flag_emoji} {log.city}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm"
                      style={{
                        color: "#666",
                        fontFamily: "var(--font-geist-sans)",
                      }}
                    >
                      {log.native_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: log.images.length > 0 ? "#dcfce7" : "#f3f4f6",
                        color: log.images.length > 0 ? "#166534" : "#6b7280",
                        fontFamily: "var(--font-geist-sans)",
                      }}
                    >
                      {log.images.length} photo{log.images.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/city-logs/${log.id}/edit`}
                        className="text-sm hover:opacity-70"
                        style={{
                          color: "#670000",
                          fontFamily: "var(--font-geist-sans)",
                        }}
                      >
                        Edit
                      </Link>
                      <DeleteButton id={log.id} action="cityLog" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
