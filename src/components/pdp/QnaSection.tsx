import React, { useState } from 'react';
import { HelpCircle, Send, ThumbsUp, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface QnA {
  id: string;
  question: string;
  answer: string;
  date: string;
  votes: number;
}

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
  const [votedQuestions, setVotedQuestions] = useState<Record<string, boolean>>({});
  const [votesCount, setVotesCount] = useState<Record<string, number>>({});
  
  const { showToast } = useToast();

  const handleVoteToggle = (qId: string, initialVotes: number) => {
    const isAlreadyVoted = votedQuestions[qId];
    if (isAlreadyVoted) {
      setVotedQuestions(prev => ({ ...prev, [qId]: false }));
      setVotesCount(prev => ({ ...prev, [qId]: (prev[qId] ?? initialVotes) - 1 }));
      showToast("Removed vote", "info");
    } else {
      setVotedQuestions(prev => ({ ...prev, [qId]: true }));
      setVotesCount(prev => ({ ...prev, [qId]: (prev[qId] ?? initialVotes) + 1 }));
      showToast("Voted question as helpful!", "success");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    onAddQuestion(questionText);
    setQuestionText('');
  };

  return (
    <section className="space-y-6 text-left">
      <h3 className="text-lg font-black text-text-primary border-b border-gray-150 dark:border-gray-800 pb-2">
        Questions & Answers
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: FAQ info & submission call */}
        <div className="space-y-4">
          <div className="glass p-5 rounded-3xl border border-gray-200/50 dark:border-gray-800/80 bg-bg-surface/50 shadow-md">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-500" /> Need Help?
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              Ask the brand seller, our active shopping community, or get instant AI answers for compatibility, sizes, or shipping.
            </p>
          </div>

          <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10 text-[10px] text-text-secondary flex items-start gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="font-extrabold text-primary block uppercase">Instant AI Assistant</span>
              All posted questions receive automated AI breakdowns analyzing detailed specs sheets.
            </div>
          </div>
        </div>

        {/* Right column: ask box */}
        <form onSubmit={handleSubmit} className="md:col-span-2 glass p-5 rounded-3xl border border-gray-200/50 dark:border-gray-800/85 bg-white/40 dark:bg-slate-900/40 shadow-md space-y-3.5">
          <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <Send className="w-4 h-4 text-primary" /> Ask a Question
          </h4>
          <div className="relative">
            <textarea
              placeholder="What would you like to know about this product? (e.g., compatibility, box contents...)"
              required
              rows={3}
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-3 rounded-2xl border border-transparent focus:border-primary outline-none w-full resize-none font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={submittingQuestion}
            className="bg-primary hover:bg-primary-hover text-text-inverted text-xs font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
          >
            {submittingQuestion ? "Posting..." : "Post Question"}
          </button>
        </form>

      </div>

      {/* Questions list */}
      <div className="space-y-5 mt-6">
        {qna.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-450 font-bold border border-dashed border-gray-200 dark:border-slate-850 rounded-2xl">
            No questions asked yet. Be the first to ask!
          </div>
        ) : (
          qna.map(q => {
            const activeVotes = votesCount[q.id] ?? q.votes;
            const isVoted = votedQuestions[q.id] ?? false;

            return (
              <div key={q.id} className="p-5 rounded-3xl border border-gray-150 dark:border-gray-850 bg-white/20 dark:bg-slate-900/20 shadow-sm space-y-4">
                
                {/* Question Block */}
                <div className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 select-none">Q</span>
                  <div className="flex-1">
                    <h5 className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">{q.question}</h5>
                    <span className="text-[9px] text-gray-450 font-medium">Asked on {q.date}</span>
                  </div>
                  
                  {/* Vote button */}
                  <button
                    onClick={() => handleVoteToggle(q.id, q.votes)}
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                      isVoted ? 'text-primary' : 'text-gray-400 hover:text-primary'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({activeVotes})</span>
                  </button>
                </div>

                {/* Answers Stack (Seller, Community, AI) */}
                <div className="pl-9 space-y-3">
                  
                  {/* Primary Database Answer (Seller Response) */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50/50 dark:bg-slate-900/40 border border-gray-150 dark:border-slate-800/60">
                    <div className="bg-indigo-600/10 text-indigo-500 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 select-none">A</div>
                    <div className="space-y-1">
                      <p className="text-xs text-text-secondary leading-relaxed font-medium">{q.answer}</p>
                      <div className="flex items-center gap-1 text-[9px] text-indigo-500 font-extrabold uppercase">
                        <ShieldCheck className="w-3 h-3" /> Brand Seller Verified
                      </div>
                    </div>
                  </div>

                  {/* Simulated AI Answer block */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 select-none">AI</div>
                    <div className="space-y-1">
                      <p className="text-xs text-text-secondary leading-relaxed font-medium">
                        Based on technical documentation, this product supports standard power inputs, and operates efficiently within standard global warranty conditions.
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-primary font-extrabold uppercase">
                        <Sparkles className="w-3 h-3" /> Buynora AI Assistant
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
