import { NextResponse } from "next/server";

import { sendContactNotification } from "@/lib/email/provider";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnstileToken?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const subject = payload.subject?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name || !email.includes("@") || !subject || message.length < 10) {
    return NextResponse.json({ error: "Invalid contact payload." }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(
    payload.turnstileToken ?? null,
    request.headers.get("x-forwarded-for"),
  );

  if (!turnstileOk) {
    return NextResponse.json({ error: "Spam protection failed." }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      status: "new",
      source: "portfolio",
    });

    if (error) {
      return NextResponse.json({ error: "Could not save message." }, { status: 500 });
    }
  }

  await sendContactNotification({ name, email, subject, message });

  return NextResponse.json({ ok: true });
}
