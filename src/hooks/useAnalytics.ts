import { useCallback, useRef } from 'react';
import type { AnalyticsEventName } from '@/engine/types';
import { track } from '@/services/analytics';

export function useAnalytics(sessionId: string) {
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const trackEvent = useCallback(
    (eventName: AnalyticsEventName, payload?: Record<string, unknown>) => {
      track(eventName, sessionIdRef.current, payload);
    },
    []
  );

  return { trackEvent };
}
