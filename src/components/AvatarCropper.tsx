"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "@/utils/cropImage";

type Props = {
  imageSrc: string;              // Base64 / local preview
  onCancel: () => void;          // Cancel cropping
  onCropDone: (file: File) => void; // Return final cropped File
};

export default function AvatarCropper({ imageSrc, onCancel, onCropDone }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  // Save cropped area
  const onCropComplete = useCallback(
    (_: unknown, croppedPixels: { width: number; height: number; x: number; y: number }) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  // Finalize cropping
  const handleDone = async () => {
  if (!croppedAreaPixels) return;

  // 1️⃣ Crop → Blob
  const croppedBlob: Blob = await getCroppedImg(imageSrc, croppedAreaPixels);

  // ⭐ FIX: Convert Blob → File BEFORE compression (TypeScript requires File!)
  const tempFile = new File([croppedBlob], "temp.png", {
    type: "image/png",
    lastModified: Date.now(),
  });

  // 2️⃣ Now compress the File safely
  const compressedBlob = await imageCompression(tempFile, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 512,
    useWebWorker: true,
  });

  // 3️⃣ Convert Compressed Blob → Final File
  const croppedFile = new File([compressedBlob], `avatar-${Date.now()}.png`, {
    type: "image/png",
    lastModified: Date.now(),
  });

  onCropDone(croppedFile);
};


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0A0F1F] p-5 rounded-xl w-full max-w-md shadow-xl border border-white/10">
        <h2 className="text-lg font-semibold mb-4 text-white">Crop Your Avatar</h2>

        {/* Cropper Container */}
        <div className="relative w-full h-64 bg-black/40 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full mt-4"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleDone}
            className="px-4 py-2 rounded-md bg-[#00E6C8] text-black font-semibold hover:bg-[#00ffe0]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
