"use client";

import {
  deleteArticleAction,
  deleteCityLogAction,
  deleteBookAction,
  deleteNoteAction,
} from "@/app/admin/actions";

export function DeleteButton({
  id,
  action = "article",
}: {
  id: string;
  action?: "article" | "cityLog" | "book" | "note";
}) {
  const deleteAction =
    action === "cityLog"
      ? deleteCityLogAction
      : action === "book"
        ? deleteBookAction
        : action === "note"
          ? deleteNoteAction
          : deleteArticleAction;
  const label =
    action === "cityLog"
      ? "city log"
      : action === "book"
        ? "book"
        : action === "note"
          ? "note"
          : "article";

  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!window.confirm(`Are you sure you want to delete this ${label}?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm hover:opacity-70 transition-opacity"
        style={{
          color: "#dc2626",
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        Delete
      </button>
    </form>
  );
}
