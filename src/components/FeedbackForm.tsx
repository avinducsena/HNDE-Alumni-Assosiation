import React, { useState } from 'react';
import { BATCH_OPTIONS, SubmittedFeedbackSummary } from '../types/alumni';
import { LoadingSpinner } from './LoadingSpinner';
import { ShieldCheck, Send } from 'lucide-react';

interface FeedbackFormProps {
  rating: number;
  onSuccess: (summary: SubmittedFeedbackSummary) => void;
  onError: (message: string) => void;
}

interface FieldErrors {
  name?: string;
  batch?: string;
  card?: string;
  feedback?: string;
  improvement?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  rating,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [card, setCard] = useState('');
  const [feedback, setFeedback] = useState('');
  const [improvement, setImprovement] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!batch || !BATCH_OPTIONS.includes(batch as any)) {
      nextErrors.batch = 'Please select your HNDE Labuduwa batch (Batch 01 – Batch 11).';
    }
    if (!card.trim()) {
      nextErrors.card = 'Please enter your Event Card / Ticket identifier.';
    }
    if (!feedback.trim() || feedback.trim().length < 5) {
      nextErrors.feedback = 'Please share your experience and feedback (at least 5 characters).';
    }
    if (!improvement.trim() || improvement.trim().length < 3) {
      nextErrors.improvement =
        'Please share at least one suggestion on how the association can improve.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          batch,
          card: card.trim(),
          rating,
          feedback: feedback.trim(),
          improvement: improvement.trim(),
          website: honeypot,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback. Please try again.');
      }

      onSuccess({
        name: name.trim(),
        batch,
        rating,
      });
    } catch (err: any) {
      onError(err.message || 'Could not submit your feedback. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 mx-auto max-w-2xl rounded-2xl bg-[#161212] border border-[#D4AF37]/35 p-6 sm:p-8 shadow-2xl text-left transition-all duration-300"
    >
      <div className="pb-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Step 2 of 2 · Your Feedback
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-[#F7F1E5]">
            Complete Your Alumni Evaluation
          </h3>
        </div>
        <span className="text-xs text-[#F7F1E5]/60">All fields are mandatory</span>
      </div>

      {/* Anti-spam honeypot field (hidden from genuine alumni) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="alumni-website-field">Website</label>
        <input
          id="alumni-website-field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-5">
        {/* 1. Name */}
        <div>
          <label
            htmlFor="feedback-name"
            className="block text-sm font-medium text-[#F7F1E5] mb-1.5"
          >
            Name <span className="text-[#D4AF37]">*</span>
          </label>
          <input
            id="feedback-name"
            type="text"
            required
            maxLength={120}
            placeholder="e.g., Chathuranga Perera"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className={`w-full rounded-xl bg-[#111111] px-4 py-3 text-sm sm:text-base text-[#F7F1E5] placeholder-[#F7F1E5]/35 border transition-colors focus:outline-none ${
              errors.name
                ? 'border-[#ef4444] focus:border-[#ef4444]'
                : 'border-white/15 focus:border-[#D4AF37]'
            }`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-[#ef4444]" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* 2. Batch & 3. Card on responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="feedback-batch"
              className="block text-sm font-medium text-[#F7F1E5] mb-1.5"
            >
              Batch <span className="text-[#D4AF37]">*</span>
            </label>
            <select
              id="feedback-batch"
              required
              value={batch}
              onChange={(e) => {
                setBatch(e.target.value);
                if (errors.batch) setErrors((prev) => ({ ...prev, batch: undefined }));
              }}
              className={`w-full rounded-xl bg-[#111111] px-4 py-3 text-sm sm:text-base text-[#F7F1E5] border transition-colors focus:outline-none ${
                errors.batch
                  ? 'border-[#ef4444] focus:border-[#ef4444]'
                  : 'border-white/15 focus:border-[#D4AF37]'
              }`}
            >
              <option value="" disabled>
                Select your batch
              </option>
              {BATCH_OPTIONS.map((b) => (
                <option key={b} value={b} className="bg-[#111111] text-[#F7F1E5]">
                  {b}
                </option>
              ))}
            </select>
            {errors.batch && (
              <p className="mt-1.5 text-xs text-[#ef4444]" role="alert">
                {errors.batch}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="feedback-card"
              className="block text-sm font-medium text-[#F7F1E5] mb-1.5"
            >
              Card <span className="text-[#D4AF37]">*</span>
              <span className="ml-1.5 text-xs font-normal text-[#F7F1E5]/55">
                (Kept private)
              </span>
            </label>
            <input
              id="feedback-card"
              type="text"
              required
              maxLength={80}
              placeholder="e.g., HNDE-2026-0412 or NIC/Ticket No."
              value={card}
              onChange={(e) => {
                setCard(e.target.value);
                if (errors.card) setErrors((prev) => ({ ...prev, card: undefined }));
              }}
              className={`w-full rounded-xl bg-[#111111] px-4 py-3 text-sm sm:text-base text-[#F7F1E5] placeholder-[#F7F1E5]/35 border transition-colors focus:outline-none ${
                errors.card
                  ? 'border-[#ef4444] focus:border-[#ef4444]'
                  : 'border-white/15 focus:border-[#D4AF37]'
              }`}
            />
            {errors.card && (
              <p className="mt-1.5 text-xs text-[#ef4444]" role="alert">
                {errors.card}
              </p>
            )}
          </div>
        </div>

        {/* 4. Feedback */}
        <div>
          <label
            htmlFor="feedback-message"
            className="block text-sm font-medium text-[#F7F1E5] mb-1.5"
          >
            Feedback <span className="text-[#D4AF37]">*</span>
          </label>
          <textarea
            id="feedback-message"
            rows={4}
            required
            maxLength={2000}
            placeholder="Share your thoughts about the HNDE Labuduwa Alumni Association and the 2026 Get-Together event..."
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              if (errors.feedback) setErrors((prev) => ({ ...prev, feedback: undefined }));
            }}
            className={`w-full rounded-xl bg-[#111111] p-4 text-sm sm:text-base text-[#F7F1E5] placeholder-[#F7F1E5]/35 border transition-colors focus:outline-none ${
              errors.feedback
                ? 'border-[#ef4444] focus:border-[#ef4444]'
                : 'border-white/15 focus:border-[#D4AF37]'
            }`}
          />
          {errors.feedback && (
            <p className="mt-1.5 text-xs text-[#ef4444]" role="alert">
              {errors.feedback}
            </p>
          )}
        </div>

        {/* 5. How can we improve? */}
        <div>
          <label
            htmlFor="feedback-improvement"
            className="block text-sm font-medium text-[#F7F1E5] mb-1.5"
          >
            How can we improve? <span className="text-[#D4AF37]">*</span>
          </label>
          <textarea
            id="feedback-improvement"
            rows={3}
            required
            maxLength={2000}
            placeholder="What initiatives, networking programs, or improvements would you like to see next?"
            value={improvement}
            onChange={(e) => {
              setImprovement(e.target.value);
              if (errors.improvement)
                setErrors((prev) => ({ ...prev, improvement: undefined }));
            }}
            className={`w-full rounded-xl bg-[#111111] p-4 text-sm sm:text-base text-[#F7F1E5] placeholder-[#F7F1E5]/35 border transition-colors focus:outline-none ${
              errors.improvement
                ? 'border-[#ef4444] focus:border-[#ef4444]'
                : 'border-white/15 focus:border-[#D4AF37]'
            }`}
          />
          {errors.improvement && (
            <p className="mt-1.5 text-xs text-[#ef4444]" role="alert">
              {errors.improvement}
            </p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="rounded-xl bg-[#111111]/90 border border-white/10 p-3.5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-[#F7F1E5]/70">
            Your feedback is collected to help strengthen the HNDE Labuduwa Alumni Association and improve future alumni activities. Your Card number is stored securely for verification and will never appear in public reviews.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-[#8B0000] via-[#B11226] to-[#8B0000] py-4 px-6 text-sm sm:text-base font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/60 shadow-lg hover:border-[#D4AF37] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {submitting ? (
            <LoadingSpinner size="sm" label="Submitting your feedback..." />
          ) : (
            <>
              <Send className="h-4 w-4 text-[#D4AF37]" />
              <span>SUBMIT MY FEEDBACK</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
