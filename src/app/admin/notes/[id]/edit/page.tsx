import { getNoteById } from "@/lib/notes";
import { NoteForm } from "@/components/admin/NoteForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: Props) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  return <NoteForm note={note} />;
}
