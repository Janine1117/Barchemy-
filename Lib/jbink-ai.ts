import { supabase } from "../Lib/supabase";

type ChatMessage = { role: "user" | "assistant"; content: string };
type BarItem = { name?: unknown };

export async function askJbinkAI(messages: ChatMessage[]): Promise<string> {
  if (!supabase) throw new Error("Barchemy sign-in is not configured.");
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) throw new Error("Please sign in to chat with J.Bink.");
  let ingredients: string[] = [];
  try {
    const saved = globalThis.localStorage?.getItem("barchemy.mybar.v1");
    const items: unknown = saved ? JSON.parse(saved) : [];
    if (Array.isArray(items)) ingredients = (items as BarItem[])
      .map(item => item?.name).filter((name): name is string => typeof name === "string").slice(0, 40);
  } catch { /* Saved bar may be unavailable on native or in private browsing. */ }
  const { data, error: invokeError } = await supabase.functions.invoke("jbink-chat", {
    body: { messages: messages.slice(-12), ingredients },
  });
  if (invokeError) throw new Error("J.Bink's AI is temporarily unavailable. Please use guided recipes.");
  if (!data || typeof data.reply !== "string") throw new Error("J.Bink did not return a response.");
  return data.reply;
}
