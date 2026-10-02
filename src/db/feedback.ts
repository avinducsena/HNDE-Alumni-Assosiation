import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { feedback, uploadedPhotos } from './schema.ts';

export const VALID_BATCHES = [
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

export interface CreateFeedbackInput {
  name: string;
  batch: string;
  card: string;
  rating: number;
  feedback: string;
  improvement: string;
}

export interface PublicReview {
  id: string;
  name: string;
  batch: string;
  rating: number;
  feedback: string;
  createdAt: Date;
}

export interface AdminReview extends PublicReview {
  card: string;
  improvement: string;
}

export async function createFeedbackEntry(input: CreateFeedbackInput) {
  try {
    const inserted = await db
      .insert(feedback)
      .values({
        name: input.name,
        batch: input.batch,
        card: input.card,
        rating: input.rating,
        feedback: input.feedback,
        improvement: input.improvement,
      })
      .returning();

    const row = inserted[0];
    return {
      id: row.id,
      name: row.name,
      batch: row.batch,
      rating: row.rating,
      feedback: row.feedback,
      createdAt: row.createdAt,
    };
  } catch (error) {
    console.error('Database insert feedback failed:', error);
    throw new Error('Unable to save feedback at this time. Please try again later.', {
      cause: error,
    });
  }
}

export async function getAllFeedbackRaw(): Promise<AdminReview[]> {
  try {
    const rows = await db
      .select()
      .from(feedback)
      .orderBy(desc(feedback.createdAt));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      batch: r.batch,
      card: r.card,
      rating: r.rating,
      feedback: r.feedback,
      improvement: r.improvement,
      createdAt: r.createdAt,
    }));
  } catch (error) {
    console.error('Database fetch feedback failed:', error);
    throw new Error('Unable to load reviews from database.', { cause: error });
  }
}

export async function getPublicReviews(options: {
  search?: string;
  batch?: string;
  rating?: number;
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}) {
  try {
    const all = await getAllFeedbackRaw();

    // NEVER expose `card` or internal fields publicly
    let filtered: PublicReview[] = all.map((item) => ({
      id: item.id,
      name: item.name,
      batch: item.batch,
      rating: item.rating,
      feedback: item.feedback,
      createdAt: item.createdAt,
    }));

    if (options.batch && options.batch !== 'all') {
      filtered = filtered.filter((r) => r.batch === options.batch);
    }

    if (options.rating && options.rating >= 1 && options.rating <= 5) {
      filtered = filtered.filter((r) => r.rating === options.rating);
    }

    if (options.search && options.search.trim() !== '') {
      const q = options.search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.batch.toLowerCase().includes(q) ||
          r.feedback.toLowerCase().includes(q)
      );
    }

    if (options.sort === 'oldest') {
      filtered.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const total = filtered.length;
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(50, options.limit || 10));
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      reviews: paginated,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (error) {
    console.error('Database getPublicReviews failed:', error);
    throw new Error('Failed to retrieve public reviews.', { cause: error });
  }
}

export async function getReviewStats() {
  try {
    const all = await getAllFeedbackRaw();
    const totalReviews = all.length;

    const counts: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    const batchCounts: Record<string, number> = {};
    for (const b of VALID_BATCHES) {
      batchCounts[b] = 0;
    }

    let sumRatings = 0;
    for (const item of all) {
      const r = Math.min(5, Math.max(1, item.rating));
      counts[r] = (counts[r] || 0) + 1;
      sumRatings += r;
      if (batchCounts[item.batch] !== undefined) {
        batchCounts[item.batch] += 1;
      } else {
        batchCounts[item.batch] = 1;
      }
    }

    const averageRating =
      totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star] || 0;
      const percentage =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return {
        star,
        count,
        percentage,
      };
    });

    return {
      totalReviews,
      averageRating,
      distribution,
      batchCounts,
    };
  } catch (error) {
    console.error('Database getReviewStats failed:', error);
    throw new Error('Failed to calculate review statistics.', { cause: error });
  }
}

export async function deleteFeedbackById(id: string) {
  try {
    const deleted = await db
      .delete(feedback)
      .where(eq(feedback.id, id))
      .returning();
    return deleted[0] || null;
  } catch (error) {
    console.error('Database deleteFeedbackById failed:', error);
    throw new Error('Failed to delete review.', { cause: error });
  }
}

export async function recordUploadedPhoto(input: {
  fileName: string;
  mimeType: string;
  fileSize: number;
  driveFileId: string;
  uploaderName?: string;
  uploaderBatch?: string;
}) {
  try {
    const inserted = await db
      .insert(uploadedPhotos)
      .values({
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        driveFileId: input.driveFileId,
        uploaderName: input.uploaderName || null,
        uploaderBatch: input.uploaderBatch || null,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.error('Database recordUploadedPhoto failed:', error);
    throw new Error('Failed to log uploaded photo metadata.', { cause: error });
  }
}
