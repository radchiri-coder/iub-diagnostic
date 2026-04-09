import type { AnalyticsEvent, AnalyticsEventName } from '@/engine/types';
import { trackEvent, loadEvents, clearEvents } from './adapters/local-analytics-adapter';

export function track(
  eventName: AnalyticsEventName,
  sessionId: string,
  payload?: Record<string, unknown>
): void {
  const event: AnalyticsEvent = {
    eventName,
    sessionId,
    timestamp: Date.now(),
    payload,
  };
  trackEvent(event);
}

export function getTrackedEvents(): AnalyticsEvent[] {
  return loadEvents();
}

export function resetAnalytics(): void {
  clearEvents();
}
