import { supabase } from "./supabase";

export type MemoryRow = {
  id: string;
  user_id: string;
  title: string;
  recipe: string;
  created_at: string;
};

export async function saveMemory(title: string, recipe: string) {
  if (!supabase) {
    return {
      ok: false as const,
      message: "Supabase is not configured. Add the two EXPO_PUBLIC_SUPABASE environment variables in Vercel.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { ok: false as const, message: userError.message };
  }

  if (!user) {
    return {
      ok: false as const,
      message: "Sign in before saving a memory.",
    };
  }

  const cleanTitle = title.trim();
  const cleanRecipe = recipe.trim();

  if (!cleanTitle || !cleanRecipe) {
    return {
      ok: false as const,
      message: "A memory needs both a title and recipe.",
    };
  }

  const { error } = await supabase.from("memories").insert({
    user_id: user.id,
    title: cleanTitle,
    recipe: cleanRecipe,
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, message: "Memory saved." };
}

export async function loadMemories() {
  if (!supabase) {
    return {
      ok: false as const,
      message: "Supabase is not configured.",
      memories: [] as MemoryRow[],
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return {
      ok: false as const,
      message: userError.message,
      memories: [] as MemoryRow[],
    };
  }

  if (!user) {
    return {
      ok: false as const,
      message: "Sign in to see your saved memories.",
      memories: [] as MemoryRow[],
    };
  }

  const { data, error } = await supabase
    .from("memories")
    .select("id,user_id,title,recipe,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false as const,
      message: error.message,
      memories: [] as MemoryRow[],
    };
  }

  return {
    ok: true as const,
    message: "",
    memories: (data ?? []) as MemoryRow[],
  };
}
