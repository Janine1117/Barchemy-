# Barchemy Founder’s Access launch readiness

Status: PRE-LAUNCH REVIEW — do not promote the existing live Stripe link yet.

## Confirmed offer
- One-time $9.99 USD Founder’s Access, not a subscription.
- Digital welcome card, early product updates, and feedback opportunities.
- No equity, premium subscription, lifetime entitlement, or promised unfinished feature.
- Support: BarchemyAdmin@thingsbyjanine.me.
- Refund requests: full refund within seven calendar days, subject to applicable law.

## Before promoting checkout
- [ ] Founder approves accurate Terms, Privacy, and Refund Policy wording.
- [ ] Merge and verify `/terms`, `/privacy`, `/refunds` on Render, including mobile refresh.
- [ ] Merge and verify `/founder-welcome` in Safari.
- [ ] Configure a verified Stripe webhook, then choose manual or automated email delivery of the welcome card. A public card URL is not proof of payment.
- [ ] Update the Stripe payment-link after-payment instructions **only after** delivery works.
- [ ] Configure purchase-event verification (Stripe webhook needed to verify payments and trigger reliable fulfillment) and a recipient/email process for founder updates and feedback invitations.
- [ ] Verify actual sales-tax registration/settings; `automatic_tax` being enabled does not itself mean tax will be collected.
- [ ] Confirm receipt emails, support mailbox, and refund handling.
- [ ] Test a checkout without charging a real customer (Stripe sandbox) and verify correct fulfillment. A live payment test needs explicit owner approval.
- [ ] Review navigation, account signup, saved-memory behavior, and J.Bink's current guided-preview limitations for marketing accuracy.
- [ ] Only then share the live $9.99 link publicly.
