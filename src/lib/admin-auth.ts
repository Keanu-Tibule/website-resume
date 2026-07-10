import { createHmac, randomInt, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const otpCookieName = "portfolio_admin_otp";
const sessionCookieName = "portfolio_admin_session";
const otpMaxAgeSeconds = 10 * 60;
const sessionMaxAgeSeconds = 30 * 24 * 60 * 60;
const maxAttempts = 5;

type OtpChallenge = {
  email: string;
  codeHash: string;
  nonce: string;
  attempts: number;
  expiresAt: number;
};

type AdminSession = {
  email: string;
  expiresAt: number;
};

function getSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ??
    process.env.SUPABASE_JWT_SECRET ??
    process.env.RESEND_API_KEY;

  if (!secret) {
    throw new Error("Set ADMIN_SESSION_SECRET, SUPABASE_JWT_SECRET, or RESEND_API_KEY.");
  }

  return secret;
}

function encode(value: unknown) {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  const signature = createHmac("sha256", getSecret()).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

function decodeSigned<T>(value: string | undefined): T | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function hashCode(email: string, nonce: string, code: string) {
  return createHmac("sha256", getSecret())
    .update(`${email.toLowerCase()}.${nonce}.${code}`)
    .digest("base64url");
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    maxAge,
  };
}

export function createOtpCode() {
  return String(randomInt(100000, 1000000));
}

export async function setAdminOtpChallenge(email: string, code: string) {
  const cookieStore = await cookies();
  const nonce = randomUUID();
  const challenge: OtpChallenge = {
    email,
    nonce,
    attempts: 0,
    codeHash: hashCode(email, nonce, code),
    expiresAt: Date.now() + otpMaxAgeSeconds * 1000,
  };

  cookieStore.set(otpCookieName, encode(challenge), cookieOptions(otpMaxAgeSeconds));
}

export async function verifyAdminOtpChallenge(email: string, code: string) {
  const cookieStore = await cookies();
  const challenge = decodeSigned<OtpChallenge>(cookieStore.get(otpCookieName)?.value);

  if (!challenge) {
    return { ok: false as const, message: "Request a fresh code first." };
  }

  if (challenge.email.toLowerCase() !== email.toLowerCase() || Date.now() > challenge.expiresAt) {
    cookieStore.delete(otpCookieName);
    return { ok: false as const, message: "That code expired. Request a fresh code." };
  }

  if (challenge.attempts >= maxAttempts) {
    cookieStore.delete(otpCookieName);
    return { ok: false as const, message: "Too many attempts. Request a fresh code." };
  }

  const expected = Buffer.from(challenge.codeHash);
  const received = Buffer.from(hashCode(email, challenge.nonce, code));
  const matches =
    expected.length === received.length && timingSafeEqual(expected, received);

  if (!matches) {
    cookieStore.set(
      otpCookieName,
      encode({ ...challenge, attempts: challenge.attempts + 1 }),
      cookieOptions(Math.max(1, Math.ceil((challenge.expiresAt - Date.now()) / 1000))),
    );

    return { ok: false as const, message: "That code was not correct." };
  }

  cookieStore.delete(otpCookieName);
  await setAdminSession(email);
  return { ok: true as const };
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  const session: AdminSession = {
    email,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
  };

  cookieStore.set(sessionCookieName, encode(session), cookieOptions(sessionMaxAgeSeconds));
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = decodeSigned<AdminSession>(cookieStore.get(sessionCookieName)?.value);

  if (!session || Date.now() > session.expiresAt) {
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Your admin session expired. Sign in again.");
  }

  return session;
}

export async function clearAdminAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(otpCookieName);
  cookieStore.delete(sessionCookieName);
}
