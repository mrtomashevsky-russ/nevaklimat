export async function verifyCaptcha(token?: string): Promise<boolean> {
  const provider = process.env.CAPTCHA_PROVIDER || "off";
  if (provider === "off") return true;

  const secret = process.env.CAPTCHA_SECRET;
  if (!secret || !token) return false;

  if (provider === "recaptcha") {
    const form = new URLSearchParams({ secret, response: token });
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: form
    });
    const data = (await res.json()) as { success?: boolean; score?: number };
    return Boolean(data.success) && Number(data.score || 0) >= Number(process.env.CAPTCHA_THRESHOLD || 0.5);
  }

  if (provider === "yandex") {
    const form = new URLSearchParams({ secret, token });
    const res = await fetch("https://smartcaptcha.yandexcloud.net/validate", {
      method: "POST",
      body: form
    });
    const data = (await res.json()) as { status?: string };
    return data.status === "ok";
  }

  return true;
}
