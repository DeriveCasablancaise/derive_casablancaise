// Pure math and checks for the square cropper. No DOM here, so vitest can run it.

export type Crop = { x: number; y: number; size: number };

export const MIN_ZOOM = 100;
export const MAX_ZOOM = 300;

const MIN_SQUARE_RATIO = 0.95;
const MAX_SQUARE_RATIO = 1.05;
const PORTRAIT_FOCUS = 0.3; // faces sit about 30% from the top

export const OUTPUT_SIDE = 1200;
export const TARGET_BYTES = 300 * 1024;

// same limit as imageUploader in api/uploadthing/core.ts
export const MAX_SOURCE_BYTES = 8 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
];

export const FORMAT_ERROR =
  'Format non accepté ou illisible par ce navigateur : utilisez JPEG, PNG ou WebP (HEIC si votre navigateur sait le lire).';
export const SIZE_ERROR = 'Cette image dépasse la limite de 8 Mo.';

export function validateImageFile(file: { type: string; size: number }) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return FORMAT_ERROR;
  if (file.size > MAX_SOURCE_BYTES) return SIZE_ERROR;
  return null;
}

export function needsSquareCrop(width: number, height: number) {
  const ratio = width / height;
  return ratio < MIN_SQUARE_RATIO || ratio > MAX_SQUARE_RATIO;
}

const isPositive = (value: number) => Number.isFinite(value) && value > 0;
const finiteOrZero = (value: number) => (Number.isFinite(value) ? value : 0);

// a size of 0 would turn the drawing scale into Infinity
const safeCrop = (): Crop => ({ x: 0, y: 0, size: 1 });

export function hasUsableSize(width: number, height: number) {
  return isPositive(width) && isPositive(height);
}

export function clampCrop(crop: Crop, width: number, height: number): Crop {
  if (!hasUsableSize(width, height) || !isPositive(crop.size)) return safeCrop();

  return {
    size: crop.size,
    x: Math.min(Math.max(finiteOrZero(crop.x), 0), width - crop.size),
    y: Math.min(Math.max(finiteOrZero(crop.y), 0), height - crop.size),
  };
}

export function initialCrop(width: number, height: number): Crop {
  if (!hasUsableSize(width, height)) return safeCrop();

  const size = Math.min(width, height);
  const centerY = height > width ? height * PORTRAIT_FOCUS : height / 2;

  return clampCrop(
    { size, x: (width - size) / 2, y: centerY - size / 2 },
    width,
    height,
  );
}

export function clampZoom(zoom: number) {
  if (Number.isNaN(zoom)) return MIN_ZOOM;
  return Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
}

// zooms around the centre of the current crop
export function zoomCrop(
  crop: Crop,
  zoom: number,
  width: number,
  height: number,
): Crop {
  const size = (Math.min(width, height) * 100) / clampZoom(zoom);
  const centerX = crop.x + crop.size / 2;
  const centerY = crop.y + crop.size / 2;

  return clampCrop(
    { size, x: centerX - size / 2, y: centerY - size / 2 },
    width,
    height,
  );
}

// dx and dy are measured on the frame: dragging right shows more of the left side
export function panCrop(
  crop: Crop,
  dx: number,
  dy: number,
  frameSide: number,
  width: number,
  height: number,
): Crop {
  if (!isPositive(frameSide)) return clampCrop(crop, width, height);

  const sourcePerFramePixel = crop.size / frameSide;

  return clampCrop(
    {
      size: crop.size,
      x: crop.x - dx * sourcePerFramePixel,
      y: crop.y - dy * sourcePerFramePixel,
    },
    width,
    height,
  );
}

// never upscale: a zoomed crop can hold fewer pixels than the short side
export function outputSide(cropSize: number) {
  return Math.min(OUTPUT_SIDE, Math.round(cropSize));
}

// tried in order until one fits under TARGET_BYTES
export function exportAttempts(side: number) {
  const attempts: { side: number; quality: number }[] = [];

  for (const scale of [1, 0.8, 0.6]) {
    for (const quality of [0.85, 0.75, 0.65]) {
      attempts.push({ side: Math.round(side * scale), quality });
    }
  }

  return attempts;
}
