"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CameraState } from "@/types";
import { CAMERA_SETTINGS } from "@/lib/constants";
import { canvasToBlob } from "@/lib/imageUtils";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CameraState>({
    stream: null,
    facingMode: CAMERA_SETTINGS.defaultFacingMode,
    hasMultipleCameras: false,
    isFlashSupported: false,
    isFlashOn: false,
    permissionState: "prompt",
    error: null,
  });

  const checkSupport = useCallback(() => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setState((prev) => ({
        ...prev,
        permissionState: "unsupported",
        error: "Camera not supported in this browser",
      }));
      return false;
    }
    return true;
  }, []);

  const checkMultipleCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");

      const hasMultiple = videoDevices.length > 1;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      setState((prev) => ({
        ...prev,
        hasMultipleCameras: hasMultiple || isMobile,
      }));
    } catch {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setState((prev) => ({
        ...prev,
        hasMultipleCameras: isMobile,
      }));
    }
  }, []);

  const startCamera = useCallback(
    async (facingMode?: "user" | "environment") => {
      if (!checkSupport()) return;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const mode = facingMode || state.facingMode;

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            ...CAMERA_SETTINGS.videoConstraints,
            facingMode: { ideal: mode },
            //facingMode: mode,
            //width: { ideal: 1280 },
            //height: { ideal: 720 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        const track = stream.getVideoTracks()[0];
        let isFlashSupported = false;
        try {
          const capabilities =
            track.getCapabilities?.() as MediaTrackCapabilities & {
              torch?: boolean;
            };
          isFlashSupported = !!capabilities?.torch;
        } catch { }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => { });
        }

        setState((prev) => ({
          ...prev,
          stream,
          facingMode: mode,
          isFlashSupported,
          permissionState: "granted",
          error: null,
        }));

        checkMultipleCameras();
      } catch (err) {
        const error = err as Error;
        let permissionState: CameraState["permissionState"] = "denied";
        let errorMessage = "Failed to access camera";

        if (error.name === "NotAllowedError") {
          errorMessage = "Camera permission denied";
        } else if (error.name === "NotFoundError") {
          errorMessage = "No camera found";
        } else if (error.name === "NotReadableError") {
          errorMessage = "Camera is in use by another app";
        }

        setState((prev) => ({
          ...prev,
          stream: null,
          permissionState,
          error: errorMessage,
        }));
      }
    },
    [state.facingMode, checkSupport, checkMultipleCameras],
  );

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setState((prev) => ({
        ...prev,
        stream: null,
      }));
    }
  }, []);

  const switchCamera = useCallback(() => {
    const newMode = state.facingMode === "user" ? "environment" : "user";
    startCamera(newMode);
  }, [state.facingMode, startCamera]);

  const toggleFlash = useCallback(async () => {
    if (!streamRef.current || !state.isFlashSupported) return;

    const track = streamRef.current.getVideoTracks()[0];
    const newFlashState = !state.isFlashOn;

    try {
      await track.applyConstraints({
        advanced: [{ torch: newFlashState } as never],
      });
      setState((prev) => ({
        ...prev,
        isFlashOn: newFlashState,
      }));
    } catch {
      console.error("Failed to toggle flash");
    }
  }, [state.isFlashSupported, state.isFlashOn]);

  const capturePhoto = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (state.facingMode === "user") {
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    return canvasToBlob(canvas);
  }, [state.facingMode]);

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => { });
      }
    }
  }, [state.stream]);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    stopCamera,
    switchCamera,
    toggleFlash,
    capturePhoto,
  };
}
