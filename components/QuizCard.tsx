import React, { useState } from 'react';
import { Question, QuestionType } from '../types';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  onNext: (isCorrect: boolean) => void;
  isLast: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({ question, onNext, isLast }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper to extract the option letter (A, B, C...)
  const getOptionLabel = (text: string) => text.charAt(0);

  const handleOptionClick = (optionValue: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionValue);
    setIsSubmitted(true);
  };

  const handleNextClick = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === question.answer;
    onNext(isCorrect);
    // Reset state handled by parent changing question key
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const isCorrect = selectedOption === question.answer;

  const renderOptions = () => {
    if (question.type === QuestionType.SINGLE_CHOICE && question.options) {
      return question.options.map((opt) => {
        const letter = getOptionLabel(opt);
        let buttonStyle = "border-gray-200 bg-white active:bg-gray-50";
        
        if (isSubmitted) {
          if (letter === question.answer) {
            buttonStyle = "border-green-500 bg-green-50 text-green-700";
          } else if (selectedOption === letter && letter !== question.answer) {
            buttonStyle = "border-red-500 bg-red-50 text-red-700";
          } else {
             buttonStyle = "border-gray-100 opacity-60";
          }
        }

        return (
          <button
            key={letter}
            onClick={() => handleOptionClick(letter)}
            className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${buttonStyle} mb-3 flex items-start touch-manipulation`}
            disabled={isSubmitted}
          >
            <span className={`font-bold mr-3 min-w-[1.5rem] flex items-center justify-center rounded-full w-8 h-8 ${isSubmitted && letter === question.answer ? 'bg-green-200 text-green-800' : (isSubmitted && selectedOption === letter ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-600')}`}>
                {letter}
            </span>
            <span className="flex-1 pt-1">{opt.substring(2)}</span>
          </button>
        );
      });
    }

    if (question.type === QuestionType.JUDGMENT) {
      const options = [
        { label: 'T', text: '正确 (Correct)' },
        { label: 'F', text: '错误 (Incorrect)' }
      ];

      return (
        <div className="flex space-x-4 mt-4">
          {options.map((opt) => {
             let buttonStyle = "border-gray-200 bg-white hover:bg-gray-50";
             if (isSubmitted) {
                if (opt.label === question.answer) {
                  buttonStyle = "border-green-500 bg-green-50 text-green-700";
                } else if (selectedOption === opt.label && opt.label !== question.answer) {
                  buttonStyle = "border-red-500 bg-red-50 text-red-700";
                } else {
                   buttonStyle = "border-gray-100 opacity-50";
                }
             }

             return (
               <button
                  key={opt.label}
                  onClick={() => handleOptionClick(opt.label)}
                  className={`flex-1 p-6 rounded-xl border-2 font-semibold text-center transition-all ${buttonStyle} touch-manipulation`}
                  disabled={isSubmitted}
               >
                 {opt.text}
               </button>
             )
          })}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <div className="flex justify-between items-start">
             <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              {question.category}
            </span>
        </div>
       
        <h2 className="text-lg md:text-2xl font-bold text-gray-800 leading-snug">
          {question.question}
        </h2>
      </div>

      <div className="mb-6 space-y-2">
        {renderOptions()}
      </div>

      {isSubmitted && (
        <div className="animate-fade-in space-y-6">
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <div className="flex items-start">
                {isCorrect ? <CheckCircle className="text-green-600 w-6 h-6 mr-3 flex-shrink-0 mt-0.5" /> : <XCircle className="text-red-600 w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />}
                <div>
                    <h3 className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'} text-lg`}>
                    {isCorrect ? '回答正确！' : '回答错误'}
                    </h3>
                    {question.explanation && (
                    <div className="mt-2 text-gray-700 text-sm leading-relaxed">
                        <span className="font-semibold block mb-1">解析：</span>
                        {question.explanation}
                    </div>
                    )}
                </div>
            </div>
            </div>

            <button
                onClick={handleNextClick}
                className="w-full flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
                {isLast ? '查看结果' : '下一题'} <ArrowRight className="ml-2 w-5 h-5" />
            </button>
        </div>
      )}
    </div>
  );
};