// Email & SMTP-header injection defenses.
//
// nodemailer escapes most things by default, but we treat user input as
// hostile and enforce strict RFC-style email format ourselves before
// passing values to the `replyTo` field of an email — that field, if it
// contains CRLF, can be exploited to inject extra headers (Bcc:, etc.)
// turning the inquiry endpoint into an open mail relay.

const EMAIL_RE =
  /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

/**
 * True iff `s` is a syntactically valid email AND contains no control
 * characters (CR, LF, NUL) that could be used for SMTP header injection.
 */
export function isSafeEmail(s: unknown): s is string {
  if (typeof s !== "string") return false;
  if (s.length === 0 || s.length > 254) return false;          // RFC 5321 max
  if (/[\r\n\0\t]/.test(s)) return false;                       // header injection
  if (!EMAIL_RE.test(s)) return false;
  return true;
}

/** Strip CR/LF/NUL from any string field (defense-in-depth for header values). */
export function stripCrlf(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.replace(/[\r\n\0]/g, " ").trim();
}

/**
 * For free-text fields (message bodies). Allows newlines but kills NULs and
 * trims to maxLen.
 */
export function sanitizeBody(s: unknown, maxLen = 5000): string {
  if (typeof s !== "string") return "";
  return s.replace(/\0/g, "").slice(0, maxLen);
}
