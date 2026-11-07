// Browser side of the cropper: decoding images and exporting the square.
import {
  Crop,
  exportAttempts,
  outputSide,
  TARGET_BYTES,
} from './square-crop';

export const CORS_ERROR =
  'Impossible de recadrer cette image ici : téléchargez-la puis ajoutez-la à nouveau.';

export type CropImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

function loadElement(src: string, crossOrigin?: 'anonymous') {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    if (crossOrigin) image.crossOrigin = crossOrigin;
    // a failed decode() is not fatal, drawing decodes the image anyway
    image.onload = () =>
      image
        .decode()
        .catch(() => {})
        .then(() => resolve(image));
    image.onerror = () => reject(new Error('Image illisible'));
    image.src = src;
  });
}

// the image's EXIF orientation is applied in both branches
export async function loadImageFile(file: File): Promise<CropImage> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image',
    });
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    };
  } catch {
    // older browsers refuse the option; an img element still rotates by itself
    const url = URL.createObjectURL(file);
    try {
      const element = await loadElement(url);
      return {
        source: element,
        width: element.naturalWidth,
        height: element.naturalHeight,
        close: () => URL.revokeObjectURL(url),
      };
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
  }
}

// fails on a refused CORS load, and on a tainted canvas through getImageData
export async function loadImageUrl(url: string): Promise<CropImage> {
  const element = await loadElement(url, 'anonymous');

  const probe = document.createElement('canvas');
  probe.width = 1;
  probe.height = 1;
  const context = probe.getContext('2d');
  if (!context) throw new Error('Canvas indisponible');
  context.drawImage(element, 0, 0, 1, 1);
  context.getImageData(0, 0, 1, 1);

  return {
    source: element,
    width: element.naturalWidth,
    height: element.naturalHeight,
    close: () => {},
  };
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Échec de l'export")),
      type,
      quality,
    );
  });
}

function drawSquare(image: CropImage, crop: Crop, side: number, fill?: string) {
  const canvas = document.createElement('canvas');
  canvas.width = side;
  canvas.height = side;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas indisponible');

  if (fill) {
    context.fillStyle = fill;
    context.fillRect(0, 0, side, side);
  }
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    image.source,
    crop.x,
    crop.y,
    crop.size,
    crop.size,
    0,
    0,
    side,
    side,
  );

  return canvas;
}

async function encode(
  image: CropImage,
  crop: Crop,
  side: number,
  quality: number,
) {
  const webp = await toBlob(
    drawSquare(image, crop, side),
    'image/webp',
    quality,
  );
  // a browser without WebP export quietly hands back a PNG
  if (webp.type === 'image/webp') return webp;

  // JPEG has no alpha, so transparency takes the colour of the card frame
  return toBlob(
    drawSquare(image, crop, side, '#094142'),
    'image/jpeg',
    quality,
  );
}

export async function exportSquareCrop(
  image: CropImage,
  crop: Crop,
  fileName: string,
): Promise<File> {
  let blob: Blob | undefined;

  for (const attempt of exportAttempts(outputSide(crop.size))) {
    blob = await encode(image, crop, attempt.side, attempt.quality);
    if (blob.size <= TARGET_BYTES) break;
  }
  if (!blob) throw new Error("Échec de l'export");

  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';

  return new File([blob], `${baseName}.${extension}`, { type: blob.type });
}
