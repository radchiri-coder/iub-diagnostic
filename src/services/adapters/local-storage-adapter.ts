import type { PersistedState, DiagnosticSession, LeadCapture } from '@/engine/types';
import { isValidPersistedState } from '@/engine/validation';
import { isExpired } from '@/utils/time';

const SESSION_KEY = 'iub-diagnostic-state';
const TTL_DAYS = 30;
const CURRENT_VERSION = 3;

export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isValidPersistedState(parsed)) {
      clearPersistedState();
      return null;
    }

    // TTL check
    if (isExpired(parsed.savedAt, TTL_DAYS)) {
      clearPersistedState();
      return null;
    }

    // Version migration
    if (parsed.version < CURRENT_VERSION) {
      return migrateState(parsed);
    }

    return parsed;
  } catch {
    clearPersistedState();
    return null;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    const toSave: PersistedState = {
      ...state,
      version: CURRENT_VERSION,
      savedAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

export function clearPersistedState(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // silent
  }
}

// ── Migrations ────────────────────────────────────────────────────────

function migrateState(state: PersistedState): PersistedState | null {
  try {
    // v1/v2 → v3: restructure data shape
    // For now, graceful reset — old sessions are lost
    if (state.version < 3) {
      clearPersistedState();
      return null;
    }
    return state;
  } catch {
    clearPersistedState();
    return null;
  }
}
