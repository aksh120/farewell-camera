export const APP_NAME = "Disposable";
export const APP_DESCRIPTION = "A vintage camera experience in your browser";

export const IMAGE_SETTINGS = {
  maxWidth: 1920,
  maxHeight: 1920,
  maxSizeMB: 0.5,
  quality: 0.8,
  thumbnailWidth: 400,
  thumbnailHeight: 400,
} as const;

export const CAMERA_SETTINGS = {
  defaultFacingMode: "environment" as const,
  videoConstraints: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: "environment",
  },
} as const;

export const SUPABASE_SETTINGS = {
  storageBucket: "photos",
  tableName: "photos",
} as const;

export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  shutterFlash: 300,
} as const;
