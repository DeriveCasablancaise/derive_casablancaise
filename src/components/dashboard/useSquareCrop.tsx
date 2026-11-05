'use client';

import { useRef, useState } from 'react';
import { toast } from '@/components/hooks/use-toast';
import {
  FORMAT_ERROR,
  initialCrop,
  needsSquareCrop,
  validateImageFile,
} from '@/lib/square-crop';
import {
  CORS_ERROR,
  CropImage,
  exportSquareCrop,
  loadImageFile,
  loadImageUrl,
} from '@/lib/square-crop-image';
import { SquareCropper } from './SquareCropper';

type CropJob = {
  key: number;
  image: CropImage;
  fileName: string;
  onConfirm: (file: File) => void | Promise<void>;
  onCancel: () => void;
};

const showError = (description: string) =>
  toast({ variant: 'destructive', title: 'Image refusée', description });

export function useSquareCrop() {
  const [job, setJob] = useState<CropJob | null>(null);
  const nextKey = useRef(0);

  // resolves once the admin has validated or cancelled, so files go one by one
  const askCrop = (
    image: CropImage,
    fileName: string,
    onConfirm: (file: File) => void | Promise<void>,
  ) =>
    new Promise<void>((resolve) => {
      nextKey.current += 1;
      const close = () => {
        setJob(null);
        resolve();
      };

      setJob({
        key: nextKey.current,
        image,
        fileName,
        onConfirm: async (file) => {
          await onConfirm(file);
          close();
        },
        onCancel: close,
      });
    });

  const prepareFile = async (file: File): Promise<File | null> => {
    const invalid = validateImageFile(file);
    if (invalid) {
      showError(`${file.name} : ${invalid}`);
      return null;
    }

    let image: CropImage;
    try {
      image = await loadImageFile(file);
    } catch (error) {
      console.error('Image decode failed', error);
      showError(`${file.name} : ${FORMAT_ERROR}`);
      return null;
    }

    try {
      if (needsSquareCrop(image.width, image.height)) {
        let cropped: File | null = null;
        await askCrop(image, file.name, (result) => {
          cropped = result;
        });
        return cropped;
      }

      if (file.type !== 'image/heic') return file;

      // a square HEIC skips the modal but must still be converted, only Safari shows it
      return await exportSquareCrop(
        image,
        initialCrop(image.width, image.height),
        file.name,
      );
    } catch (error) {
      console.error('Image export failed', error);
      showError(`${file.name} : le traitement de l'image a échoué.`);
      return null;
    } finally {
      image.close();
    }
  };

  // new images, in order; a cancelled or refused one is simply left out
  const prepareFiles = async (files: File[]) => {
    const ready: File[] = [];

    for (const file of files) {
      const prepared = await prepareFile(file);
      if (prepared) ready.push(prepared);
    }

    return ready;
  };

  // for an image already stored: nothing changes unless onCropped succeeds
  const recrop = async (
    url: string,
    onCropped: (file: File) => Promise<void>,
  ) => {
    let image: CropImage;
    try {
      image = await loadImageUrl(url);
    } catch (error) {
      console.error('Stored image could not be loaded for cropping', error);
      showError(CORS_ERROR);
      return;
    }

    await askCrop(image, 'image-recadree', onCropped);
    image.close();
  };

  const cropperNode = job && (
    <SquareCropper
      key={job.key}
      image={job.image}
      fileName={job.fileName}
      onConfirm={job.onConfirm}
      onCancel={job.onCancel}
    />
  );

  return { prepareFiles, recrop, cropperNode };
}
