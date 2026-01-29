"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        border-vintage-cream/30
        border-t-vintage-cream
        rounded-full
        spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-vintage-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-vintage-cream/70 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function PhotoSkeleton() {
  return (
    <div className="aspect-square bg-vintage-charcoal rounded-xl overflow-hidden pulse" />
  );
}

export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <PhotoSkeleton key={i} />
      ))}
    </div>
  );
}
