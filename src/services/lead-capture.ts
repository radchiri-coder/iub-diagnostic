import type { LeadCapture, LeadStatus } from '@/engine/types';
import { validateLeadInput, type LeadValidationResult } from '@/engine/validation';
import { sanitizeInput } from '@/utils/email';

const LEAD_KEY = 'iub-diagnostic-lead';

export function validateLead(email?: string, telegram?: string): LeadValidationResult {
  return validateLeadInput(email, telegram);
}

export function saveLeadLocally(email?: string, telegram?: string): LeadCapture {
  const lead: LeadCapture = {
    status: 'completed' as LeadStatus,
    email: email ? sanitizeInput(email) : undefined,
    telegram: telegram ? sanitizeInput(telegram) : undefined,
    consentGiven: true,
    capturedAt: Date.now(),
  };

  try {
    localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
  } catch {
    // silent
  }

  return lead;
}

export function loadLeadLocally(): LeadCapture | null {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LeadCapture;
  } catch {
    return null;
  }
}

export function clearLead(): void {
  try {
    localStorage.removeItem(LEAD_KEY);
  } catch {
    // silent
  }
}
