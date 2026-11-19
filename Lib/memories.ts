import { supabase } from "./supabase";

export type MemoryRow = {
  id: string;
  user_id: string;
  title: string;
  recipe: string;
  created_at: string;
};

const GUEST_KEY = "barchemy.memories.v1";
const accountKey = (userId: string) => `barchemy.memories.account.${userId}.v1`;

function storage() {
  try { return (globalThis as any).localStorage ?? null; } catch { return null; }
}

function readLocal(key: string): MemoryRow[] {
  try {
    const raw = storage()?.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row): row is MemoryRow =>
      row !== null && typeof row === "object" &&
      typeof row.id === "string" && typeof row.title === "string" &&
      typeof row.recipe === "string" && typeof row.created_at === "string"
    );
  } catch { return []; }
}

function writeLocal(key: string, rows: MemoryRow[]): boolean {
  try {
    const store = storage();
    if (!store) return false;
    store.setItem(key, JSON.stringify(rows));
    return true;
  } catch { return false; }
}

function localId(): string {
  const cryptoObject = (globalThis as any).crypto;
  return cryptoObject?.randomUUID?.() ?? `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function saveOnDevice(key: string, userId: string, title: string, recipe: string) {
  const memory: MemoryRow = {
    id: localId(), user_id: userId, title, recipe, created_at: new Date().toISOString(),
  };
  return writeLocal(key, [memory, ...readLocal(key)]);
}

function missingColumn(error: { code?: string; message?: string }): boolean {
  return (error.code === "PGRST204" || error.code === "42703") &&
    /column|schema cache/i.test(error.message ?? "");
}

function normalizeRemote(rows: any[]): MemoryRow[] {
  return rows.map((row) => ({
    id: String(row.id),
    user_id: String(row.user_id),
    title: String(row.title ?? "Untitled cocktail"),
    recipe: String(row.recipe ?? row.notes ?? row.note ?? ""),
    created_at: String(row.created_at),
  }));
}

export async function saveMemory(title: string, recipe: string) {
  const cleanTitle = title.trim();
  const cleanRecipe = recipe.trim();
  if (!cleanTitle || !cleanRecipe) {
    return { ok: false as const, message: "A memory needs both a title and recipe." };
  }

  let userId: string | null = null;
  if (supabase) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!authError && user) {
        userId = user.id;
        // Allow safe transition from legacy 'note'/'notes' schemas while the
        // additive database migration is pending. Never retry an RLS error.
        const payloads = [
          { recipe: cleanRecipe },
          { notes: cleanRecipe },
          { note: cleanRecipe },
        ];
        for (const payload of payloads) {
          const { error } = await supabase.from("memories").insert({
            user_id: user.id, title: cleanTitle, ...payload,
          });
          if (!error) return { ok: true as const, message: "Memory saved to your account." };
          if (!missingColumn(error)) break;
        }
      }
    } catch {
      // Display an explicit local-only message instead of pretending cloud sync succeeded.
    }
  }

  const key = userId ? accountKey(userId) : GUEST_KEY;
  if (saveOnDevice(key, userId ?? "local", cleanTitle, cleanRecipe)) {
    return {
      ok: true as const,
      message: userId
        ? "Saved on this device only. Account sync is unavailable; keep this browser's data."
        : "Saved on this device only. Sign in for account-based saving when available.",
    };
  }
  return { ok: false as const, message: "Unable to save this memory. Please try again." };
}

export async function loadMemories() {
  if (supabase) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!authError && user) {
        const localRows = readLocal(accountKey(user.id));
        // A wildcard is intentional: current installations may have 'recipe',
        // 'notes', or legacy 'note'. RLS still restricts rows to this user.
        const { data, error } = await supabase.from("memories")
          .select("*").eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error) {
          const remoteRows = normalizeRemote(data ?? []);
          return {
            ok: true as const,
            message: localRows.length
              ? "Some memories are stored only on this device and have not synced to your account."
              : "",
            memories: [...localRows, ...remoteRows].sort((a, b) =>
              b.created_at.localeCompare(a.created_at)),
          };
        }
        return {
          ok: true as const,
          message: "Account memories are temporarily unavailable. Showing only memories saved on this device.",
          memories: localRows,
        };
      }
    } catch {
      // Recover with guest data, clearly labeled as device-only in the UI.
    }
  }
  return {
    ok: true as const,
    message: "These memories are saved only on this device. They do not sync across devices.",
    memories: readLocal(GUEST_KEY),
  };
}
