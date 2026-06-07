import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { QnA } from '../../types';

interface QnaSectionProps {
  qna: QnA[];
  onAddQuestion: (questionText: string) => void;
  submittingQuestion: boolean;
}

export const QnaSection: React.FC<QnaSectionProps> = ({
  qna,
  onAddQuestion,
  submittingQuestion
}) => {
  const [questionText, setQuestionText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    onAddQuestion(questionText);
    setQuestionText('');
  };

  return (
    <section className="space-y-6 text-left">
      <h3 className="text-lg font-black text-text-primary border-b border-gray-150 dark:border-gray-800 pb-2 flex items-center gap-1.5">
        <HelpCircle className="w-5 h-5 text-indigo-500" /> Customer Questions & Answers
      </h3>

      {/* Ask Question Form */}
      <form onSubmit={handleSubmit} className="glass p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 flex gap-3">
        <input
          type="text"
          placeholder="Have a question? Ask owners or the merchant..."
          required
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          className="flex-1 bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none"
        />
        <button
          type="submit"
          disabled={submittingQuestion}
          className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
        >
          {submittingQuestion ? "Posting..." : "Ask"}
        </button>
      </form>

      {/* Q&A List */}
      <div className="space-y-4">
        {qna.length === 0 ? (
          <p className="text-xs text-gray-400">No questions answered yet. Be the first to ask!</p>
        ) : (
          qna.map(q => (
            <div key={q.id} className="p-4 rounded-xl bg-bg-secondary/20 space-y-2 border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-start gap-2 text-xs font-bold text-text-primary">
                <span className="bg-indigo-500/10 text-indigo-500 text-[10px] px-1.5 py-0.5 rounded">Q</span>
                <p>{q.question}</p>
              </div>
              <div className="flex items-start gap-2 text-xs text-text-secondary pl-4">
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded">A</span>
                <p>{q.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </section>
  );
};
