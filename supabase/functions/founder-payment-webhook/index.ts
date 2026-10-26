// Server-side Stripe webhook for Barchemy Founder’s Access.
// Deploy with JWT verification disabled; Stripe request signatures are verified below.
// Keep every key and signing secret in Supabase Edge Function secrets, never in the app.
import Stripe from "npm:stripe@22.6.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.0";

const cryptoProvider = Stripe.createSubtleCryptoProvider();

function requireSetting(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required setting: ${name}`);
  return value;
}

function paymentLinkId(value: string | Stripe.PaymentLink | null): string | null {
  return typeof value === "string" ? value : value?.id ?? null;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const signature = request.headers.get("Stripe-Signature");
    if (!signature) return new Response("Missing Stripe signature", { status: 400 });

    let stripe: Stripe;
    let webhookSecret: string;
    let expectedPaymentLink: string;
    let expectedLiveMode: boolean;

    try {
      stripe = new Stripe(requireSetting("STRIPE_RESTRICTED_API_KEY"), {
        apiVersion: "2026-08-26.dahlia",
      });
      webhookSecret = requireSetting("STRIPE_WEBHOOK_SIGNING_SECRET");
      expectedPaymentLink = requireSetting("STRIPE_FOUNDER_PAYMENT_LINK_ID");
      const mode = requireSetting("STRIPE_EXPECTED_MODE");
      if (mode !== "live" && mode !== "test") throw new Error("Invalid Stripe mode");
      expectedLiveMode = mode === "live";
    } catch (error) {
      console.error("Founder webhook configuration error", error);
      return new Response("Webhook unavailable", { status: 503 });
    }

    let event: Stripe.Event;
    try {
      // Signature verification requires the unmodified raw body.
      event = await stripe.webhooks.constructEventAsync(
        await request.text(),
        signature,
        webhookSecret,
        undefined,
        cryptoProvider,
      );
    } catch {
      return new Response("Invalid Stripe signature", { status: 400 });
    }

    if (event.livemode !== expectedLiveMode) {
      return new Response("Unexpected Stripe mode", { status: 400 });
    }

    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded"
    ) {
      return Response.json({ received: true, ignored: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "payment" || session.payment_status !== "paid") {
      // Delayed methods are handled when async_payment_succeeded arrives.
      return Response.json({ received: true, pending: true });
    }

    if (paymentLinkId(session.payment_link) !== expectedPaymentLink) {
      return Response.json({ received: true, ignored: true });
    }

    // This is a single $9.99 USD product, before any applicable sales tax.
    // Fail closed if a different product/price appears on this link.
    if (session.currency?.toLowerCase() !== "usd" || session.amount_subtotal !== 999) {
      console.error("Unexpected Founder purchase currency or subtotal", session.id);
      return new Response("Unexpected Founder purchase", { status: 422 });
    }

    const purchaserEmail = session.customer_details?.email ?? session.customer_email;
    if (!purchaserEmail) {
      console.error("Founder checkout session missing contact email", session.id);
      return new Response("Customer contact unavailable", { status: 500 });
    }

    let database;
    try {
      database = createClient(
        requireSetting("SUPABASE_URL"),
        requireSetting("SUPABASE_SERVICE_ROLE_KEY"),
        { auth: { autoRefreshToken: false, persistSession: false } },
      );
    } catch (error) {
      console.error("Founder purchase store configuration error", error);
      return new Response("Purchase store unavailable", { status: 503 });
    }

    // A unique checkout session ID makes retries and duplicate Stripe events safe.
    // Ignore duplicates so later retries cannot reset fulfillment work.
    const { error } = await database.from("founder_purchases").upsert(
      {
        stripe_checkout_session_id: session.id,
        stripe_event_id: event.id,
        stripe_payment_link_id: expectedPaymentLink,
        customer_email: purchaserEmail,
        amount_subtotal: session.amount_subtotal,
        amount_total: session.amount_total,
        currency: "usd",
        payment_status: "paid",
      },
      { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true },
    );

    if (error) {
      console.error("Founder purchase store failed", error.code);
      // Stripe retries a 5xx response. Do not acknowledge an unrecorded purchase.
      return new Response("Purchase record temporarily unavailable", { status: 500 });
    }

    return Response.json({ received: true });
  },
};
