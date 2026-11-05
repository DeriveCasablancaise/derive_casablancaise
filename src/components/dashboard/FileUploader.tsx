'use client';

import { useCallback, useRef, useState, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { Button } from '@/components/ui/button';
import { convertFileToUrl } from '@/lib/utils';
import { ImageSlider } from './ImageSlider';

type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void;
  imageUrls: string[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  // shows move buttons; only for forms that keep the order of new uploads
  reorderable?: boolean;
  // runs before files are added, e.g. to crop them; left out files are dropped
  prepareFiles?: (files: File[]) => Promise<File[]>;
  onFilesRejected?: () => void;
  onRecrop?: (url: string) => void;
  formatsHint?: string;
};

export function FileUploader({
  imageUrls,
  onFieldChange,
  setFiles,
  reorderable = false,
  prepareFiles,
  onFilesRejected,
  onRecrop,
  formatsHint = 'SVG, PNG, JPG',
}: FileUploaderProps) {
  // files always follow the order of their blob previews in imageUrls
  const fileByPreview = useRef(new Map<string, File>());
  const [isPreparing, setIsPreparing] = useState(false);

  // preparing is async, the list may have changed once it ends
  const latestUrls = useRef(imageUrls);
  latestUrls.current = imageUrls;

  const applyUrls = useCallback(
    (urls: string[]) => {
      onFieldChange(urls);
      setFiles(
        urls
          .map((url) => fileByPreview.current.get(url))
          .filter((file): file is File => Boolean(file)),
      );
    },
    [onFieldChange, setFiles],
  );

  const addFiles = useCallback(
    (files: File[]) => {
      // Create preview URLs for the dropped files
      const newImageUrls = files.map((file) => {
        const url = convertFileToUrl(file);
        fileByPreview.current.set(url, file);
        return url;
      });
      applyUrls([...latestUrls.current, ...newImageUrls]);
    },
    [applyUrls],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (!prepareFiles) {
        addFiles(acceptedFiles);
        return;
      }

      setIsPreparing(true);
      prepareFiles(acceptedFiles)
        .then(addFiles)
        .finally(() => setIsPreparing(false));
    },
    [prepareFiles, addFiles],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected: onFilesRejected,
    accept: generateClientDropzoneAccept(['image/*']),
    multiple: true,
    disabled: isPreparing,
  });

  const removeImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    applyUrls(newImageUrls);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= imageUrls.length) return;
    const newImageUrls = [...imageUrls];
    const [moved] = newImageUrls.splice(from, 1);
    newImageUrls.splice(to, 0, moved);
    applyUrls(newImageUrls);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        {...getRootProps()}
        className="flex justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border cursor-pointer flex-col rounded-xl h-72"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        <div className="flex justify-center items-center flex-col py-5 text-gray-500">
          <img
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Placez vos images ici</h3>
          <p className="mb-4">{formatsHint}</p>
          <Button
            type="button"
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 my-4"
            variant="outline"
          >
            Choisir à partir de l'appareil
          </Button>
        </div>
      </div>

      {imageUrls.length > 0 && (
        <div className="flex flex-col gap-4">
          <ImageSlider
            images={imageUrls}
            onRemove={removeImage}
            onMove={reorderable ? moveImage : undefined}
            onRecrop={onRecrop && ((index) => onRecrop(imageUrls[index]))}
          />
        </div>
      )}
    </div>
  );
}
