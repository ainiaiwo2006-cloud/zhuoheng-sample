// OEM/ODM enquiry submission — same email pattern as inquiry, different template.

import type { OemFormFields, Locale } from "../types";
import { getTransporter, isMailConfigured, SMTP_FROM, SALES_TO } from "../mail/transporter";
import { oemInternalEmail, oemReceiptEmail } from "../mail/templates";

export type OemSubmission = OemFormFields & {
  locale: Locale;
  source: string;
  submittedAt: string;
};

export async function submitOem(payload: OemSubmission) {
  if (payload.hp && payload.hp.length > 0) return { ok: true, dropped: true };
  await deliver(payload);
  return { ok: true };
}

async function deliver(p: OemSubmission) {
  const transporter = getTransporter();
  if (!isMailConfigured() || !transporter) {
    consoleFallback(p);
    return;
  }

  const internal = oemInternalEmail(p);
  const receipt  = oemReceiptEmail(p);

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
      console.error("OEM email failed:", r.reason);
    }
  }
}

function consoleFallback(p: OemSubmission) {
  // eslint-disable-next-line no-console
  console.log("\n────── 🏭 OEM ENQUIRY (SMTP not configured) ──────");
  console.log("From   :", p.name, p.company ? `(${p.company})` : "");
  console.log("Email  :", p.email);
  console.log("Phone  :", p.phone ?? "—");
  console.log("Country:", p.country);
  console.log("Types  :", p.productTypes.join(", "));
  console.log("Qty    :", p.estimatedQty);
  console.log("Needs  :",
    [
      p.needsLogo && "Logo",
      p.needsPackaging && "Packaging",
      p.needsExclusiveDesign && "Exclusive Design",
    ].filter(Boolean).join(" + ") || "—",
  );
  console.log("Budget :", p.budget ?? "—");
  console.log("Message:", p.message);
  console.log("Time   :", p.submittedAt);
  console.log("─────────────────────────────────────────────────────\n");
}
