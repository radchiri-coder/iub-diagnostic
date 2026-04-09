import type { AnswerRecord, DiagnosticSession, DiagnosticResult, CategoryId } from './types';

/**
 * Transform session answers into a scoring-ready payload.
 * Strips UI-specific fields, keeps only what scoring needs.
 */
export function toScoringPayload(answers: AnswerRecord[]): Array<{
  questionId: string;
  score: number;
}> {
  return answers.map((a) => ({
    questionId: a.questionId,
    score: a.selectedScore,
  }));
}

/**
 * Transform an individual result into an aggregate-ready shape.
 * This is the bridge to future server analytics:
 * - individual results can be aggregated into org/department/team views
 * - wave comparisons can use this shape
 */
export function toAggregateReadyShape(
  session: DiagnosticSession,
  result: DiagnosticResult
): {
  sessionId: string;
  assessmentDate: number;
  context: {
    size: string;
    stage: string;
    industry: string;
  } | null;
  categoryScores: Record<CategoryId, number>;
  overallScore: number;
  controlFlags: string[];
  // Future fields
  participantRole?: string;
  organizationId?: string;
  departmentId?: string;
  teamId?: string;
  waveId?: string;
} {
  const categoryScores = {} as Record<CategoryId, number>;
  for (const cr of result.categoryResults) {
    categoryScores[cr.categoryId] = cr.normalizedScore;
  }

  return {
    sessionId: session.sessionId,
    assessmentDate: result.assessmentDate,
    context: session.context
      ? {
          size: session.context.size,
          stage: session.context.stage,
          industry: session.context.industry,
        }
      : null,
    categoryScores,
    overallScore: result.overallScore,
    controlFlags: result.controlWarnings.map((w) => w.categoryId),
    // Future: populated when org/team features exist
    participantRole: session.participantRole,
    organizationId: session.organizationId,
    departmentId: session.departmentId,
    teamId: session.teamId,
    waveId: session.waveId,
  };
}
