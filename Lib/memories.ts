import { supabase } from "./supabase";

export type MemoryRow = {
  id: string;
  user_id: string;
  title: string;
  recipe: string;
  created_at: string;
};

const LOCAL_KEY = "barchemy.memories.v1";

function getStorage() {
  try {
    return (globalThis as any).localStorage ?? null;
  } catch {
    return null;
  }
}

function readLocalMemories(): MemoryRow[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MemoryRow[]) : [];
  } catch {
    return [];
  }
}

function writeLocalMemories(memories: MemoryRow[]) {
  const storage = getStorage();
  if (!storage) return false;

  try {
    storage.setItem(LOCAL_KEY, JSON.stringify(memories));
    return true;
  } catch {
    return false;
  }
}

function createLocalId() {
  const cryptoObject = (globalThis as any).crypto;
  if (cryptoObject?.randomUUID) return cryptoObject.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function saveLocalMemory(title: string, recipe: string) {
  const memory: MemoryRow = {
    id: createLocalId(),
    user_id: "local",
    title,
    recipe,
    created_at: new Date().toISOString(),
  };

  const memories = [memory, ...readLocalMemories()];
  return writeLocalMemories(memories);
}

export async function saveMemory(title: string, recipe: string) {
  const cleanTitle = title.trim();
  const cleanRecipe = recipe.trim();

  if (!cleanTitle || !cleanRecipe) {
    return {
      ok: false as const,
      message: "A memory needs both a title and recipe.",
    };
  }

  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("memories").insert({
          user_id: user.id,
          title: cleanTitle,
          recipe: cleanRecipe,
        });

        if (!error) {
          return { ok: true as const, message: "Memory saved." };
        }
      }
    } catch {
      // Fall through to local storage so the MVP still works offline or unsigned-in.
    }
  }

  if (saveLocalMemory(cleanTitle, cleanRecipe)) {
    return {
      ok: true as const,
      message: "Memory saved on this device.",
    };
  }

  return {
    ok: false as const,
    message: "Unable to save this memory on this device.",
  };
}

export async function loadMemories() {
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("memories")
          .select("id,user_id,title,recipe,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error) {
          return {
            ok: true as const,
            message: "",
            memories: (data ?? []) as MemoryRow[],
          };
        }
      }
    } catch {
      // Fall through to locally saved memories.
    }
  }

  return {
    ok: true as const,
    message: "",
    memories: readLocalMemories(),
  };
}
