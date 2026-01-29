"use client";

import { CameraView } from "@/components/camera/CameraView";

export default function CameraPage() {
  return (
    <div className="fixed inset-0 bg-vintage-black">
      <CameraView />
    </div>
  );
}
