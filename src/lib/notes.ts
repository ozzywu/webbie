import { supabase, supabaseAdmin } from "./supabase";

export interface Note {
  id: string;
  title: string;
  slug: string;
  date: string;
  cover_image: string | null;
  cover_image_position: string | null;
  content: string;
  excerpt: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export async function getPublishedNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching published notes:", error);
    return [];
  }
  return data || [];
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
}

export async function getAllNotes(): Promise<Note[]> {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching all notes:", error);
    return [];
  }
  return data || [];
}

export async function getNoteById(id: string): Promise<Note | null> {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createNote(note: Partial<Note>): Promise<Note> {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .insert(note)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNote(
  id: string,
  updates: Partial<Note>,
): Promise<Note> {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("notes").delete().eq("id", id);
  if (error) throw error;
}
