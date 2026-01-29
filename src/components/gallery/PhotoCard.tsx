"use client";

import React, { memo, useState, useCallback } from "react";
import type { Photo } from "@/types";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

export const PhotoCard = memo(
  function PhotoCard({ photo, onClick }: PhotoCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    const handleError = useCallback(() => {
      setImageError(true);
    }, []);

    return (
      <button
        onClick={onClick}
        className="
                relative
                bg-vintage-charcoal rounded-lg overflow-hidden
                shadow-lg hover:shadow-xl
                transition-shadow duration-200
                focus:outline-none focus:ring-2 focus:ring-vintage-brown/50
                group
                contain-layout contain-paint
            "
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 200px" }}
        aria-label="View photo"
      >
        {}
        <div className="relative aspect-square overflow-hidden">
          {}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-vintage-charcoal animate-pulse" />
          )}

          {}
          {imageError && (
            <div className="absolute inset-0 bg-vintage-charcoal flex items-center justify-center">
              <span className="text-vintage-beige/40 text-xs">Failed</span>
            </div>
          )}

          {}
          <img
            src={photo.url}
            alt="Photo"
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`
                        w-full h-full object-cover
                        transition-opacity duration-300
                        ${imageLoaded ? "opacity-100" : "opacity-0"}
                    `}
          />

          {}
          <div
            className="
                    absolute inset-0
                    bg-black/0 group-hover:bg-black/20
                    transition-colors duration-200
                "
          />
        </div>
      </button>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.photo.id === nextProps.photo.id &&
      prevProps.photo.url === nextProps.photo.url
    );
  },
);
