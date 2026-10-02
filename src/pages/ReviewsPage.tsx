import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import {
  BATCH_OPTIONS,
  PublicReviewItem,
  ReviewStats,
} from '../types/alumni';
import { ReviewSummary } from '../components/ReviewSummary';
import { ReviewCard } from '../components/ReviewCard';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface ReviewsPageProps {
  stats: ReviewStats;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ stats }) => {
  const [reviews, setReviews] = useState<PublicReviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);

  const [selectedReview, setSelectedReview] = useState<PublicReviewItem | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (batchFilter !== 'all') params.set('batch', batchFilter);
      if (ratingFilter !== 'all') params.set('rating', ratingFilter);
      params.set('sort', sortOrder);
      params.set('page', String(page));
      params.set('limit', '9');

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load alumni reviews.');
      }

      setReviews(data.reviews || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Could not load reviews.');
    } finally {
      setLoading(false);
    }
  }, [search, batchFilter, ratingFilter, sortOrder, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleResetFilters = () => {
    setSearch('');
    setBatchFilter('all');
    setRatingFilter('all');
    setSortOrder('newest');
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#111111] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Back Link & Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D4AF37] hover:text-[#F7F1E5] transition-colors uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[#F7F1E5]">
            Alumni Community Reviews
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#F7F1E5]/75 max-w-2xl">
            Explore ratings and reflections from all 11 batches of the HNDE Labuduwa Alumni Association.
          </p>
        </div>

        {/* Dynamic Summary */}
        <ReviewSummary stats={stats} />

        {/* Filter & Search Controls Bar */}
        <div className="mt-10 rounded-2xl bg-[#161212] border border-white/10 p-5 sm:p-6 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="lg:col-span-4">
              <label
                htmlFor="reviews-search"
                className="block text-xs font-semibold uppercase tracking-wider text-[#F7F1E5]/65 mb-1.5"
              >
                Search Reviews
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F7F1E5]/45" />
                <input
                  id="reviews-search"
                  type="text"
                  placeholder="Search by name, batch, or keyword..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl bg-[#111111] pl-10 pr-4 py-2.5 text-sm text-[#F7F1E5] placeholder-[#F7F1E5]/40 border border-white/15 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Filter by Batch */}
            <div className="lg:col-span-3">
              <label
                htmlFor="reviews-batch-filter"
                className="block text-xs font-semibold uppercase tracking-wider text-[#F7F1E5]/65 mb-1.5"
              >
                Filter by Batch
              </label>
              <select
                id="reviews-batch-filter"
                value={batchFilter}
                onChange={(e) => {
                  setBatchFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl bg-[#111111] px-3.5 py-2.5 text-sm text-[#F7F1E5] border border-white/15 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="all">All 11 Batches</option>
                {BATCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Rating */}
            <div className="lg:col-span-2">
              <label
                htmlFor="reviews-rating-filter"
                className="block text-xs font-semibold uppercase tracking-wider text-[#F7F1E5]/65 mb-1.5"
              >
                Filter by Rating
              </label>
              <select
                id="reviews-rating-filter"
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl bg-[#111111] px-3.5 py-2.5 text-sm text-[#F7F1E5] border border-white/15 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars (★★★★★)</option>
                <option value="4">4 Stars (★★★★☆)</option>
                <option value="3">3 Stars (★★★☆☆)</option>
                <option value="2">2 Stars (★★☆☆☆)</option>
                <option value="1">1 Star (★☆☆☆☆)</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="lg:col-span-2">
              <label
                htmlFor="reviews-sort"
                className="block text-xs font-semibold uppercase tracking-wider text-[#F7F1E5]/65 mb-1.5"
              >
                Sort By
              </label>
              <select
                id="reviews-sort"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as 'newest' | 'oldest');
                  setPage(1);
                }}
                className="w-full rounded-xl bg-[#111111] px-3.5 py-2.5 text-sm text-[#F7F1E5] border border-white/15 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="lg:col-span-1">
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset filters"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 py-2.5 px-3 text-xs font-medium text-[#F7F1E5]/80 border border-white/15 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="h-4 w-4 text-[#D4AF37]" />
                <span className="lg:hidden">Reset</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#F7F1E5]/60">
            <span className="font-mono-num">
              Showing {reviews.length} of {total} matching {total === 1 ? 'review' : 'reviews'}
            </span>
            {(search || batchFilter !== 'all' || ratingFilter !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                Clear active filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" label="Loading reviews..." />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-[#260D10] border border-[#ef4444]/50 p-8 text-center">
              <p className="text-base font-semibold text-[#ef4444]">{error}</p>
              <button
                type="button"
                onClick={fetchReviews}
                className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-[#F7F1E5]"
              >
                Retry
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl bg-[#161212] border border-white/10 p-12 text-center max-w-xl mx-auto">
              <p className="font-display text-2xl font-bold text-[#F7F1E5]">
                No reviews yet.
              </p>
              <p className="mt-2 text-sm text-[#F7F1E5]/75">
                Be the first HNDEian to share your experience.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((item) => (
                  <ReviewCard
                    key={item.id}
                    review={item}
                    onReadMore={(r) => setSelectedReview(r)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#161212] px-4 py-2.5 text-xs font-semibold text-[#F7F1E5] border border-white/15 hover:border-[#D4AF37]/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <span className="font-mono-num text-xs text-[#F7F1E5]/80 px-3">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#161212] px-4 py-2.5 text-xs font-semibold text-[#F7F1E5] border border-white/15 hover:border-[#D4AF37]/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Full Review Modal */}
      <Modal
        isOpen={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        title="Alumni Review"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= selectedReview.rating
                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono-num text-xs text-[#F7F1E5]/60">
                {new Date(selectedReview.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <p className="text-base leading-relaxed text-[#F7F1E5] whitespace-pre-line">
              &ldquo;{selectedReview.feedback}&rdquo;
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#F7F1E5]">
                — {selectedReview.name}
              </span>
              <span className="font-mono-num font-medium text-[#D4AF37]">
                {selectedReview.batch}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};
