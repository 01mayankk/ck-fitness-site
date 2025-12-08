export const getCroppedImg = (
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob); // ALWAYS RETURNS A BLOB!
        },
        "image/png",
        1
      );
    };

    image.onerror = (e) => reject(e);
  });
};
