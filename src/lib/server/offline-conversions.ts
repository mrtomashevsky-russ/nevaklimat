import type { StoredLead } from "@/lib/server/db";

export async function enqueueOfflineConversion(lead: StoredLead): Promise<void> {
  // Integration point for offline conversions back to ad platforms.
  // Keep the persisted UTM/gclid/yclid values in the leads table and connect
  // this function to a queue/cron export when cabinet credentials are issued.
  if (lead.utm.gclid || lead.utm.yclid) {
    console.info("Offline conversion candidate", {
      phone: lead.phoneNormalized,
      gclid: lead.utm.gclid,
      yclid: lead.utm.yclid
    });
  }
}
