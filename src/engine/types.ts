// ═══════════════════════════════════════════════════════════════════════
// IUB Diagnostic — Domain Types
// MVP types + future server entities for Gallup-like platform growth
// ═══════════════════════════════════════════════════════════════════════

// ── Primitives & IDs ──────────────────────────────────────────────────

export type ScreenId = 'landing' | 'context' | 'questions' | 'emailGate' | 'results';

export type CategoryId =
  | 'clarity'
  | 'decisions'
  | 'execution'
  | 'structure'
  | 'teamwork'
  | 'people';

export type QuestionId = string; // e.g. 'clarity_1', 'control_1'
export type AnswerOptionId = string; // e.g. 'clarity_1_a'

export type CompanySize = 'up_to_15' | '15_to_50' | '50_to_150' | '150_plus';
export type CompanyStage = 'survival' | 'stabilization' | 'growth' | 'rebuild';
export type IndustryId =
  | 'it'
  | 'manufacturing'
  | 'retail'
  | 'services'
  | 'construction'
  | 'logistics'
  | 'education'
  | 'healthcare'
  | 'horeca'
  | 'media'
  | 'finance'
  | 'other';

export type ResultLevel = 'high' | 'medium' | 'low';
export type LeadStatus = 'none' | 'skipped' | 'partial' | 'completed';
export type ResultUnlockLevel = 'basic' | 'full';
export type QuestionKind = 'main' | 'control';
export type BenchmarkType = 'expert' | 'empirical';

// ── Future server role types (not used in MVP, but defined for model) ─

export type RoleId =
  | 'owner'
  | 'executive'
  | 'manager'
  | 'employee'
  | 'consultant_admin'
  | 'consultant_analyst';

export type AssessmentLevel = 'personal' | 'team' | 'department' | 'organization';

// ── Category ──────────────────────────────────────────────────────────

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  /** Weight for systemic dependency in leverage calculation (0–1) */
  systemicDependencyWeight: number;
  /** Priority weight by company stage for leverage calculation */
  stagePriorityMap: Record<CompanyStage, number>;
}

// ── Questions ─────────────────────────────────────────────────────────

export interface QuestionOption {
  id: AnswerOptionId;
  label: string;
  score: number;
  /** Sounds positive but indicates immature process */
  isTrap?: boolean;
  /** Position in the authored order (0-based) */
  originalOrder: number;
}

export interface IndustryQuestionOverride {
  prompt?: string;
  options?: Array<{ id: AnswerOptionId; label: string }>;
  description?: string;
}

export interface Question {
  id: QuestionId;
  kind: QuestionKind;
  categoryId: CategoryId;
  /** For control questions: which categories does this cross-check */
  controlForCategoryIds?: CategoryId[];
  prompt: string;
  description?: string;
  options: QuestionOption[];
  tags: string[];
  shuffleOptions: boolean;
  reverseScored?: boolean;
  industryOverrides?: Partial<Record<IndustryId, IndustryQuestionOverride>>;
}

// ── Company Context ───────────────────────────────────────────────────

export interface CompanyContext {
  size: CompanySize;
  stage: CompanyStage;
  industry: IndustryId;
}

// ── Answer Record ─────────────────────────────────────────────────────

export interface AnswerRecord {
  questionId: QuestionId;
  selectedOptionId: AnswerOptionId;
  selectedScore: number;
  /** The shuffled order shown to user */
  displayOrder: AnswerOptionId[];
  answeredAt: number; // timestamp ms
  timeToAnswerMs: number;
  /** If user went back and changed answer */
  changedFromOptionId?: AnswerOptionId;
}

// ── Lead Capture ──────────────────────────────────────────────────────

export interface LeadCapture {
  status: LeadStatus;
  email?: string;
  telegram?: string;
  consentGiven: boolean;
  capturedAt?: number;
}

// ── Session ───────────────────────────────────────────────────────────

export interface DiagnosticSession {
  sessionId: string;
  schemaVersion: number;
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
  screen: ScreenId;
  context: CompanyContext | null;
  answers: AnswerRecord[];
  lead: LeadCapture;
  /** Stable shuffled order for each question, keyed by questionId */
  questionDisplayOrders: Record<QuestionId, AnswerOptionId[]>;
  resultUnlockLevel: ResultUnlockLevel;
  currentQuestionIndex: number;

  // ── Future fields for aggregate-ready shape ──
  participantRole?: RoleId;
  organizationId?: string;
  departmentId?: string;
  teamId?: string;
  waveId?: string;
}

// ── Results ───────────────────────────────────────────────────────────

