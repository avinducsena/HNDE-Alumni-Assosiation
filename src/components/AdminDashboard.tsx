import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield,
  LogOut,
  Download,
  Trash2,
  Search,
  Star,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  AdminReviewItem,
  BATCH_OPTIONS,
  ReviewStats,
} from '../types/alumni';
import { LoadingSpinner } from './LoadingSpinner';
import { Modal } from './Modal';

interface AdminDashboardProps {
  onNotify: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  onDataChanged?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNotify,
  onDataChanged,
}) => {
  const { user, loading: authLoading, signInWithGoogle, logout, getFreshToken } = useAuth();

  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    distribution: [],
    batchCounts: {},
  });
  const [reviewsOverTime, setReviewsOverTime] = useState<
    Array<{ date: string; count: number }>
  >([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const [deleteTarget, setDeleteTarget] = useState<AdminReviewItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    setDataError(null);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error('Authentication session expired. Please sign in again.');

      const res = await fetch('/api/admin/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load admin analytics.');
      }

      setReviews(data.reviews || []);
      setStats(
        data.stats || {
          totalReviews: 0,
          averageRating: 0,
          distribution: [],
          batchCounts: {},
        }
      );
      setReviewsOverTime(data.reviewsOverTime || []);
    } catch (err: any) {
      setDataError(err.message || 'Unable to load admin dashboard data.');
    } finally {
      setLoadingData(false);
    }
  }, [user, getFreshToken]);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user, loadAdminData]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      const token = await getFreshToken();
      const res = await fetch(`/api/admin/reviews/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete review.');
      }

      onNotify('success', 'Review Deleted', `Removed review from ${deleteTarget.name}.`);
      setDeleteTarget(null);
      await loadAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      onNotify('error', 'Delete Failed', err.message || 'Could not delete review.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const token = await getFreshToken();
      const res = await fetch('/api/admin/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to export CSV.');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hnde-labuduwa-alumni-reviews-2026.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onNotify(
        'success',
        'CSV Export Complete',
        'Downloaded hnde-labuduwa-alumni-reviews-2026.csv.'
      );
    } catch (err: any) {
      onNotify('error', 'Export Failed', err.message || 'Unable to export CSV.');
    } finally {
      setExporting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center bg-[#111111]">
        <LoadingSpinner size="lg" label="Verifying organizer session..." />
      </main>
    );
  }

  // Protected Gate: Require Firebase Google Authentication
  if (!user) {
    return (
      <main className="min-h-[82vh] flex items-center justify-center bg-[#111111] px-4 py-16">
        <div className="w-full max-w-md rounded-2xl bg-[#161212] border border-[#D4AF37]/40 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#8B0000]/30 border border-[#D4AF37]/50 text-[#D4AF37]">
            <Shield className="h-7 w-7" />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            Protected Organizer Portal
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-[#F7F1E5]">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-sm text-[#F7F1E5]/75 leading-relaxed">
            Sign in with your authorized Google account to inspect alumni feedback, view private Card identifiers, analyze batch participation charts, and export CSV reports.
          </p>

          <button
            type="button"
            onClick={async () => {
              try {
                await signInWithGoogle();
                onNotify('success', 'Signed In', 'Welcome to the HNDE Labuduwa Admin Dashboard.');
              } catch {
                // Handled in AuthContext
              }
            }}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#8B0000] via-[#B11226] to-[#8B0000] py-3.5 px-6 text-sm font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      </main>
    );
  }

  // Filtered reviews for Admin Table
  const filteredReviews = reviews.filter((r) => {
    if (batchFilter !== 'all' && r.batch !== batchFilter) return false;
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCard = r.card.toLowerCase().includes(q);
      const matchFeedback = r.feedback.toLowerCase().includes(q);
      const matchImprovement = r.improvement.toLowerCase().includes(q);
      if (!matchName && !matchCard && !matchFeedback && !matchImprovement) return false;
    }
    return true;
  });

  const getStarCount = (star: number) =>
    stats.distribution.find((d) => d.star === star)?.count || 0;

  const maxBatchCount = Math.max(
    1,
    ...BATCH_OPTIONS.map((b) => stats.batchCounts[b] || 0)
  );
  const maxDateCount = Math.max(1, ...reviewsOverTime.map((d) => d.count));

  return (
    <main className="min-h-screen bg-[#111111] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              HNDE Labuduwa Alumni Association · Organizer Console
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#F7F1E5]">
              Admin Analytics &amp; Feedback Management
            </h1>
            <p className="mt-1 text-xs text-[#F7F1E5]/65">
              Authenticated as <span className="text-[#D4AF37]">{user.email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadAdminData}
              disabled={loadingData}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-[#F7F1E5] border border-white/15 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B11226] px-4 py-2.5 text-xs font-semibold text-[#F7F1E5] border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-medium text-[#F7F1E5]/80 border border-white/15 transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {dataError && (
          <div className="rounded-xl bg-[#260D10] border border-[#ef4444]/60 p-4 text-sm text-[#ef4444]">
            {dataError}
          </div>
        )}

        {/* KPI Summary Strip: Total Reviews, Average Rating, 5★ to 1★ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="rounded-2xl bg-[#161212] border border-[#D4AF37]/35 p-4">
            <span className="text-[11px] uppercase tracking-wider text-[#F7F1E5]/60">
              Total Reviews
            </span>
            <p className="mt-1 font-mono-num text-2xl sm:text-3xl font-bold text-[#F7F1E5]">
              {stats.totalReviews}
            </p>
          </div>

          <div className="rounded-2xl bg-[#161212] border border-[#D4AF37]/35 p-4">
            <span className="text-[11px] uppercase tracking-wider text-[#F7F1E5]/60">
              Average Rating
            </span>
            <p className="mt-1 font-mono-num text-2xl sm:text-3xl font-bold text-[#D4AF37]">
              {stats.averageRating.toFixed(1)} <span className="text-sm text-[#F7F1E5]/50">/ 5</span>
            </p>
          </div>

          {[5, 4, 3, 2, 1].map((star) => (
            <div
              key={star}
              className="rounded-2xl bg-[#161212] border border-white/10 p-4"
            >
              <span className="text-[11px] uppercase tracking-wider text-[#F7F1E5]/60">
                {star} Star
              </span>
              <p className="mt-1 font-mono-num text-2xl font-bold text-[#F7F1E5]">
                {getStarCount(star)}
              </p>
            </div>
          ))}
        </div>

        {/* 3 Visual Charts: Rating Distribution, Reviews by Batch, Reviews Over Time */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Rating Distribution */}
          <div className="rounded-2xl bg-[#161212] border border-white/10 p-6">
            <h2 className="font-display text-xl font-bold text-[#F7F1E5]">
              Rating Distribution
            </h2>
            <p className="text-xs text-[#F7F1E5]/60 mt-0.5 mb-5">
              Share of alumni ratings from 5★ down to 1★
            </p>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const dist = stats.distribution.find((d) => d.star === star) || {
                  star,
                  count: 0,
                  percentage: 0,
                };
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="font-mono-num w-12 text-[#D4AF37] font-semibold">
                      {star} ★
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8B0000] to-[#D4AF37]"
                        style={{ width: `${Math.max(dist.percentage, dist.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                    <span className="font-mono-num w-16 text-right text-[#F7F1E5]/80">
                      {dist.count} ({dist.percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Reviews by Batch (Batch 01 - Batch 11) */}
          <div className="rounded-2xl bg-[#161212] border border-white/10 p-6">
            <h2 className="font-display text-xl font-bold text-[#F7F1E5]">
              Reviews by Batch
            </h2>
            <p className="text-xs text-[#F7F1E5]/60 mt-0.5 mb-5">
              Participation across all 11 HNDE Labuduwa batches
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {BATCH_OPTIONS.map((batch) => {
                const count = stats.batchCounts[batch] || 0;
                const widthPct = Math.round((count / maxBatchCount) * 100);
                return (
                  <div key={batch} className="flex items-center gap-3 text-xs">
                    <span className="font-mono-num w-20 text-[#F7F1E5]/85 shrink-0">
                      {batch}
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#B11226]"
                        style={{ width: `${count > 0 ? Math.max(widthPct, 6) : 0}%` }}
                      />
                    </div>
                    <span className="font-mono-num w-8 text-right font-semibold text-[#D4AF37]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Reviews Over Time */}
          <div className="rounded-2xl bg-[#161212] border border-white/10 p-6">
            <h2 className="font-display text-xl font-bold text-[#F7F1E5]">
              Reviews Over Time
            </h2>
            <p className="text-xs text-[#F7F1E5]/60 mt-0.5 mb-5">
              Daily feedback submission volume
            </p>
            {reviewsOverTime.length === 0 ? (
              <p className="text-xs text-[#F7F1E5]/50 py-10 text-center">
                No timeline data recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {reviewsOverTime.map((entry) => {
                  const pct = Math.round((entry.count / maxDateCount) * 100);
                  return (
                    <div key={entry.date} className="flex items-center gap-3 text-xs">
                      <span className="font-mono-num w-24 text-[#F7F1E5]/75 shrink-0">
                        {entry.date}
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#D4AF37]"
                          style={{ width: `${Math.max(pct, 8)}%` }}
                        />
                      </div>
                      <span className="font-mono-num w-8 text-right font-semibold text-[#F7F1E5]">
                        {entry.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Filter & Search Bar for Admin Review Table */}
        <div className="rounded-2xl bg-[#161212] border border-white/10 p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#F7F1E5]">
                Submitted Feedback &amp; Private Verification Records
              </h2>
              <p className="text-xs text-[#F7F1E5]/65">
                Includes confidential Card identifiers and improvement suggestions visible only to organizers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F7F1E5]/45" />
                <input
                  type="text"
                  placeholder="Search name, card, feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl bg-[#111111] pl-9 pr-4 py-2 text-xs sm:text-sm text-[#F7F1E5] border border-white/15 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                aria-label="Filter by Batch"
                className="rounded-xl bg-[#111111] px-3 py-2 text-xs sm:text-sm text-[#F7F1E5] border border-white/15 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="all">All Batches</option>
                {BATCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                aria-label="Filter by Rating"
                className="rounded-xl bg-[#111111] px-3 py-2 text-xs sm:text-sm text-[#F7F1E5] border border-white/15 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Admin Table */}
          {loadingData ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="md" label="Loading feedback records..." />
            </div>
          ) : filteredReviews.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#F7F1E5]/60">
              No matching feedback records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-[11px] uppercase tracking-wider text-[#D4AF37]">
                    <th className="py-3.5 pr-4">Alumni Name</th>
                    <th className="py-3.5 px-4">Batch</th>
                    <th className="py-3.5 px-4">Card (Private)</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Feedback</th>
                    <th className="py-3.5 px-4">How Can We Improve?</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                  {filteredReviews.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] align-top">
                      <td className="py-4 pr-4 font-semibold text-[#F7F1E5] whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 font-mono-num text-[#D4AF37] whitespace-nowrap">
                        {item.batch}
                      </td>
                      <td className="py-4 px-4 font-mono-num text-xs text-[#F7F1E5]/85 whitespace-nowrap">
                        {item.card}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${
                                s <= item.rating
                                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                                  : 'text-white/20'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#F7F1E5]/90 max-w-xs">
                        {item.feedback}
                      </td>
                      <td className="py-4 px-4 text-[#F7F1E5]/80 max-w-xs">
                        {item.improvement}
                      </td>
                      <td className="py-4 px-4 font-mono-num text-xs text-[#F7F1E5]/60 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#B11226]/20 hover:bg-[#B11226] px-2.5 py-1.5 text-xs font-medium text-[#F7F1E5] border border-[#B11226]/50 transition-colors cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Review Deletion"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <p className="text-sm text-[#F7F1E5]/85 leading-relaxed">
              Are you sure you want to permanently remove the feedback submitted by{' '}
              <strong className="text-[#F7F1E5]">{deleteTarget.name}</strong> ({deleteTarget.batch})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-[#F7F1E5] hover:bg-white/15 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-[#B11226] hover:bg-[#8B0000] px-5 py-2.5 text-xs font-semibold text-[#F7F1E5] cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};
