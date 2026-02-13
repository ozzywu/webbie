import { supabase, supabaseAdmin } from "./supabase";

export interface Book {
  id: string;
  title: string;
  author: string;
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

export async function getPublishedBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching published books:", error);
    return [];
  }
  return data || [];
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
}

export async function getAllBooks(): Promise<Book[]> {
  const { data, error } = await supabaseAdmin
    .from("books")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching all books:", error);
    return [];
  }
  return data || [];
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabaseAdmin
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createBook(book: Partial<Book>): Promise<Book> {
  const { data, error } = await supabaseAdmin
    .from("books")
    .insert(book)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBook(
  id: string,
  updates: Partial<Book>,
): Promise<Book> {
  const { data, error } = await supabaseAdmin
    .from("books")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("books").delete().eq("id", id);
  if (error) throw error;
}
