// Zod schemas for inquiry / OEM API payloads.
//
// Defense in depth: even though the frontend forms validate before sending,
// the API route MUST re-validate. Anyone can POST raw JSON.
//
// Limits chosen to be liberal enough for real B2B buyers but tight enough
// to make automated abuse painful (no 1MB descriptions, no 1000-item carts).

import { z } from "zod";
import { isSafeEmail } from "./email";

const ALLOWED_LOCALES = ["zh", "en", "es", "it", "pt", "ko", "ja", "ar"] as const;

/** Reusable: short header-safe field (used for name/company/country/phone) */
const headerSafeStr = (max: number, opts: { required?: boolean } = {}) => {
  const base = z
    .string()
    .max(max, `Too long (max ${max} chars)`)
    .refine((s) => !/[\r\n\0]/.test(s), "Contains illegal control characters");
  return opts.required ? base.min(1, "Required") : base.optional().default("");
};

const safeEmail = z
  .string()
  .max(254)
  .refine(isSafeEmail, "Invalid email address");

/** Honeypot — must be empty. Bots fill all visible fields. */
const honeypot = z
  .string()
  .max(0, "Honeypot triggered")
  .optional()
  .default("");

const InquiryItem = z.object({
  sku: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[A-Za-z0-9\-_]+$/, "Invalid SKU format"),
  qty: z.number().int().min(1).max(1_000_000),
  note: headerSafeStr(500),
  customisation: z.boolean().optional().default(false),
});

export const InquirySchema = z.object({
  items: z.array(InquiryItem).max(200, "Too many items"),
  name: headerSafeStr(120, { required: true }),
  company: headerSafeStr(120),
  email: safeEmail,
  phone: headerSafeStr(40),
  country: headerSafeStr(80, { required: true }),
  message: z.string().max(5000, "Message too long").optional().default(""),
  hp: honeypot,                         // honeypot field name
  locale: z.enum(ALLOWED_LOCALES),
  source: z.string().max(2048).optional().default(""),
  submittedAt: z.string().datetime().or(z.string().max(40)),
});

export const OemSchema = z.object({
  name: headerSafeStr(120, { required: true }),
  company: headerSafeStr(120),
  email: safeEmail,
  phone: headerSafeStr(40),
  country: headerSafeStr(80, { required: true }),
  productTypes: z.array(z.string().max(40)).max(20),
  estimatedQty: headerSafeStr(80),
  needsLogo: z.boolean().optional().default(false),
  needsPackaging: z.boolean().optional().default(false),
  needsExclusiveDesign: z.boolean().optional().default(false),
  budget: headerSafeStr(120),
  message: z.string().min(1, "Required").max(5000, "Message too long"),
  hp: honeypot,
  locale: z.enum(ALLOWED_LOCALES),
  source: z.string().max(2048).optional().default(""),
  submittedAt: z.string().max(40),
});

export type InquiryPayload = z.infer<typeof InquirySchema>;
export type OemPayload = z.infer<typeof OemSchema>;
