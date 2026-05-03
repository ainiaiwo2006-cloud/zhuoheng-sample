import { rateLimit } from "../lib/security/rate-limit";
import { InquirySchema } from "../lib/security/schemas";

console.log("--- rate-limit (limit=5/min) ---");
const ip = "203.0.113.1";
for (let i = 1; i <= 7; i++) {
  const r = rateLimit(ip, 5);
  console.log(`attempt ${i} → ok=${r.ok} remaining=${r.remaining}`);
}

console.log("\n--- InquirySchema cases ---");
const ts = new Date().toISOString();
const cases: Record<string, unknown> = {
  empty: {},
  "bad-email": { name: "a", email: "not-an-email", message: "hi", locale: "en", items: [], country: "US", source: "test", submittedAt: ts },
  "CRLF in name": { name: "Eve\r\nBcc: x@y.com", email: "a@b.com", message: "hi", locale: "en", items: [], country: "US", source: "test", submittedAt: ts },
  "huge message": { name: "a", email: "a@b.com", message: "x".repeat(20000), locale: "en", items: [], country: "US", source: "test", submittedAt: ts },
  "bad locale": { name: "a", email: "a@b.com", message: "hi", locale: "xx", items: [], country: "US", source: "test", submittedAt: ts },
  "honeypot set": { name: "a", email: "a@b.com", message: "hi", locale: "en", items: [], country: "US", source: "test", submittedAt: ts, hp: "bot" },
  "valid": { name: "Alice", email: "a@b.com", message: "Hello, please quote.", locale: "en", items: [{ sku: "ER-S001", qty: 240, customisation: false }], country: "US", source: "test", submittedAt: ts },
};
for (const [label, payload] of Object.entries(cases)) {
  const r = InquirySchema.safeParse(payload);
  const verdict = r.success ? "PASS ✓" : `REJECT (${r.error.issues[0]?.path.join(".")}: ${r.error.issues[0]?.message})`;
  console.log(label.padEnd(15), "→", verdict);
}
