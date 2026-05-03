// Nodemailer transporter — created lazily on first use, reused across requests.
// Reads SMTP credentials from environment variables. If SMTP_HOST is not set,
// emails are skipped gracefully (callers fall back to console.log) so dev
// continues to work without configuration.

import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

export function getTransporter(): Transporter | null {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  cached = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") !== "false",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
  });
  return cached;
}

export const SMTP_FROM = process.env.SMTP_FROM ?? "ZHUOHENG <noreply@zhuoheng.com>";
export const SALES_TO  = process.env.SALES_NOTIFY_EMAIL ?? "sales@zhuoheng.com";

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}
