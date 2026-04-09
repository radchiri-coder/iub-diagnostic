import type { AnalyticsEvent } from '@/engine/types';

const ANALYTICS_KEY = 'iub-diagnostic-analytics';
const MAX_EVENTS = 500;

export function trackEvent(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event.eventName}`, event.payload ?? '');
  }

  try {
    const events = loadEvents();
    events.push(event);

    // Keep only last N events to avoid localStorage bloat
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
  } catch {
    // silent
  }
}

export function loadEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearEvents(): void {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch {
    // silent
  }
}
