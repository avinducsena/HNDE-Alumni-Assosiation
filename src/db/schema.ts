import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const feedback = pgTable('feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  batch: text('batch').notNull(),
  card: text('card').notNull(),
  rating: integer('rating').notNull(),
  feedback: text('feedback').notNull(),
  improvement: text('improvement').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const uploadedPhotos = pgTable('uploaded_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  driveFileId: text('drive_file_id').notNull(),
   uploaderName: text('uploader_name'),
  uploaderBatch: text('uploader_batch'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
