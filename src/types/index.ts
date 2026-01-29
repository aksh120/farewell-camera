export interface Photo {
  id: string;
  user_id?: string;
  storage_path: string;
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  orientation?: "portrait" | "landscape" | "square";
  device_info?: string;
  created_at: string;
}

export interface CameraState {
  stream: MediaStream | null;
  facingMode: "user" | "environment";
  hasMultipleCameras: boolean;
  isFlashSupported: boolean;
  isFlashOn: boolean;
  permissionState: "prompt" | "granted" | "denied" | "unsupported";
  error: string | null;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export type PhotoAction = "view" | "delete" | "download";

export interface PhotoMetadata {
  width: number;
  height: number;
  orientation: "portrait" | "landscape" | "square";
  deviceInfo?: string;
}
