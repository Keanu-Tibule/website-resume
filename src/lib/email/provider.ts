import { Resend } from "resend";

type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendContactNotification(payload: ContactEmailPayload) {
  const resend = getResendClient();

  if (!resend || !process.env.CONTACT_TO_EMAIL) {
    return { status: "skipped" as const };
  }

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

export async function sendAdminOtpEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const resend = getResendClient();

  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const from = process.env.ADMIN_OTP_FROM_EMAIL ?? "Keanu Portfolio <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: `${code} is your portfolio admin code`,
    text: [
      "Use this one-time code to sign in to your portfolio admin:",
      "",
      code,
      "",
      "This code expires in 10 minutes.",
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}
