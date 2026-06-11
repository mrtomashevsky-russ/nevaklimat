CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  phone_normalized text NOT NULL,
  source text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  rec jsonb NOT NULL DEFAULT '{}'::jsonb,
  utm jsonb NOT NULL DEFAULT '{}'::jsonb,
  page text,
  referrer text,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_phone_normalized_idx ON leads (phone_normalized);
CREATE INDEX IF NOT EXISTS leads_utm_gin_idx ON leads USING gin (utm);
