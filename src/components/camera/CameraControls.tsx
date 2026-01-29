"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { RefreshCcw, Zap, ZapOff, Upload, Images } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

interface CameraControlsProps {
  onCapture: () => void;
  onUpload: (file: File) => void;
  onSwitchCamera: () => void;
  onToggleFlash: () => void;
  hasMultipleCameras: boolean;
  isFlashSupported: boolean;
  isFlashOn: boolean;
  isCapturing: boolean;
}

export function CameraControls({
  onCapture,
  onUpload,
  onSwitchCamera,
  onToggleFlash,
  hasMultipleCameras,
  isFlashSupported,
  isFlashOn,
  isCapturing,
}: CameraControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);

      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {}
      <div className="absolute top-0 left-0 right-0 safe-area-inset-top z-10">
        <div className="p-4 flex justify-between items-center">
          {isFlashSupported ? (
            <IconButton
              icon={isFlashOn ? Zap : ZapOff}
              label={isFlashOn ? "Flash on" : "Flash off"}
              onClick={onToggleFlash}
              active={isFlashOn}
              variant="ghost"
            />
          ) : (
            <div className="w-11 h-11" />
          )}

          {hasMultipleCameras && (
            <IconButton
              icon={RefreshCcw}
              label="Switch camera"
              onClick={onSwitchCamera}
              variant="ghost"
            />
          )}
        </div>
      </div>

      {}
      <div className="absolute bottom-0 left-0 right-0 safe-area-inset-bottom z-10">
        <div className="pb-8 pt-6 px-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            {}
            <IconButton
              icon={Upload}
              label="Upload photo"
              onClick={handleUploadClick}
              size="lg"
              variant="default"
            />

            {}
            <div className="flex items-center gap-4">
              {hasMultipleCameras && (
                <IconButton
                  icon={RefreshCcw}
                  label="Switch camera"
                  onClick={onSwitchCamera}
                  size="md"
                  variant="ghost"
                  className="bg-black/30 backdrop-blur-sm"
                />
              )}

              <button
                onClick={onCapture}
                disabled={isCapturing}
                className={`
                  w-[72px] h-[72px] rounded-full
                  bg-vintage-cream
                  border-4 border-vintage-cream
                  shadow-lg
                  transition-all duration-150
                  focus:outline-none focus:ring-4 focus:ring-vintage-cream/30
                  disabled:opacity-70
                  ${isCapturing ? "scale-90" : "hover:scale-105 active:scale-95"}
                `}
                aria-label="Take photo"
              >
                <div
                  className={`
                    w-full h-full rounded-full
                    border-2 border-vintage-charcoal/20
                    transition-all duration-150
                    ${isCapturing ? "bg-vintage-beige" : "bg-vintage-cream"}
                  `}
                />
              </button>
            </div>

            {}
            <Link href="/gallery">
              <IconButton
                icon={Images}
                label="View gallery"
                size="lg"
                variant="default"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
