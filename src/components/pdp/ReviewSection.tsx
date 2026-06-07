import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  verifiedPurchaser: boolean;
}

interface ReviewSectionProps {
  reviews: Review[];
  rating: number;
  onAddReview: (reviewData: { userName: string; rating: number; title: string; comment: string }) => void;
  submittingReview: boolean;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  rating,
  onAddReview,
  submittingReview
}) => {
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) {
      return;
    }
    onAddReview({
      userName: reviewName,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment
    });
    // Reset form
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <section className="space-y-6 text-left">
      <h3 className="text-lg font-black text-text-primary border-b border-gray-150 dark:border-gray-800 pb-2">
        Ratings & Reviews
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Reviews Scoreboard */}
        <div className="glass p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4">
          <h4 className="text-sm font-bold text-text-primary">Customer Rating Summary</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{rating}</span>
            <span className="text-sm text-gray-400">/ 5</span>
          </div>
          <div className="flex items-center text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-current' : 'text-text-secondary'}`} />
            ))}
          </div>
          <p className="text-[10px] text-gray-400">100% of reviews are verified purchases</p>
        </div>

        {/* Review Submission Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 glass p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 bg-white/40 dark:bg-slate-900/40">
          <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-500" /> Share Your Thoughts
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={reviewName}
              onChange={e => setReviewName(e.target.value)}
              className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Rating:</span>
              <select
                value={reviewRating}
                onChange={e => setReviewRating(parseInt(e.target.value))}
                className="bg-gray-150 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-bold"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            placeholder="Headline Title"
            required
            value={reviewTitle}
            onChange={e => setReviewTitle(e.target.value)}
            className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
          />

          <textarea
            placeholder="Review Details..."
            required
            rows={3}
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full resize-none"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2.5 px-5 rounded-xl shadow cursor-pointer transition-all hover:scale-105"
          >
            {submittingReview ? "Submitting..." : "Post Review"}
          </button>
        </form>

      </div>

      {/* Reviews List */}
      <div className="space-y-4 mt-6">
        {reviews.map(rev => (
          <div key={rev.id} className="p-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-white/20 dark:bg-slate-900/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={rev.userAvatar} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <h5 className="text-xs font-bold">{rev.userName}</h5>
                  <span className="text-[9px] text-gray-400">{rev.date}</span>
                </div>
              </div>
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
            </div>
            <h6 className="text-xs font-extrabold text-text-secondary">{rev.title}</h6>
            <p className="text-xs text-text-secondary mt-1">{rev.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
