# Founder payment verification and delivery — production setup

**Status: prepared, NOT deployed. Do not advertise $9.99 Founder checkout until the steps below are verified.**

Barchemy already has an active $9.99 one-time Stripe Payment Link. The current hosted confirmation promises email instructions, but **no webhook endpoint or automatic email sender exists**. The public Founder welcome card is not proof of purchase.

## Exact dependencies

1. Verify the correct Barchemy Supabase project in **Render's deployed environment**. The current connected Supabase database tools return password-authentication error `28P01`, even though project metadata reports ACTIVE_HEALTHY. Reconnect/repair that database connection before making any migration. Do not reset credentials blindly.
2. Inspect the actual `public.memories` table and its row-level policies. Apply `Supabase/migrations/20261119_add_memory_recipe_compat.sql` only to the confirmed production project. Preserve and back up existing saved cocktails.
3. Apply `Supabase/migrations/20261119_founder_purchases_ledger.sql` on the same project. Verify anon/authenticated browser roles cannot read, create, modify, or delete purchases. The service role should be restricted to server-side Edge Functions.
4. Deploy `Supabase/functions/stripe-founder-webhook/index.ts` as a Supabase Edge Function called `stripe-founder-webhook` **with JWT verification disabled only for this endpoint**, because it verifies Stripe's signed request header and rejects unsigned calls. Configure server-only function secrets `STRIPE_WEBHOOK_SECRET`, `STRIPE_FOUNDER_PAYMENT_LINK_ID`, and `STRIPE_EXPECT_LIVE_MODE=true`. Never put the Stripe webhook secret or Supabase service-role key in Expo EXPO_PUBLIC variables, Render static-site build vars, or GitHub.
5. In the Barchemy Stripe account, create the endpoint at `https://<verified-supabase-project>.supabase.co/functions/v1/stripe-founder-webhook`. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy the endpoint's signing secret to the Edge Function secret store. The Founder payment-link ID must match the actual link; do not accept unrelated payment links.
6. Run checkout tests in a Stripe **sandbox**, with the sandbox's matching signing secret and link ID and `STRIPE_EXPECT_LIVE_MODE=false`. Verify valid events are recorded only once in `founder_purchases`, invalid signatures are rejected, unpaid/foreign checkout sessions do not create a purchase, and service outages cause Stripe to retry.
7. Configure **actual delivery**: send the digital Founder welcome card to the recorded buyer using an authenticated delivery provider, or have an administrator send it manually and mark `welcome_delivery_status` as `sent`. A paid ledger entry alone is not a sent email. Confirm receipt, opt-out for future updates, and refund support.
8. Update the Stripe Payment Link after-completion message only *after* step 7 works. Verify receipt emails and the published refund policy.
9. Validate Stripe Tax settings and legal registrations with the owner or tax professional. The current live payment link has automatic tax enabled, while the Stripe account showed no tax registrations and its one-time price has `tax_behavior=unspecified`. Neither setting alone proves taxes are being collected correctly. Confirm the tax jurisdictions and whether tax is inclusive/exclusive before modifying prices.
10. Final iPhone QA: brand welcome → six-scene tour → Academy → ask J.Bink → four guided recipes → Memory Wall save/refresh → account signup → sign-in/out → My Bar persistence → legal routes → refresh/deep-link behavior. Only then merge, deploy Render, and release.

## Separate J.Bink Plus subscription

The proposed $2.99/month, seven-day-trial AI tier is **not implemented**; it is a separate later release. It needs server-side model integration and provider credentials, per-user entitlements and usage limits, cancellation/refund handling, and sandbox-tested subscription webhook flows. Do not imply the one-time $9.99 Founder purchase includes the AI tier.

## Account privacy testing

Run a test using two real, distinct authenticated test accounts. Confirm each can see only its own Supabase rows (including attempts to select the other account's IDs). Confirm device-only data is labeled and never claimed as cloud synced. The SQL ledger should never be exposed to clients.
