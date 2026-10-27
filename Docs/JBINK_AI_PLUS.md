# J.Bink AI Plus — subscription specification (not live)

## Offer
- Free: 10 J.Bink AI messages per signed-in guest per UTC day, then refreshes the following UTC day.
- $2.99 USD/month recurring: save and revisit J.Bink's personalized AI responses.
- Free Memory Wall, saved cocktail recipes, guided cocktails, and Academy access remain as currently offered.
- This subscription is **separate** from the $9.99 one-time Founder's Access digital welcome-card offer.
- Do not promise unlimited AI messages with Plus until cost modeling and entitlement policy are approved.
- Do not charge or collect payment until checkout, entitlements, cancellation, renewal disclosures, and support are implemented and tested.

## Subscription fulfillment requirements
1. Configure a recurring Stripe price for $2.99/month and an accurate checkout disclosure.
2. Implement verified webhook events for subscription create/update/cancel and payment failure.
3. Store subscription entitlements server-side; do not trust localStorage, a query string, or a success URL.
4. Store AI replies per signed-in user with RLS and server-side authorization requiring an active Plus entitlement.
5. Define retention, deletion, cancellation, refund and data export behavior in policies.
6. Offer an accessible billing-management/cancel link and test purchase, renewal, failed payment, cancellation, and access expiry.
7. Confirm tax, receipts, customer support, and mobile checkout.
8. Keep the upgrade prompt clearly labeled as **coming soon** until all the above work.
