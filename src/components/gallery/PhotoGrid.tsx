"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Camera, ImageOff } from "lucide-react";
import { PhotoCard } from "./PhotoCard";
import { PhotoViewer } from "./PhotoViewer";
import { GallerySkeleton } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import type { Photo } from "@/types";
import Link from "next/link";

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  onDeletePhoto: (photo: Photo) => Promise<boolean>;
}

const BATCH_SIZE = 24;

export function PhotoGrid({
  photos,
  loading,
  error,
  onDeletePhoto,
}: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const { showToast } = useToast();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const visiblePhotos = useMemo(() => {
    return photos.slice(0, visibleCount);
  }, [photos, visibleCount]);

  const hasMore = visibleCount < photos.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, photos.length));
        }
      },
      { rootMargin: "200px" },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, photos.length]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [photos.length]);

  const handleDelete = useCallback(async () => {
    if (!selectedPhoto || isDeleting) return;

    setIsDeleting(true);
    const success = await onDeletePhoto(selectedPhoto);
    setIsDeleting(false);

    if (success) {
      showToast("success", "Photo deleted");
      setSelectedPhoto(null);
    } else {
      showToast("error", "Failed to delete photo");
    }
  }, [selectedPhoto, isDeleting, onDeletePhoto, showToast]);

  const handlePhotoClick = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  if (loading) {
    return <GallerySkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vintage-charcoal to-vintage-black flex items-center justify-center mb-6 shadow-lg">
          <ImageOff className="w-10 h-10 text-vintage-beige/40" />
        </div>
        <h2 className="text-xl font-semibold text-vintage-cream mb-2">
          Couldn&apos;t Load Photos
        </h2>
        <p className="text-vintage-beige/50 text-sm max-w-xs">{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        {}
        <div className="relative mb-8">
          <div className="w-32 h-40 bg-vintage-charcoal rounded-lg overflow-hidden shadow-2xl">
            <div className="flex h-full">
              <div className="w-4 bg-vintage-black flex flex-col justify-between py-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 mx-auto rounded-sm bg-vintage-charcoal/60"
                  />
                ))}
              </div>
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-vintage-charcoal to-vintage-black">
                <Camera className="w-12 h-12 text-vintage-brown/40" />
              </div>
              <div className="w-4 bg-vintage-black flex flex-col justify-between py-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 mx-auto rounded-sm bg-vintage-charcoal/60"
                  />
                ))}
              </div>
            </div>
          </div>
          {}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-lg pointer-events-none" />
        </div>

        <h2 className="text-2xl font-bold text-vintage-cream mb-3">
          No Memories Yet
        </h2>
        <p className="text-vintage-beige/50 text-sm max-w-xs mb-8 leading-relaxed">
          Start capturing moments with your vintage camera. Each photo becomes a
          timeless memory.
        </p>
        <Link href="/">
          <Button
            icon={Camera}
            className="bg-gradient-to-r from-vintage-brown to-vintage-amber text-vintage-cream border-none shadow-lg"
          >
            Capture First Memory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="pb-24 min-h-[50vh] px-4">
        {}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          style={{ contain: "layout style" }}
        >
          {visiblePhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => handlePhotoClick(photo)}
            />
          ))}
        </div>

        {}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-vintage-beige/40 text-sm">
              <div className="w-2 h-2 rounded-full bg-vintage-beige/40 animate-pulse" />
              Loading more...
            </div>
          </div>
        )}

        {}
        {!hasMore && photos.length > BATCH_SIZE && (
          <div className="text-center py-6 text-vintage-beige/30 text-xs">
            All {photos.length} photos loaded
          </div>
        )}
      </div>

      {}
      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={handleCloseViewer}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
