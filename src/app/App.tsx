import { useEffect } from 'react';
import { useDiagnostic } from '@/hooks/useDiagnostic';
import { useQuestionFlow } from '@/hooks/useQuestionFlow';
import { LandingScreen } from '@/components/screens/LandingScreen';
import { ContextScreen } from '@/components/screens/ContextScreen';
import { QuestionScreen } from '@/components/screens/QuestionScreen';
import { EmailGateScreen } from '@/components/screens/EmailGateScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';

export function App() {
  const diagnostic = useDiagnostic();
  const { session, questionStartTime } = diagnostic;

  const questionFlow = useQuestionFlow({
    sessionId: session.sessionId,
    currentIndex: session.currentQuestionIndex,
    answers: session.answers,
    questionDisplayOrders: session.questionDisplayOrders,
    onAnswer: diagnostic.answerQuestion,
    onBack: diagnostic.goBackQuestion,
  });

  // Track screen views
  useEffect(() => {
    if (session.screen === 'landing') {
      diagnostic.trackEvent('landing_view');
    } else if (session.screen === 'results') {
      diagnostic.trackEvent('results_viewed');
    } else if (session.screen === 'emailGate') {
      diagnostic.trackEvent('email_gate_viewed');
    } else if (session.screen === 'questions' && questionFlow.currentQuestion) {
      diagnostic.trackEvent('question_viewed', {
        questionId: questionFlow.currentQuestion.id,
        questionIndex: questionFlow.currentIndex,
      });
    }
  }, [session.screen, session.currentQuestionIndex]);

  switch (session.screen) {
    case 'landing':
      return <LandingScreen onStart={diagnostic.goToContext} />;

    case 'context':
      return (
        <ContextScreen
          onSubmit={diagnostic.setContext}
          initialSize={session.context?.size}
          initialStage={session.context?.stage}
          initialIndustry={session.context?.industry}
        />
      );

    case 'questions':
      if (!questionFlow.currentQuestion) return null;
      return (
        <QuestionScreen
          question={questionFlow.currentQuestion}
          questionIndex={questionFlow.currentIndex}
          totalQuestions={questionFlow.totalQuestions}
          progress={questionFlow.progress}
          displayOrder={questionFlow.displayOrder}
          existingAnswer={questionFlow.existingAnswer}
          canGoBack={questionFlow.canGoBack}
          questionStartTime={questionStartTime}
          onSelect={questionFlow.handleSelectOption}
          onBack={questionFlow.handleBack}
        />
      );

    case 'emailGate':
      return (
        <EmailGateScreen
          onSubmit={diagnostic.submitLead}
          onSkip={diagnostic.skipGate}
        />
      );

    case 'results':
      return (
        <ResultsScreen
          session={session}
          onRestart={diagnostic.restart}
        />
      );

    default:
      return null;
  }
}
