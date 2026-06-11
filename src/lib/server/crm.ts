import type { StoredLead } from "@/lib/server/db";

export async function sendToCrm(lead: StoredLead): Promise<void> {
  const provider = process.env.CRM_PROVIDER || "off";
  if (provider === "off") return;

  if (provider === "bitrix") {
    await postWebhook(process.env.BITRIX_WEBHOOK_URL, lead);
    return;
  }

  if (provider === "amocrm") {
    await postWebhook(process.env.AMOCRM_WEBHOOK_URL, lead);
  }
}

async function postWebhook(url: string | undefined, lead: StoredLead): Promise<void> {
  if (!url) return;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: lead.phone,
      source: lead.source,
      payload: lead.payload,
      rec: lead.rec,
      utm: lead.utm,
      page: lead.page
    })
  });
  if (!res.ok) throw new Error(`CRM webhook failed: ${res.status}`);
}
