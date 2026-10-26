-- DRAFT ONLY. Review and run once in the intended Supabase project before
-- deploying the signed Stripe webhook; not yet applied to production.

create table if not exists public.founder_purchases (
  id bigint generated always as identity primary key,
  stripe_checkout_session_id text not null unique,
  stripe_event_id text not null,
  stripe_payment_link_id text not null,
  customer_email text not null,
  amount_subtotal integer not null,
  amount_total integer not null,
  currency text not null check (currency = 'usd'),
  payment_status text not null check (payment_status = 'paid'),
  fulfillment_status text not null default 'pending'
    check (fulfillment_status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.founder_purchases enable row level security;

-- Do not expose purchase emails/amounts through the public Data API.
-- The server-side service role is allowed to write after webhook verification.
revoke all on table public.founder_purchases from anon, authenticated;
revoke all on sequence public.founder_purchases_id_seq from anon, authenticated;

-- No SELECT/INSERT/UPDATE/DELETE policies for anon or authenticated users.
