"use client";

import React from "react";
import { Camera, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CameraState } from "@/types";

interface PermissionRequestProps {
  permissionState: CameraState["permissionState"];
  error: string | null;
  onRequestPermission: () => void;
}

export function PermissionRequest({
  permissionState,
  error,
  onRequestPermission,
}: PermissionRequestProps) {
  if (permissionState === "granted") {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-vintage-black p-6">
      <div className="text-center max-w-sm">
        {permissionState === "unsupported" ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-vintage-charcoal flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-vintage-amber" />
            </div>
            <h2 className="text-xl font-semibold text-vintage-cream mb-3">
              Camera Not Supported
            </h2>
            <p className="text-vintage-beige/70 text-sm leading-relaxed mb-6">
              Your browser doesn&apos;t support camera access. Please try using
              a modern browser like Chrome, Safari, or Firefox.
            </p>
          </>
        ) : permissionState === "denied" ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-vintage-charcoal flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-vintage-cream mb-3">
              Camera Access Denied
            </h2>
            <p className="text-vintage-beige/70 text-sm leading-relaxed mb-6">
              {error ||
                "Camera permission was denied. Please enable camera access in your browser settings and try again."}
            </p>
            <Button onClick={onRequestPermission} icon={RefreshCw}>
              Try Again
            </Button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-vintage-brown to-vintage-amber flex items-center justify-center shadow-lg">
              <Camera className="w-10 h-10 text-vintage-cream" />
            </div>
            <h2 className="text-2xl font-semibold text-vintage-cream mb-3">
              Ready to Capture
            </h2>
            <p className="text-vintage-beige/70 text-sm leading-relaxed mb-8">
              Allow camera access to start capturing beautiful vintage-style
              photos.
            </p>
            <Button onClick={onRequestPermission} size="lg" className="w-full">
              Enable Camera
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
