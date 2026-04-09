import { useReducer, useEffect, useCallback } from 'react';
import { QUESTIONS } from '@/data/questions';
import LandingScreen from '@/components/LandingScreen';
import ContextScreen from '@/components/ContextScreen';
import QuestionScreen from '@/components/QuestionScreen';
import ResultsScreen from '@/components/ResultsScreen';

// --- State ---
type Screen = 'landing' | 'context' | 'questions' | 'results';

interface State {
  screen: Screen;
  companySize: string;
  companyStage: string;
  currentQuestion: number;
  answers: Record<string, number>; // questionId → score
  darkMode: boolean;
}

type Action =
  | { type: 'GO_TO_CONTEXT' }
  | { type: 'SET_CONTEXT'; size: string; stage: string }
  | { type: 'ANSWER'; questionId: string; score: number }
  | { type: 'GO_BACK' }
  | { type: 'SHOW_RESULTS' }
  | { type: 'RESTART' }
  | { type: 'TOGGLE_DARK' }
  | { type: 'RESTORE'; state: Partial<State> };

const STORAGE_KEY = 'iub-diagnostic-state';

function loadSaved(): Partial<State> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState: State = {
  screen: 'landing',
  companySize: '',
  companyStage: '',
  currentQuestion: 0,
  answers: {},
  darkMode: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GO_TO_CONTEXT':
      return { ...state, screen: 'context' };
    case 'SET_CONTEXT':
      return { ...state, screen: 'questions', companySize: action.size, companyStage: action.stage, currentQuestion: 0 };
    case 'ANSWER': {
      const newAnswers = { ...state.answers, [action.questionId]: action.score };
      const nextQ = state.currentQuestion + 1;
      if (nextQ >= QUESTIONS.length) {
        return { ...state, answers: newAnswers, screen: 'results' };
      }
      return { ...state, answers: newAnswers, currentQuestion: nextQ };
    }
    case 'GO_BACK':
      if (state.currentQuestion > 0) {
        return { ...state, currentQuestion: state.currentQuestion - 1 };
      }
      return { ...state, screen: 'context' };
    case 'SHOW_RESULTS':
      return { ...state, screen: 'results' };
    case 'RESTART':
      return { ...initialState, darkMode: state.darkMode };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    case 'RESTORE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

// --- Supabase integration placeholder ---
// async function saveResultsToSupabase(state: State) {
//   // TODO: Connect to Supabase when ready
//   // const { data, error } = await supabase.from('diagnostic_results').insert({...})
// }

const Index = () => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadSaved();
    if (saved) {
      return { ...init, ...saved };
    }
    return init;
  });

  // Persist to localStorage
  useEffect(() => {
    const { screen, companySize, companyStage, currentQuestion, answers, darkMode } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, companySize, companyStage, currentQuestion, answers, darkMode }));
  }, [state]);

  // Dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const handleToggleDark = useCallback(() => dispatch({ type: 'TOGGLE_DARK' }), []);

  switch (state.screen) {
    case 'landing':
      return (
        <LandingScreen
          onStart={() => dispatch({ type: 'GO_TO_CONTEXT' })}
          darkMode={state.darkMode}
          onToggleDarkMode={handleToggleDark}
        />
      );
    case 'context':
      return (
        <ContextScreen
          onSubmit={(size, stage) => dispatch({ type: 'SET_CONTEXT', size, stage })}
          initialSize={state.companySize}
          initialStage={state.companyStage}
        />
      );
    case 'questions': {
      const q = QUESTIONS[state.currentQuestion];
      return (
        <QuestionScreen
          question={q}
          questionIndex={state.currentQuestion}
          totalQuestions={QUESTIONS.length}
          selectedScore={state.answers[q.id]}
          onAnswer={(score) => dispatch({ type: 'ANSWER', questionId: q.id, score })}
          onBack={() => dispatch({ type: 'GO_BACK' })}
          canGoBack={true}
        />
      );
    }
    case 'results':
      return (
        <ResultsScreen
          answers={state.answers}
          companySize={state.companySize}
          companyStage={state.companyStage}
          onRestart={() => dispatch({ type: 'RESTART' })}
        />
      );
    default:
      return null;
  }
};

export default Index;
