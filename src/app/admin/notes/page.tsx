import { getAllNotes } from "@/lib/notes";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminNotesPage() {
  const notes = await getAllNotes();

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
          Notes
        </h1>
        <Link
          href="/admin/notes/new"
          className="px-4 py-2 rounded text-sm hover:opacity-80 transition-opacity"
          style={{
            background: "#670000",
            color: "#fff",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <p
          className="text-sm"
          style={{
            color: "#666",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          No notes yet. Create your first one.
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
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr
                  key={note.id}
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
                      {note.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background:
                          note.status === "published" ? "#dcfce7" : "#f3f4f6",
                        color:
                          note.status === "published" ? "#166534" : "#6b7280",
                        fontFamily: "var(--font-geist-sans)",
                      }}
                    >
                      {note.status}
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
                      {note.date}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {note.status === "published" && (
                        <a
                          href={`/athenaeum/note/${note.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:opacity-70"
                          style={{
                            color: "#2563eb",
                            fontFamily: "var(--font-geist-sans)",
                          }}
                        >
                          View
                        </a>
                      )}
                      <Link
                        href={`/admin/notes/${note.id}/edit`}
                        className="text-sm hover:opacity-70"
                        style={{
                          color: "#670000",
                          fontFamily: "var(--font-geist-sans)",
                        }}
                      >
                        Edit
                      </Link>
                      <DeleteButton id={note.id} action="note" />
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
