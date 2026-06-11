import { Pool } from "pg";

export type StoredLead = {
  phone: string;
  phoneNormalized: string;
  source: string | null;
  payload: Record<string, unknown>;
  rec: Record<string, unknown>;
  utm: Record<string, unknown>;
  page: string | null;
  referrer: string | null;
  ip: string;
  userAgent: string;
};

let pool: Pool | null = null;

function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!pool) pool = new Pool({ connectionString });
  return pool;
}

export async function saveLead(lead: StoredLead): Promise<void> {
  const db = getPool();
  if (!db) {
    throw new Error("DATABASE_URL is not set");
  }

  await db.query(
    `INSERT INTO leads
      (phone, phone_normalized, source, payload, rec, utm, page, referrer, ip, user_agent)
     VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7, $8, $9, $10)`,
    [
      lead.phone,
      lead.phoneNormalized,
      lead.source,
      JSON.stringify(lead.payload),
      JSON.stringify(lead.rec),
      JSON.stringify(lead.utm),
      lead.page,
      lead.referrer,
      lead.ip,
      lead.userAgent
    ]
  );
}
