import { supabase, supabaseAdmin } from "./supabase";

export interface CityLog {
  id: string;
  city: string;
  country_code: string;
  native_name: string;
  flag_emoji: string;
  one_liner: string;
  jots: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

// Public read — used on the travel page (server-side)
export async function getCityLogs(): Promise<CityLog[]> {
  const { data, error } = await supabase
    .from("city_logs")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    console.error("Error fetching city logs:", error);
    return [];
  }
  return data || [];
}

export async function getCityLogByCity(city: string): Promise<CityLog | null> {
  const { data, error } = await supabase
    .from("city_logs")
    .select("*")
    .eq("city", city)
    .single();

  if (error) return null;
  return data;
}

// Admin reads
export async function getAllCityLogs(): Promise<CityLog[]> {
  const { data, error } = await supabaseAdmin
    .from("city_logs")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    console.error("Error fetching all city logs:", error);
    return [];
  }
  return data || [];
}

export async function getCityLogById(id: string): Promise<CityLog | null> {
  const { data, error } = await supabaseAdmin
    .from("city_logs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

// Admin writes
export async function createCityLog(log: Partial<CityLog>): Promise<CityLog> {
  const { data, error } = await supabaseAdmin
    .from("city_logs")
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCityLog(
  id: string,
  updates: Partial<CityLog>,
): Promise<CityLog> {
  const { data, error } = await supabaseAdmin
    .from("city_logs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCityLog(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("city_logs").delete().eq("id", id);
  if (error) throw error;
}
