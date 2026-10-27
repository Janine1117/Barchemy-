// Staged only. Do not deploy or register Stripe webhook until trusted checkout
// session creation, idempotent processing, and refund/dispute reconciliation are ready.
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.0";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const signingSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const url = Deno.env.get("SUPABASE_URL");
const founderPrice = Deno.env.get("STRIPE_FOUNDER_PRICE_ID");

Deno.serve(async req => {
  if (req.method !== "POST") return new Response("Method not allowed", {status:405});
  if (!stripeKey || !signingSecret || !serviceKey || !url || !founderPrice) {
    return new Response("Not configured", {status:503});
  }
  const stripe = new Stripe(stripeKey, {httpClient: Stripe.createFetchHttpClient()});
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", {status:400});
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(), signature, signingSecret, undefined, Stripe.createSubtleCryptoProvider()
    );
  } catch {
    return new Response("Invalid signature", {status:400});
  }

  // Until a trusted authenticated checkout-creation endpoint attaches user ID
  // and founder price, the webhook must not grant membership from email or redirects.
  if (event.type !== "checkout.session.completed") return new Response("Acknowledged");
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return new Response("Not a paid one-time purchase");
  }
  const userId = session.metadata?.barchemy_user_id;
  if (!userId || !/^[0-9a-f-]{36}$/i.test(userId)) return new Response("No trusted user mapping", {status:422});
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {expand:["line_items"]});
  const matching = fullSession.line_items?.data.some(item => item.price?.id === founderPrice);
  if (!matching) return new Response("Wrong product", {status:422});
  const supabase = createClient(url, serviceKey, {auth:{persistSession:false}});
  const {error} = await supabase.from("barchemy_entitlements").upsert({
    user_id:userId, entitlement:"founder", active:true,
    stripe_customer_id:typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
    stripe_checkout_session_id:session.id, updated_at:new Date().toISOString(),
  }, {onConflict:"user_id,entitlement"});
  if (error) return new Response("Database unavailable", {status:500});
  return new Response("Acknowledged");
});
