import { supabase, supabaseAdmin } from "./supabase";

export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  cover_image: string | null;
  content: string;
  excerpt: string | null;
  status: "draft" | "published";
  source: "original" | "substack" | "twitter" | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching published articles:", error);
    return [];
  }
  return data || [];
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
}

export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching all articles:", error);
    return [];
  }
  return data || [];
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createArticle(
  article: Partial<Article>
): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert(article)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateArticle(
  id: string,
  updates: Partial<Article>
): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) throw error;
}
