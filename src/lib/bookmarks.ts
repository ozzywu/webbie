import { supabase, supabaseAdmin } from "./supabase";

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  author: string | null;
  excerpt: string | null;
  og_image: string | null;
  source: string;
  notes: string;
  status: "saved" | "published";
  created_at: string;
  updated_at: string;
}

export async function getPublishedBookmarks(): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published bookmarks:", error);
    return [];
  }
  return data || [];
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all bookmarks:", error);
    return [];
  }
  return data || [];
}

export async function getBookmarkById(id: string): Promise<Bookmark | null> {
  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getBookmarkByUrl(url: string): Promise<Bookmark | null> {
  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .select("*")
    .eq("url", url)
    .single();

  if (error) return null;
  return data;
}

export async function createBookmark(
  bookmark: Partial<Bookmark>,
): Promise<Bookmark> {
  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .insert(bookmark)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookmark(
  id: string,
  updates: Partial<Bookmark>,
): Promise<Bookmark> {
  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBookmark(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bookmarks")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
