import type { DiagnosticSession, PersistedState, AnalyticsEvent } from '@/engine/types';
import {
  loadPersistedState,
  savePersistedState,
  clearPersistedState,
} from './adapters/local-storage-adapter';

const CURRENT_VERSION = 3;

export function loadSession(): DiagnosticSession | null {
  const state = loadPersistedState();
  return state?.data?.session ?? null;
}

export function saveSession(session: DiagnosticSession, analytics: AnalyticsEvent[] = []): void {
  const state: PersistedState = {
    version: CURRENT_VERSION,
    savedAt: Date.now(),
    data: {
      session,
      analytics,
    },
  };
  savePersistedState(state);
}

export function clearSession(): void {
  clearPersistedState();
}
