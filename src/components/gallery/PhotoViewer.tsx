"use client";

import React, { useState, useCallback } from "react";
import {
  X,
  Trash2,
  Download,
  Calendar,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime, downloadImage } from "@/lib/imageUtils";
import type { Photo } from "@/types";

interface PhotoViewerProps {
  photo: Photo;
  onClose: () => void;
  onDelete: () => void;
}

const ADMIN_PASSWORD = "AkshisAdmin";

export function PhotoViewer({ photo, onClose, onDelete }: PhotoViewerProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDownload = () => {
    const filename = `disposable_${new Date(photo.created_at).getTime()}.jpg`;
    downloadImage(photo.url, filename);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteClick = useCallback(() => {
    setShowPasswordModal(true);
    setPassword("");
    setError("");
  }, []);

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (password === ADMIN_PASSWORD) {
        setShowPasswordModal(false);
        onDelete();
      } else {
        setError("Incorrect password");
        setPassword("");
      }
    },
    [password, onDelete],
  );

  const handleCancelDelete = useCallback(() => {
    setShowPasswordModal(false);
    setPassword("");
    setError("");
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {}
      <div className="absolute top-0 left-0 right-0 safe-area-inset-top z-10">
        <div className="flex items-center justify-between p-4">
          <IconButton
            icon={X}
            label="Close"
            onClick={onClose}
            variant="ghost"
            size="md"
          />

          <div className="flex items-center gap-2">
            <IconButton
              icon={Download}
              label="Download"
              onClick={handleDownload}
              variant="ghost"
              size="md"
            />
            <IconButton
              icon={Trash2}
              label="Delete"
              onClick={handleDeleteClick}
              variant="ghost"
              size="md"
              className="text-red-400 hover:text-red-300"
            />
          </div>
        </div>
      </div>

      {}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <img
          src={photo.url}
          alt={`Photo from ${formatRelativeTime(photo.created_at)}`}
          className="
            max-w-full max-h-full
            object-contain
            rounded-lg
            shadow-2xl
          "
        />
      </div>

      {}
      <div className="absolute bottom-0 left-0 right-0 safe-area-inset-bottom">
        <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-2 text-vintage-cream/80">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {new Date(photo.created_at).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          {photo.orientation && (
            <p className="text-xs text-vintage-beige/60 mt-1 capitalize">
              {photo.orientation} • {photo.width} × {photo.height}
            </p>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#1a1a1a] rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Admin Access
                </h3>
                <p className="text-sm text-white/50">
                  This action requires authorization
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-6 space-y-2">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="
                                        w-full px-4 py-3 rounded-xl
                                        bg-black/40 border border-white/10
                                        text-white placeholder-white/20
                                        focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50
                                        transition-all font-mono text-sm
                                    "
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs animate-shake">
                    <AlertTriangle className="w-3 h-3" />
                    {error}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="
                                        flex-1 px-4 py-2.5 rounded-lg font-medium text-sm
                                        bg-white/5 text-white/70 hover:bg-white/10 hover:text-white
                                        border border-white/5
                                        transition-colors
                                    "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="
                                        flex-1 px-4 py-2.5 rounded-lg font-medium text-sm
                                        bg-gradient-to-r from-red-600 to-red-500
                                        text-white shadow-lg shadow-red-500/20
                                        hover:from-red-500 hover:to-red-400
                                        transform active:scale-95 transition-all
                                    "
                >
                  Delete Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
