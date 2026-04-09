import { useReducer, useEffect, useCallback } from 'react';
import type {
  ScreenId,
  CompanySize,
  CompanyStage,
  IndustryId,
  CompanyContext,
  AnswerRecord,
  AnswerOptionId,
  QuestionId,
  LeadCapture,
  DiagnosticSession,
} from '@/engine/types';
import { TOTAL_QUESTIONS } from '@/config/questions';
import { generateSessionId } from '@/utils/ids';
import { now } from '@/utils/time';
import { usePersistence } from './usePersistence';
import { useAnalytics } from './useAnalytics';

// ── State ─────────────────────────────────────────────────────────────

interface State {
  session: DiagnosticSession;
  questionStartTime: number;
}

const SCHEMA_VERSION = 3;

function createFreshSession(): DiagnosticSession {
  return {
    sessionId: generateSessionId(),
    schemaVersion: SCHEMA_VERSION,
    startedAt: now(),
    updatedAt: now(),
    screen: 'landing',
    context: null,
    answers: [],
    lead: { status: 'none', consentGiven: false },
    questionDisplayOrders: {},
    resultUnlockLevel: 'basic',
    currentQuestionIndex: 0,
  };
}

// ── Actions ───────────────────────────────────────────────────────────

type Action =
  | { type: 'RESTORE_SESSION'; session: DiagnosticSession }
  | { type: 'GO_TO_CONTEXT' }
  | { type: 'SET_CONTEXT'; context: CompanyContext }
  | { type: 'ANSWER'; questionId: QuestionId; optionId: AnswerOptionId; score: number; displayOrder: AnswerOptionId[]; timeMs: number }
  | { type: 'GO_BACK_QUESTION' }
  | { type: 'SKIP_GATE' }
  | { type: 'SUBMIT_LEAD'; lead: LeadCapture }
  | { type: 'RESTART' }
  | { type: 'MARK_QUESTION_START' };

function reducer(state: State, action: Action): State {
  const ts = now();

  switch (action.type) {
    case 'RESTORE_SESSION':
      return { ...state, session: { ...action.session, updatedAt: ts } };

    case 'GO_TO_CONTEXT':
      return {
        ...state,
        session: { ...state.session, screen: 'context', updatedAt: ts },
      };

    case 'SET_CONTEXT':
      return {
        ...state,
        session: {
          ...state.session,
          screen: 'questions',
          context: action.context,
          currentQuestionIndex: 0,
          updatedAt: ts,
        },
        questionStartTime: ts,
      };

    case 'ANSWER': {
      const { questionId, optionId, score, displayOrder, timeMs } = action;
      const existingIdx = state.session.answers.findIndex((a) => a.questionId === questionId);

      const record: AnswerRecord = {
        questionId,
        selectedOptionId: optionId,
        selectedScore: score,
        displayOrder,
        answeredAt: ts,
        timeToAnswerMs: timeMs,
        changedFromOptionId:
          existingIdx >= 0 ? state.session.answers[existingIdx]?.selectedOptionId : undefined,
      };

      const newAnswers =
        existingIdx >= 0
          ? state.session.answers.map((a, i) => (i === existingIdx ? record : a))
          : [...state.session.answers, record];

      // Save display order for this question (stable on back-nav)
      const newOrders = {
        ...state.session.questionDisplayOrders,
        [questionId]: displayOrder,
      };

      const nextIndex = state.session.currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= TOTAL_QUESTIONS;

      return {
        ...state,
        session: {
          ...state.session,
          answers: newAnswers,
          questionDisplayOrders: newOrders,
          currentQuestionIndex: isLastQuestion ? state.session.currentQuestionIndex : nextIndex,
          screen: isLastQuestion ? 'emailGate' : 'questions',
          updatedAt: ts,
        },
        questionStartTime: ts,
      };
    }

    case 'GO_BACK_QUESTION': {
      const prevIndex = Math.max(0, state.session.currentQuestionIndex - 1);
      const newScreen: ScreenId = prevIndex === 0 && state.session.currentQuestionIndex === 0
        ? 'context'
        : 'questions';
      return {
        ...state,
        session: {
          ...state.session,
          currentQuestionIndex: prevIndex,
          screen: newScreen,
          updatedAt: ts,
        },
        questionStartTime: ts,
      };
    }

    case 'SKIP_GATE':
      return {
        ...state,
        session: {
          ...state.session,
          screen: 'results',
          lead: { ...state.session.lead, status: 'skipped' },
          resultUnlockLevel: 'basic',
          completedAt: ts,
          updatedAt: ts,
        },
      };

    case 'SUBMIT_LEAD':
      return {
        ...state,
        session: {
          ...state.session,
          screen: 'results',
          lead: action.lead,
          resultUnlockLevel: 'full',
          completedAt: ts,
          updatedAt: ts,
        },
      };

    case 'RESTART': {
      return {
        session: createFreshSession(),
        questionStartTime: ts,
      };
    }

    case 'MARK_QUESTION_START':
      return { ...state, questionStartTime: ts };

    default:
      return state;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useDiagnostic() {
  const persistence = usePersistence();

  const [state, dispatch] = useReducer(reducer, null, () => {
    const saved = persistence.load();
    if (saved && saved.schemaVersion === SCHEMA_VERSION) {
      return { session: saved, questionStartTime: now() };
    }
    return { session: createFreshSession(), questionStartTime: now() };
  });

  const { trackEvent } = useAnalytics(state.session.sessionId);

  // ── Persist on every state change ──
  useEffect(() => {
    persistence.save(state.session);
  }, [state.session, persistence]);

  // ── Public API ──

  const goToContext = useCallback(() => {
    dispatch({ type: 'GO_TO_CONTEXT' });
    trackEvent('diagnostic_started');
  }, [trackEvent]);

  const setContext = useCallback(
    (size: CompanySize, stage: CompanyStage, industry: IndustryId) => {
      dispatch({ type: 'SET_CONTEXT', context: { size, stage, industry } });
      trackEvent('context_size_selected', { size });
      trackEvent('context_stage_selected', { stage });
      trackEvent('context_industry_selected', { industry });
    },
    [trackEvent]
  );

  const answerQuestion = useCallback(
    (questionId: QuestionId, optionId: AnswerOptionId, score: number, displayOrder: AnswerOptionId[], timeMs: number) => {
      dispatch({ type: 'ANSWER', questionId, optionId, score, displayOrder, timeMs });
      trackEvent('question_answered', { questionId, optionId, score, timeMs });
    },
    [trackEvent]
  );

  const goBackQuestion = useCallback(() => {
    dispatch({ type: 'GO_BACK_QUESTION' });
    trackEvent('question_back_clicked');
  }, [trackEvent]);

  const skipGate = useCallback(() => {
    dispatch({ type: 'SKIP_GATE' });
    trackEvent('email_gate_skipped');
  }, [trackEvent]);

  const submitLead = useCallback(
    (lead: LeadCapture) => {
      dispatch({ type: 'SUBMIT_LEAD', lead });
      trackEvent('email_gate_completed');
    },
    [trackEvent]
  );

  const restart = useCallback(() => {
    persistence.clear();
    dispatch({ type: 'RESTART' });
    trackEvent('diagnostic_restarted');
  }, [persistence, trackEvent]);

  return {
    session: state.session,
    questionStartTime: state.questionStartTime,

    // Actions
    goToContext,
    setContext,
    answerQuestion,
    goBackQuestion,
    skipGate,
    submitLead,
    restart,
    trackEvent,
  };
}
