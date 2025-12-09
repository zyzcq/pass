import React, { useState, useEffect } from 'react';
import { questions } from './data';
import { Question, QuestionType } from './types';
import { Dashboard } from './components/Dashboard';
import { QuizCard } from './components/QuizCard';
import { FlashCard } from './components/FlashCard';
import { Home, ChevronLeft, Award } from 'lucide-react';

// Key for local storage
const LS_WRONG_KEY = 'pm_exam_wrong_answers';

function App() {
  const [view, setView] = useState<'DASHBOARD' | 'QUIZ' | 'RESULT'>('DASHBOARD');
  const [quizMode, setQuizMode] = useState<'ALL' | 'CHOICE' | 'JUDGMENT' | 'MNEMONIC' | 'MISTAKES'>('ALL');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  
  // Stats for current session
  const [sessionCorrect, setSessionCorrect] = useState(0);

  // Load wrong answers from LS on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_WRONG_KEY);
    if (saved) {
      try {
        setWrongAnswers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  const saveWrongAnswer = (id: string) => {
    setWrongAnswers(prev => {
      if (prev.includes(id)) return prev;
      const newVal = [...prev, id];
      localStorage.setItem(LS_WRONG_KEY, JSON.stringify(newVal));
      return newVal;
    });
  };

  const removeWrongAnswer = (id: string) => {
    setWrongAnswers(prev => {
        const newVal = prev.filter(qid => qid !== id);
        localStorage.setItem(LS_WRONG_KEY, JSON.stringify(newVal));
        return newVal;
    });
  };

  const startQuiz = (mode: 'ALL' | 'CHOICE' | 'JUDGMENT' | 'MNEMONIC' | 'MISTAKES') => {
    setQuizMode(mode);
    let filtered: Question[] = [];

    switch (mode) {
      case 'CHOICE':
        filtered = questions.filter(q => q.type === QuestionType.SINGLE_CHOICE);
        break;
      case 'JUDGMENT':
        filtered = questions.filter(q => q.type === QuestionType.JUDGMENT);
        break;
      case 'MNEMONIC':
        filtered = questions.filter(q => q.type === QuestionType.MNEMONIC);
        break;
      case 'MISTAKES':
        filtered = questions.filter(q => wrongAnswers.includes(q.id));
        break;
      default:
        filtered = [...questions];
    }

    // Shuffle simple questions
    if (mode !== 'MNEMONIC') {
        filtered = filtered.sort(() => Math.random() - 0.5);
    }

    setActiveQuestions(filtered);
    setCurrentIndex(0);
    setSessionCorrect(0);
    setView('QUIZ');
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    const currentQ = activeQuestions[currentIndex];

    if (isCorrect) {
      setSessionCorrect(prev => prev + 1);
      // If we are in mistake mode and they got it right, remove it from mistakes
      if (quizMode === 'MISTAKES') {
          removeWrongAnswer(currentQ.id);
      }
    } else {
      saveWrongAnswer(currentQ.id);
    }

    // Move to next question immediately (animation handled by React key change)
    if (currentIndex < activeQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
    } else {
        setView('RESULT');
    }
  };

  const handleFlashcardNext = () => {
      if (currentIndex < activeQuestions.length - 1) {
          setCurrentIndex(prev => prev + 1);
      } else {
          setView('RESULT');
      }
  };

  const goHome = () => {
    setView('DASHBOARD');
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-10">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {view !== 'DASHBOARD' && (
                <button onClick={goHome} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200">
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
            )}
            <span className="font-bold text-lg tracking-tight text-indigo-900 truncate max-w-[150px] md:max-w-none">PM Exam Master</span>
          </div>
          {view === 'QUIZ' && (
             <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                {currentIndex + 1} / {activeQuestions.length}
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl p-4 md:p-6">
        
        {view === 'DASHBOARD' && (
          <Dashboard onStartQuiz={startQuiz} mistakeCount={wrongAnswers.length} />
        )}

        {view === 'QUIZ' && activeQuestions.length > 0 && (
          <div className="flex flex-col items-center justify-start md:justify-center min-h-[70vh] py-4">
            {activeQuestions[currentIndex].type === QuestionType.MNEMONIC ? (
                <FlashCard 
                    question={activeQuestions[currentIndex]} 
                    onNext={handleFlashcardNext} 
                />
            ) : (
                <div className="w-full">
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 max-w-2xl mx-auto overflow-hidden">
                        <div 
                            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                            style={{ width: `${((currentIndex) / activeQuestions.length) * 100}%`}}
                        ></div>
                    </div>
                    <QuizCard 
                        key={activeQuestions[currentIndex].id} // Key forces re-render on new question
                        question={activeQuestions[currentIndex]} 
                        onNext={handleQuizAnswer} 
                        isLast={currentIndex === activeQuestions.length - 1}
                    />
                </div>
            )}
          </div>
        )}

        {view === 'RESULT' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up px-4">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Award className="w-12 h-12 text-yellow-600" />
                </div>
                <h2 className="text-3xl font-bold mb-2">练习完成!</h2>
                <p className="text-gray-500 mb-8">继续加油，保持学习进度。</p>
                
                {quizMode !== 'MNEMONIC' && (
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-3xl font-bold text-indigo-600">{sessionCorrect}</div>
                            <div className="text-xs text-gray-400 uppercase font-bold mt-1">正确</div>
                        </div>
                         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-3xl font-bold text-gray-800">{activeQuestions.length}</div>
                            <div className="text-xs text-gray-400 uppercase font-bold mt-1">总题数</div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full max-w-sm">
                    <button 
                        onClick={goHome}
                        className="w-full px-8 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors active:bg-gray-100"
                    >
                        返回主页
                    </button>
                    <button 
                        onClick={() => startQuiz(quizMode)}
                        className="w-full px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                    >
                        再练一次
                    </button>
                </div>
            </div>
        )}

        {view === 'QUIZ' && activeQuestions.length === 0 && (
            <div className="text-center mt-20">
                <p className="text-gray-500">该分类下暂无题目。</p>
                <button onClick={goHome} className="mt-4 text-indigo-600 font-medium">返回</button>
            </div>
        )}

      </main>
    </div>
  );
}

export default App;