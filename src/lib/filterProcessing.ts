import { VintageFilter } from "./filters";

export function applyFilterToCanvas(
  canvas: HTMLCanvasElement,
  filter: VintageFilter,
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const { canvasFilter } = filter;

  if (filter.id === "none") {
    return canvas;
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const contrastFactor = (canvasFilter.contrast - 1) * 255;
  const contrastMultiplier =
    (259 * (contrastFactor + 255)) / (255 * (259 - contrastFactor));

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    r *= canvasFilter.brightness;
    g *= canvasFilter.brightness;
    b *= canvasFilter.brightness;

    r = contrastMultiplier * (r - 128) + 128;
    g = contrastMultiplier * (g - 128) + 128;
    b = contrastMultiplier * (b - 128) + 128;

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + (r - gray) * canvasFilter.saturate;
    g = gray + (g - gray) * canvasFilter.saturate;
    b = gray + (b - gray) * canvasFilter.saturate;

    if (canvasFilter.sepia > 0) {
      const sepiaR = 0.393 * r + 0.769 * g + 0.189 * b;
      const sepiaG = 0.349 * r + 0.686 * g + 0.168 * b;
      const sepiaB = 0.272 * r + 0.534 * g + 0.131 * b;
      r = r + (sepiaR - r) * canvasFilter.sepia;
      g = g + (sepiaG - g) * canvasFilter.sepia;
      b = b + (sepiaB - b) * canvasFilter.sepia;
    }

    if (canvasFilter.warmth !== 0) {
      const warmthAmount = canvasFilter.warmth / 100;
      r += warmthAmount * 30;
      g += warmthAmount * 15;
      b -= warmthAmount * 20;
    }

    data[i] = Math.max(0, Math.min(255, Math.round(r)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
  }

  ctx.putImageData(imageData, 0, 0);

  if (canvasFilter.vignette > 0) {
    applyVignette(ctx, canvas.width, canvas.height, canvasFilter.vignette);
  }

  if (canvasFilter.grain > 0) {
    applyGrain(ctx, canvas.width, canvas.height, canvasFilter.grain);
  }

  return canvas;
}

function applyVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.sqrt(centerX * centerX + centerY * centerY);

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.4,
    centerX,
    centerY,
    radius,
  );

  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.7, `rgba(0, 0, 0, ${intensity * 0.2})`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.5})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const amount = intensity * 15;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

function addFilmBorders(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): HTMLCanvasElement {
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  const isLandscape = originalWidth > originalHeight;

  const borderSize = Math.round(Math.min(originalWidth, originalHeight) * 0.04);
  const sprocketWidth = Math.round(borderSize * 0.6);
  const sprocketHeight = Math.round(borderSize * 0.8);
  const sprocketGap = Math.round(borderSize * 1.2);

  const newCanvas = document.createElement("canvas");

  if (isLandscape) {
    newCanvas.width = originalWidth;
    newCanvas.height = originalHeight + borderSize * 2;
  } else {
    newCanvas.width = originalWidth + borderSize * 2;
    newCanvas.height = originalHeight;
  }

  const newCtx = newCanvas.getContext("2d");
  if (!newCtx) return canvas;

  newCtx.fillStyle = "#0a0a0a";
  newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  if (isLandscape) {
    newCtx.drawImage(canvas, 0, borderSize);
  } else {
    newCtx.drawImage(canvas, borderSize, 0);
  }

  newCtx.fillStyle = "#1a1a1a";

  if (isLandscape) {
    const sprocketCount = Math.floor(originalWidth / sprocketGap);
    const startX = (originalWidth - (sprocketCount - 1) * sprocketGap) / 2;

    for (let i = 0; i < sprocketCount; i++) {
      const x = startX + i * sprocketGap - sprocketWidth / 2;

      newCtx.fillRect(
        x,
        (borderSize - sprocketHeight) / 2,
        sprocketWidth,
        sprocketHeight,
      );

      newCtx.fillRect(
        x,
        originalHeight + borderSize + (borderSize - sprocketHeight) / 2,
        sprocketWidth,
        sprocketHeight,
      );
    }
  } else {
    const sprocketCount = Math.floor(originalHeight / sprocketGap);
    const startY = (originalHeight - (sprocketCount - 1) * sprocketGap) / 2;

    for (let i = 0; i < sprocketCount; i++) {
      const y = startY + i * sprocketGap - sprocketHeight / 2;

      newCtx.fillRect(
        (borderSize - sprocketWidth) / 2,
        y,
        sprocketWidth,
        sprocketHeight,
      );

      newCtx.fillRect(
        originalWidth + borderSize + (borderSize - sprocketWidth) / 2,
        y,
        sprocketWidth,
        sprocketHeight,
      );
    }
  }

  return newCanvas;
}

export async function applyFilterToImage(
  imageBlob: Blob,
  filter: VintageFilter,
  addBorders: boolean = true,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        let canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(img.src);
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        if (filter.id !== "none") {
          applyFilterToCanvas(canvas, filter);
        }

        if (addBorders) {
          canvas = addFilmBorders(canvas, ctx);
        }

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(img.src);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not create blob"));
            }
          },
          "image/jpeg",
          0.92,
        );
      } catch (err) {
        URL.revokeObjectURL(img.src);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Could not load image"));
    };

    img.src = URL.createObjectURL(imageBlob);
  });
}
