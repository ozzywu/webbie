"use client";

import { deleteArticleAction } from "@/app/admin/actions";

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteArticleAction}
      onSubmit={(e) => {
        if (!window.confirm("Are you sure you want to delete this article?")) {
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
