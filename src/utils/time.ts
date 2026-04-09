export function now(): number {
  return Date.now();
}

export function isExpired(savedAt: number, ttlDays: number): boolean {
  const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
  return now() - savedAt > ttlMs;
}
