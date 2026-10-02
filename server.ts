import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { google } from 'googleapis';
import { Readable } from 'stream';
import path from 'path';
import * as dotenv from 'dotenv';
import {
  VALID_BATCHES,
  createFeedbackEntry,
  deleteFeedbackById,
  getAllFeedbackRaw,
  getPublicReviews,
  getReviewStats,
  recordUploadedPhoto,
} from './src/db/feedback.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';

dotenv.config();

const PORT = 3000;
const DEFAULT_DRIVE_FOLDER_ID = '1yQX_ibiOROfgiW10fDdYNguvHLD_x6Q5';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const FORBIDDEN_EXTENSIONS = [
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.php',
  '.pl',
  '.py',
  '.js',
  '.jsp',
  '.asp',
  '.aspx',
  '.html',
  '.htm',
  '.svg',
];

// Simple in-memory rate limiter and duplicate submission guard
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();
const recentSubmissions = new Map<string, number>();

function checkRateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = ipRateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
    .slice(0, maxLength);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 10,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const lowerName = file.originalname.toLowerCase();

    if (FORBIDDEN_EXTENSIONS.some((bad) => lowerName.includes(bad))) {
      return cb(new Error(`Security Policy: File "${file.originalname}" contains a prohibited extension.`));
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase()) || !ALLOWED_EXTENSIONS.has(ext)) {
      return cb(
        new Error(
          `Invalid file format for "${file.originalname}". Only JPG, JPEG, PNG, and WEBP images are allowed.`
        )
      );
    }

    cb(null, true);
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Security headers
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // ---------------------------------------------------------------------------
  // POST /api/feedback - Submit rating & alumni feedback
  // ---------------------------------------------------------------------------
  app.post('/api/feedback', async (req: Request, res: Response) => {
    try {
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        'unknown';

      // Anti-spam honeypot check
      if (req.body?.website || req.body?.honeypot) {
        return res.status(400).json({ error: 'Spam submission detected.' });
      }

      if (!checkRateLimit(`feedback:${clientIp}`, 12, 15 * 60 * 1000)) {
        return res.status(429).json({
          error: 'Too many submissions from your connection. Please wait a few minutes and try again.',
        });
      }

      const rawName = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
      const rawBatch = typeof req.body?.batch === 'string' ? req.body.batch.trim() : '';
      const rawCard = typeof req.body?.card === 'string' ? req.body.card.trim() : '';
      const rawRating = Number(req.body?.rating);
      const rawFeedback = typeof req.body?.feedback === 'string' ? req.body.feedback.trim() : '';
      const rawImprovement =
        typeof req.body?.improvement === 'string' ? req.body.improvement.trim() : '';

      if (!rawName || rawName.length < 2 || rawName.length > 120) {
        return res.status(400).json({ error: 'Please enter your full name (2–120 characters).' });
      }

      if (!VALID_BATCHES.includes(rawBatch as (typeof VALID_BATCHES)[number])) {
        return res.status(400).json({
          error: 'Please select a valid HNDE Labuduwa batch (Batch 01 through Batch 11).',
        });
      }

      if (!rawCard || rawCard.length < 1 || rawCard.length > 80) {
        return res.status(400).json({
          error: 'Please enter your Alumni Event Card number or identifier.',
        });
      }

      if (!Number.isInteger(rawRating) || rawRating < 1 || rawRating > 5) {
        return res.status(400).json({
          error: 'Please select a valid star rating between 1 and 5.',
        });
      }

      if (!rawFeedback || rawFeedback.length < 5 || rawFeedback.length > 2000) {
        return res.status(400).json({
          error: 'Please share your feedback (between 5 and 2000 characters).',
        });
      }

      if (!rawImprovement || rawImprovement.length < 3 || rawImprovement.length > 2000) {
        return res.status(400).json({
          error: 'Please share your suggestions on how we can improve (at least 3 characters).',
        });
      }

      // Duplicate submission check (within 2 minutes)
      const dedupeKey = `${rawName.toLowerCase()}|${rawBatch}|${rawCard.toLowerCase()}|${rawFeedback
        .slice(0, 50)
        .toLowerCase()}`;
      const lastSubmittedAt = recentSubmissions.get(dedupeKey);
      if (lastSubmittedAt && Date.now() - lastSubmittedAt < 2 * 60 * 1000) {
        return res.status(409).json({
          error: 'Your feedback was already submitted moments ago. Thank you!',
        });
      }

      const created = await createFeedbackEntry({
        name: sanitizeText(rawName, 120),
        batch: rawBatch,
        card: sanitizeText(rawCard, 80),
        rating: rawRating,
        feedback: sanitizeText(rawFeedback, 2000),
        improvement: sanitizeText(rawImprovement, 2000),
      });

      recentSubmissions.set(dedupeKey, Date.now());

      return res.status(201).json({
        success: true,
        review: created,
      });
    } catch (error: any) {
      console.error('POST /api/feedback error:', error);
      return res.status(500).json({
        error: error.message || 'An unexpected error occurred while saving your feedback.',
      });
    }
  });

  // ---------------------------------------------------------------------------
  // GET /api/reviews - Public alumni reviews (NEVER exposes card or improvement)
  // ---------------------------------------------------------------------------
  app.get('/api/reviews', async (req: Request, res: Response) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : '';
      const batch = typeof req.query.batch === 'string' ? req.query.batch : 'all';
      const rating = req.query.rating ? Number(req.query.rating) : undefined;
      const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await getPublicReviews({
        search,
        batch,
        rating,
        sort,
        page,
        limit,
      });

      return res.json(result);
    } catch (error: any) {
      console.error('GET /api/reviews error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to load alumni reviews.',
      });
    }
  });

  // ---------------------------------------------------------------------------
  // GET /api/reviews/stats - Dynamic rating summary & distribution
  // ---------------------------------------------------------------------------
  app.get('/api/reviews/stats', async (_req: Request, res: Response) => {
    try {
      const stats = await getReviewStats();
      return res.json(stats);
    } catch (error: any) {
      console.error('GET /api/reviews/stats error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to load rating statistics.',
      });
    }
  });

  // ---------------------------------------------------------------------------
  // POST /api/upload - Server-side Google Drive photo upload
  // ---------------------------------------------------------------------------
  app.post('/api/upload', (req: Request, res: Response) => {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';

    if (!checkRateLimit(`upload:${clientIp}`, 15, 15 * 60 * 1000)) {
      return res.status(429).json({
        error: 'Upload rate limit reached. Please wait a few minutes before uploading more photos.',
      });
    }

    const uploadHandler = upload.array('photos', 10);
    uploadHandler(req, res, async (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              error: 'One or more files exceed the 10 MB maximum file size limit.',
            });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
              error: 'You can upload up to 10 photos at a time.',
            });
          }
        }
        return res.status(400).json({
          error: err.message || 'Invalid file upload request.',
        });
      }

      try {
        const files = req.files as Express.Multer.File[] | undefined;
        if (!files || files.length === 0) {
          return res.status(400).json({
            error: 'Please select at least one event photo (JPG, PNG, or WEBP) to upload.',
          });
        }

        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
        const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY?.trim();
        const folderId =
          process.env.GOOGLE_DRIVE_FOLDER_ID?.trim() || DEFAULT_DRIVE_FOLDER_ID;

        if (
          !clientEmail ||
          !rawPrivateKey ||
          clientEmail === 'MY_GOOGLE_CLIENT_EMAIL' ||
          rawPrivateKey === 'MY_GOOGLE_PRIVATE_KEY'
        ) {
          return res.status(503).json({
            error:
              'Google Drive API service account credentials (GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY) are not configured on the server.',
            code: 'DRIVE_NOT_CONFIGURED',
            setupRequired: true,
            folderId,
            message: `To activate direct server-side uploads to Google Drive folder (${folderId}), add GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in environment variables and share the Drive folder with the service account email.`,
          });
        }

        const formattedPrivateKey = rawPrivateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.JWT({
          email: clientEmail,
          key: formattedPrivateKey,
          scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });

        const uploaderName =
          typeof req.body?.uploaderName === 'string'
            ? sanitizeText(req.body.uploaderName, 100)
            : undefined;
        const uploaderBatch =
          typeof req.body?.uploaderBatch === 'string'
            ? sanitizeText(req.body.uploaderBatch, 30)
            : undefined;

        const uploadedResults: Array<{ id: string; name: string }> = [];

        for (const file of files) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          const prefix = uploaderBatch ? `${uploaderBatch.replace(/\s+/g, '')}_` : 'HNDE2026_';
          const driveFileName = `${prefix}${timestamp}_${safeOriginalName}`;

          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);

          const driveResponse = await drive.files.create({
            requestBody: {
              name: driveFileName,
              parents: [folderId],
              description: `HNDE Labuduwa Alumni Get-Together 2026 Photo${
                uploaderName ? ` uploaded by ${uploaderName}` : ''
              }${uploaderBatch ? ` (${uploaderBatch})` : ''}`,
            },
            media: {
              mimeType: file.mimetype,
              body: bufferStream,
            },
            fields: 'id, name',
            supportsAllDrives: true,
          });

          const fileId = driveResponse.data.id || 'unknown';
          uploadedResults.push({
            id: fileId,
            name: driveResponse.data.name || driveFileName,
          });

          await recordUploadedPhoto({
            fileName: driveFileName,
            mimeType: file.mimetype,
            fileSize: file.size,
            driveFileId: fileId,
            uploaderName,
            uploaderBatch,
          });
        }

        return res.status(200).json({
          success: true,
          uploadedCount: uploadedResults.length,
          files: uploadedResults,
          folderId,
        });
      } catch (uploadError: any) {
        console.error('Google Drive upload failed:', uploadError);
        return res.status(500).json({
          error:
            'Upload failed. Please verify that the Google Drive folder is shared with the configured service account email and try again.',
        });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // ADMIN API ROUTES (Protected by Firebase Authentication)
  // ---------------------------------------------------------------------------
  app.get('/api/admin/reviews', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.uid) {
        await getOrCreateUser(req.user.uid, req.user.email || 'admin@hndelabuduwa.lk');
      }

      const [reviews, stats] = await Promise.all([
        getAllFeedbackRaw(),
        getReviewStats(),
      ]);

      // Group reviews over time (by YYYY-MM-DD)
      const dateMap: Record<string, number> = {};
      for (const item of reviews) {
        const d = new Date(item.createdAt).toISOString().split('T')[0];
        dateMap[d] = (dateMap[d] || 0) + 1;
      }
      const reviewsOverTime = Object.entries(dateMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));

      return res.json({
        reviews,
        stats,
        reviewsOverTime,
      });
    } catch (error: any) {
      console.error('GET /api/admin/reviews error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to load admin dashboard data.',
      });
    }
  });

  app.delete('/api/admin/reviews/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid review ID format.' });
      }

      const deleted = await deleteFeedbackById(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Review not found.' });
      }

      return res.json({ success: true, deletedId: id });
    } catch (error: any) {
      console.error('DELETE /api/admin/reviews/:id error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to delete review.',
      });
    }
  });

  app.get('/api/admin/export', requireAuth, async (_req: AuthRequest, res: Response) => {
    try {
      const reviews = await getAllFeedbackRaw();

      const escapeCsv = (val: string | number) => {
        const str = String(val ?? '');
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const headers = [
        'ID',
        'Name',
        'Batch',
        'Card',
        'Rating',
        'Feedback',
        'How Can We Improve',
        'Created At',
      ];

      const rows = reviews.map((r) =>
        [
          escapeCsv(r.id),
          escapeCsv(r.name),
          escapeCsv(r.batch),
          escapeCsv(r.card),
          escapeCsv(r.rating),
          escapeCsv(r.feedback),
          escapeCsv(r.improvement),
          escapeCsv(new Date(r.createdAt).toISOString()),
        ].join(',')
      );

      const csvContent = [headers.join(','), ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="hnde-labuduwa-alumni-reviews-2026.csv"'
      );
      return res.status(200).send(csvContent);
    } catch (error: any) {
      console.error('GET /api/admin/export error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to export reviews CSV.',
      });
    }
  });

  // ---------------------------------------------------------------------------
  // Vite Middleware (Development) or Static Asset Serving (Production)
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HNDE Labuduwa Alumni Association server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
