// Barchemy Founder checkout webhook. NOT SAFE TO ENABLE UNTIL THE DATABASE
// migration, signing secret, and payment-link settings have been verified.
// Deploy as a Supabase Edge Function with verify_jwt=false, since Stripe
// authenticates using the verified Stripe-Signature HMAC, not Supabase JWT.
import { createClient } from "npm:@supabase/supabase-js@2.57.0";

const encoder = new TextEncoder();
const MAX_DRIFT_SECONDS = 300;
function respond(status: number, message: string): Response {
  return new Response(JSON.stringify({ message }), {
    status, headers: { "content-type": "application/json" },
  });
}
function equalHex(digest: Uint8Array, provided: string): boolean {
  if (provided.length !== digest.length * 2 || !/^[a-f0-9]+$/i.test(provided)) return false;
  // Constant-time comparison for valid candidate signature hex strings.
  let differences = 0;
  for (let i = 0; i < digest.length; i++) {
    differences |= digest[i] ^ parseInt(provided.slice(i * 2, i * 2 + 2), 16);
  }
  return differences === 0;
}
async function verify(body: string, header: string, secret: string): Promise<boolean> {
  const parts = header.split(",").map((x) => x.trim());
  const timestampRaw = parts.find((x) => x.startsWith("t="))?.slice(2) ?? "";
  if (!/^[0-9]+$/.test(timestampRaw)) return false;
  const timestamp = Number(timestampRaw);
  if (!Number.isSafeInteger(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > MAX_DRIFT_SECONDS) return false;
  const signatures = parts.filter((x) => x.startsWith("v1=")).map((x) => x.slice(3));
  if (!signatures.length) return false;
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const digest = new Uint8Array(await crypto.subtle.sign(
    "HMAC", key, encoder.encode(String(timestamp) + "." + body),
  ));
  return signatures.some((signature) => equalHex(digest, signature));
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method !== "POST") return respond(405, "Method not allowed");
  const signingSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const linkId = Deno.env.get("STRIPE_FOUNDER_PAYMENT_LINK_ID");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!signingSecret || !linkId || !url || !serviceRoleKey) {
    return respond(503, "Checkout verification is not configured");
  }
  const header = request.headers.get("stripe-signature");
  if (!header) return respond(400, "Invalid signature");
  let body: string;
  try { body = await request.text(); } catch { return respond(400, "Invalid payload"); }
  let authenticated = false;
  try { authenticated = await verify(body, header, signingSecret); }
  catch { authenticated = false; }
  if (!authenticated) return respond(400, "Invalid signature");

  let event: any;
  try { event = JSON.parse(body); } catch { return respond(400, "Invalid JSON"); }
  if (!event || typeof event.id !== "string" || typeof event.type !== "string") {
    return respond(400, "Invalid event");
  }
  if (event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded") {
    return respond(200, "Ignored event");
  }
  // Validate the EXACT supported product, link, mode, payment status and live/test
  // environment. The signature is not a substitute for product validation.
  const session = event.data?.object;
  const expectingLive = Deno.env.get("STRIPE_EXPECT_LIVE_MODE") !== "false";
  if (!session || typeof session.id !== "string" ||
      event.livemode !== expectingLive || session.livemode !== expectingLive ||
      session.payment_link !== linkId || session.mode !== "payment" ||
      session.payment_status !== "paid" || session.amount_subtotal !== 999 ||
      typeof session.amount_total !== "number" || session.amount_total < 0 ||
      String(session.currency).toLowerCase() !== "usd") {
    return respond(200, "Not a verified Founder purchase");
  }
  const email = session.customer_details?.email ?? session.customer_email ?? null;
  // The insert is idempotent because the Checkout Session ID is unique.
  const db = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await db.from("founder_purchases").insert({
    stripe_checkout_session_id: session.id,
    stripe_event_id: event.id,
    email: typeof email === "string" ? email : null,
    currency: "usd",
    amount_total: session.amount_total,
    status: "paid",
    welcome_delivery_status: "pending",
  });
  if (error && error.code !== "23505") {
    // Retrying Stripe webhook on database errors is critical.
    console.error("Founder purchase recording failed", error.code);
    return respond(503, "Unable to record purchase");
  }
  // This records payment only; email delivery must be configured separately.
  return respond(200, "Recorded");
});
