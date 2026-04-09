import { useCallback } from 'react';
import type { DiagnosticSession, AnalyticsEvent } from '@/engine/types';
import { loadSession, saveSession, clearSession } from '@/services/storage';

export function usePersistence() {
  const load = useCallback((): DiagnosticSession | null => {
    return loadSession();
  }, []);

  const save = useCallback((session: DiagnosticSession, analytics?: AnalyticsEvent[]) => {
    saveSession(session, analytics);
  }, []);

  const clear = useCallback(() => {
    clearSession();
  }, []);

  return { load, save, clear };
}
