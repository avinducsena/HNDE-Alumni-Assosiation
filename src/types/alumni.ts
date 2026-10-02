export const BATCH_OPTIONS = [
  'Batch 01',
  'Batch 02',
  'Batch 03',
  'Batch 04',
  'Batch 05',
  'Batch 06',
  'Batch 07',
  'Batch 08',
  'Batch 09',
  'Batch 10',
  'Batch 11',
] as const;

export type BatchOption = (typeof BATCH_OPTIONS)[number];

export interface PublicReviewItem {
  id: string;
  name: string;
  batch: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface AdminReviewItem extends PublicReviewItem {
  card: string;
  improvement: string;
}

export interface RatingDistributionItem {
  star: number;
  count: number;
  percentage: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: RatingDistributionItem[];
  batchCounts: Record<string, number>;
}

export interface SubmittedFeedbackSummary {
  name: string;
  batch: string;
  rating: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
