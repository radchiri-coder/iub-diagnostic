/**
 * No-op API adapter for MVP.
 * In production, replace with Supabase/REST adapter.
 */

import type { DiagnosticSession, DiagnosticResult, LeadCapture } from '@/engine/types';

export async function submitSession(_session: DiagnosticSession): Promise<{ ok: boolean }> {
  return { ok: true };
}

export async function submitResult(_result: DiagnosticResult): Promise<{ ok: boolean }> {
  return { ok: true };
}

export async function submitLead(_lead: LeadCapture): Promise<{ ok: boolean }> {
  return { ok: true };
}
