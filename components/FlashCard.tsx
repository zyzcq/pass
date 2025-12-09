import React, { useState } from 'react';
import { Question } from '../types';
import { motion } from 'framer-motion';
import { RefreshCw, Check, Brain, X } from 'lucide-react';

interface FlashCardProps {
  question: Question;
  onNext: () => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({ question, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        onNext();
    }, 200);
  };

  return (
    <div className="max-w-xl mx-auto w-full h-[400px] md:h-[500px] perspective-1000 relative mb-20 md:mb-0">
        <motion.div
            className="w-full h-full relative transform-style-3d cursor-pointer"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Front of Card */}
            <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center items-center p-6 md:p-8 text-center hover:shadow-2xl transition-shadow">
                <div className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                <div className="mb-4 mt-8 md:mt-0">
                    <span className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-widest">{question.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 line-clamp-4">{question.question}</h2>
                <p className="text-gray-400 text-xs md:text-sm animate-pulse mt-auto md:mt-0">点击翻转查看口诀</p>
            </div>

            {/* Back of Card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 rounded-3xl shadow-xl flex flex-col justify-between p-6 md:p-8 text-center text-white">
                <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto no-scrollbar">
                     <div className="mb-4 md:mb-6 flex-shrink-0">
                        <span className="text-xs font-bold bg-indigo-500 px-2 py-1 rounded text-indigo-100">记忆口诀</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-extrabold mb-4 md:mb-6 tracking-wide text-yellow-300 drop-shadow-md">
                        {question.mnemonic}
                    </h3>
                    <div className="w-16 h-1 bg-white/20 rounded-full mb-4 md:mb-6 flex-shrink-0"></div>
                    <p className="text-indigo-100 text-base md:text-lg leading-relaxed">
                        {question.answer}
                    </p>
                    {question.explanation && (
                         <p className="text-indigo-200 text-xs md:text-sm mt-4 italic opacity-80 border-t border-indigo-500 pt-4 w-full">
                            "{question.explanation}"
                        </p>
                    )}
                </div>
            </div>
        </motion.div>

        {/* Controls - Outside the flip container to avoid rotation */}
        <div className="absolute -bottom-20 left-0 w-full flex justify-center space-x-4 md:space-x-6">
            <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="flex flex-col md:flex-row items-center justify-center px-4 py-2 md:px-6 md:py-3 bg-white rounded-2xl md:rounded-full shadow-lg text-gray-600 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all w-20 md:w-auto"
                title="Forgot"
            >
                <X className="w-5 h-5 mb-1 md:mb-0" />
                <span className="text-xs md:text-sm md:ml-2 font-medium">没记住</span>
            </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
                className="flex flex-col md:flex-row items-center justify-center px-4 py-2 md:px-6 md:py-3 bg-white rounded-2xl md:rounded-full shadow-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all w-20 md:w-auto"
            >
                <RefreshCw className="w-5 h-5 mb-1 md:mb-0" />
                <span className="text-xs md:text-sm md:ml-2 font-medium">翻转</span>
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="flex flex-col md:flex-row items-center justify-center px-4 py-2 md:px-6 md:py-3 bg-white rounded-2xl md:rounded-full shadow-lg text-gray-600 hover:text-green-600 hover:bg-green-50 active:scale-95 transition-all w-20 md:w-auto"
                title="Got it"
            >
                <Check className="w-5 h-5 mb-1 md:mb-0" />
                <span className="text-xs md:text-sm md:ml-2 font-medium">记住了</span>
            </button>
        </div>
    </div>
  );
};