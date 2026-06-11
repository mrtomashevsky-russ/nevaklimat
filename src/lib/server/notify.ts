import type { StoredLead } from "@/lib/server/db";

export async function notifyManagers(lead: StoredLead): Promise<void> {
  await Promise.allSettled([sendTelegram(lead), sendEmail(lead)]);
}

function leadText(lead: StoredLead): string {
  const rec = typeof lead.rec?.model === "string" ? `${lead.rec.model} / ${lead.rec.pkg || ""} / ${lead.rec.price || ""} ₽` : "не указан";
  const utm = Object.entries(lead.utm)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join("\n");

  return [
    "Новая заявка НеваКлимат",
    `Телефон: ${lead.phone}`,
    `Источник: ${lead.source || "не указан"}`,
    `Подбор: ${rec}`,
    `Страница: ${lead.page || "-"}`,
    utm ? `UTM:\n${utm}` : "UTM: -"
  ].join("\n");
}

async function sendTelegram(lead: StoredLead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: leadText(lead),
      disable_web_page_preview: true
    })
  });

  if (!res.ok) throw new Error(`Telegram notification failed: ${res.status}`);
}

async function sendEmail(lead: StoredLead): Promise<void> {
  const host = process.env.SMTP_HOST;
  const to = process.env.LEAD_EMAIL_TO;
  if (!host || !to) return;

  const nodemailer = (await import("nodemailer")) as unknown as {
    createTransport?: typeof import("nodemailer").createTransport;
    default?: { createTransport: typeof import("nodemailer").createTransport };
  };
  const createTransport = nodemailer.createTransport || nodemailer.default?.createTransport;
  if (!createTransport) throw new Error("Nodemailer transport factory is unavailable");
  const transporter = createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "leads@neva-klimat.local",
    to,
    subject: `Заявка НеваКлимат: ${lead.phone}`,
    text: leadText(lead)
  });
}
