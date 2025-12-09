import React from 'react';
import { BookOpen, AlertCircle, Brain, CheckSquare, Layers } from 'lucide-react';

interface DashboardProps {
  onStartQuiz: (mode: 'ALL' | 'CHOICE' | 'JUDGMENT' | 'MNEMONIC' | 'MISTAKES') => void;
  mistakeCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, mistakeCount }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">PM 考霸</h1>
        <p className="text-gray-500 text-lg">项目管理 PMP/软考 刷题神器</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selection */}
        <button
          onClick={() => onStartQuiz('CHOICE')}
          className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckSquare className="w-24 h-24 text-blue-500" />
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">选择题专项</h3>
          <p className="text-gray-500 text-sm">单项选择，涵盖十大知识领域与五大过程组。</p>
        </button>

        {/* Judgment */}
        <button
          onClick={() => onStartQuiz('JUDGMENT')}
          className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-24 h-24 text-purple-500" />
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">判断题专项</h3>
          <p className="text-gray-500 text-sm">快速判断对错，厘清概念误区。</p>
        </button>

        {/* Mnemonics */}
        <button
          onClick={() => onStartQuiz('MNEMONIC')}
          className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain className="w-24 h-24 text-indigo-500" />
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">口诀记忆卡</h3>
          <p className="text-gray-500 text-sm">翻转卡片模式，高效记忆核心知识点与流程。</p>
        </button>

        {/* Mistakes */}
        <button
          onClick={() => onStartQuiz('MISTAKES')}
          disabled={mistakeCount === 0}
          className={`group relative overflow-hidden p-6 rounded-2xl shadow-sm border text-left transition-all ${
            mistakeCount === 0 
              ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' 
              : 'bg-white border-red-100 hover:shadow-lg hover:border-red-200'
          }`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className={`w-24 h-24 ${mistakeCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
            mistakeCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800">错题回顾</h3>
            {mistakeCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{mistakeCount}</span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {mistakeCount === 0 ? "暂无错题，继续保持！" : "攻克薄弱环节，消灭每一个知识盲点。"}
          </p>
        </button>
      </div>
      
      <div className="mt-8 text-center">
         <button onClick={() => onStartQuiz('ALL')} className="text-gray-400 hover:text-indigo-600 text-sm font-medium transition-colors flex items-center justify-center mx-auto">
             <BookOpen className="w-4 h-4 mr-2" /> 浏览全部题目
         </button>
      </div>
    </div>
  );
};