// HTML / plain-text email templates for inquiry & OEM submissions.
// Inline styles only (most mail clients strip <style> tags).

import type { InquirySubmission } from "@/lib/types";
import type { OemSubmission } from "@/lib/api/oem";

const BASE = `
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
color: #1A1A1A;
line-height: 1.55;
max-width: 640px;
margin: 0 auto;
padding: 32px 24px;
background: #FFFFFF;
`;

const H1 = `font-size: 22px; font-weight: 600; margin: 0 0 16px; color: #1A1A1A; border-bottom: 2px solid #C8102E; padding-bottom: 12px;`;
const H2 = `font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.16em; color: #888; margin: 24px 0 8px;`;
const ROW = `margin: 4px 0; font-size: 14px;`;
const LBL = `display: inline-block; min-width: 90px; color: #6B6B6B;`;
const TBL = `width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px;`;
const TH = `text-align: left; padding: 8px; background: #FAFAFA; border-bottom: 1px solid #EDEDED; font-weight: 600;`;
const TD = `padding: 8px; border-bottom: 1px solid #EDEDED; vertical-align: top;`;

// ─── Internal notification (to sales) ─────────────────────
export function inquiryInternalEmail(p: InquirySubmission) {
  const itemsRows = p.items.map((it) => `
    <tr>
      <td style="${TD}; font-family: ui-monospace, monospace;">${it.sku}</td>
      <td style="${TD}; text-align: right;">${it.qty}</td>
      <td style="${TD};">${it.customisation ? "✓ OEM" : ""}</td>
      <td style="${TD};">${escape(it.note ?? "")}</td>
    </tr>
  `).join("");

  const html = `<div style="${BASE}">
    <h1 style="${H1}">📥 New Inquiry — ${escape(p.name)}${p.company ? ` (${escape(p.company)})` : ""}</h1>

    <h2 style="${H2}">Customer</h2>
    <p style="${ROW}"><span style="${LBL}">Name</span> ${escape(p.name)}</p>
    <p style="${ROW}"><span style="${LBL}">Company</span> ${escape(p.company ?? "—")}</p>
    <p style="${ROW}"><span style="${LBL}">Email</span> <a href="mailto:${escape(p.email)}">${escape(p.email)}</a></p>
    <p style="${ROW}"><span style="${LBL}">Phone</span> ${escape(p.phone ?? "—")}</p>
    <p style="${ROW}"><span style="${LBL}">Country</span> ${escape(p.country)}</p>
    <p style="${ROW}"><span style="${LBL}">Locale</span> ${p.locale}</p>
    <p style="${ROW}"><span style="${LBL}">Source</span> ${escape(p.source)}</p>
    <p style="${ROW}"><span style="${LBL}">Submitted</span> ${p.submittedAt}</p>

    ${p.items.length > 0 ? `
      <h2 style="${H2}">Items requested (${p.items.length})</h2>
      <table style="${TBL}">
        <tr><th style="${TH}">SKU</th><th style="${TH}; text-align: right;">Qty</th><th style="${TH}">Flag</th><th style="${TH}">Note</th></tr>
        ${itemsRows}
      </table>
    ` : ""}

    ${p.message ? `
      <h2 style="${H2}">Message</h2>
      <p style="${ROW}; white-space: pre-wrap;">${escape(p.message)}</p>
    ` : ""}

    <p style="margin-top: 32px; font-size: 12px; color: #888;">
      Reply directly to this email to reach ${escape(p.name)}.
    </p>
  </div>`;

  const text = [
    `NEW INQUIRY — ${p.name}${p.company ? ` (${p.company})` : ""}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone ?? "—"}`,
    `Country: ${p.country}`,
    `Source: ${p.source}`,
    `Submitted: ${p.submittedAt}`,
    "",
    "Items:",
    ...p.items.map((it) => `  - ${it.sku} × ${it.qty}${it.customisation ? "  [OEM]" : ""}${it.note ? `  (${it.note})` : ""}`),
    "",
    "Message:",
    p.message,
  ].join("\n");

  return {
    subject: `New Inquiry · ${p.name}${p.company ? ` (${p.company})` : ""} · ${p.country}${p.items.length ? ` · ${p.items.length} items` : ""}`,
    html, text,
    replyTo: p.email,
  };
}

