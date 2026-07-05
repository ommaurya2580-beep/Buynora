import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Filter, SortAsc, Sparkles, MessageCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

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
  
  // Custom states for filter & sort
  const [starFilter, setStarFilter] = useState<'all' | number>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('helpful');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  
  const { showToast } = useToast();

  const handleLikeToggle = (revId: string, initialLikes: number) => {
    const isAlreadyLiked = likedReviews[revId];
    if (isAlreadyLiked) {
      setLikedReviews(prev => ({ ...prev, [revId]: false }));
      setLikesCount(prev => ({ ...prev, [revId]: (prev[revId] ?? initialLikes) - 1 }));
      showToast("Removed helpful vote", "info");
    } else {
      setLikedReviews(prev => ({ ...prev, [revId]: true }));
      setLikesCount(prev => ({ ...prev, [revId]: (prev[revId] ?? initialLikes) + 1 }));
      showToast("Voted review as helpful!", "success");
    }
  };

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

  // Filter and Sort Logic
  const getProcessedReviews = () => {
    let list = [...reviews];
    
    // Filter
    if (starFilter !== 'all') {
      list = list.filter(r => r.rating === starFilter);
    }
    
    // Sort
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      // Default: helpful (likes)
      const aLikes = likesCount[a.id] ?? a.likes;
      const bLikes = likesCount[b.id] ?? b.likes;
      return bLikes - aLikes;
    });

    return list;
  };

  const processedReviews = getProcessedReviews();

  return (
    <section className="space-y-6 text-left">
      <h3 className="text-lg font-black text-text-primary border-b border-gray-150 dark:border-gray-800 pb-2">
        Ratings & Reviews
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Reviews Scoreboard */}
        <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/80 space-y-4 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Customer Rating Summary</h4>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-text-primary">{rating}</span>
              <span className="text-sm text-gray-400">/ 5</span>
            </div>
            <div className="flex items-center text-amber-400 gap-0.5 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-current' : 'text-gray-300 dark:text-slate-700'}`} />
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">100% of reviews are from verified buyers</p>
          </div>

          {/* Mini AI Summary block */}
          <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 text-[10px] text-text-secondary flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <p><strong>AI Verdict:</strong> Customers overwhelmingly praise the build materials, sleek branding, and comfort. A minor concern is the lack of bundled chargers on electronic variants.</p>
          </div>
        </div>

        {/* Review Submission Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/85 space-y-4 bg-white/40 dark:bg-slate-900/40 shadow-md">
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
              className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-medium"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-450 font-bold">Rating:</span>
              <select
                value={reviewRating}
                onChange={e => setReviewRating(parseInt(e.target.value))}
                className="bg-gray-150 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-extrabold cursor-pointer"
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
            className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full font-medium"
          />

          <textarea
            placeholder="Review Details..."
            required
            rows={3}
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            className="bg-gray-150 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full resize-none font-medium"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="bg-indigo-600 hover:bg-indigo-700 text-text-inverted text-xs font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
          >
            {submittingReview ? "Submitting..." : "Post Review"}
          </button>
        </form>

      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl border border-gray-150 dark:border-slate-800/80 mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button 
            onClick={() => setStarFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              starFilter === 'all' ? 'bg-primary text-text-inverted' : 'bg-gray-150 dark:bg-slate-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setStarFilter(stars)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                starFilter === stars ? 'bg-primary text-text-inverted' : 'bg-gray-150 dark:bg-slate-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {stars} <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
            <SortAsc className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-gray-150 dark:bg-slate-800 text-xs px-3 py-1.5 rounded-xl border border-transparent outline-none font-bold cursor-pointer"
          >
            <option value="helpful">Most Helpful</option>
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {processedReviews.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-450 font-bold border border-dashed border-gray-200 dark:border-slate-850 rounded-2xl">
            No reviews match the selected filter.
          </div>
        ) : (
          processedReviews.map(rev => {
            const activeLikes = likesCount[rev.id] ?? rev.likes;
            const isLiked = likedReviews[rev.id] ?? false;

            return (
              <div key={rev.id} className="p-5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-white/20 dark:bg-slate-900/20 shadow-sm hover:shadow transition-shadow">
                
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img src={rev.userAvatar} alt="avatar" className="w-9 h-9 rounded-full border border-gray-200 dark:border-slate-800 object-cover" />
                    <div>
                      <h5 className="text-xs font-bold flex items-center gap-1.5">
                        {rev.userName} 
                        {rev.verifiedPurchaser && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 px-1.5 py-0.2 rounded-full font-black uppercase">
                            Verified Buyer
                          </span>
                        )}
                      </h5>
                      <span className="text-[9px] text-gray-400 font-medium">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200 dark:text-slate-800'}`} />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <h6 className="text-xs font-extrabold text-text-primary mt-1">{rev.title}</h6>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{rev.comment}</p>

                {/* Footer votes toolbar */}
                <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-gray-100 dark:border-slate-800/40">
                  <button
                    onClick={() => handleLikeToggle(rev.id, rev.likes)}
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      isLiked ? 'text-primary' : 'text-gray-400 hover:text-primary'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>Helpful ({activeLikes})</span>
                  </button>

                  <button className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Comment
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
