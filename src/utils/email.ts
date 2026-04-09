const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TG_RE = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidTelegram(value: string): boolean {
  return TG_RE.test(value.trim());
}

export function sanitizeInput(value: string): string {
  return value.trim().slice(0, 200);
}
