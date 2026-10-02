import React, { useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface SelectedPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

interface PhotoUploaderProps {
  uploaderName?: string;
  uploaderBatch?: string;
  onUploadSuccess?: (count: number) => void;
  onUploadError?: (msg: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  uploaderName,
  uploaderBatch,
  onUploadSuccess,
  onUploadError,
}) => {
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [setupInfo, setSetupInfo] = useState<{
    message: string;
    folderId: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setErrorMsg(null);
    setSetupInfo(null);
    setUploadedCount(null);

    const newItems: SelectedPhoto[] = [];
    const validationErrors: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        validationErrors.push(`"${file.name}" is not a valid JPG, JPEG, PNG, or WEBP image.`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        validationErrors.push(`"${file.name}" exceeds the 10 MB maximum size limit.`);
        return;
      }

      // Prevent duplicate selection of the exact same file
      const alreadyAdded = photos.some(
        (p) => p.file.name === file.name && p.file.size === file.size
      );
      if (!alreadyAdded) {
        newItems.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    });

    if (validationErrors.length > 0) {
      const combined = validationErrors.join(' ');
      setErrorMsg(combined);
      if (onUploadError) onUploadError(combined);
    }

    if (newItems.length > 0) {
      setPhotos((prev) => [...prev, ...newItems].slice(0, 10));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleUpload = async () => {
    if (uploading || photos.length === 0) return;

    setUploading(true);
    setErrorMsg(null);
    setSetupInfo(null);

    try {
      const formData = new FormData();
      photos.forEach((item) => {
        formData.append('photos', item.file);
      });
      if (uploaderName) formData.append('uploaderName', uploaderName);
      if (uploaderBatch) formData.append('uploaderBatch', uploaderBatch);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'DRIVE_NOT_CONFIGURED') {
          setSetupInfo({
            message:
              data.message ||
              'Google Drive API credentials are not configured in server environment variables.',
            folderId: data.folderId || '1yQX_ibiOROfgiW10fDdYNguvHLD_x6Q5',
          });
          if (onUploadError) {
            onUploadError('Google Drive service account credentials require server configuration.');
          }
          return;
        }
        throw new Error(data.error || 'Upload failed. Please try again.');
      }

      // Clean up object URLs and clear selection
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      const count = data.uploadedCount || photos.length;
      setPhotos([]);
      setUploadedCount(count);
      if (onUploadSuccess) onUploadSuccess(count);
    } catch (err: any) {
      const message = err.message || 'Upload failed. Please try again.';
      setErrorMsg(message);
      if (onUploadError) onUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-[#161212] border border-[#D4AF37]/35 p-6 sm:p-8 shadow-2xl">
      <div className="text-center">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
          Keep The Memories Alive
        </span>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#F7F1E5]">
          Share Your Event Memories
        </h3>
        <p className="mt-2 text-sm sm:text-base text-[#F7F1E5]/75 max-w-xl mx-auto">
          Have a great photo from the HNDE Labuduwa Alumni Event? Share it with the alumni community.
        </p>
      </div>

      {/* Upload Success Banner */}
      {uploadedCount !== null && (
        <div
          className="mt-6 rounded-xl bg-[#112218] border border-emerald-500/40 p-5 text-center"
          role="status"
        >
          <div className="inline-flex items-center justify-center gap-2 text-emerald-400 font-semibold text-base">
            <CheckCircle2 className="h-5 w-5" />
            <span>✓ PHOTOS UPLOADED SUCCESSFULLY</span>
          </div>
          <p className="mt-1.5 text-sm text-[#F7F1E5]/90">
            Thank you for helping us preserve the memories of HNDE Labuduwa.
          </p>
          <p className="mt-1 font-mono-num text-xs font-semibold text-[#D4AF37]">
            {uploadedCount} {uploadedCount === 1 ? 'photo' : 'photos'} uploaded successfully.
          </p>
        </div>
      )}

      {/* Clear Server Setup Notice when Google Drive Service Account is not yet configured */}
      {setupInfo && (
        <div
          className="mt-6 rounded-xl bg-[#22180C] border border-[#D4AF37]/60 p-5 text-left"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs sm:text-sm text-[#F7F1E5]/90">
              <p className="font-semibold text-[#D4AF37]">
                Google Drive Service Account Setup Required
              </p>
              <p>{setupInfo.message}</p>
              <div className="rounded-lg bg-black/50 p-3 font-mono-num text-xs text-[#F7F1E5]/80 space-y-1">
                <p>Target Folder ID: {setupInfo.folderId}</p>
                <p>Required Env Vars: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorMsg && (
        <div
          className="mt-6 rounded-xl bg-[#260D10] border border-[#ef4444]/60 p-4 text-left flex items-start gap-3"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 text-[#ef4444] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#F7F1E5]">
            <p className="font-semibold text-[#ef4444]">Upload failed. Please try again.</p>
            <p className="mt-0.5 text-[#F7F1E5]/80">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-150 ${
          isDragging
            ? 'border-[#D4AF37] bg-[#8B0000]/20'
            : 'border-white/20 hover:border-[#D4AF37]/60 bg-[#111111]/70 hover:bg-[#111111]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#8B0000]/30 border border-[#D4AF37]/40 text-[#D4AF37]">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-xl font-bold tracking-wide text-[#F7F1E5] uppercase">
          UPLOAD EVENT PHOTOS
        </p>
        <p className="mt-1 text-sm text-[#F7F1E5]/75">
          Drag &amp; drop your photos here or choose from your device.
        </p>
        <p className="mt-2 font-mono-num text-xs text-[#F7F1E5]/50">
          Supported formats: JPG · JPEG · PNG · WEBP · Max 10 MB per image
        </p>
      </div>

      {/* Selected Image Thumbnails Preview */}
      {photos.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#F7F1E5]/75">
            <span className="font-medium">
              Selected Photos (<span className="font-mono-num">{photos.length}</span>)
            </span>
            <button
              type="button"
              onClick={() => {
                photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
                setPhotos([]);
              }}
              className="text-[#F7F1E5]/60 hover:text-[#ef4444] transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl bg-[#111111] border border-white/15 aspect-square"
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2">
                  <p className="truncate text-[11px] font-medium text-[#F7F1E5]">
                    {item.file.name}
                  </p>
                  <p className="font-mono-num text-[10px] text-[#D4AF37]">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(item.id);
                  }}
                  className="absolute top-2 right-2 rounded-lg bg-black/80 p-1.5 text-[#F7F1E5] hover:bg-[#B11226] transition-colors cursor-pointer"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full rounded-xl bg-gradient-to-r from-[#8B0000] via-[#B11226] to-[#8B0000] py-4 px-6 text-sm sm:text-base font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/60 shadow-lg hover:border-[#D4AF37] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {uploading ? (
              <LoadingSpinner size="sm" label="Uploading photos to Google Drive..." />
            ) : (
              <>
                <ImageIcon className="h-4 w-4 text-[#D4AF37]" />
                <span>UPLOAD PHOTOS ({photos.length})</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
