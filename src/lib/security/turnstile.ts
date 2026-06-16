export async function verifyTurnstile(token: string | null, ip?: string | null) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return true;
  }

  if (!token) {
    return false;
  }

  const formData = new FormData();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );

  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}
