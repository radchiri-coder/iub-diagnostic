/**
 * Generate a unique session ID (UUID v4-like, no crypto dependency).
 */
export function generateSessionId(): string {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  const s = (n: number) => Array.from({ length: n }, hex).join('');
  return `${s(8)}-${s(4)}-4${s(3)}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${s(3)}-${s(12)}`;
}
