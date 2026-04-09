import { useState, useEffect, useCallback, useRef } from 'react';
import type { Question, AnswerOptionId, AnswerRecord } from '@/engine/types';
import { CATEGORY_MAP } from '@/config/categories';
import { Container } from '@/components/layout/Container';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  progress: number;
  displayOrder: AnswerOptionId[];
  existingAnswer?: AnswerRecord;
  canGoBack: boolean;
  questionStartTime: number;
  onSelect: (optionId: AnswerOptionId, score: number, timeMs: number) => void;
  onBack: () => void;
}

export function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  progress,
  displayOrder,
  existingAnswer,
  canGoBack,
  questionStartTime,
  onSelect,
  onBack,
}: QuestionScreenProps) {
  const [selected, setSelected] = useState<AnswerOptionId | null>(
    existingAnswer?.selectedOptionId ?? null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeKey, setFadeKey] = useState(questionIndex);
  const timerRef = useRef(questionStartTime);

  // Reset selected when question changes
  useEffect(() => {
    setSelected(existingAnswer?.selectedOptionId ?? null);
    setFadeKey(questionIndex);
    timerRef.current = questionStartTime;
  }, [questionIndex, existingAnswer, questionStartTime]);

  const category = CATEGORY_MAP[question.categoryId];

  // Ordered options based on displayOrder
  const orderedOptions = displayOrder
    .map((id) => question.options.find((o) => o.id === id))
    .filter(Boolean) as typeof question.options;

  const handleSelect = useCallback(
    (optionId: AnswerOptionId, score: number) => {
      if (isTransitioning) return;
      setSelected(optionId);
      setIsTransitioning(true);

      const timeMs = Date.now() - timerRef.current;

      // 300ms delay for visual feedback, then advance
      setTimeout(() => {
        onSelect(optionId, score, timeMs);
        setIsTransitioning(false);
      }, 300);
    },
    [isTransitioning, onSelect]
  );

  return (
    <Container className="min-h-[100dvh] flex flex-col">
      {/* Progress */}
      <div className="mb-1">
        <ProgressBar value={progress} />
      </div>
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs text-ink-muted">
          {questionIndex + 1} из {totalQuestions}
        </span>
        {category && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: category.color, backgroundColor: `${category.color}10` }}
          >
            {category.shortName}
          </span>
        )}
      </div>

      {/* Question */}
      <div
        key={fadeKey}
        className="flex-1 animate-fade-up"
      >
        <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
          {question.prompt}
        </h2>

        {/* Options */}
        <div className="mt-6 space-y-2.5">
          {orderedOptions.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id, option.score)}
                disabled={isTransitioning && !isSelected}
                className={`
                  w-full text-left rounded-lg border-2 px-4 py-3.5
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                  ${
                    isSelected
                      ? 'shadow-sm'
                      : 'border-transparent bg-surface-dark hover:border-ink/10'
                  }
                  ${isTransitioning && !isSelected ? 'opacity-50' : ''}
                `}
                style={
                  isSelected && category
                    ? { borderColor: category.color, backgroundColor: `${category.color}08` }
                    : undefined
                }
              >
                <span className="block text-[15px] leading-relaxed">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-8 pb-4">
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isTransitioning}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            &#8592; Назад
          </button>
        )}
      </div>
    </Container>
  );
}
