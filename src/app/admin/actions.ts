"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/articles";
import {
  createCityLog,
  updateCityLog,
  deleteCityLog,
} from "@/lib/city-logs";
import { supabaseAdmin } from "@/lib/supabase";

// --- Auth helpers ---

function getExpectedToken() {
  return Buffer.from(`admin:${process.env.ADMIN_PASSWORD}`).toString("base64");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return token === getExpectedToken();
}

async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }
}

// --- Login / Logout ---

export async function loginAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string } | void> {
  const password = formData.get("password") as string;

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", getExpectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect("/admin/articles");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}

// --- Article CRUD ---

export async function saveArticleAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string } | void> {
  await requireAuth();

  const id = formData.get("id") as string | null;
  const articleData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    date: formData.get("date") as string,
    cover_image: (formData.get("cover_image") as string) || null,
    cover_image_position:
      (formData.get("cover_image_position") as string) || "50% 50%",
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    status: formData.get("status") as "draft" | "published",
  };

  try {
    if (id) {
      await updateArticle(id, articleData);
    } else {
      await createArticle(articleData);
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save article";
    return { error: message };
  }

  redirect("/admin/articles");
}

export async function deleteArticleAction(formData: FormData) {
  await requireAuth();

  const id = formData.get("id") as string;

  try {
    await deleteArticle(id);
  } catch (error) {
    console.error("Delete failed:", error);
  }

  redirect("/admin/articles");
}

// --- Image Upload ---

export async function uploadImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  await requireAuth();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const bucket = (formData.get("bucket") as string) || "article-images";

  // Ensure the storage bucket exists (idempotent)
  await supabaseAdmin.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  });

  // Generate a unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

  return { url: publicUrl };
}

// --- City Log CRUD ---

export async function saveCityLogAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string } | void> {
  await requireAuth();

  const id = formData.get("id") as string | null;
  const imagesJson = formData.get("images") as string;

  const logData = {
    city: formData.get("city") as string,
    native_name: formData.get("native_name") as string,
    flag_emoji: (formData.get("flag_emoji") as string) || "",
    one_liner: (formData.get("one_liner") as string) || "",
    jots: (formData.get("jots") as string) || "",
    images: imagesJson ? JSON.parse(imagesJson) : [],
  };

  try {
    if (id) {
      await updateCityLog(id, logData);
    } else {
      await createCityLog(logData);
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save city log";
    return { error: message };
  }

  redirect("/admin/city-logs");
}

export async function deleteCityLogAction(formData: FormData) {
  await requireAuth();

  const id = formData.get("id") as string;

  try {
    await deleteCityLog(id);
  } catch (error) {
    console.error("Delete failed:", error);
  }

  redirect("/admin/city-logs");
}
