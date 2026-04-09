import type { DiagnosticSession, PersistedState, CompanyContext } from './types';
import { isValidEmail, isValidTelegram, sanitizeInput } from '@/utils/email';

// ── Session validation ────────────────────────────────────────────────

export function isValidSession(session: unknown): session is DiagnosticSession {
  if (!session || typeof session !== 'object') return false;
  const s = session as Record<string, unknown>;
  return (
    typeof s['sessionId'] === 'string' &&
    typeof s['schemaVersion'] === 'number' &&
    typeof s['startedAt'] === 'number' &&
    typeof s['screen'] === 'string' &&
    Array.isArray(s['answers'])
  );
}

export function isValidPersistedState(state: unknown): state is PersistedState {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  return (
    typeof s['version'] === 'number' &&
    typeof s['savedAt'] === 'number' &&
    s['data'] != null &&
    typeof s['data'] === 'object'
  );
}

// ── Context validation ────────────────────────────────────────────────

export function isCompleteContext(context: CompanyContext | null): context is CompanyContext {
  if (!context) return false;
  return (
    typeof context.size === 'string' &&
    context.size.length > 0 &&
    typeof context.stage === 'string' &&
    context.stage.length > 0 &&
    typeof context.industry === 'string' &&
    context.industry.length > 0
  );
}

// ── Lead validation ───────────────────────────────────────────────────

export interface LeadValidationResult {
  isValid: boolean;
  emailError?: string;
  telegramError?: string;
}

export function validateLeadInput(email?: string, telegram?: string): LeadValidationResult {
  const hasEmail = email && email.trim().length > 0;
  const hasTelegram = telegram && telegram.trim().length > 0;

  if (!hasEmail && !hasTelegram) {
    return { isValid: false, emailError: 'Укажите email или Telegram' };
  }

  const result: LeadValidationResult = { isValid: true };

  if (hasEmail && !isValidEmail(email)) {
    result.isValid = false;
    result.emailError = 'Некорректный формат email';
  }

  if (hasTelegram && !isValidTelegram(telegram)) {
    result.isValid = false;
    result.telegramError = 'Некорректный Telegram (например, @username)';
  }

  return result;
}
