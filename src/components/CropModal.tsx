"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";

export default function CropModal({
  image,
  onCancel,
  onCropComplete,
}: {
  image: string;
  onCancel: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });

  const cropImage = async (croppedAreaPixels: any) => {
    const img = await createImage(image);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob((blob) => {
      if (blob) onCropComplete(blob);
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-[#0B1220] p-5 rounded-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-3">Crop Your Avatar</h2>

        <div className="relative w-full h-64 bg-black/20 overflow-hidden rounded-lg">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedPixels) => {
              (window as any).croppedPixels = croppedPixels;
            }}
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              cropImage((window as any).croppedPixels)
            }
            className="px-4 py-2 bg-[#00E6C8] text-black rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
