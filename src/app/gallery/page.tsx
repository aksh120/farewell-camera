"use client";

import { usePhotos } from "@/hooks/usePhotos";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { Camera } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const { photos, loading, error, removePhoto } = usePhotos();

  return (
    <div className="min-h-screen bg-vintage-black pb-20">
      {}
      <header className="mt-8 bg-vintage-black">
        <div className="px-6 pb-4">
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-4xl font-bold text-vintage-cream tracking-tight drop-shadow-md">
              Your Memories
            </h1>
            <p className="text-base font-medium text-vintage-beige/60 flex items-center gap-2 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-vintage-amber/70 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              {photos.length} {photos.length === 1 ? "moment" : "moments"}{" "}
              captured
            </p>
          </div>

          {}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-vintage-brown/30 to-transparent" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-3 rounded-sm bg-vintage-charcoal border border-vintage-brown/20"
                />
              ))}
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-vintage-brown/30 to-transparent" />
          </div>
        </div>
      </header>

      {}
      <PhotoGrid
        photos={photos}
        loading={loading}
        error={error}
        onDeletePhoto={removePhoto}
      />
    </div>
  );
}
