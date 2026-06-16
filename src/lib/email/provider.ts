import { Resend } from "resend";

type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactNotification(payload: ContactEmailPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return { skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  await resend.emails.send({
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

  return { skipped: false };
}
