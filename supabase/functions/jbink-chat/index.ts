// Staged prototype only: do not deploy until server-side quotas and billing caps are configured.
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigin = "https://barchemy.onrender.com";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigin, "Vary": "Origin" },
});

Deno.serve(async (req: Request) => {
  if (req.headers.get("origin") !== allowedOrigin) return json({ error: "Origin not allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, {
    status: 204, headers: { "Access-Control-Allow-Origin": allowedOrigin, "Access-Control-Allow-Headers": "authorization, content-type, apikey", "Access-Control-Allow-Methods": "POST", "Vary": "Origin" },
  });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const token = req.headers.get("authorization")?.replace(/^Bearer /i, "");
  if (!token) return json({ error: "Sign in required" }, 401);
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user || user.is_anonymous) return json({ error: "Sign in required" }, 401);
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) return json({ error: "AI is not configured" }, 503);
  let body: { messages?: { role?: string; content?: string }[]; ingredients?: string[] };
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12 ||
      messages.some(m => !["user", "assistant"].includes(m.role ?? "") || typeof m.content !== "string" || m.content.length > 1000))
    return json({ error: "Invalid conversation" }, 400);
  const ingredients = Array.isArray(body.ingredients) ? body.ingredients.filter(x => typeof x === "string").slice(0, 40).map(x => x.slice(0, 60)) : [];
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4.1-mini", max_completion_tokens: 250,
      messages: [
        { role: "system", content: "You are J.Bink, Barchemy's witty, welcoming chatbot bartender. Be varied, concise and practical. Ask clarifying questions when needed. Suggest drinks using the guest's available ingredients when possible, clearly identifying missing ingredients. Do not claim you performed actions you did not perform. Provide safe, accurate measurements and nonalcoholic alternatives when requested. Academy teaches mixing techniques. Do not encourage excessive alcohol consumption. Ingredients available: " + JSON.stringify(ingredients) },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  });
  if (!response.ok) return json({ error: "AI temporarily unavailable" }, 502);
  const data = await response.json();
  return json({ reply: data.choices?.[0]?.message?.content ?? "I couldn't prepare a response just now." });
});
