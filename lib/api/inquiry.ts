// Inquiry submission — sends two emails when SMTP is configured:
//   1. internal notification → SALES_NOTIFY_EMAIL
//   2. customer auto-receipt → submitter's email
// When SMTP_HOST isn't set, falls back to console.log so dev still works.

import type { InquirySubmission } from "../types";
import { getTransporter, isMailConfigured, SMTP_FROM, SALES_TO } from "../mail/transporter";
import { inquiryInternalEmail, inquiryReceiptEmail } from "../mail/templates";

export async function submitInquiry(payload: InquirySubmission) {
  // Honeypot — bots auto-fill hidden fields. Silently drop them.
  if (payload.hp && payload.hp.length > 0) return { ok: true, dropped: true };

  await deliver(payload);
  return { ok: true };
}

async function deliver(p: InquirySubmission) {
  const transporter = getTransporter();
  if (!isMailConfigured() || !transporter) {
    consoleFallback(p);
    return;
  }

  const internal = inquiryInternalEmail(p);
  const receipt  = inquiryReceiptEmail(p);

  // Run in parallel — failure of one shouldn't block the other.
  const results = await Promise.allSettled([
    transporter.sendMail({
      from: SMTP_FROM, to: SALES_TO,
      subject: internal.subject, html: internal.html, text: internal.text,
      replyTo: internal.replyTo,
    }),
    transporter.sendMail({
      from: SMTP_FROM, to: p.email,
      subject: receipt.subject, html: receipt.html, text: receipt.text,
    }),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      // eslint-disable-next-line no-console
      console.error("Inquiry email failed:", r.reason);
    }
  }
}

function consoleFallback(p: InquirySubmission) {
  // eslint-disable-next-line no-console
  console.log("\n────── 📥 NEW INQUIRY (SMTP not configured) ──────");
  console.log("From   :", p.name, p.company ? `(${p.company})` : "");
  console.log("Email  :", p.email);
  console.log("Phone  :", p.phone ?? "—");
  console.log("Country:", p.country);
  console.log("Locale :", p.locale);
  console.log("Source :", p.source);
  console.log("Items  :");
  for (const it of p.items) {
    console.log(`  · ${it.sku} × ${it.qty}${it.note ? `  (note: ${it.note})` : ""}${it.customisation ? "  [OEM]" : ""}`);
  }
  console.log("Message:", p.message);
  console.log("Time   :", p.submittedAt);
  console.log("─────────────────────────────────────────────────────\n");
}
