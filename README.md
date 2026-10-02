# HNDE Labuduwa Alumni Association — Event 2026 Platform

Official full-stack web application for the **HNDE Labuduwa Alumni Association — Alumni Get-Together & Professional Networking Event 2026** (Sunday, 01 November 2026 · Ramadia Ranmal Holiday Resort, Moratuwa).

Built to collect alumni ratings, structured feedback across all 11 batches (`Batch 01` – `Batch 11`), and event photographs uploaded securely to Google Drive.

---

## Features

1. **Interactive Two-Step Alumni Rating & Feedback Flow**
   - Step 1: Interactive 1–5 Star Rating selector with immediate confirmation.
   - Step 2: Smoothly revealed feedback form (`Name`, `Batch 01`–`Batch 11`, private `Card` identifier, `Feedback`, and `How can we improve?`).
   - Anti-spam honeypot protection, server-side rate limiting, duplicate submission prevention, and strict input sanitization.
2. **Dynamic Live Reviews & Rating Distribution**
   - Real-time calculation of average rating and 5★–1★ distribution bars from the PostgreSQL database.
   - Privacy-first public reviews: the alumnus `Card` identifier is stored securely in PostgreSQL for organizer verification and is **never** exposed in public API responses or UI cards.
   - Dedicated `/reviews` page with keyword search, batch filter, star rating filter, newest/oldest sorting, pagination, and full-review modal.
3. **Server-Side Google Drive Photo Upload System (`POST /api/upload`)**
   - Drag & drop multi-photo uploader supporting `JPG`, `JPEG`, `PNG`, and `WEBP` up to `10 MB` per image.
   - Secure server-side upload to Google Drive folder `1yQX_ibiOROfgiW10fDdYNguvHLD_x6Q5` via Google Service Account credentials (`GOOGLE_CLIENT_EMAIL` & `GOOGLE_PRIVATE_KEY`).
4. **Protected Organizer Admin Dashboard (`/admin`)**
   - Secured by Firebase Authentication (Google Sign-In) with backend Bearer ID token verification.
   - Displays KPIs, Rating Distribution chart, Reviews by Batch chart, Reviews Over Time chart, private `Card` & `Improvement` fields, review deletion, and one-click **CSV Export**.

---

## Google Drive Setup Instructions

To enable live photo uploads into the destination Google Drive folder (`https://drive.google.com/drive/folders/1yQX_ibiOROfgiW10fDdYNguvHLD_x6Q5`):

1. **Create a Google Cloud Project**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. **Enable the Google Drive API**
   - Navigate to **APIs & Services → Library**, search for **Google Drive API**, and click **Enable**.
3. **Create a Service Account**
   - Navigate to **IAM & Admin → Service Accounts** and click **Create Service Account**.
   - Give it a name (e.g., `hnde-alumni-photo-uploader`) and complete creation.
4. **Generate Service Account Credentials (JSON Key)**
   - Click on the newly created service account → **Keys** tab → **Add Key → Create new key → JSON**.
   - Download the JSON key file. Inside it, locate `client_email` and `private_key`.
5. **Share the Google Drive Folder with the Service Account**
   - Open the destination Google Drive folder: `https://drive.google.com/drive/folders/1yQX_ibiOROfgiW10fDdYNguvHLD_x6Q5`
   - Click **Share** and paste the `client_email` from your service account JSON file.
   - Grant **Editor** permission so the service account can upload files into the folder.
6. **Configure Environment Variables**
   - Set the following variables in your environment:
     ```env
     GOOGLE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
     GOOGLE_DRIVE_FOLDER_ID="1yQX_ibiOROfgiW10fDdYNguvHLD_x6Q5"
     ```

---

## Local Development & Deployment

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server on port 3000
npm run dev

# 3. Type-check and build production bundle
npm run lint
npm run build
```