export interface CategoryResult {
  categoryId: CategoryId;
  rawScore: number; // sum of answer scores for this category
  normalizedScore: number; // 0–10 scale
  controlDelta?: number; // difference from control question
  benchmarkDelta?: number; // difference from benchmark
  level: ResultLevel;
  interpretationKey: string; // e.g. 'clarity_medium_growth'
}

export interface ControlWarning {
  categoryId: CategoryId;
  directScore: number;
  indirectScore: number;
  delta: number;
  message: string;
}

export interface LeverageRecommendation {
  categoryId: CategoryId;
  leverageScore: number;
  reason: string;
  firstStep: string;
  expectedEffect: string;
}

export interface BenchmarkComparison {
  categoryId: CategoryId;
  userScore: number;
  benchmarkScore: number;
  delta: number;
  label: string;
}

export interface DiagnosticResult {
  overallScore: number;
  overallLevel: ResultLevel;
  categoryResults: CategoryResult[];
  topLeverage: LeverageRecommendation;
  controlWarnings: ControlWarning[];
  benchmarkComparison: BenchmarkComparison[];
  assessmentDate: number;

  // ── Future aggregate-ready fields ──
  participantRole?: RoleId;
  organizationId?: string;
  departmentId?: string;
  teamId?: string;
  waveId?: string;
}

// ── Interpretation ────────────────────────────────────────────────────

export interface InterpretationBlock {
  categoryId: CategoryId;
  level: ResultLevel;
  stage: CompanyStage;
  diagnosis: string;
  stageContext: string;
  mainRisk: string;
  firstStep: string;
  industryOverrides?: Partial<Record<IndustryId, Partial<InterpretationBlock>>>;
}

// ── Benchmarks ────────────────────────────────────────────────────────

export interface BenchmarkEntry {
  size: CompanySize;
  stage: CompanyStage;
  industry?: IndustryId;
  categoryScores: Record<CategoryId, number>;
  overallScore: number;
  benchmarkType: BenchmarkType;
  sampleSize?: number;
  label: string;
}

// ── Analytics ─────────────────────────────────────────────────────────

export type AnalyticsEventName =
  | 'landing_view'
  | 'diagnostic_started'
  | 'context_size_selected'
  | 'context_stage_selected'
  | 'context_industry_selected'
  | 'question_viewed'
  | 'question_answered'
  | 'question_back_clicked'
  | 'email_gate_viewed'
  | 'email_gate_skipped'
  | 'email_gate_completed'
  | 'results_viewed'
  | 'diagnostic_restarted';

export interface AnalyticsEvent {
  eventName: AnalyticsEventName;
  sessionId: string;
  timestamp: number;
  payload?: Record<string, unknown>;
}

// ── Persistence ───────────────────────────────────────────────────────

export interface PersistedState {
  version: number;
  savedAt: number;
  data: {
    session: DiagnosticSession;
    analytics: AnalyticsEvent[];
  };
}

// ── Level thresholds (configurable) ───────────────────────────────────

export interface LevelThresholds {
  high: number; // score >= this → high
  medium: number; // score >= this → medium, below → low
}

// ── Context option for UI ─────────────────────────────────────────────

export interface ContextOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Future Server Entities (types only — not used in MVP logic)
// Defined here so the domain model is ready for platform growth.
// ═══════════════════════════════════════════════════════════════════════

export interface Organization {
  id: string;
  name: string;
  industry: IndustryId;
  size: CompanySize;
  createdAt: number;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  parentDepartmentId?: string;
}

export interface Team {
  id: string;
  departmentId: string;
  name: string;
}

export interface Participant {
  id: string;
  organizationId: string;
  departmentId?: string;
  teamId?: string;
  role: RoleId;
  email?: string;
  displayName?: string;
}

export interface SurveyWave {
  id: string;
  organizationId: string;
  name: string;
  startedAt: number;
  closedAt?: number;
  assessmentLevel: AssessmentLevel;
}

export interface OrganizationAggregate {
  organizationId: string;
  waveId: string;
  categoryAverages: Record<CategoryId, number>;
  overallAverage: number;
  participantCount: number;
  responseRate: number;
}

export interface DepartmentAggregate {
  departmentId: string;
  waveId: string;
  categoryAverages: Record<CategoryId, number>;
  overallAverage: number;
  participantCount: number;
}

export interface TrendComparison {
  entityId: string;
  entityType: 'organization' | 'department' | 'team';
  wave1Id: string;
  wave2Id: string;
  categoryDeltas: Record<CategoryId, number>;
  overallDelta: number;
}
