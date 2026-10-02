/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RatingSelector } from './components/RatingSelector';
import { FeedbackForm } from './components/FeedbackForm';
import { SuccessMessage } from './components/SuccessMessage';
import { PhotoUploader } from './components/PhotoUploader';
import { RecentReviews } from './components/RecentReviews';
import { AboutAssociation } from './components/AboutAssociation';
import { BatchTimeline } from './components/BatchTimeline';
import { EventDetails } from './components/EventDetails';
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';
import { AdminDashboard } from './components/AdminDashboard';
import { ReviewsPage } from './pages/ReviewsPage';
import {
  PublicReviewItem,
  ReviewStats,
  SubmittedFeedbackSummary,
  ToastMessage,
} from './types/alumni';

export default function App() {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [submittedSummary, setSubmittedSummary] =
    useState<SubmittedFeedbackSummary | null>(null);

  const [reviews, setReviews] = useState<PublicReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    distribution: [
      { star: 5, count: 0, percentage: 0 },
      { star: 4, count: 0, percentage: 0 },
      { star: 3, count: 0, percentage: 0 },
      { star: 2, count: 0, percentage: 0 },
      { star: 1, count: 0, percentage: 0 },
    ],
    batchCounts: {},
  });
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, message: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchCommunityData = useCallback(async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch('/api/reviews?limit=9&sort=newest'),
        fetch('/api/reviews/stats'),
      ]);

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error loading community reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#111111] text-[#F7F1E5]">
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <main className="flex-1">
                  {/* 1. Hero Section */}
                  <Hero
                    onRateClick={() => scrollToId('rate-association')}
                    onShareExperienceClick={() => scrollToId('rate-association')}
                    averageRating={stats.averageRating}
                    totalReviews={stats.totalReviews}
                  />

                  {/* 2. Live Association Rating & Step-by-Step Feedback Flow */}
                  <section
                    id="rate-association"
                    className="py-20 sm:py-28 border-b border-white/10 bg-gradient-to-b from-[#171112] via-[#120E0E] to-[#111111]"
                  >
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                      {!submittedSummary ? (
                        <>
                          <RatingSelector
                            selectedRating={selectedRating}
                            onSelectRating={(star) => setSelectedRating(star)}
                          />

                          {/* Step 2: Smoothly reveal Feedback Form after Star Rating is selected */}
                          {selectedRating > 0 && (
                            <div className="transition-all duration-300 ease-out">
                              <FeedbackForm
                                rating={selectedRating}
                                onSuccess={(summary) => {
                                  setSubmittedSummary(summary);
                                  addToast(
                                    'success',
                                    'Feedback Recorded',
                                    `Thank you, ${summary.name}! Your rating and feedback have been saved.`
                                  );
                                  fetchCommunityData();
                                }}
                                onError={(msg) =>
                                  addToast('error', 'Submission Error', msg)
                                }
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-12">
                          <SuccessMessage
                            summary={submittedSummary}
                            onReset={() => {
                              setSubmittedSummary(null);
                              setSelectedRating(0);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* 3. Live Review / Rating Summary & Latest Alumni Reviews */}
                  <RecentReviews
                    reviews={reviews}
                    stats={stats}
                    loading={loadingReviews}
                    onRateNowClick={() => scrollToId('rate-association')}
                  />

                  {/* 4. About HNDE Labuduwa Section */}
                  <AboutAssociation />

                  {/* 5. About Association & 11 Batches Timeline */}
                  <BatchTimeline batchCounts={stats.batchCounts} />

                  {/* 6. Event Information & Ticket Showcase */}
                  <EventDetails />

                  {/* 7. Share Event Memories (Photo Upload System) */}
                  <section
                    id="share-memories"
                    className="py-20 sm:py-28 bg-gradient-to-b from-[#111111] to-[#171112]"
                  >
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                      <PhotoUploader
                        uploaderName={submittedSummary?.name}
                        uploaderBatch={submittedSummary?.batch}
                        onUploadSuccess={(count) =>
                          addToast(
                            'success',
                            'Photos Uploaded Successfully',
                            `${count} ${
                              count === 1 ? 'photo' : 'photos'
                            } uploaded to the HNDE Labuduwa Google Drive archive.`
                          )
                        }
                        onUploadError={(msg) =>
                          addToast('error', 'Photo Upload Notice', msg)
                        }
                      />
                    </div>
                  </section>
                </main>
              }
            />

            <Route
              path="/reviews"
              element={<ReviewsPage stats={stats} />}
            />

            <Route
              path="/admin"
              element={
                <AdminDashboard
                  onNotify={addToast}
                  onDataChanged={fetchCommunityData}
                />
              }
            />
          </Routes>

          <Footer
            onSocialPlaceholderClick={(platform) =>
              addToast(
                'info',
                `${platform} Channel`,
                `Set VITE_SOCIAL_${platform.toUpperCase()}_URL in your environment variables to link the official ${platform} page.`
              )
            }
          />

          <ToastNotification toasts={toasts} onDismiss={dismissToast} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
