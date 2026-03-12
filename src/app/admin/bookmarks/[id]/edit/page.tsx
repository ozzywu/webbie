import { getBookmarkById } from "@/lib/bookmarks";
import { notFound } from "next/navigation";
import { BookmarkForm } from "@/components/admin/BookmarkForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBookmarkPage({ params }: Props) {
  const { id } = await params;
  const bookmark = await getBookmarkById(id);

  if (!bookmark) {
    notFound();
  }

  return <BookmarkForm bookmark={bookmark} />;
}
