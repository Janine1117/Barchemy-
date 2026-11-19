-- Stripe Founder payment event ledger.
-- Apply before enabling the stripe-founder-webhook edge function.
-- No INSERT/SELECT policies for browser roles: only the Edge Function's
-- service-role credential may read/write verified checkout sessions.
begin;
create table if not exists public.founder_purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_event_id text not null,
  email text,
  amount_total integer not null check (amount_total >= 0),
  currency text not null check (currency = 'usd'),
  status text not null check (status = 'paid'),
  welcome_delivery_status text not null default 'pending'
    check (welcome_delivery_status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  welcome_sent_at timestamptz
);
alter table public.founder_purchases enable row level security;
revoke all on public.founder_purchases from anon, authenticated;
commit;

-- Verify signed-out and signed-in app users cannot query the ledger.
-- Only then deploy the webhook after configuring its signing secret.
