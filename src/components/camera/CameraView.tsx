"use client";

import React, { useState, useCallback } from "react";
import { useCamera } from "@/hooks/useCamera";
import { usePhotos } from "@/hooks/usePhotos";
import { useToast } from "@/components/ui/Toast";
import { VintageOverlay, ShutterFlash, FilmReelEdges } from "./VintageOverlay";
import { CameraControls } from "./CameraControls";
import { FilterMenu } from "./FilterMenu";
import { PermissionRequest } from "./PermissionRequest";
import { compressImage, getImageDimensions } from "@/lib/imageUtils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DEFAULT_FILTER, VintageFilter } from "@/lib/filters";
import { applyFilterToImage } from "@/lib/filterProcessing";

export function CameraView() {
  const {
    videoRef,
    canvasRef,
    stream,
    permissionState,
    error,
    hasMultipleCameras,
    isFlashSupported,
    isFlashOn,
    facingMode,
    startCamera,
    switchCamera,
    toggleFlash,
    capturePhoto,
  } = useCamera();

  const { addPhoto } = usePhotos();
  const { showToast } = useToast();

  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [selectedFilter, setSelectedFilter] =
    useState<VintageFilter>(DEFAULT_FILTER);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    setShowFlash(true);
    setIsFilterMenuOpen(false);

    try {
      const blob = await capturePhoto();

      if (blob) {
        const filteredBlob = await applyFilterToImage(blob, selectedFilter);
        const photo = await addPhoto(filteredBlob);

        if (photo) {
          showToast("success", "Photo saved!");
        } else {
          showToast("error", "Failed to save photo");
        }
      }
    } catch {
      showToast("error", "Capture failed");
    } finally {
      setIsCapturing(false);

      setTimeout(() => setShowFlash(false), 300);
    }
  }, [isCapturing, capturePhoto, addPhoto, showToast, selectedFilter]);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsCapturing(true);
      setIsFilterMenuOpen(false);

      try {
        const compressedBlob = await compressImage(file);

        await getImageDimensions(compressedBlob);

        const filteredBlob = await applyFilterToImage(
          compressedBlob,
          selectedFilter,
        );
        const photo = await addPhoto(filteredBlob);

        if (photo) {
          showToast("success", "Photo uploaded!");
        } else {
          showToast("error", "Failed to upload photo");
        }
      } catch {
        showToast("error", "Invalid image file");
      } finally {
        setIsCapturing(false);
      }
    },
    [addPhoto, showToast, selectedFilter],
  );

  const toggleFilterMenu = useCallback(() => {
    setIsFilterMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative w-full h-full bg-vintage-black overflow-hidden">
      {}
      <canvas ref={canvasRef} className="hidden" />

      {}
      {!stream &&
        permissionState !== "denied" &&
        permissionState !== "unsupported" && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className="
            bg-black/40 backdrop-blur-md 
            px-8 py-6 rounded-2xl 
            flex flex-col items-center gap-4 
            border border-white/10 shadow-2xl 
            animate-in fade-in zoom-in duration-300
          "
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-vintage-cream/10" />
                <LoadingSpinner
                  size="lg"
                  className="border-vintage-amber border-t-vintage-cream"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-vintage-cream text-xs font-bold tracking-[0.2em] uppercase">
                  Loading Film
                </p>
                <div className="flex gap-1 h-1">
                  <div className="w-1 h-1 rounded-full bg-vintage-amber animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 rounded-full bg-vintage-amber animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 rounded-full bg-vintage-amber animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        )}

      {}
      {(permissionState === "denied" || permissionState === "unsupported") && (
        <PermissionRequest
          permissionState={permissionState}
          error={error}
          onRequestPermission={startCamera}
        />
      )}

      {}
      {stream && <FilmReelEdges />}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`
          absolute inset-0 w-full h-full object-cover
          ${facingMode === "user" ? "scale-x-[-1]" : ""}
          ${!stream ? "invisible" : ""}
        `}
        style={{
          filter: selectedFilter.cssFilter,
          clipPath: "inset(0 20px 0 20px)",
        }}
      />

      {stream && (
        <>
          {}
          <VintageOverlay intensity={selectedFilter.id === "none" ? 0 : 1} />

          {}
          <ShutterFlash visible={showFlash} />

          {}
          <FilterMenu
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
            isOpen={isFilterMenuOpen}
            onToggle={toggleFilterMenu}
          />

          {}
          <CameraControls
            onCapture={handleCapture}
            onUpload={handleUpload}
            onSwitchCamera={switchCamera}
            onToggleFlash={toggleFlash}
            hasMultipleCameras={hasMultipleCameras}
            isFlashSupported={isFlashSupported}
            isFlashOn={isFlashOn}
            isCapturing={isCapturing}
          />
        </>
      )}
    </div>
  );
}
