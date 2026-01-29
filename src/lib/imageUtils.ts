import imageCompression from "browser-image-compression";
import { IMAGE_SETTINGS } from "./constants";
import type { PhotoMetadata } from "@/types";

export async function compressImage(file: File | Blob): Promise<Blob> {
  const options = {
    maxSizeMB: IMAGE_SETTINGS.maxSizeMB,
    maxWidthOrHeight: Math.max(
      IMAGE_SETTINGS.maxWidth,
      IMAGE_SETTINGS.maxHeight,
    ),
    useWebWorker: true,
    fileType: "image/jpeg",
  };

  try {
    const imageFile =
      file instanceof File
        ? file
        : new File([file], "photo.jpg", { type: "image/jpeg" });

    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);

    return file;
  }
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number = IMAGE_SETTINGS.quality,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

export async function getImageDimensions(
  blob: Blob,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

export function getPhotoMetadata(width: number, height: number): PhotoMetadata {
  let orientation: "portrait" | "landscape" | "square";

  if (width > height) {
    orientation = "landscape";
  } else if (height > width) {
    orientation = "portrait";
  } else {
    orientation = "square";
  }

  const deviceInfo =
    typeof navigator !== "undefined"
      ? `${navigator.userAgent.slice(0, 100)}`
      : undefined;

  return {
    width,
    height,
    orientation,
    deviceInfo,
  };
}

export function generateFileName(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `photo_${timestamp}_${random}.jpg`;
}

export async function createThumbnail(blob: Blob): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      const maxSize = IMAGE_SETTINGS.thumbnailWidth;
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (thumbnailBlob) => resolve(thumbnailBlob),
        "image/jpeg",
        0.7,
      );

      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(blob);
  });
}

export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (error) {
    console.error("Download failed:", error);
    window.open(url, "_blank");
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
