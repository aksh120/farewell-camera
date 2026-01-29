"use client";

import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  uploadImage,
  deleteImage,
  initAnonymousSession,
} from "@/lib/supabase";
import {
  compressImage,
  getImageDimensions,
  getPhotoMetadata,
  generateFileName,
} from "@/lib/imageUtils";
import { SUPABASE_SETTINGS } from "@/lib/constants";
import type { Photo, PhotoMetadata } from "@/types";

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    const id = await initAnonymousSession();
    setUserId(id);
    return id;
  }, []);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from(SUPABASE_SETTINGS.tableName)
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPhotos(data || []);
    } catch (err) {
      console.error("Fetch photos error:", err);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  }, []);

  const addPhoto = useCallback(
    async (blob: Blob): Promise<Photo | null> => {
      setError(null);

      try {
        const compressedBlob = await compressImage(blob);

        const dimensions = await getImageDimensions(compressedBlob);
        const metadata: PhotoMetadata = getPhotoMetadata(
          dimensions.width,
          dimensions.height,
        );

        const fileName = generateFileName();

        const uploadResult = await uploadImage(compressedBlob, fileName);

        if (!uploadResult) {
          throw new Error("Upload failed");
        }

        const photoRecord = {
          user_id: userId,
          storage_path: uploadResult.path,
          url: uploadResult.url,
          width: metadata.width,
          height: metadata.height,
          orientation: metadata.orientation,
          device_info: metadata.deviceInfo,
        };

        const { data, error: insertError } = await supabase
          .from(SUPABASE_SETTINGS.tableName)
          .insert(photoRecord)
          .select()
          .single();

        if (insertError) {
          await deleteImage(uploadResult.path);
          throw insertError;
        }

        setPhotos((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        console.error("Add photo error:", err);
        setError("Failed to save photo");
        return null;
      }
    },
    [userId],
  );

  const removePhoto = useCallback(async (photo: Photo): Promise<boolean> => {
    setError(null);

    try {
      const deleted = await deleteImage(photo.storage_path);

      if (!deleted) {
        console.warn("Storage delete failed, continuing with database delete");
      }

      const { error: deleteError } = await supabase
        .from(SUPABASE_SETTINGS.tableName)
        .delete()
        .eq("id", photo.id);

      if (deleteError) {
        throw deleteError;
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      return true;
    } catch (err) {
      console.error("Delete photo error:", err);
      setError("Failed to delete photo");
      return false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initSession();
      await fetchPhotos();
    };
    init();
  }, [initSession, fetchPhotos]);

  useEffect(() => {
    const channel = supabase
      .channel("photos-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: SUPABASE_SETTINGS.tableName,
        },
        (payload) => {
          const newPhoto = payload.new as Photo;
          setPhotos((prev) => {
            if (prev.some((p) => p.id === newPhoto.id)) return prev;
            return [newPhoto, ...prev];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: SUPABASE_SETTINGS.tableName,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setPhotos((prev) => prev.filter((p) => p.id !== deletedId));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: SUPABASE_SETTINGS.tableName,
        },
        (payload) => {
          const updatedPhoto = payload.new as Photo;
          setPhotos((prev) =>
            prev.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    photos,
    loading,
    error,
    userId,
    addPhoto,
    removePhoto,
    refreshPhotos: fetchPhotos,
  };
}
