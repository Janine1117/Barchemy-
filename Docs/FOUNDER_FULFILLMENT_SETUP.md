# Barchemy Founder’s Access payment verification — implementation draft

**Status: not connected to live Stripe. Do not promote the $9.99 link yet.**

Barchemy's regular guided experience remains **free**. The one-time **$9.99 Founder’s Access** purchase is entirely optional. It includes only a digital welcome card, early product updates, and feedback opportunities. It does not unlock premium features or a subscription.

## What has been prepared

- A signed Stripe Checkout webhook for successful Founder’s Access payments, stored in `supabase/functions/founder-payment-webhook/index.ts`.
- A private-by-RLS purchase registry schema in `Docs/FOUNDER_PURCHASE_SCHEMA.sql`.
- Duplicate-event protection based on Stripe's Checkout Session ID.
- No frontend Stripe keys, no billing-form changes, and no live charge tests.

## Before connecting live payments

1. **Review the database schema** and apply it to the correct Supabase project. Run Supabase security advisors; confirm `anon` and `authenticated` have no access to `founder_purchases`.
2. **Test in an isolated Stripe sandbox first.** Use a sandbox Founder product/payment link and its own webhook signing secret, not the live payment link. The function is configured with `STRIPE_EXPECTED_MODE=test` and the sandbox link's ID.
3. **Store server secrets in the Supabase Edge Function secrets manager** (not GitHub, not `EXPO_PUBLIC_*`, not this document):
   - `STRIPE_RESTRICTED_API_KEY`: a restricted server API key for the matching Stripe environment.
   - `STRIPE_WEBHOOK_SIGNING_SECRET`: the destination's `whsec_` secret, copied directly from Stripe.
   - `STRIPE_FOUNDER_PAYMENT_LINK_ID`: ID of the matching sandbox or live Founder's Access payment link.
   - `STRIPE_EXPECTED_MODE`: `test` or `live`.
   Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to server functions; verify that they're available.
4. **Deploy with Supabase JWT verification disabled** for this route. Stripe sends a signed event, not a Supabase JWT. The handler verifies Stripe's signature using the unmodified raw body.
5. **Register Stripe events** `checkout.session.completed` and `checkout.session.async_payment_succeeded` to the Supabase HTTPS function URL. Keep signing secrets and API keys out of the repository.
6. **Verify** successful paid sandbox purchase, duplicate-event retry, failed signature, incorrect payment-link ID, delayed payment, and database write errors. The private `founder_purchases` table should contain exactly one row per paid Checkout Session.
7. **Complete welcome-card delivery.** For an inexpensive first release, show the public welcome card from the post-payment confirmation while using the Stripe receipt as purchase evidence. Do not claim that viewing the public card proves someone paid. Confirm receipt emails and a process for sending early product updates and feedback invitations. Replace the current Stripe confirmation promise of emailed instructions only when delivery is ready.
8. **Check the sales-tax setup** and the business's actual registration obligations before advertising the live checkout. Stripe Tax settings currently show no registrations; `automatic_tax.enabled` is not a substitute for registration.
9. After successful tests, configure the **separate live webhook** using the live payment-link ID and live signing secret, verify a controlled launch flow, and only then display the $9.99 option publicly.

### Why no automatic email integration yet?

The confirmed Founder benefits do not require buying a new email provider immediately. A transactional-email integration would require a verified sender domain and provider account. Keep first-launch costs low; add it only when the owner chooses a delivery provider and authorizes its setup.

### Boundaries

The webhook **records purchases**, but does not grant premium access, trigger a refund, send customer email, or confirm fulfillment on its own. The `fulfillment_status` column is for tracking manual delivery and future automation. Stripe API keys and secrets must never be pasted into ChatGPT or checked into public GitHub.
