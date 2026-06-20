import { Resend } from "resend";

type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactNotification(payload: ContactEmailPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return { status: "skipped" as const };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: payload.email,
    subject: `Portfolio inquiry: ${payload.subject}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Subject: ${payload.subject}`,
      "",
      payload.message,
    ].join("\n"),
  });

  if (error) {
    console.error("Resend contact notification failed:", error.message);
    return { status: "failed" as const };
  }

  return { status: "sent" as const };
}