// ─── Customer auto-receipt ───────────────────────────────
export function inquiryReceiptEmail(p: InquirySubmission) {
  const isZh = p.locale === "zh";
  const greeting = isZh ? `${p.name}，您好：` : `Hi ${p.name},`;
  const body = isZh
    ? `感谢您的询盘。我们的外贸团队将在 24 小时内与您联系，提供报价、起订量、交货期及样品安排。`
    : `Thank you for your inquiry. Our export team will reach out within 24 hours with pricing, MOQ, lead time, and a sample plan if needed.`;
  const itemLine = isZh ? `已选商品（${p.items.length} 款）` : `Items selected (${p.items.length})`;
  const sig = isZh ? `卓恒 · 外贸团队` : `ZHUOHENG · Export Team`;

  const itemsRows = p.items.map((it) => `
    <tr>
      <td style="${TD}; font-family: ui-monospace, monospace;">${it.sku}</td>
      <td style="${TD}; text-align: right;">${it.qty}</td>
    </tr>
  `).join("");

  const html = `<div style="${BASE}">
    <h1 style="${H1}">${isZh ? "✓ 询盘已收到" : "✓ Inquiry Received"}</h1>
    <p style="${ROW}">${greeting}</p>
    <p style="${ROW}">${body}</p>

    ${p.items.length > 0 ? `
      <h2 style="${H2}">${itemLine}</h2>
      <table style="${TBL}">
        <tr><th style="${TH}">SKU</th><th style="${TH}; text-align: right;">${isZh ? "数量" : "Qty"}</th></tr>
        ${itemsRows}
      </table>
    ` : ""}

    <p style="margin-top: 32px; font-size: 13px; color: #6B6B6B;">${sig}</p>
    <p style="margin-top: 8px; font-size: 12px; color: #888;">
      ${isZh ? "如未收到回复，请直接邮件至" : "If you don't hear back, email"}
      <a href="mailto:sales@zhuoheng.com">sales@zhuoheng.com</a>
    </p>
  </div>`;

  return {
    subject: isZh ? "卓恒 · 询盘已收到" : "ZHUOHENG · Inquiry Received",
    html,
    text: [greeting, "", body, "", sig].join("\n"),
  };
}

// ─── OEM internal notification ───────────────────────────
export function oemInternalEmail(p: OemSubmission) {
  const html = `<div style="${BASE}">
    <h1 style="${H1}">🏭 New OEM Enquiry — ${escape(p.name)}${p.company ? ` (${escape(p.company)})` : ""}</h1>

    <h2 style="${H2}">Customer</h2>
    <p style="${ROW}"><span style="${LBL}">Name</span> ${escape(p.name)}</p>
    <p style="${ROW}"><span style="${LBL}">Company</span> ${escape(p.company ?? "—")}</p>
    <p style="${ROW}"><span style="${LBL}">Email</span> <a href="mailto:${escape(p.email)}">${escape(p.email)}</a></p>
    <p style="${ROW}"><span style="${LBL}">Phone</span> ${escape(p.phone ?? "—")}</p>
    <p style="${ROW}"><span style="${LBL}">Country</span> ${escape(p.country)}</p>

    <h2 style="${H2}">Project</h2>
    <p style="${ROW}"><span style="${LBL}">Types</span> ${p.productTypes.join(", ")}</p>
    <p style="${ROW}"><span style="${LBL}">Qty</span> ${escape(p.estimatedQty)}</p>
    <p style="${ROW}"><span style="${LBL}">Needs</span> ${[
      p.needsLogo && "Logo",
      p.needsPackaging && "Packaging",
      p.needsExclusiveDesign && "Exclusive Design",
    ].filter(Boolean).join(" · ") || "—"}</p>
    <p style="${ROW}"><span style="${LBL}">Budget</span> ${escape(p.budget ?? "—")}</p>

    <h2 style="${H2}">Description</h2>
    <p style="${ROW}; white-space: pre-wrap;">${escape(p.message)}</p>

    <p style="margin-top: 32px; font-size: 12px; color: #888;">
      Reply directly to this email to reach ${escape(p.name)}. Submitted ${p.submittedAt}.
    </p>
  </div>`;

  return {
    subject: `New OEM Enquiry · ${p.name}${p.company ? ` (${p.company})` : ""} · ${p.estimatedQty}`,
    html,
    text: `New OEM Enquiry from ${p.name} (${p.company ?? "—"})\nEmail: ${p.email}\nPhone: ${p.phone ?? "—"}\nCountry: ${p.country}\nTypes: ${p.productTypes.join(", ")}\nQty: ${p.estimatedQty}\nBudget: ${p.budget ?? "—"}\n\n${p.message}`,
    replyTo: p.email,
  };
}

// ─── OEM customer receipt ────────────────────────────────
export function oemReceiptEmail(p: OemSubmission) {
  const isZh = p.locale === "zh";
  const greeting = isZh ? `${p.name}，您好：` : `Hi ${p.name},`;
  const body = isZh
    ? `感谢您的项目咨询。OEM 团队将在 24 小时内与您联系，提供初步报价与下一步流程（NDA、设计沟通、打样安排）。`
    : `Thank you for your project enquiry. Our OEM team will reach out within 24 hours with initial pricing and next steps (NDA, design discussion, sampling).`;
  const sig = isZh ? `卓恒 · OEM 团队` : `ZHUOHENG · OEM Team`;

  const html = `<div style="${BASE}">
    <h1 style="${H1}">${isZh ? "✓ 项目咨询已收到" : "✓ OEM Enquiry Received"}</h1>
    <p style="${ROW}">${greeting}</p>
    <p style="${ROW}">${body}</p>
    <p style="margin-top: 32px; font-size: 13px; color: #6B6B6B;">${sig}</p>
  </div>`;

  return {
    subject: isZh ? "卓恒 · OEM 项目咨询已收到" : "ZHUOHENG · OEM Enquiry Received",
    html,
    text: [greeting, "", body, "", sig].join("\n"),
  };
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
