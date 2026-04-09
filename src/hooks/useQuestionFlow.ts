import { useCallback, useMemo } from 'react';
import type { AnswerOptionId, QuestionId, AnswerRecord } from '@/engine/types';
import { QUESTIONS, TOTAL_QUESTIONS } from '@/config/questions';
import { shuffleWithSeed, stringToSeed } from '@/utils/shuffle';

interface UseQuestionFlowArgs {
  sessionId: string;
  currentIndex: number;
  answers: AnswerRecord[];
  questionDisplayOrders: Record<QuestionId, AnswerOptionId[]>;
  onAnswer: (questionId: QuestionId, optionId: AnswerOptionId, score: number, displayOrder: AnswerOptionId[], timeMs: number) => void;
  onBack: () => void;
}

export function useQuestionFlow({
  sessionId,
  currentIndex,
  answers,
  questionDisplayOrders,
  onAnswer,
  onBack,
}: UseQuestionFlowArgs) {
  const currentQuestion = QUESTIONS[currentIndex] ?? null;
  const totalQuestions = TOTAL_QUESTIONS;
  const progress = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;
  const canGoBack = currentIndex > 0;

  /**
   * Get stable display order for a question.
   * If already computed (e.g. user went back), reuse it.
   * Otherwise compute and it will be saved when user answers.
   */
  const displayOrder = useMemo((): AnswerOptionId[] => {
    if (!currentQuestion) return [];

    // Reuse saved order if exists (critical for back-navigation stability)
    const saved = questionDisplayOrders[currentQuestion.id];
    if (saved && saved.length > 0) return saved;

    // First time showing this question: shuffle if needed
    if (!currentQuestion.shuffleOptions) {
      return currentQuestion.options.map((o) => o.id);
    }

    const seed = stringToSeed(`${sessionId}-${currentQuestion.id}`);
    const shuffled = shuffleWithSeed(currentQuestion.options, seed);
    return shuffled.map((o) => o.id);
  }, [currentQuestion, questionDisplayOrders, sessionId]);

  const existingAnswer = useMemo(() => {
    if (!currentQuestion) return undefined;
    return answers.find((a) => a.questionId === currentQuestion.id);
  }, [currentQuestion, answers]);

  const handleSelectOption = useCallback(
    (optionId: AnswerOptionId, score: number, timeMs: number) => {
      if (!currentQuestion) return;
      onAnswer(currentQuestion.id, optionId, score, displayOrder, timeMs);
    },
    [currentQuestion, displayOrder, onAnswer]
  );

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    progress,
    canGoBack,
    displayOrder,
    existingAnswer,
    handleSelectOption,
    handleBack: onBack,
  };
}
